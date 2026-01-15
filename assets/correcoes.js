// ============================================
// CORREÇÕES E MELHORIAS DO SISTEMA
// ============================================

/**
 * Corrigir estrutura de chat
 * O chat deve usar a estrutura simplificada do Firebase
 */
function enviarMensagemCorrigida(agendamentoId, texto, usuarioAtual) {
  const mensagem = {
    texto: texto,
    timestamp: Date.now(),
    userId: usuarioAtual.uid,
    nome: usuarioAtual.displayName || usuarioAtual.email
  };
  
  return firebase.database().ref(`chats/${agendamentoId}`).push(mensagem);
}

/**
 * Listar mensagens corrigidas
 */
function listarMensagensCorrigidas(agendamentoId, callback) {
  const ref = firebase.database().ref(`chats/${agendamentoId}`);
  
  ref.on('value', (snapshot) => {
    const mensagens = [];
    snapshot.forEach((childSnapshot) => {
      const msg = childSnapshot.val();
      mensagens.push({
        id: childSnapshot.key,
        texto: msg.texto || '',
        nome: msg.nome || 'Usuário',
        userId: msg.userId || '',
        timestamp: msg.timestamp || Date.now()
      });
    });
    
    // Ordenar por timestamp
    mensagens.sort((a, b) => a.timestamp - b.timestamp);
    callback(mensagens);
  });
  
  // Retornar função para remover listener
  return () => ref.off('value');
}

/**
 * Verificar conflito de horários considerando duração
 */
async function verificarConflitosHorario(data, horaInicio, duracaoMinutos, agendamentoIdIgnorar = null) {
  const [hora, min] = horaInicio.split(':').map(Number);
  const inicioMinutos = hora * 60 + min;
  const fimMinutos = inicioMinutos + duracaoMinutos;
  
  const agendamentos = await firebase.database().ref('agendamentos')
    .orderByChild('dataHora')
    .startAt(data)
    .endAt(data + 'T23:59')
    .once('value');
  
  let temConflito = false;
  
  agendamentos.forEach((snapshot) => {
    if (snapshot.key === agendamentoIdIgnorar) return;
    
    const agend = snapshot.val();
    if (agend.status === 'cancelado') return;
    
    // Extrair hora do agendamento
    const agendHora = agend.dataHora.split('T')[1];
    if (!agendHora) return;
    
    const [aHora, aMin] = agendHora.split(':').map(Number);
    const agendInicioMin = aHora * 60 + aMin;
    const agendFimMin = agendInicioMin + (agend.duracaoTotal || 30);
    
    // Verificar sobreposição
    if (!(fimMinutos <= agendInicioMin || inicioMinutos >= agendFimMin)) {
      temConflito = true;
    }
  });
  
  return temConflito;
}

/**
 * Gerar horários disponíveis considerando duração e conflitos
 */
async function gerarHorariosDisponiveisCorrigidos(data, duracaoMinutos) {
  const horarios = [];
  const horaInicio = 8;
  const horaFim = 19;
  const intervalo = 30;
  
  for (let h = horaInicio; h < horaFim; h++) {
    for (let m = 0; m < 60; m += intervalo) {
      // Pular horário de almoço
      if (h === 12 || (h === 13 && m === 0)) continue;
      
      const horario = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      
      // Verificar se há tempo suficiente até o fim do expediente
      const totalMinutos = h * 60 + m + duracaoMinutos;
      const horaFimMinutos = horaFim * 60;
      
      if (totalMinutos > horaFimMinutos) continue;
      
      // Verificar conflitos
      const temConflito = await verificarConflitosHorario(data, horario, duracaoMinutos);
      
      if (!temConflito) {
        horarios.push(horario);
      }
    }
  }
  
  return horarios;
}

/**
 * Alterar senha de usuário (admin)
 */
async function alterarSenhaUsuario(userId, novaSenha) {
  // Nota: Alterar senha via Admin SDK requer backend
  // Esta é uma solução alternativa usando o próprio Firebase Auth
  
  try {
    // Buscar email do usuário
    const perfil = await obterPerfilUsuario(userId);
    if (!perfil || !perfil.email) {
      throw new Error('Usuário não encontrado');
    }
    
    // Enviar email de recuperação de senha
    await firebase.auth().sendPasswordResetEmail(perfil.email);
    
    return {
      success: true,
      message: 'Email de recuperação enviado para o usuário'
    };
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw error;
  }
}

/**
 * Formatar data/hora para o formato correto
 */
function formatarDataHora(data, hora) {
  // Garantir formato YYYY-MM-DDTHH:MM
  const dataFormatada = data.includes('T') ? data.split('T')[0] : data;
  const horaFormatada = hora.length === 5 ? hora : hora.substring(0, 5);
  return `${dataFormatada}T${horaFormatada}`;
}

// Exportar funções
if (typeof window !== 'undefined') {
  window.enviarMensagemCorrigida = enviarMensagemCorrigida;
  window.listarMensagensCorrigidas = listarMensagensCorrigidas;
  window.verificarConflitosHorario = verificarConflitosHorario;
  window.gerarHorariosDisponiveisCorrigidos = gerarHorariosDisponiveisCorrigidos;
  window.alterarSenhaUsuario = alterarSenhaUsuario;
  window.formatarDataHora = formatarDataHora;
}

console.log('✅ Correções carregadas');
