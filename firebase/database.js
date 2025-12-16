// ============================================
// Funções de Banco de Dados
// Sistema de Agendamentos Online
// Compatível com a estrutura do Realtime Database fornecida
// ============================================

/**
 * Função para salvar um novo agendamento
 * Estrutura: agendamentos/{id}/{clienteId, clienteNome, servicos[], dataHora, duracaoTotal, precoTotal, status, observacoes}
 */
async function salvarAgendamento(dados) {
  try {
    const agendamento = {
      clienteId: dados.clienteId,
      clienteNome: dados.clienteNome,
      clienteTelefone: dados.clienteTelefone || '',
      servicos: dados.servicos || [], // Array de {id, nome, preco, duracao}
      dataHora: dados.dataHora, // ISO string
      duracaoTotal: dados.duracaoTotal || 30,
      precoTotal: dados.precoTotal || 0,
      status: dados.status || 'pendente',
      observacoes: dados.observacoes || '',
      criadoEm: new Date().toISOString()
    };

    return await db.ref('agendamentos').push(agendamento);
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
    throw error;
  }
}

/**
 * Listar todos os agendamentos (uma vez)
 */
async function listarAgendamentosOnce() {
  try {
    const snapshot = await db.ref('agendamentos').once('value');
    return snapshot.val() || {};
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return {};
  }
}

/**
 * Listar agendamentos com listener em tempo real
 */
function listarAgendamentos(callback) {
  db.ref('agendamentos').on('value', (snapshot) => {
    callback(snapshot.val() || {});
  });
}

/**
 * Obter agendamento específico por ID
 */
async function obterAgendamento(id) {
  try {
    const snapshot = await db.ref(`agendamentos/${id}`).once('value');
    return snapshot.val();
  } catch (error) {
    console.error('Erro ao obter agendamento:', error);
    return null;
  }
}

/**
 * Atualizar agendamento
 */
async function atualizarAgendamento(id, dados) {
  try {
    const dadosAtualizados = {
      ...dados,
      atualizadoEm: new Date().toISOString()
    };
    return await db.ref(`agendamentos/${id}`).update(dadosAtualizados);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    throw error;
  }
}

/**
 * Deletar agendamento
 */
async function deletarAgendamento(id) {
  try {
    return await db.ref(`agendamentos/${id}`).remove();
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    throw error;
  }
}

/**
 * Alterar status de agendamento
 */
async function alterarStatusAgendamento(id, novoStatus) {
  return atualizarAgendamento(id, { status: novoStatus });
}

/**
 * Listar agendamentos por clienteId
 */
async function listarAgendamentosPorUsuario(clienteId) {
  try {
    const snapshot = await db.ref('agendamentos')
      .orderByChild('clienteId')
      .equalTo(clienteId)
      .once('value');
    return snapshot.val() || {};
  } catch (error) {
    console.error('Erro ao listar agendamentos do usuário:', error);
    return {};
  }
}

/**
 * Listar agendamentos por status
 */
async function listarAgendamentosPorStatus(status) {
  try {
    const snapshot = await db.ref('agendamentos')
      .orderByChild('status')
      .equalTo(status)
      .once('value');
    return snapshot.val() || {};
  } catch (error) {
    console.error('Erro ao listar agendamentos por status:', error);
    return {};
  }
}

/**
 * Listar agendamentos por data específica
 */
async function listarAgendamentosPorData(data) {
  try {
    const snapshot = await db.ref('agendamentos').once('value');
    const todos = snapshot.val() || {};
    const filtrados = {};
    
    Object.entries(todos).forEach(([id, agend]) => {
      const agendData = agend.dataHora ? agend.dataHora.split('T')[0] : '';
      if (agendData === data) {
        filtrados[id] = agend;
      }
    });
    
    return filtrados;
  } catch (error) {
    console.error('Erro ao listar agendamentos por data:', error);
    return {};
  }
}

// ============================================
// FUNÇÕES DE PERFIL DE USUÁRIO
// ============================================

/**
 * Salvar/Criar perfil de usuário
 * Estrutura: usuarios/{uid}/{nomeCompleto, email, telefone, role, criadoEm}
 */
async function salvarPerfilUsuario(userId, dados) {
  try {
    const perfil = {
      nomeCompleto: dados.nome || dados.nomeCompleto,
      email: dados.email,
      telefone: dados.telefone || '',
      role: dados.role || 'cliente',
      criadoEm: dados.criadoEm || new Date().toISOString()
    };
    return await db.ref(`usuarios/${userId}`).set(perfil);
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    throw error;
  }
}

/**
 * Obter perfil de usuário
 */
async function obterPerfilUsuario(userId) {
  try {
    const snapshot = await db.ref(`usuarios/${userId}`).once('value');
    const perfil = snapshot.val();
    if (perfil) {
      perfil.nome = perfil.nomeCompleto; // Alias para compatibilidade
    }
    return perfil;
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    return null;
  }
}

/**
 * Atualizar perfil de usuário
 */
