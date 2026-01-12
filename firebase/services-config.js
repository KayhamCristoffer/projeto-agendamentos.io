// ============================================
// Configuração de Serviços
// Sistema de Agendamentos Online
// ============================================

const SERVICOS = [
  {
    id: 'corte_cabelo_masc',
    icon: '✂️',
    nome: 'Corte de Cabelo Masculino',
    descricao: 'Corte moderno e profissional',
    preco: 50,
    duracao: 30
  },
  {
    id: 'corte_cabelo_fem',
    icon: '✂️',
    nome: 'Corte de Cabelo Feminino',
    descricao: 'Corte e finalização',
    preco: 80,
    duracao: 45
  },
  {
    id: 'barba',
    icon: '🧔',
    nome: 'Barba',
    descricao: 'Aparar e modelar',
    preco: 40,
    duracao: 20
  },
  {
    id: 'corte_barba',
    icon: '✂️',
    nome: 'Corte + Barba',
    descricao: 'Combo completo',
    preco: 85,
    duracao: 50
  },
  {
    id: 'manicure',
    icon: '💅',
    nome: 'Manicure',
    descricao: 'Unhas das mãos',
    preco: 60,
    duracao: 40
  },
  {
    id: 'pedicure',
    icon: '🦶',
    nome: 'Pedicure',
    descricao: 'Unhas dos pés',
    preco: 70,
    duracao: 50
  },
  {
    id: 'mani_pedi',
    icon: '💅',
    nome: 'Manicure + Pedicure',
    descricao: 'Pacote completo',
    preco: 120,
    duracao: 90
  },
  {
    id: 'depilacao_facial',
    icon: '👩',
    nome: 'Depilação Facial',
    descricao: 'Depilação facial completa',
    preco: 50,
    duracao: 30
  },
  {
    id: 'depilacao_corporal',
    icon: '🧖',
    nome: 'Depilação Corporal',
    descricao: 'Depilação corpo inteiro',
    preco: 150,
    duracao: 90
  },
  {
    id: 'massagem',
    icon: '💆',
    nome: 'Massagem Relaxante',
    descricao: 'Massagem terapêutica',
    preco: 200,
    duracao: 60
  },
  {
    id: 'limpeza_pele',
    icon: '✨',
    nome: 'Limpeza de Pele',
    descricao: 'Tratamento facial completo',
    preco: 180,
    duracao: 90
  },
  {
    id: 'design_sobrancelha',
    icon: '👁️',
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

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.SERVICOS = SERVICOS;
  window.getTodosServicos = getTodosServicos;
  window.getServicoPorId = getServicoPorId;
  window.getServicosPorIds = getServicosPorIds;
  
  console.log('✅ Serviços carregados:', SERVICOS.length);
}
