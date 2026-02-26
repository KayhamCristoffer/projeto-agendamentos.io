/**
 * Sistema de Notificações Toast
 * Exibe mensagens de sucesso, erro, aviso e informação
 */

class ToastNotification {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Criar container se não existir
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed top-4 right-4 z-[9999] space-y-2 max-w-sm';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  }

  /**
   * Exibe uma notificação
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duração em ms (padrão: 4000)
   */
  show(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `transform transition-all duration-300 ease-in-out translate-x-0 opacity-100
                       rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in
                       ${this.getColorClass(type)}`;
    
    toast.innerHTML = `
      <div class="flex-shrink-0 text-2xl">
        ${this.getIcon(type)}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium break-words">${message}</p>
      </div>
      <button onclick="this.parentElement.remove()" 
              class="flex-shrink-0 text-lg hover:opacity-70 transition">
        ✕
      </button>
    `;

    this.container.appendChild(toast);

    // Auto remover
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  getColorClass(type) {
    const colors = {
      success: 'bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-800 dark:text-green-200',
      error: 'bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-800 dark:text-red-200',
      warning: 'bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200',
      info: 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200'
    };
    return colors[type] || colors.info;
  }

  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  // Atalhos
  success(message, duration) { this.show(message, 'success', duration); }
  error(message, duration) { this.show(message, 'error', duration); }
  warning(message, duration) { this.show(message, 'warning', duration); }
  info(message, duration) { this.show(message, 'info', duration); }
}

// Instância global
const Toast = new ToastNotification();

// CSS para animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
  @media (max-width: 640px) {
    #toast-container {
      left: 1rem;
      right: 1rem;
      max-width: calc(100% - 2rem);
    }
  }
`;
document.head.appendChild(style);

// Expor globalmente
window.Toast = Toast;
