// ============================================
// Funções de Banco de Dados
// Sistema de Agendamentos Online
// ============================================

/**
 * Função para salvar um novo agendamento
 * @param {Object} dados - Dados do agendamento (deve incluir clienteId, clienteNome, dataHora, servicos: Array<{id: string, nome: string, preco: number, duracao: number}>)
 * @returns {Promise}
 */
function salvarAgendamento(dados) {
  // CORREÇÃO 1: Validar campos da nova estrutura
  if (!dados.clienteId || !dados.servicos || !dados.dataHora || dados.servicos.length === 0) {
    return Promise.reject(new Error('Dados obrigatórios (cliente, serviços e data/hora) não fornecidos.'));
  }

  // CORREÇÃO 2: Calcular duração total e preço total
  const duracaoTotal = dados.servicos.reduce((total, servico) => total + (servico.duracao || 0), 0);
  const precoTotal = dados.servicos.reduce((total, servico) => total + (servico.preco || 0), 0);

  const agendamento = {
    // Campos da nova estrutura
    clienteId: dados.clienteId,
    clienteNome: dados.clienteNome || 'Cliente', 
    dataHora: dados.dataHora, // Esperado no formato ISO: YYYY-MM-DDTHH:MM:SS.sssZ
    duracaoTotal: duracaoTotal,
    precoTotal: precoTotal,
    servicos: dados.servicos, // Array de serviços
    status: dados.status || 'pendente',
    observacoes: dados.observacoes || '',

    // Metadados
    criadoEm: new Date().toISOString(),
    timestamp: new Date(dados.dataHora).getTime(), // Timestamp útil para ordenação
    atualizadoEm: new Date().toISOString()
  };

  // Salvar no Firebase
  return db.ref('agendamentos').push(agendamento);
}

/**
 * Função para listar todos os agendamentos
 * @param {Function} callback - Função de callback com os dados
 */
function listarAgendamentos(callback) {
  db.ref('agendamentos').on('value', (snapshot) => {
    const dados = snapshot.val();
    callback(dados);
  }, (error) => {
    console.error('Erro ao listar agendamentos:', error);
    callback(null, error);
  });
}

/**
 * Função para listar agendamentos uma única vez (sem listener)
 * @returns {Promise}
 */
function listarAgendamentosOnce() {
  return db.ref('agendamentos').once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
}

/**
 * Função para obter um agendamento específico por ID
 * @param {string} id - ID do agendamento
 * @returns {Promise}
 */
function obterAgendamento(id) {
  return db.ref(`agendamentos/${id}`).once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
}

/**
 * Função para atualizar um agendamento
 * @param {string} id - ID do agendamento
 * @param {Object} dados - Dados a serem atualizados
 * @returns {Promise}
 */
function atualizarAgendamento(id, dados) {
  // Adicionar timestamp de atualização
  const dadosAtualizados = {
    ...dados,
    atualizadoEm: new Date().toISOString()
  };

  return db.ref(`agendamentos/${id}`).update(dadosAtualizados);
}

/**
 * Função para deletar um agendamento por ID
 * @param {string} id - ID do agendamento
 * @returns {Promise}
 */
function deletarAgendamento(id) {
  return db.ref(`agendamentos/${id}`).remove();
}

/**
 * Função para alterar status de um agendamento
 * @param {string} id - ID do agendamento
 * @param {string} novoStatus - Novo status (pendente, confirmado, cancelado, concluído)
 * @returns {Promise}
 */
function alterarStatusAgendamento(id, novoStatus) {
  return atualizarAgendamento(id, { status: novoStatus });
}

/**
 * Função para listar agendamentos de um usuário específico
 * @param {string} userId - ID do usuário
 * @returns {Promise}
 */
function listarAgendamentosPorUsuario(userId) {
  return db.ref('agendamentos')
    // CORREÇÃO 3: Mudar 'userId' para 'clienteId' (novo padrão do banco)
    .orderByChild('clienteId')
    .equalTo(userId)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
}

/**
 * Função para listar agendamentos por data
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {Promise}
 */
function listarAgendamentosPorData(data) {
  // CORREÇÃO 4: Usar prefixo ISO string para buscar todos daquele dia
  return db.ref('agendamentos')
    .orderByChild('dataHora')
    .startAt(data + 'T00:00:00.000Z')
    .endAt(data + 'T23:59:59.999Z')
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
}

/**
 * Função para listar agendamentos por status
 * @param {string} status - Status (pendente, confirmado, cancelado, concluído)
 * @returns {Promise}
 */
function listarAgendamentosPorStatus(status) {
  return db.ref('agendamentos')
    .orderByChild('status')
    .equalTo(status)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
}

