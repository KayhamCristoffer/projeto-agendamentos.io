/**
 * Regras de Negócio do Sistema de Agendamentos
 */

const BusinessRules = {
  
  /**
   * VALIDAÇÕES
   */
  validation: {
    // Valida email
    isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },

    // Valida telefone (mínimo 10 dígitos)
    isValidPhone(phone) {
      const digits = phone.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 11;
    },

    // Valida senha (mínimo 6 caracteres)
    isValidPassword(password) {
      return password && password.length >= 6;
    },

    // Valida nome (mínimo 3 caracteres)
    isValidName(name) {
      return name && name.trim().length >= 3;
    },

    // Valida preço
    isValidPrice(price) {
      return typeof price === 'number' && price >= 0;
    },

    // Valida duração (em minutos)
    isValidDuration(duration) {
      return typeof duration === 'number' && duration > 0;
    }
  },

  /**
   * FORMATAÇÃO
   */
  format: {
    // Formata preço para R$ X.XXX,XX
    price(value) {
      if (typeof value !== 'number') value = parseFloat(value) || 0;
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    // Formata telefone (XX) XXXXX-XXXX
    phone(phone) {
      if (!phone) return '';
      let digits = phone.replace(/\D/g, '');
      
      if (digits.length <= 11) {
        digits = digits.replace(/^(\d{2})(\d)/g, '($1) $2');
        digits = digits.replace(/(\d{5})(\d)/, '$1-$2');
      }
      
      return digits;
    },

    // Formata data para DD/MM/YYYY
    date(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    },

    // Formata data e hora para DD/MM/YYYY HH:MM
    datetime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    // Formata duração (minutos para horas)
    duration(minutes) {
      if (!minutes) return '0min';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      if (hours === 0) return `${mins}min`;
      if (mins === 0) return `${hours}h`;
      return `${hours}h${mins}min`;
    }
  },

  /**
   * HORÁRIOS
   */
  schedule: {
    // Horário de funcionamento
    openTime: 8,  // 8:00
    closeTime: 19, // 19:00
    interval: 30,  // 30 minutos

    // Gera horários disponíveis
    generateTimeSlots(date, duration = 60) {
      const slots = [];
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Se for hoje, começa da próxima hora cheia
      let startHour = this.openTime;
      if (selectedDate.getTime() === today.getTime()) {
        const now = new Date();
        startHour = Math.max(this.openTime, now.getHours() + 1);
      }

      for (let hour = startHour; hour < this.closeTime; hour++) {
        for (let minute = 0; minute < 60; minute += this.interval) {
          // Verificar se há tempo suficiente antes do fechamento
          const totalMinutes = hour * 60 + minute + duration;
          const closeMinutes = this.closeTime * 60;
          
          if (totalMinutes <= closeMinutes) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(time);
          }
        }
      }
      
      return slots;
    },

    // Verifica se horário está disponível
    isTimeAvailable(date, time, appointments) {
      const dateTimeStr = `${date}T${time}:00`;
      
      // Verificar conflitos
      for (const apt of appointments) {
        if (apt.status === 'cancelado') continue;
        
        const aptDate = new Date(apt.dataHora);
        const newDate = new Date(dateTimeStr);
        
        // Verificar overlap
        const aptEnd = new Date(aptDate.getTime() + apt.duracaoTotal * 60000);
        
        if (newDate < aptEnd && newDate >= aptDate) {
          return false;
        }
      }
      
      return true;
    }
  },

  /**
   * AGENDAMENTOS
   */
  appointment: {
    // Status permitidos
    validStatuses: ['pendente', 'confirmado', 'concluido', 'cancelado'],

    // Calcula preço total dos serviços
    calculateTotal(services) {
      return services.reduce((sum, s) => sum + (s.preco || 0), 0);
    },

    // Calcula duração total dos serviços
    calculateDuration(services) {
      return services.reduce((sum, s) => sum + (s.duracao || 0), 0);
    },

    // Verifica se pode cancelar
    canCancel(appointment) {
      const aptDate = new Date(appointment.dataHora);
      const now = new Date();
      
      // Só pode cancelar se for futuro
      return aptDate > now && appointment.status !== 'cancelado' && appointment.status !== 'concluido';
    },

    // Verifica se pode editar
    canEdit(appointment) {
      return appointment.status === 'pendente' || appointment.status === 'confirmado';
    }
  },

  /**
   * USUÁRIOS
   */
  user: {
    // Roles válidos
    validRoles: ['admin', 'cliente'],

    // Verifica se é admin
    isAdmin(user) {
      return user && user.role === 'admin';
    },

    // Verifica se é cliente
    isClient(user) {
      return user && user.role === 'cliente';
    },

    // Cria perfil padrão de cliente
    createClientProfile(data) {
      return {
        nome: data.nome || '',
        nomeCompleto: data.nome || '',
        email: data.email,
        telefone: data.telefone || '',
        whatsapp: data.telefone || '',
        role: 'cliente',
        totalVisitas: 0,
        ultimaVisita: null,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      };
    },

    // Atualiza última visita
    updateLastVisit(userId) {
      return {
        ultimaVisita: new Date().toISOString(),
        totalVisitas: firebase.database.ServerValue.increment(1),
        atualizadoEm: new Date().toISOString()
      };
    }
  },

  /**
   * MENSAGENS DE ERRO
   */
  messages: {
    validation: {
      emailInvalid: 'E-mail inválido',
      phoneInvalid: 'Telefone inválido. Use o formato (XX) XXXXX-XXXX',
      passwordShort: 'Senha deve ter no mínimo 6 caracteres',
      passwordMismatch: 'As senhas não coincidem',
      nameShort: 'Nome deve ter no mínimo 3 caracteres',
      requiredFields: 'Preencha todos os campos obrigatórios',
      priceInvalid: 'Preço inválido',
      durationInvalid: 'Duração inválida'
    },
    auth: {
      emailInUse: 'Este e-mail já está cadastrado',
      invalidCredentials: 'E-mail ou senha incorretos',
      userNotFound: 'Usuário não encontrado',
      weakPassword: 'Senha muito fraca',
      networkError: 'Erro de conexão. Verifique sua internet'
    },
    appointment: {
      noServices: 'Selecione pelo menos um serviço',
      noProfessional: 'Selecione um profissional',
      noDate: 'Selecione uma data',
      noTime: 'Selecione um horário',
      timeUnavailable: 'Horário não disponível',
      pastDate: 'Não é possível agendar em datas passadas'
    },
    success: {
      created: 'Criado com sucesso!',
      updated: 'Atualizado com sucesso!',
      deleted: 'Excluído com sucesso!',
      saved: 'Salvo com sucesso!',
      sent: 'Enviado com sucesso!'
    }
  }
};

// Expor globalmente
window.BusinessRules = BusinessRules;
