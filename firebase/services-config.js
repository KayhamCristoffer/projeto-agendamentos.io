// ============================================
// Configuração de Serviços - Carrega do Firebase
// Sistema de Agendamentos Online
// ============================================

let SERVICOS = [];

// Carregar serviços do Firebase
async function carregarServicosDoFirebase() {
  try {
    const snapshot = await firebase.database().ref('servicos').once('value');
    const servicosData = snapshot.val();
    
    if (servicosData) {
      SERVICOS = Object.entries(servicosData)
        .filter(([id, servico]) => servico.ativo !== false)
        .map(([id, servico]) => ({
          id,
          nome: servico.nome,
          descricao: servico.descricao,
          preco: servico.preco,
          duracao: servico.duracao,
          icone: servico.icone || '✂️'
        }));
      
      console.log(`✅ Serviços carregados do Firebase: ${SERVICOS.length}`);
    } else {
      console.warn('⚠️ Nenhum serviço encontrado no Firebase');
      SERVICOS = [];
    }
  } catch (error) {
    console.error('❌ Erro ao carregar serviços:', error);
    SERVICOS = [];
  }
}

/**
 * Retorna todos os serviços ativos
 */
function getTodosServicos() {
  return SERVICOS;
}

/**
 * Retorna um serviço por ID
 */
function getServicoPorId(id) {
  return SERVICOS.find(s => s.id === id);
}

/**
 * Retorna múltiplos serviços por IDs
 */
function getServicosPorIds(ids) {
  return SERVICOS.filter(s => ids.includes(s.id));
}

/**
 * Gerar slots de horário disponíveis
 */
function gerarSlotsHorario(data, duracaoServico = 30) {
  const slots = [];
  const dataObj = new Date(data + 'T00:00:00');
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  // Se for data passada, não retornar slots
  if (dataObj < hoje) {
    return [];
  }
  
  const horaInicio = 8; // 8h
  const horaFim = 20; // 20h
  const intervalo = 30; // minutos
  
  for (let hora = horaInicio; hora < horaFim; hora++) {
    for (let minuto = 0; minuto < 60; minuto += intervalo) {
      const horarioStr = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
      
      // Verificar se o horário + duração não ultrapassa horário de fechamento
      const totalMinutos = hora * 60 + minuto + duracaoServico;
      const horaFimServico = Math.floor(totalMinutos / 60);
      
      if (horaFimServico <= horaFim) {
        slots.push(horarioStr);
      }
    }
  }
  
  return slots;
}

// Inicializar quando o Firebase estiver pronto
if (typeof firebase !== 'undefined') {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      await carregarServicosDoFirebase();
    }
  });
} else {
  console.warn('⚠️ Firebase não está disponível ainda');
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.SERVICOS = SERVICOS;
  window.getTodosServicos = getTodosServicos;
  window.getServicoPorId = getServicoPorId;
  window.getServicosPorIds = getServicosPorIds;
  window.gerarSlotsHorario = gerarSlotsHorario;
  window.carregarServicosDoFirebase = carregarServicosDoFirebase;
}

console.log('✅ Sistema de serviços inicializado');
