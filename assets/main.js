// ===============================================
// MAIN.JS - Funções Principais do Sistema
// ===============================================

// Estado global do usuário
window.currentUser = null;
window.currentUserRole = null;

// ===============================================
// INICIALIZAÇÃO
// ===============================================

// Carrega o menu em todas as páginas
async function loadMenu() {
  try {
    const response = await fetch('/components/menu.html');
    const menuHTML = await response.text();
    
    // Insere o menu no início do body
    const menuContainer = document.createElement('div');
    menuContainer.innerHTML = menuHTML;
    document.body.insertBefore(menuContainer.firstElementChild, document.body.firstChild);
    
    // Inicializa o menu após carregar
    initializeMenu();
  } catch (error) {
    console.error('Erro ao carregar menu:', error);
  }
}

// Inicializa o menu e verifica autenticação
function initializeMenu() {
  firebase.auth().onAuthStateChanged(async (user) => {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const authButton = document.getElementById('authButton');
    const navButtons = document.getElementById('navButtons');
    const btnModoAdmin = document.getElementById('btnModoAdmin');
    
    if (user) {
      // Usuário logado
      window.currentUser = user;
      
      // Carrega dados do usuário
      try {
        const userProfile = await obterPerfilUsuario(user.uid);
        window.currentUserRole = userProfile?.role || 'cliente';
        
        // Atualiza interface
        if (userNameDisplay) {
          userNameDisplay.textContent = userProfile?.nomeCompleto || user.email;
        }
        
        if (authButton) {
          authButton.textContent = 'Sair';
          authButton.onclick = logout;
        }
        
        if (navButtons) {
          navButtons.style.display = 'flex';
        }
        
        // Mostra botão admin se for admin
        if (btnModoAdmin && window.currentUserRole === 'admin') {
          btnModoAdmin.style.display = 'inline-flex';
        }
        
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
      
    } else {
      // Usuário não logado
      window.currentUser = null;
      window.currentUserRole = null;
      
      if (userNameDisplay) {
        userNameDisplay.textContent = '';
      }
      
      if (authButton) {
        authButton.textContent = 'Entrar';
        authButton.onclick = () => window.location.href = 'login.html';
      }
      
      if (navButtons) {
        navButtons.style.display = 'none';
      }
    }
  });
}

// ===============================================
// AUTENTICAÇÃO
// ===============================================

function handleAuth() {
  if (window.currentUser) {
    logout();
  } else {
    window.location.href = 'login.html';
  }
}

async function logout() {
  try {
    await firebase.auth().signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    alert('Erro ao sair. Tente novamente.');
  }
}

// ===============================================
// VERIFICAÇÃO DE PERMISSÕES
// ===============================================

async function verificarPermissaoAdmin() {
  const user = firebase.auth().currentUser;
  
  if (!user) {
    window.location.href = 'login.html';
    return false;
  }
  
  try {
    const perfil = await obterPerfilUsuario(user.uid);
    
    if (perfil?.role !== 'admin') {
      alert('Acesso negado. Apenas administradores podem acessar esta página.');
      window.location.href = 'cliente.html';
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    window.location.href = 'login.html';
    return false;
  }
}

async function verificarAutenticacao() {
  const user = firebase.auth().currentUser;
  
  if (!user) {
    window.location.href = 'login.html';
    return false;
  }
  
  return true;
}

// ===============================================
// UTILIDADES
// ===============================================

// Formata data para exibição
function formatarData(dataISO) {
  if (!dataISO) return '';
  
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
}

// Formata horário para exibição
function formatarHorario(dataISO) {
  if (!dataISO) return '';
  
  const data = new Date(dataISO);
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  
  return `${horas}:${minutos}`;
}

// Formata data e hora completa
function formatarDataHora(dataISO) {
  if (!dataISO) return '';
  return `${formatarData(dataISO)} às ${formatarHorario(dataISO)}`;
}

// Formata preço
function formatarPreco(valor) {
  if (!valor && valor !== 0) return 'R$ 0,00';
  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

// Formata duração em minutos para texto
function formatarDuracao(minutos) {
  if (!minutos) return '0 min';
  
  if (minutos < 60) {
    return `${minutos} min`;
  }
  
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  
  if (mins === 0) {
    return `${horas}h`;
  }
  
  return `${horas}h ${mins}min`;
}

// Mostra mensagem de sucesso
function mostrarSucesso(mensagem) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-success';
  alert.textContent = mensagem;
  alert.style.position = 'fixed';
  alert.style.top = '20px';
  alert.style.right = '20px';
  alert.style.zIndex = '10000';
  alert.style.maxWidth = '400px';
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Mostra mensagem de erro
function mostrarErro(mensagem) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-danger';
  alert.textContent = mensagem;
  alert.style.position = 'fixed';
  alert.style.top = '20px';
  alert.style.right = '20px';
  alert.style.zIndex = '10000';
  alert.style.maxWidth = '400px';
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// Mostra loading
function mostrarLoading(elemento) {
  if (elemento) {
    elemento.innerHTML = '<div class="spinner"></div>';
  }
}

// Esconde loading
function esconderLoading(elemento) {
  if (elemento) {
    const spinner = elemento.querySelector('.spinner');
    if (spinner) {
      spinner.remove();
    }
  }
}

// ===============================================
// INICIALIZAÇÃO AUTOMÁTICA
// ===============================================

// Carrega o menu automaticamente quando a página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadMenu);
} else {
  loadMenu();
}

// Exporta funções globais
window.handleAuth = handleAuth;
window.logout = logout;
window.verificarPermissaoAdmin = verificarPermissaoAdmin;
window.verificarAutenticacao = verificarAutenticacao;
window.formatarData = formatarData;
window.formatarHorario = formatarHorario;
window.formatarDataHora = formatarDataHora;
window.formatarPreco = formatarPreco;
window.formatarDuracao = formatarDuracao;
window.mostrarSucesso = mostrarSucesso;
window.mostrarErro = mostrarErro;
window.mostrarLoading = mostrarLoading;
window.esconderLoading = esconderLoading;
