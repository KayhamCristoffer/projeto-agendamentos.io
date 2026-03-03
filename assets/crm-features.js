// ==========================================
// CRM Features - Pesquisa, Filtros e Configurações
// ==========================================

// Configuração de visibilidade das estatísticas
const CONFIG_STATS_KEY = 'admin_stats_visibility';

function carregarConfigEstatisticas() {
  const config = localStorage.getItem(CONFIG_STATS_KEY);
  if (config) {
    const stats = JSON.parse(config);
    Object.entries(stats).forEach(([key, visible]) => {
      const elem = document.querySelector(`[data-stat="${key}"]`);
      if (elem) {
        elem.style.display = visible ? 'block' : 'none';
      }
    });
  }
}

function salvarConfigEstatisticas(config) {
  localStorage.setItem(CONFIG_STATS_KEY, JSON.stringify(config));
  carregarConfigEstatisticas();
}

function abrirModalConfigEstatisticas() {
  const modal = document.getElementById('modalConfigEstatisticas');
  if (modal) {
    // Carregar config atual
    const config = JSON.parse(localStorage.getItem(CONFIG_STATS_KEY) || '{}');
    ['total', 'pendentes', 'confirmados', 'concluidos', 'cancelados'].forEach(stat => {
      const checkbox = document.getElementById(`check_${stat}`);
      if (checkbox) {
        checkbox.checked = config[stat] !== false; // Default: true
      }
    });
    modal.classList.remove('hidden');
  }
}

function fecharModalConfigEstatisticas() {
  const modal = document.getElementById('modalConfigEstatisticas');
  if (modal) modal.classList.add('hidden');
}

function salvarEstatisticasConfig() {
  const config = {};
  ['total', 'pendentes', 'confirmados', 'concluidos', 'cancelados'].forEach(stat => {
    const checkbox = document.getElementById(`check_${stat}`);
    if (checkbox) {
      config[stat] = checkbox.checked;
    }
  });
  salvarConfigEstatisticas(config);
  Toast?.success('Configuração salva!');
  fecharModalConfigEstatisticas();
}

// ==========================================
// Funções de Pesquisa e Filtro
// ==========================================

function aplicarFiltrosGenericos(lista, filtroNome, filtroExtras = {}) {
  if (!lista || lista.length === 0) return [];
  
  let resultado = [...lista];
  
  // Filtro por nome
  if (filtroNome && filtroNome.trim() !== '') {
    const termo = filtroNome.toLowerCase();
    resultado = resultado.filter(item => {
      const nome = (item.nome || item.clienteNome || '').toLowerCase();
      const email = (item.email || item.clienteEmail || '').toLowerCase();
      return nome.includes(termo) || email.includes(termo);
    });
  }
  
  // Filtros adicionais
  Object.entries(filtroExtras).forEach(([key, value]) => {
    if (value && value !== '' && value !== 'todos') {
      resultado = resultado.filter(item => item[key] === value);
    }
  });
  
  return resultado;
}

// Pesquisa em Clientes
function pesquisarClientes(termo) {
  const lista = document.getElementById('listaClientesAdmin');
  if (!lista) return;
  
  const cards = lista.querySelectorAll('.bg-white, .bg-gray-800');
  cards.forEach(card => {
    const texto = card.textContent.toLowerCase();
    card.style.display = texto.includes(termo.toLowerCase()) ? '' : 'none';
  });
}

// Pesquisa em Equipe
function pesquisarEquipe(termo) {
  const lista = document.getElementById('listaEquipeAdmin');
  if (!lista) return;
  
  const cards = lista.querySelectorAll('.bg-white, .bg-gray-800');
  cards.forEach(card => {
    const texto = card.textContent.toLowerCase();
    card.style.display = texto.includes(termo.toLowerCase()) ? '' : 'none';
  });
}

// Pesquisa em Serviços
function pesquisarServicos(termo) {
  const lista = document.getElementById('listaServicosAdmin');
  if (!lista) return;
  
  const cards = lista.querySelectorAll('.bg-white, .bg-gray-800');
  cards.forEach(card => {
    const texto = card.textContent.toLowerCase();
    card.style.display = texto.includes(termo.toLowerCase()) ? '' : 'none';
  });
}

// Pesquisa em Produtos
function pesquisarProdutos(termo) {
  const lista = document.getElementById('listaProdutosAdmin');
  if (!lista) return;
  
  const cards = lista.querySelectorAll('.bg-white, .bg-gray-800');
  cards.forEach(card => {
    const texto = card.textContent.toLowerCase();
    card.style.display = texto.includes(termo.toLowerCase()) ? '' : 'none';
  });
}

// Pesquisa em Faturamento
function pesquisarFaturamento(termo) {
  const tabela = document.getElementById('tabelaExtrato');
  if (!tabela) return;
  
  const linhas = tabela.querySelectorAll('tr');
  linhas.forEach(linha => {
    const texto = linha.textContent.toLowerCase();
    linha.style.display = texto.includes(termo.toLowerCase()) ? '' : 'none';
  });
}

// Filtro de Status para Agendamentos
function filtrarAgendamentosPorStatus(status, containerElement) {
  if (!containerElement) return;
  
  const cards = containerElement.querySelectorAll('.bg-white, .bg-gray-800');
  if (status === 'todos') {
    cards.forEach(card => card.style.display = '');
    return;
  }
  
  cards.forEach(card => {
    const statusCard = card.dataset.status || '';
    card.style.display = statusCard === status ? '' : 'none';
  });
}

// ==========================================
// Toggle Sidebar (Mobile)
// ==========================================
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (sidebar && overlay) {
    const isHidden = sidebar.classList.contains('-translate-x-full');
    
    if (isHidden) {
      sidebar.classList.remove('-translate-x-full');
      overlay.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    }
  }
}

// Atualizar estatísticas na sidebar
function atualizarEstatisticasSidebar(stats) {
  if (!stats) return;
  
  const mapping = {
    totalAgendamentosSidebar: stats.total || 0,
    totalPendentesSidebar: stats.pendentes || 0,
    totalConfirmadosSidebar: stats.confirmados || 0,
    totalConcluidosSidebar: stats.concluidos || 0,
    totalCanceladosSidebar: stats.cancelados || 0
  };
  
  Object.entries(mapping).forEach(([id, value]) => {
    const elem = document.getElementById(id);
    if (elem) elem.textContent = value;
  });
}

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
  carregarConfigEstatisticas();
  console.log('✅ CRM Features carregadas');
});

// Exportar funções globais
window.abrirModalConfigEstatisticas = abrirModalConfigEstatisticas;
window.fecharModalConfigEstatisticas = fecharModalConfigEstatisticas;
window.salvarEstatisticasConfig = salvarEstatisticasConfig;
window.toggleSidebar = toggleSidebar;
window.pesquisarClientes = pesquisarClientes;
window.pesquisarEquipe = pesquisarEquipe;
window.pesquisarServicos = pesquisarServicos;
window.pesquisarProdutos = pesquisarProdutos;
window.pesquisarFaturamento = pesquisarFaturamento;
window.filtrarAgendamentosPorStatus = filtrarAgendamentosPorStatus;
window.atualizarEstatisticasSidebar = atualizarEstatisticasSidebar;
