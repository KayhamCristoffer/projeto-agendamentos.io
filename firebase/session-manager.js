// ============================================
// Gerenciamento de Sessão e Timeout
// Sistema de Agendamentos Online
// ============================================

/**
 * Configuração de timeout de sessão
 * Usuário será deslogado após 1 hora de inatividade
 */

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora em milissegundos
let sessionTimer = null;
let lastActivity = Date.now();

/**
 * Resetar timer de inatividade
 */
function resetSessionTimer() {
  lastActivity = Date.now();
  
  // Limpar timer anterior
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
  
  // Criar novo timer
  sessionTimer = setTimeout(() => {
    handleSessionTimeout();
  }, SESSION_TIMEOUT);
}

/**
 * Logout automático por timeout
 */
function handleSessionTimeout() {
  console.log('⏰ Sessão expirada por inatividade');
  
  // Fazer logout
  if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
    firebase.auth().signOut().then(() => {
      alert('Sua sessão expirou por inatividade. Por favor, faça login novamente.');
      window.location.href = 'login.html';
    }).catch((error) => {
      console.error('Erro ao fazer logout:', error);
      window.location.href = 'login.html';
    });
  } else {
    window.location.href = 'login.html';
  }
}

/**
 * Verificar tempo de sessão
 */
function checkSessionValidity() {
  const timeElapsed = Date.now() - lastActivity;
  
  if (timeElapsed >= SESSION_TIMEOUT) {
    handleSessionTimeout();
    return false;
  }
  
  return true;
}

/**
 * Inicializar monitoramento de atividade
 */
function initSessionMonitoring() {
  // Eventos que indicam atividade do usuário
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  
  activityEvents.forEach(event => {
    document.addEventListener(event, () => {
      resetSessionTimer();
    }, true);
  });
  
  // Iniciar timer
  resetSessionTimer();
  
  // Verificar sessão periodicamente (a cada 5 minutos)
  setInterval(() => {
    if (firebase.auth().currentUser) {
      checkSessionValidity();
    }
  }, 5 * 60 * 1000);
  
  console.log('✅ Monitoramento de sessão iniciado (timeout: 1 hora)');
}

/**
 * Obter tempo restante de sessão
 */
function getSessionTimeRemaining() {
  const timeElapsed = Date.now() - lastActivity;
  const timeRemaining = SESSION_TIMEOUT - timeElapsed;
  
  if (timeRemaining <= 0) {
    return 0;
  }
  
  // Retornar em minutos
  return Math.floor(timeRemaining / (60 * 1000));
}

/**
 * Avisar usuário quando faltarem 5 minutos
 */
function setupSessionWarning() {
  setInterval(() => {
    const remaining = getSessionTimeRemaining();
    
    if (remaining === 5 && firebase.auth().currentUser) {
      console.warn('⚠️ Sua sessão expirará em 5 minutos');
      // Opcional: mostrar notificação visual
      const notification = document.createElement('div');
      notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#ff9800;color:white;padding:15px;border-radius:8px;z-index:10000;box-shadow:0 4px 6px rgba(0,0,0,0.1)';
      notification.innerHTML = '⚠️ Sua sessão expirará em 5 minutos. Faça alguma ação para renovar.';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 10000);
    }
  }, 60 * 1000); // Verificar a cada 1 minuto
}

// Inicializar quando a página carregar
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof firebase !== 'undefined') {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            initSessionMonitoring();
            setupSessionWarning();
          }
        });
      }
    });
  } else {
    if (typeof firebase !== 'undefined') {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          initSessionMonitoring();
          setupSessionWarning();
        }
      });
    }
  }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.resetSessionTimer = resetSessionTimer;
  window.getSessionTimeRemaining = getSessionTimeRemaining;
  window.checkSessionValidity = checkSessionValidity;
}

console.log('✅ Sistema de gerenciamento de sessão carregado');
