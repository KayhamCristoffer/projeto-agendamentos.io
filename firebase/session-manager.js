/**
 * Session Manager
 * Gerencia sessões de usuário e timeout de inatividade
 */

(function() {
  'use strict';

  // Configurações
  const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora em milissegundos
  const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Verificar a cada 1 minuto

  let lastActivity = Date.now();
  let sessionCheckInterval = null;

  /**
   * Atualizar timestamp da última atividade
   */
  function updateActivity() {
    lastActivity = Date.now();
    if (localStorage) {
      localStorage.setItem('lastActivity', lastActivity.toString());
    }
  }

  /**
   * Verificar se a sessão expirou
   */
  function checkSessionTimeout() {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;

    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      console.warn('⚠️ Sessão expirada por inatividade');
      handleSessionExpired();
    }
  }

  /**
   * Lidar com sessão expirada
   */
  async function handleSessionExpired() {
    try {
      if (firebase && firebase.auth && firebase.auth()) {
        await firebase.auth().signOut();
      }
      
      if (window.Toast) {
        Toast.warning('Sessão expirada por inatividade. Faça login novamente.', 5000);
      } else {
        alert('Sessão expirada por inatividade. Faça login novamente.');
      }

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } catch (error) {
      console.error('❌ Erro ao expirar sessão:', error);
      window.location.href = 'login.html';
    }
  }

  /**
   * Inicializar monitoramento de sessão
   */
  function initSessionManager() {
    // Restaurar última atividade do localStorage
    if (localStorage && localStorage.getItem('lastActivity')) {
      const stored = parseInt(localStorage.getItem('lastActivity'));
      if (!isNaN(stored)) {
        lastActivity = stored;
      }
    }

    // Eventos que atualizam atividade
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Throttle para não atualizar a cada milissegundo
    let throttleTimeout;
    activityEvents.forEach(event => {
      document.addEventListener(event, () => {
        if (!throttleTimeout) {
          updateActivity();
          throttleTimeout = setTimeout(() => {
            throttleTimeout = null;
          }, 5000); // Atualizar no máximo a cada 5 segundos
        }
      }, true);
    });

    // Iniciar verificação periódica
    sessionCheckInterval = setInterval(checkSessionTimeout, ACTIVITY_CHECK_INTERVAL);

    console.log('✅ Sistema de gerenciamento de sessão carregado');
    console.log(`⏱️ Timeout de inatividade: ${SESSION_TIMEOUT / 1000 / 60} minutos`);
  }

  /**
   * Parar monitoramento de sessão
   */
  function stopSessionManager() {
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      sessionCheckInterval = null;
    }
  }

  // Inicializar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Só iniciar se houver usuário autenticado
      if (firebase && firebase.auth) {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            console.log('✅ Monitoramento de sessão iniciado (timeout: 1 hora)');
            initSessionManager();
          } else {
            stopSessionManager();
          }
        });
      }
    });
  } else {
    // DOM já está pronto
    if (firebase && firebase.auth) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log('✅ Monitoramento de sessão iniciado (timeout: 1 hora)');
          initSessionManager();
        } else {
          stopSessionManager();
        }
      });
    }
  }

  // Expor funções globalmente se necessário
  window.SessionManager = {
    updateActivity: updateActivity,
    checkSessionTimeout: checkSessionTimeout,
    stop: stopSessionManager
  };

})();
