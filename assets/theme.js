// ============================================
// Sistema de Tema Escuro/Claro
// ============================================

// Inicializar tema ao carregar página
function initTheme() {
  // Verificar se há tema salvo no localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
}

// Definir tema
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Atualizar ícone do botão
  updateThemeIcon(theme);
}

// Alternar tema
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Atualizar ícone do botão
function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-toggle-icon');
  if (icon) {
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

// Criar botão de toggle
function createThemeToggle() {
  const button = document.createElement('button');
  button.className = 'theme-toggle';
  button.setAttribute('aria-label', 'Alternar tema');
  button.onclick = toggleTheme;
  
  const icon = document.createElement('span');
  icon.className = 'theme-toggle-icon';
  icon.textContent = '🌙';
  
  const text = document.createElement('span');
  text.textContent = 'Tema';
  text.style.fontSize = '14px';
  text.style.fontWeight = '600';
  
  button.appendChild(icon);
  button.appendChild(text);
  document.body.appendChild(button);
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// Exportar funções
window.initTheme = initTheme;
window.setTheme = setTheme;
window.toggleTheme = toggleTheme;

console.log('✅ Sistema de tema carregado');
