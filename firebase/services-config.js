// ============================================
// Configuração de Serviços
// Preços, Durações e Descrições
// ============================================

const SERVICES = {
  corte_cabelo: {
    id: 'corte_cabelo',
    nome: 'Corte de Cabelo',
    icon: '💇',
    preco: 35.00,
    duracao: 30, // minutos
    descricao: 'Corte de cabelo masculino ou feminino'
  },
  corte_cabelo_masc: {
    id: 'corte_cabelo_masc',
    nome: 'Corte de Cabelo Masculino',
    icon: '💇‍♂️',
    preco: 35.00,
    duracao: 30,
    descricao: 'Corte de cabelo estilo masculino'
  },
  barba: {
    id: 'barba',
    nome: 'Barba',
    icon: '🧔',
    preco: 25.00,
    duracao: 20,
    descricao: 'Barba completa com acabamento'
  },
  corte_barba: {
    id: 'corte_barba',
    nome: 'Corte + Barba',
    icon: '💇‍♂️',
    preco: 50.00,
    duracao: 45,
    descricao: 'Pacote completo: corte de cabelo e barba'
  },
  manicure: {
    id: 'manicure',
    nome: 'Manicure',
    icon: '💅',
    preco: 30.00,
    duracao: 40,
    descricao: 'Manicure completa com esmaltação'
  },
  pedicure: {
    id: 'pedicure',
    nome: 'Pedicure',
    icon: '🦶',
    preco: 35.00,
    duracao: 50,
    descricao: 'Pedicure completa com esmaltação'
  },
  mani_pedi: {
    id: 'mani_pedi',
    nome: 'Mani + Pedi',
    icon: '💅🦶',
    preco: 60.00,
    duracao: 90,
    descricao: 'Pacote manicure e pedicure'
  },
  depilacao: {
    id: 'depilacao',
    nome: 'Depilação',
    icon: '✨',
    preco: 40.00,
    duracao: 45,
    descricao: 'Depilação com cera'
  },
  massagem: {
    id: 'massagem',
    nome: 'Massagem',
    icon: '💆',
    preco: 80.00,
    duracao: 60,
    descricao: 'Massagem relaxante'
  },
  hidratacao: {
    id: 'hidratacao',
    nome: 'Hidratação Capilar',
    icon: '💧',
    preco: 55.00,
    duracao: 60,
    descricao: 'Hidratação profunda para cabelos'
  },
  coloracao: {
    id: 'coloracao',
    nome: 'Coloração',
    icon: '🎨',
    preco: 120.00,
    duracao: 120,
    descricao: 'Coloração completa do cabelo'
  },
  escova: {
    id: 'escova',
    nome: 'Escova',
    icon: '🌸',
    preco: 45.00,
    duracao: 40,
    descricao: 'Escova progressiva ou modeladora'
  },
  maquiagem: {
    id: 'maquiagem',
    nome: 'Maquiagem',
    icon: '💄',
    preco: 70.00,
    duracao: 45,
    descricao: 'Maquiagem profissional para eventos'
  }
};
const DIAS_SEMANA_NOME = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
// Horário de funcionamento
const BUSINESS_HOURS = {
  inicio: '08:00',
  fim: '19:00',
  intervalo_inicio: '12:00',
  intervalo_fim: '13:00',
  dias_funcionamento: [1, 2, 3, 4, 5, 6], // Segunda a Sábado (0 = Domingo)
  slot_duracao: 15, // minutos por slot base
  // Adicionando o array de nomes de dias aqui para que o admin.html possa desestruturar
  dias_semana_nome: DIAS_SEMANA_NOME
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
  window.DIAS_SEMANA_NOME = DIAS_SEMANA_NOME;
}

console.log('✅ Configuração de serviços carregada');
