// ============================================
// Configuração de Serviços
// Preços, Durações e Descrições
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
    icon: '✂️🧔',
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
    icon: '💅🦶',
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

function getTodosServicos() {
  return SERVICOS;
}

function getServicoPorId(id) {
  return SERVICOS.find(s => s.id === id);
}

if (typeof window !== 'undefined') {
  window.SERVICOS = SERVICOS;
  window.getTodosServicos = getTodosServicos;
  window.getServicoPorId = getServicoPorId;
}

// Horário de funcionamento
const BUSINESS_HOURS = {
  inicio: '08:00',
  fim: '19:00',
  intervalo_inicio: '12:00',
  intervalo_fim: '13:00',
  dias_funcionamento: [1, 2, 3, 4, 5, 6], // Segunda a Sábado (0 = Domingo)
  slot_duracao: 15 // minutos por slot base
};

// Função para obter todos os serviços
function getTodosServicos() {
  return Object.values(SERVICES);
}

// Função para obter serviço por ID
function getServicoPorId(id) {
  return SERVICES[id] || null;
}

// Função para calcular preço total
function calcularPrecoTotal(servicosIds) {
  return servicosIds.reduce((total, id) => {
    const servico = getServicoPorId(id);
    return total + (servico ? servico.preco : 0);
  }, 0);
}

// Função para calcular duração total
function calcularDuracaoTotal(servicosIds) {
  return servicosIds.reduce((total, id) => {
    const servico = getServicoPorId(id);
    return total + (servico ? servico.duracao : 0);
  }, 0);
}

// Função para gerar slots de horário disponíveis
function gerarSlotsHorario(data) {
  const slots = [];
  const [horaInicio, minInicio] = BUSINESS_HOURS.inicio.split(':').map(Number);
  const [horaFim, minFim] = BUSINESS_HOURS.fim.split(':').map(Number);
  const [horaIntervaloInicio, minIntervaloInicio] = BUSINESS_HOURS.intervalo_inicio.split(':').map(Number);
  const [horaIntervaloFim, minIntervaloFim] = BUSINESS_HOURS.intervalo_fim.split(':').map(Number);
  
  let horaAtual = horaInicio;
  let minAtual = minInicio;
  
  while (horaAtual < horaFim || (horaAtual === horaFim && minAtual < minFim)) {
    // Verificar se não está no horário de intervalo
    const isIntervalo = (
      horaAtual > horaIntervaloInicio ||
      (horaAtual === horaIntervaloInicio && minAtual >= minIntervaloInicio)
    ) && (
      horaAtual < horaIntervaloFim ||
      (horaAtual === horaIntervaloFim && minAtual < minIntervaloFim)
    );
    
    if (!isIntervalo) {
      const horarioFormatado = `${String(horaAtual).padStart(2, '0')}:${String(minAtual).padStart(2, '0')}`;
      slots.push(horarioFormatado);
    }
    
    // Avançar para próximo slot
    minAtual += BUSINESS_HOURS.slot_duracao;
    if (minAtual >= 60) {
      horaAtual += Math.floor(minAtual / 60);
      minAtual = minAtual % 60;
    }
  }
  
  return slots;
}

// Função para verificar se data está disponível
function isDiaDisponivel(data) {
  const diaSemana = new Date(data).getDay();
  return BUSINESS_HOURS.dias_funcionamento.includes(diaSemana);
}

// Função para formatar preço em Real
function formatarPreco(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Função para formatar duração
function formatarDuracao(minutos) {
  if (minutos < 60) {
    return `${minutos} min`;
  }
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.SERVICES = SERVICES;
  window.BUSINESS_HOURS = BUSINESS_HOURS;
  window.getTodosServicos = getTodosServicos;
  window.getServicoPorId = getServicoPorId;
  window.calcularPrecoTotal = calcularPrecoTotal;
  window.calcularDuracaoTotal = calcularDuracaoTotal;
  window.gerarSlotsHorario = gerarSlotsHorario;
  window.isDiaDisponivel = isDiaDisponivel;
  window.formatarPreco = formatarPreco;
  window.formatarDuracao = formatarDuracao;
}

console.log('✅ Configuração de serviços carregada');