/**
 * Função para contar total de agendamentos
 * @returns {Promise<number>}
 */
function contarAgendamentos() {
  return db.ref('agendamentos').once('value')
    .then((snapshot) => {
      return snapshot.numChildren();
    });
}

/**
 * Função para verificar disponibilidade de horário com duração
 * @param {string} data - Data no formato YYYY-MM-DD
 * @param {string} horario - Horário no formato HH:MM
 * @param {number} duracao - Duração em minutos (total dos serviços)
 * @returns {Promise<boolean>}
 */
function verificarDisponibilidadeComDuracao(data, horario, duracao) {
  
  // Converter para minutos para cálculo de sobreposição
  const [novoInicioHora, novoInicioMin] = horario.split(':').map(Number);
  const novoInicioMinTotal = novoInicioHora * 60 + novoInicioMin;
  const novoFimMinTotal = novoInicioMinTotal + duracao;
  
  // Buscar agendamentos que caem no mesmo dia (usando a busca de data ajustada)
  return db.ref('agendamentos')
    .orderByChild('dataHora')
    .startAt(data + 'T00:00:00.000Z') 
    .endAt(data + 'T23:59:59.999Z')
    .once('value')
    .then((snapshot) => {
      let disponivel = true;
      snapshot.forEach((child) => {
        const agendamento = child.val();
        
        // Ignorar agendamentos cancelados
        if (agendamento.status === 'cancelado') {
          return;
        }
        
        // CORREÇÃO 5: Usar duracaoTotal do agendamento existente
        const agendDuracao = agendamento.duracaoTotal || agendamento.duracao || 30; // Garante fallback
        const agendDataHoraStr = agendamento.dataHora; 

        // Extrair o horário do agendamento existente
        const agendHorarioStr = agendDataHoraStr.split('T')[1].substring(0, 5); // Pega HH:MM
        
        const [agendHora, agendMin] = agendHorarioStr.split(':').map(Number);
        const agendInicioMinTotal = agendHora * 60 + agendMin;
        const agendFimMinTotal = agendInicioMinTotal + agendDuracao;
        
        // Verificar sobreposição: Não se sobrepõem se o novo_fim <= agendamento_inicio OU novo_inicio >= agendamento_fim
        if (!(novoFimMinTotal <= agendInicioMinTotal || novoInicioMinTotal >= agendFimMinTotal)) {
          disponivel = false;
        }
      });
      return disponivel;
    });
}

/**
 * Função para verificar disponibilidade (função original removida/simplificada, usar a com duração)
 * MANTIDA POR COMPATIBILIDADE, mas DEPRECADA.
 */
function verificarDisponibilidade(dataHora) {
  // A função original era muito simples. Mantenho a assinatura, mas chamo a função mais robusta
  const [data, horario] = dataHora.split('T');
  // Assumindo uma duração padrão de 30 minutos se esta função for chamada
  return verificarDisponibilidadeComDuracao(data, horario.substring(0,5), 30); 
}


/**
 * Obter horários disponíveis para uma data
 * @param {string} data - Data no formato YYYY-MM-DD
 * @param {number} duracao - Duração do serviço em minutos
 * @returns {Promise<Array>}
 */
function obterHorariosDisponiveis(data, duracao = 30) {
  // Gerar todos os slots possíveis
  const slots = window.gerarSlotsHorario ? window.gerarSlotsHorario(data) : [];
  
  // Verificar disponibilidade de cada slot
  const promises = slots.map(horario => 
    verificarDisponibilidadeComDuracao(data, horario, duracao)
      .then(disponivel => ({ horario, disponivel }))
  );
  
  return Promise.all(promises)
    .then(results => results.filter(r => r.disponivel).map(r => r.horario));
}


// ============================================
// FUNÇÕES DE PERFIL DE USUÁRIO
// ============================================

/**
 * Criar/Atualizar perfil de usuário
 * @param {string} userId - ID do usuário
 * @param {Object} dados - Dados do perfil. Espera 'nomeCompleto' e não 'nome'.
 * @returns {Promise}
 */
function salvarPerfilUsuario(userId, dados) {
  const perfil = {
    ...dados,
    atualizadoEm: new Date().toISOString()
  };
  return db.ref(`usuarios/${userId}`).set(perfil);
}

/**
 * Obter perfil de usuário
 * @param {string} userId - ID do usuário
 * @returns {Promise}
 */
function obterPerfilUsuario(userId) {
  return db.ref(`usuarios/${userId}`).once('value')
    .then((snapshot) => snapshot.val());
}

