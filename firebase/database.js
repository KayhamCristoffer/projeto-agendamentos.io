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
  if (!dados.nome || !dados.servico || !dados.dataHora) {
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
// Exportar funções para uso global
// ============================================

if (typeof window !== 'undefined') {
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
}

console.log('✅ Funções de banco de dados carregadas');