async function atualizarPerfilUsuario(userId, dados) {
  try {
    const dadosAtualizados = {
      ...dados,
      nomeCompleto: dados.nome || dados.nomeCompleto,
      atualizadoEm: new Date().toISOString()
    };
    // Remover campos undefined
    delete dadosAtualizados.nome;
    return await db.ref(`usuarios/${userId}`).update(dadosAtualizados);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}

/**
 * Verificar se usuário é admin
 */
async function isAdmin(userId) {
  const perfil = await obterPerfilUsuario(userId);
  return perfil && perfil.role === 'admin';
}

// ============================================
// FUNÇÕES DE CHAT
// ============================================

/**
 * Enviar mensagem
 * Estrutura: chats/{agendamentoId}/mensagens/{msgId}/{userId, nome, texto, timestamp}
 */
async function enviarMensagem(agendamentoId, dados) {
  try {
    const mensagem = {
      userId: dados.userId,
      nome: dados.userNome || dados.nome,
      texto: dados.mensagem || dados.texto,
      timestamp: Date.now()
    };
    return await db.ref(`chats/${agendamentoId}/mensagens`).push(mensagem);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}

/**
 * Listar mensagens com listener
 */
function listarMensagens(agendamentoId, callback) {
  db.ref(`chats/${agendamentoId}/mensagens`)
    .orderByChild('timestamp')
    .on('value', (snapshot) => {
      const mensagens = [];
      snapshot.forEach((child) => {
        const msg = child.val();
        mensagens.push({
          id: child.key,
          userId: msg.userId,
          userNome: msg.nome,
          mensagem: msg.texto,
          timestamp: msg.timestamp
        });
      });
      callback(mensagens);
    });
}

/**
 * Marcar chat como lido
 */
async function marcarComoLido(agendamentoId, userId, isAdmin = false) {
  try {
    const key = isAdmin ? 'admin' : 'cliente';
    return await db.ref(`chats/${agendamentoId}/lido/${key}`).set(true);
  } catch (error) {
    console.error('Erro ao marcar como lido:', error);
  }
}

// ============================================
// FUNÇÕES DE HORÁRIOS DISPONÍVEIS
// ============================================

/**
 * Verificar se um horário está disponível
 */
async function verificarDisponibilidadeComDuracao(data, horario, duracao) {
  try {
    // Buscar todos os agendamentos da data
    const agendamentos = await listarAgendamentosPorData(data);
    
    // Converter horário selecionado para minutos
    const [hora, min] = horario.split(':').map(Number);
    const inicioMin = hora * 60 + min;
    const fimMin = inicioMin + duracao;
    
    // Verificar conflitos
    for (const [id, agend] of Object.entries(agendamentos)) {
      if (agend.status === 'cancelado') continue;
      
      const agendHorario = agend.dataHora.split('T')[1];
      const [agendHora, agendMinuto] = agendHorario.split(':').map(Number);
      const agendInicioMin = agendHora * 60 + agendMinuto;
      const agendFimMin = agendInicioMin + (agend.duracaoTotal || 30);
      
      // Verificar sobreposição
      if (!(fimMin <= agendInicioMin || inicioMin >= agendFimMin)) {
        return false; // Conflito encontrado
      }
    }
    
    return true; // Disponível
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return false;
  }
}

/**
 * Gerar slots de horário (08:00 às 18:00, exceto 12:00-13:00)
 */
function gerarSlotsHorario(data) {
  const slots = [];
  const slotDuracao = 15; // minutos
  
  // Verificar se não é data passada
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataSelecionada = new Date(data + 'T00:00:00');
  
  let horaInicio = 8 * 60; // 08:00 em minutos
  const horaFim = 18 * 60; // 18:00 em minutos
  
  // Se for hoje, começar da próxima hora
  if (dataSelecionada.toDateString() === hoje.toDateString()) {
    const agora = new Date();
    const minutoAtual = agora.getHours() * 60 + agora.getMinutes();
    if (minutoAtual > horaInicio) {
      horaInicio = Math.ceil(minutoAtual / slotDuracao) * slotDuracao;
    }
  }
  
  for (let min = horaInicio; min < horaFim; min += slotDuracao) {
    // Pular horário de almoço (12:00 - 13:00)
    if (min >= 12 * 60 && min < 13 * 60) continue;
    
    const hora = Math.floor(min / 60);
    const minuto = min % 60;
    const horario = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
    slots.push(horario);
  }
  
  return slots;
}

/**
 * Obter horários disponíveis para uma data
 */
async function obterHorariosDisponiveis(data, duracao = 30) {
  try {
    const slots = gerarSlotsHorario(data);
    const disponiveis = [];
    
    for (const horario of slots) {
      const disponivel = await verificarDisponibilidadeComDuracao(data, horario, duracao);
      if (disponivel) {
        disponiveis.push(horario);
      }
    }
    
    return disponiveis;
  } catch (error) {
    console.error('Erro ao obter horários disponíveis:', error);
    return [];
  }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Formatar preço em R$
 */
function formatarPreco(valor) {
  return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
}

/**
 * Formatar duração em minutos
 */
function formatarDuracao(minutos) {
  if (minutos < 60) {
    return `${minutos} min`;
  }
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
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
  
  // Perfil
  window.salvarPerfilUsuario = salvarPerfilUsuario;
  window.obterPerfilUsuario = obterPerfilUsuario;
  window.atualizarPerfilUsuario = atualizarPerfilUsuario;
  window.isAdmin = isAdmin;
  
  // Chat
  window.enviarMensagem = enviarMensagem;
  window.listarMensagens = listarMensagens;
  window.marcarComoLido = marcarComoLido;
  
  // Horários
  window.verificarDisponibilidadeComDuracao = verificarDisponibilidadeComDuracao;
  window.obterHorariosDisponiveis = obterHorariosDisponiveis;
  window.gerarSlotsHorario = gerarSlotsHorario;
  
  // Auxiliares
  window.formatarPreco = formatarPreco;
  window.formatarDuracao = formatarDuracao;
  
  console.log('✅ Funções de banco de dados carregadas');
}
