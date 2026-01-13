// ============================================
// Configuração de Serviços
// Sistema de Agendamentos Online
// ============================================

const SERVICOS = [
  {
    id: 'corte_cabelo_masc',
    icone: '✂️',
    nome: 'Corte de Cabelo Masculino',
    descricao: 'Corte moderno e profissional',
    preco: 50,
    duracao: 30
  },
  {
    id: 'corte_cabelo_fem',
    icone: '✂️',
    nome: 'Corte de Cabelo Feminino',
    descricao: 'Corte e finalização',
    preco: 80,
    duracao: 45
  },
  {
    id: 'barba',
    icone: '🧔',
    nome: 'Barba',
    descricao: 'Aparar e modelar',
    preco: 40,
    duracao: 20
  },
  {
    id: 'corte_barba',
    icone: '✂️',
    nome: 'Corte + Barba',
    descricao: 'Combo completo',
    preco: 85,
    duracao: 50
  },
  {
    id: 'manicure',
    icone: '💅',
    nome: 'Manicure',
    descricao: 'Unhas das mãos',
    preco: 60,
    duracao: 40
  },
  {
    id: 'pedicure',
    icone: '🦶',
    nome: 'Pedicure',
    descricao: 'Unhas dos pés',
    preco: 70,
    duracao: 50
  },
  {
    id: 'mani_pedi',
    icone: '💅',
    nome: 'Manicure + Pedicure',
    descricao: 'Pacote completo',
    preco: 120,
    duracao: 90
  },
  {
    id: 'depilacao_facial',
    icone: '👩',
    nome: 'Depilação Facial',
    descricao: 'Depilação facial completa',
    preco: 50,
    duracao: 30
  },
  {
    id: 'depilacao_corporal',
    icone: '🧖',
    nome: 'Depilação Corporal',
    descricao: 'Depilação corpo inteiro',
    preco: 150,
    duracao: 90
  },
  {
    id: 'massagem',
    icone: '💆',
    nome: 'Massagem Relaxante',
    descricao: 'Massagem terapêutica',
    preco: 200,
    duracao: 60
  },
  {
    id: 'limpeza_pele',
    icone: '✨',
    nome: 'Limpeza de Pele',
    descricao: 'Tratamento facial completo',
    preco: 180,
    duracao: 90
  },
  {
    id: 'design_sobrancelha',
    icone: '👁️',
    nome: 'Design de Sobrancelhas',
    descricao: 'Modelagem de sobrancelhas',
    preco: 60,
    duracao: 30
  }
];

/**
 * Obter todos os serviços
 */
function getTodosServicos() {
  return SERVICOS;
}

/**
 * Obter serviço por ID
 */
function getServicoPorId(id) {
  return SERVICOS.find(s => s.id === id);
}

/**
 * Obter múltiplos serviços por array de IDs
 */
function getServicosPorIds(ids) {
  return ids.map(id => getServicoPorId(id)).filter(s => s !== undefined);
}

/**
 * Gerar slots de horário disponíveis para uma data
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {Array<string>} Array de horários no formato HH:MM
 */
function gerarSlotsHorario(data) {
  const slots = [];
  const horaInicio = 8; // 8h
  const horaFim = 18; // 18h
  const intervalo = 30; // 30 minutos
  
  for (let hora = horaInicio; hora < 20; hora++) {
    for (let min = 0; min < 60; min += 30) {
      if (hora === 12 && min === 0) continue; // Pausa para almoço
      if (hora === 12 && min === 30) continue;
      if (hora >= 19) break; // Horário de fechamento
      
      const horario = `${String(hora).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      slots.push(horario);
    }
  }
  return slots;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.SERVICOS = SERVICOS;
  window.getTodosServicos = getTodosServicos;
  window.getServicoPorId = getServicoPorId;
  window.getServicosPorIds = getServicosPorIds;
  window.gerarSlotsHorario = gerarSlotsHorario;
  
  console.log('✅ Serviços carregados:', SERVICOS.length);
}
