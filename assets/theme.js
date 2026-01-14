// ============================================
// Sistema de Tema Escuro/Claro
// ============================================

// Inicializar tema ao carregar página
function initTheme() {
  // Verificar se há tema salvo no localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
}

// Aplicar tema
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
  updateThemeIcons(theme);
}

// Alternar tema
function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme);
}

// Atualizar ícones do tema
function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('#themeIcon, .theme-icon');
  icons.forEach(icon => {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// Exportar funções
window.initTheme = initTheme;
window.applyTheme = applyTheme;
window.toggleTheme = toggleTheme;

console.log('✅ Sistema de tema carregado');
