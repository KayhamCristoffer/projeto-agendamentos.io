// ============================================
// Funções de Banco de Dados
// Sistema de Agendamentos Online
// ============================================

/**
 * Função para salvar um novo agendamento
 * @param {Object} dados - Dados do agendamento
 * @returns {Promise}
 */
function salvarAgendamento(dados) {
  // Validar dados obrigatórios
  if (!dados.dataHora || !dados.clienteId) {
    return Promise.reject(new Error('Dados obrigatórios não fornecidos'));
  }

  // Adicionar metadados
  const agendamento = {
    ...dados,
    criadoEm: new Date().toISOString(),
    timestamp: Date.now(),
    status: dados.status || 'pendente'
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
    .orderByChild('userId')
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
  return db.ref('agendamentos')
    .orderByChild('dataHora')
    .startAt(data)
    .endAt(data + '\uf8ff')
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
 * Função para verificar disponibilidade de horário
 * @param {string} dataHora - Data e hora no formato ISO
 * @returns {Promise<boolean>}
 */
function verificarDisponibilidade(dataHora) {
  return db.ref('agendamentos')
    .orderByChild('dataHora')
    .equalTo(dataHora)
    .once('value')
    .then((snapshot) => {
      // Se não existe nenhum agendamento nesse horário, está disponível
      return !snapshot.exists();
    });
}

// ============================================
// FUNÇÕES DE PERFIL DE USUÁRIO
// ============================================

/**
 * Criar/Atualizar perfil de usuário
 * @param {string} userId - ID do usuário
 * @param {Object} dados - Dados do perfil
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
 * @returns {Function} Função para remover listener
 */
function listarMensagens(agendamentoId, callback) {
  const ref = db.ref(`chats/${agendamentoId}`);
  const listener = ref.on('value', (snapshot) => {
    callback(snapshot.val());
  });
  
  // Retornar função para remover listener
  return () => ref.off('value', listener);
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
// ============================================

/**
 * Verificar disponibilidade de horário com duração
 * @param {string} data - Data no formato YYYY-MM-DD
 * @param {string} horario - Horário no formato HH:MM
 * @param {number} duracao - Duração em minutos
 * @returns {Promise<boolean>}
 */
function verificarDisponibilidadeComDuracao(data, horario, duracao) {
  const dataHoraInicio = `${data}T${horario}`;
  const [hora, min] = horario.split(':').map(Number);
  
  // Calcular horário de fim
  const totalMin = hora * 60 + min + duracao;
  const horaFim = Math.floor(totalMin / 60);
  const minFim = totalMin % 60;
  const horarioFim = `${String(horaFim).padStart(2, '0')}:${String(minFim).padStart(2, '0')}`;
  const dataHoraFim = `${data}T${horarioFim}`;
  
  // Buscar agendamentos na faixa de horário
  return db.ref('agendamentos')
    .orderByChild('dataHora')
    .startAt(data)
    .endAt(data + 'T23:59')
    .once('value')
    .then((snapshot) => {
      let disponivel = true;
      snapshot.forEach((child) => {
        const agendamento = child.val();
        if (agendamento.status !== 'cancelado') {
          const agendHorario = agendamento.dataHora.split('T')[1];
          const agendDuracao = agendamento.duracao || 30;
          const [agendHora, agendMin] = agendHorario.split(':').map(Number);
          const agendTotalMin = agendHora * 60 + agendMin;
          const agendFimMin = agendTotalMin + agendDuracao;
          
          const novoInicioMin = hora * 60 + min;
          const novoFimMin = novoInicioMin + duracao;
          
          // Verificar sobreposição
          if (!(novoFimMin <= agendTotalMin || novoInicioMin >= agendFimMin)) {
            disponivel = false;
          }
        }
      });
      return disponivel;
    });
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
// FUNÇÕES DE EQUIPE
// ============================================

/**
 * Adicionar membro da equipe
 * @param {Object} dados - Dados do membro
 * @returns {Promise}
 */
function adicionarMembroEquipe(dados) {
  const membro = {
    ...dados,
    curtidas: 0,
    criadoEm: new Date().toISOString()
  };
  return db.ref('equipe').push(membro);
}

/**
 * Listar membros da equipe
 * @returns {Promise}
 */
function listarEquipe() {
  return db.ref('equipe').once('value')
    .then((snapshot) => snapshot.val());
}

/**
 * Atualizar membro da equipe
 * @param {string} id - ID do membro
 * @param {Object} dados - Dados para atualizar
 * @returns {Promise}
 */
function atualizarMembroEquipe(id, dados) {
  return db.ref(`equipe/${id}`).update(dados);
}

/**
 * Deletar membro da equipe
 * @param {string} id - ID do membro
 * @returns {Promise}
 */
function deletarMembroEquipe(id) {
  return db.ref(`equipe/${id}`).remove();
}

/**
 * Curtir membro da equipe
 * @param {string} id - ID do membro
 * @param {string} userId - ID do usuário que curtiu
 * @returns {Promise}
 */
function curtirMembroEquipe(id, userId) {
  return db.ref(`equipe/${id}`).once('value')
    .then((snapshot) => {
      const membro = snapshot.val();
      const curtidas = membro.curtidas || 0;
      const curtidasUsuarios = membro.curtidasUsuarios || {};
      
      if (curtidasUsuarios[userId]) {
        // Já curtiu, remover curtida
        delete curtidasUsuarios[userId];
        return db.ref(`equipe/${id}`).update({
          curtidas: Math.max(0, curtidas - 1),
          curtidasUsuarios: curtidasUsuarios
        });
      } else {
        // Adicionar curtida
        curtidasUsuarios[userId] = true;
        return db.ref(`equipe/${id}`).update({
          curtidas: curtidas + 1,
          curtidasUsuarios: curtidasUsuarios
        });
      }
    });
}

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
  
  // Equipe
  window.adicionarMembroEquipe = adicionarMembroEquipe;
  window.listarEquipe = listarEquipe;
  window.atualizarMembroEquipe = atualizarMembroEquipe;
  window.deletarMembroEquipe = deletarMembroEquipe;
  window.curtirMembroEquipe = curtirMembroEquipe;
}

console.log('✅ Funções de banco de dados carregadas');
