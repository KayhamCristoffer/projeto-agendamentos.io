// ============================================
// Componente de Menu de Navegação
// Sistema de Agendamentos Online
// ============================================

/**
 * Criar menu de navegação
 * @param {Object} options - Opções do menu {isAdmin: boolean, currentPage: string}
 */
function criarMenu(options = {}) {
  const { isAdmin = false, currentPage = '' } = options;
  
  return `
    <nav class="nav-bar">
      <div class="nav-container">
        <a href="index.html" class="nav-logo">📅 Agendamentos Online</a>
        
        <div class="nav-menu">
          <a href="cliente.html" class="nav-link ${currentPage === 'cliente' ? 'active' : ''}">
            👤 Área do Cliente
          </a>
          
          ${isAdmin ? `
            <a href="admin.html" class="nav-link ${currentPage === 'admin' ? 'active' : ''}">
              🛠️ Administração
            </a>
          ` : ''}
          
          <a href="perfil.html" class="nav-link ${currentPage === 'perfil' ? 'active' : ''}">
            ⚙️ Perfil
          </a>
          
          <button onclick="toggleTheme()" class="btn btn-sm btn-ghost theme-toggle" title="Alterar tema">
            <span id="themeIcon">🌙</span>
          </button>
          
          <button onclick="logout()" class="btn btn-sm btn-danger">
            🚪 Sair
          </button>
        </div>
      </div>
    </nav>
  `;
}

/**
 * Inicializar menu na página
 */
async function inicializarMenu(currentPage = '') {
  const user = firebase.auth().currentUser;
  
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  const perfil = await obterPerfilUsuario(user.uid);
  const isAdmin = perfil && perfil.role === 'admin';
  
  // Inserir menu no início do body
  const menuHTML = criarMenu({ isAdmin, currentPage });
  document.body.insertAdjacentHTML('afterbegin', menuHTML);
  
  // Atualizar ícone do tema
  atualizarIconeTema();
  
  return { user, perfil, isAdmin };
}

/**
 * Atualizar ícone do tema
 */
function atualizarIconeTema() {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    const theme = localStorage.getItem('theme') || 'light';
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/**
 * Função de logout
 */
function logout() {
  if (confirm('Deseja realmente sair?')) {
    firebase.auth().signOut().then(() => {
      window.location.href = 'login.html';
    });
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.criarMenu = criarMenu;
  window.inicializarMenu = inicializarMenu;
  window.atualizarIconeTema = atualizarIconeTema;
  window.logout = logout;
}