/**
 * Atualizar campos específicos do perfil
 * @param {string} userId - ID do usuário
 * @param {Object} dados - Dados para atualizar
 * @returns {Promise}
 */
function atualizarPerfilUsuario(userId, dados) {
  const dadosAtualizados = {
    ...dados,
    atualizadoEm: new Date().toISOString()
  };
  return db.ref(`usuarios/${userId}`).update(dadosAtualizados);
}

/**
 * Verificar se usuário é admin
 * @param {string} userId - ID do usuário
 * @returns {Promise<boolean>}
 */
function isAdmin(userId) {
  return obterPerfilUsuario(userId)
    .then((perfil) => perfil && perfil.role === 'admin');
}

// ============================================
// FUNÇÕES DE CHAT
// ============================================

/**
 * Enviar mensagem no chat
 * @param {string} agendamentoId - ID do agendamento
 * @param {Object} mensagem - Dados da mensagem
 * @returns {Promise}
 */
function enviarMensagem(agendamentoId, mensagem) {
  const msg = {
    ...mensagem,
    timestamp: Date.now(),
    criadoEm: new Date().toISOString()
  };
  return db.ref(`chats/${agendamentoId}/mensagens`).push(msg);
}

/**
 * Listar mensagens de um chat
 * @param {string} agendamentoId - ID do agendamento
 * @param {Function} callback - Callback com mensagens
 */
function listarMensagens(agendamentoId, callback) {
  db.ref(`chats/${agendamentoId}/mensagens`)
    .orderByChild('timestamp')
    .on('value', (snapshot) => {
      const mensagens = [];
      snapshot.forEach((child) => {
        mensagens.push({
          id: child.key,
          ...child.val()
        });
      });
      callback(mensagens);
    });
}

/**
 * Marcar mensagens como lidas
 * @param {string} agendamentoId - ID do agendamento
 * @param {string} userId - ID do usuário
 * @returns {Promise}
 */
function marcarComoLido(agendamentoId, userId) {
  return db.ref(`chats/${agendamentoId}/lido/${userId}`).set(Date.now());
}

/**
 * Obter contagem de mensagens não lidas
 * @param {string} agendamentoId - ID do agendamento
 * @param {string} userId - ID do usuário
 * @param {number} ultimaLeitura - Timestamp da última leitura
 * @returns {Promise<number>}
 */
function contarMensagensNaoLidas(agendamentoId, userId, ultimaLeitura) {
  return db.ref(`chats/${agendamentoId}/mensagens`)
    .orderByChild('timestamp')
    .startAt(ultimaLeitura + 1)
    .once('value')
    .then((snapshot) => {
      let count = 0;
      snapshot.forEach((child) => {
        const msg = child.val();
        if (msg.userId !== userId) {
          count++;
        }
      });
      return count;
    });
}

// ============================================
// FUNÇÕES DE HORÁRIOS DISPONÍVEIS
// (A lógica de sobreposição e busca foi atualizada acima)
// ============================================

// ============================================
// Exportar funções para uso global
// ============================================

if (typeof window !== 'undefined') {
  // Agendamentos
  window.salvarAgendamento = salvarAgendamento;
  window.listarAgendamentos = listarAgendamentos;
  window.listarAgendamentosOnce = listarAgendamentosOnce;
  window.obterAgendamento = obterAgendamento;
  window.atualizarAgendamento = atualizarAgendamento;
  window.deletarAgendamento = deletarAgendamento;
  window.alterarStatusAgendamento = alterarStatusAgendamento;
  window.listarAgendamentosPorUsuario = listarAgendamentosPorUsuario;
  window.listarAgendamentosPorData = listarAgendamentosPorData;
  window.listarAgendamentosPorStatus = listarAgendamentosPorStatus;
  window.contarAgendamentos = contarAgendamentos;
  window.verificarDisponibilidade = verificarDisponibilidade;
  
  // Perfil
  window.salvarPerfilUsuario = salvarPerfilUsuario;
  window.obterPerfilUsuario = obterPerfilUsuario;
  window.atualizarPerfilUsuario = atualizarPerfilUsuario;
  window.isAdmin = isAdmin;
  
  // Chat
  window.enviarMensagem = enviarMensagem;
  window.listarMensagens = listarMensagens;
  window.marcarComoLido = marcarComoLido;
  window.contarMensagensNaoLidas = contarMensagensNaoLidas;
  
  // Horários
  window.verificarDisponibilidadeComDuracao = verificarDisponibilidadeComDuracao;
  window.obterHorariosDisponiveis = obterHorariosDisponiveis;
}

console.log('✅ Funções de banco de dados carregadas e atualizadas');