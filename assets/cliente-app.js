// ===============================================
// CLIENTE APP - Sistema de Agendamentos
// ===============================================

let currentUser = null;
let userProfile = null;
let servicosSelecionados = [];
let mesAtual = new Date();
let dataSelecionada = null;
let horarioSelecionado = null;
let agendamentoAtualChat = null;

// ===============================================
// INICIALIZAÇÃO
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
  carregarMenu();
  inicializarAutenticacao();
});

// Carregar menu
async function carregarMenu() {
  try {
    const response = await fetch('components/menu.html');
    const html = await response.text();
    document.getElementById('menuContainer').innerHTML = html;
    inicializarMenu();
  } catch (error) {
    console.error('Erro ao carregar menu:', error);
  }
}

// Inicializar autenticação
function inicializarAutenticacao() {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    currentUser = user;
    await carregarPerfilUsuario();
    inicializarPagina();
  });
}

// Carregar perfil do usuário
async function carregarPerfilUsuario() {
  try {
    userProfile = await obterPerfilUsuario(currentUser.uid);
    
    if (!userProfile) {
      console.error('Perfil não encontrado');
      return;
    }

    // Atualizar menu
    const userNameDisplay = document.getElementById('userName');
    if (userNameDisplay) {
      userNameDisplay.textContent = userProfile.nomeCompleto || currentUser.email;
    }

    // Mostrar/ocultar botão admin
    const btnModoAdmin = document.getElementById('btnModoAdmin');
    if (btnModoAdmin) {
      btnModoAdmin.style.display = userProfile.role === 'admin' ? 'inline-flex' : 'none';
    }

  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
  }
}

// ===============================================
// NAVEGAÇÃO
// ===============================================

function mostrarSecao(secao) {
  // Ocultar todas as seções
  document.querySelectorAll('.section-content').forEach(s => {
    s.classList.remove('active');
  });

  // Remover classe active de todos os tabs
  document.querySelectorAll('.tab-button').forEach(t => {
    t.classList.remove('active');
  });

  // Mostrar seção selecionada
  const secaoElement = document.getElementById(`secao${secao.charAt(0).toUpperCase() + secao.slice(1)}`);
  if (secaoElement) {
    secaoElement.classList.add('active');
  }

  // Ativar tab
  const tab = document.querySelector(`[data-tab="${secao}"]`);
  if (tab) {
    tab.classList.add('active');
  }

  // Carregar dados da seção
  if (secao === 'agendar') {
    carregarServicos();
    renderizarCalendario();
  } else if (secao === 'pendentes') {
    carregarPendentes();
  } else if (secao === 'historico') {
    carregarHistorico();
  } else if (secao === 'perfil') {
    carregarDadosPerfil();
  }
}

// ===============================================
// INICIALIZAÇÃO DA PÁGINA
// ===============================================

function inicializarPagina() {
  carregarServicos();
  renderizarCalendario();
  configurarEventos();
}

function configurarEventos() {
  // Form de agendamento
  document.getElementById('formAgendamento').addEventListener('submit', criarAgendamento);

  // Form de perfil
  document.getElementById('formPerfil').addEventListener('submit', salvarPerfil);

  // Form de senha
  document.getElementById('formSenha').addEventListener('submit', alterarSenha);
}

// ===============================================
// SERVIÇOS
// ===============================================

function carregarServicos() {
  const grid = document.getElementById('servicosGrid');
  if (!grid) return;

  const servicos = getAllServices();
  
  grid.innerHTML = servicos.map(servico => `
    <div class="servico-card" data-servico-id="${servico.id}">
      <div class="servico-checkbox">
        <input 
          type="checkbox" 
          id="servico-${servico.id}" 
          onchange="toggleServico('${servico.id}')"
        >
        <label for="servico-${servico.id}"></label>
      </div>
      <div class="servico-icon">${servico.icon}</div>
      <div class="servico-info">
        <h4>${servico.name}</h4>
        <p>${servico.description}</p>
      </div>
      <div class="servico-detalhes">
        <span class="servico-preco">R$ ${servico.price.toFixed(2)}</span>
        <span class="servico-duracao">⏱️ ${servico.duration} min</span>
      </div>
    </div>
  `).join('');
}

function toggleServico(servicoId) {
  const checkbox = document.getElementById(`servico-${servicoId}`);
  const card = document.querySelector(`[data-servico-id="${servicoId}"]`);
  
  if (checkbox.checked) {
    servicosSelecionados.push(servicoId);
    card.classList.add('selected');
  } else {
    servicosSelecionados = servicosSelecionados.filter(id => id !== servicoId);
    card.classList.remove('selected');
  }
  
  atualizarResumo();
  atualizarHorarios();
}

function atualizarResumo() {
  const resumo = document.getElementById('resumoSelecao');
  const lista = document.getElementById('servicosSelecionadosLista');
  
  if (servicosSelecionados.length === 0) {
    resumo.style.display = 'none';
    return;
  }
  
  resumo.style.display = 'block';
  
  // Calcular totais
  let duracaoTotal = 0;
  let precoTotal = 0;
  
  lista.innerHTML = servicosSelecionados.map(id => {
    const servico = getServiceById(id);
    duracaoTotal += servico.duration;
    precoTotal += servico.price;
    
    return `
      <div class="servico-resumo-item">
        <span>${servico.icon} ${servico.name}</span>
        <span>R$ ${servico.price.toFixed(2)}</span>
      </div>
    `;
  }).join('');
  
  document.getElementById('duracaoTotal').textContent = `${duracaoTotal} min`;
  document.getElementById('precoTotal').textContent = `R$ ${precoTotal.toFixed(2)}`;
}

// ===============================================
// CALENDÁRIO
// ===============================================

function renderizarCalendario() {
  const container = document.getElementById('diasCalendario');
  if (!container) return;
  
  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();
  
  // Atualizar título
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  document.getElementById('mesAtual').textContent = `${meses[mes]} ${ano}`;
  
  // Primeiro e último dia do mês
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  
  // Dias vazios no início
  const diasVazios = primeiroDia.getDay();
  
  container.innerHTML = '';
  
  // Adicionar dias vazios
  for (let i = 0; i < diasVazios; i++) {
    container.innerHTML += '<div class="dia-vazio"></div>';
  }
  
  // Adicionar dias do mês
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const data = new Date(ano, mes, dia);
    const dataStr = data.toISOString().split('T')[0];
    
    let classes = 'dia-calendario';
    
    // Desabilitar dias passados
    if (data < hoje) {
      classes += ' disabled';
    }
    
    // Verificar se é o dia selecionado
    if (dataSelecionada === dataStr) {
      classes += ' selected';
    }
    
    container.innerHTML += `
      <div class="${classes}" onclick="selecionarData('${dataStr}')">
        ${dia}
      </div>
    `;
  }
}

function navegarMes(direcao) {
  mesAtual.setMonth(mesAtual.getMonth() + direcao);
  renderizarCalendario();
}

function selecionarData(dataStr) {
  const data = new Date(dataStr + 'T00:00:00');
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  if (data < hoje) return;
  
  dataSelecionada = dataStr;
  document.getElementById('dataSelecionada').value = dataStr;
  renderizarCalendario();
  atualizarHorarios();
}

// ===============================================
// HORÁRIOS
// ===============================================

function atualizarHorarios() {
  const horariosGrid = document.getElementById('horariosGrid');
  const mensagem = document.getElementById('mensagemHorarios');
  
  if (!dataSelecionada || servicosSelecionados.length === 0) {
    horariosGrid.style.display = 'none';
    mensagem.style.display = 'flex';
    return;
  }
  
  mensagem.style.display = 'none';
  horariosGrid.style.display = 'grid';
  
  // Calcular duração total
  const duracaoTotal = servicosSelecionados.reduce((total, id) => {
    return total + getServiceById(id).duration;
  }, 0);
  
  // Gerar horários disponíveis
  const horarios = gerarHorariosDisponiveis(dataSelecionada, duracaoTotal);
  
  horariosGrid.innerHTML = horarios.map(horario => `
    <div 
      class="horario-card ${horarioSelecionado === horario ? 'selected' : ''}" 
      onclick="selecionarHorario('${horario}')"
    >
      ${horario}
    </div>
  `).join('');
}

function selecionarHorario(horario) {
  horarioSelecionado = horario;
  document.getElementById('horarioSelecionado').value = horario;
  atualizarHorarios();
}

function gerarHorariosDisponiveis(data, duracao) {
  const horarios = [];
  const config = BUSINESS_HOURS;
  
  // Horários de 30 em 30 minutos entre 8:00 e 18:00
  for (let h = 8; h < 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 17 && m > 0) break; // Última hora às 17:00
      
      const horaStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      horarios.push(horaStr);
    }
  }
  
  return horarios;
}

// ===============================================
// CRIAR AGENDAMENTO
// ===============================================

async function criarAgendamento(e) {
  e.preventDefault();
  
  if (servicosSelecionados.length === 0) {
    mostrarAlerta('Selecione pelo menos um serviço', 'warning');
    return;
  }
  
  if (!dataSelecionada) {
    mostrarAlerta('Selecione uma data', 'warning');
    return;
  }
  
  if (!horarioSelecionado) {
    mostrarAlerta('Selecione um horário', 'warning');
    return;
  }
  
  try {
    const servicos = servicosSelecionados.map(id => {
      const s = getServiceById(id);
      return {
        id: s.id,
        nome: s.name,
        preco: s.price,
        duracao: s.duration
      };
    });
    
    const duracaoTotal = servicos.reduce((t, s) => t + s.duracao, 0);
    const precoTotal = servicos.reduce((t, s) => t + s.preco, 0);
    
    const dataHora = `${dataSelecionada}T${horarioSelecionado}:00.000Z`;
    
    const agendamento = {
      clienteId: currentUser.uid,
      clienteNome: userProfile.nomeCompleto,
      clienteTelefone: userProfile.telefone,
      clienteEmail: currentUser.email,
      servicos: servicos,
      duracaoTotal: duracaoTotal,
      precoTotal: precoTotal,
      dataHora: dataHora,
      observacoes: document.getElementById('observacoes').value,
      status: 'pendente',
      criadoEm: new Date().toISOString()
    };
    
    await salvarAgendamento(agendamento);
    
    mostrarAlerta('Agendamento criado com sucesso!', 'success');
    
    // Limpar formulário
    servicosSelecionados = [];
    dataSelecionada = null;
    horarioSelecionado = null;
    document.getElementById('formAgendamento').reset();
    carregarServicos();
    renderizarCalendario();
    atualizarResumo();
    
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    mostrarAlerta('Erro ao criar agendamento', 'error');
  }
}

// ===============================================
// PENDENTES E HISTÓRICO
// ===============================================

async function carregarPendentes() {
  const lista = document.getElementById('listaPendentes');
  lista.innerHTML = '<div class="loading-spinner"></div>';
  
  try {
    const agendamentos = await listarAgendamentosPorUsuario(currentUser.uid);
    const pendentes = agendamentos.filter(a => a.status === 'pendente');
    
    if (pendentes.length === 0) {
      lista.innerHTML = '<div class="empty-state">Nenhum agendamento pendente</div>';
      return;
    }
    
    lista.innerHTML = pendentes.map(a => renderizarCardAgendamento(a)).join('');
    
  } catch (error) {
    console.error('Erro ao carregar pendentes:', error);
    lista.innerHTML = '<div class="error-state">Erro ao carregar agendamentos</div>';
  }
}

async function carregarHistorico() {
  const lista = document.getElementById('listaHistorico');
  lista.innerHTML = '<div class="loading-spinner"></div>';
  
  try {
    const agendamentos = await listarAgendamentosPorUsuario(currentUser.uid);
    const historico = agendamentos.filter(a => 
      a.status === 'confirmado' || a.status === 'concluido' || a.status === 'cancelado'
    );
    
    if (historico.length === 0) {
      lista.innerHTML = '<div class="empty-state">Nenhum agendamento no histórico</div>';
      return;
    }
    
    lista.innerHTML = historico.map(a => renderizarCardAgendamento(a)).join('');
    
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    lista.innerHTML = '<div class="error-state">Erro ao carregar histórico</div>';
  }
}

function renderizarCardAgendamento(agendamento) {
  const data = new Date(agendamento.dataHora);
  const dataFormatada = data.toLocaleDateString('pt-BR');
  const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  const statusBadge = {
    'pendente': '<span class="badge badge-warning">⏳ Pendente</span>',
    'confirmado': '<span class="badge badge-success">✅ Confirmado</span>',
    'concluido': '<span class="badge badge-info">✔️ Concluído</span>',
    'cancelado': '<span class="badge badge-danger">❌ Cancelado</span>'
  };
  
  return `
    <div class="agendamento-card">
      <div class="agendamento-header">
        <div>
          <h4>📅 ${dataFormatada} às ${horaFormatada}</h4>
          ${statusBadge[agendamento.status] || ''}
        </div>
        <div class="agendamento-preco">R$ ${agendamento.precoTotal.toFixed(2)}</div>
      </div>
      
      <div class="agendamento-servicos">
        ${agendamento.servicos.map(s => `
          <div class="servico-item">
            <span>${s.nome}</span>
            <span>R$ ${s.preco.toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="agendamento-info">
        <div><strong>Duração:</strong> ${agendamento.duracaoTotal} min</div>
      </div>
      
      ${agendamento.status === 'pendente' ? `
        <div class="agendamento-actions">
          <button class="btn btn-sm btn-danger" onclick="cancelarAgendamento('${agendamento.id}')">
            Cancelar
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

async function cancelarAgendamento(id) {
  if (!confirm('Deseja realmente cancelar este agendamento?')) return;
  
  try {
    await atualizarStatusAgendamento(id, 'cancelado');
    mostrarAlerta('Agendamento cancelado', 'success');
    carregarPendentes();
  } catch (error) {
    console.error('Erro ao cancelar:', error);
    mostrarAlerta('Erro ao cancelar agendamento', 'error');
  }
}

// ===============================================
// PERFIL
// ===============================================

function carregarDadosPerfil() {
  document.getElementById('perfilNome').value = userProfile.nomeCompleto || '';
  document.getElementById('perfilEmail').value = currentUser.email;
  document.getElementById('perfilTelefone').value = userProfile.telefone || '';
}

async function salvarPerfil(e) {
  e.preventDefault();
  
  try {
    const dados = {
      nomeCompleto: document.getElementById('perfilNome').value,
      telefone: document.getElementById('perfilTelefone').value,
      atualizadoEm: new Date().toISOString()
    };
    
    await atualizarPerfilUsuario(currentUser.uid, dados);
    userProfile = { ...userProfile, ...dados };
    
    mostrarAlerta('Perfil atualizado com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao salvar perfil:', error);
    mostrarAlerta('Erro ao atualizar perfil', 'error');
  }
}

async function alterarSenha(e) {
  e.preventDefault();
  
  const novaSenha = document.getElementById('novaSenha').value;
  const confirmar = document.getElementById('confirmarSenha').value;
  
  if (novaSenha !== confirmar) {
    mostrarAlerta('As senhas não conferem', 'warning');
    return;
  }
  
  try {
    await currentUser.updatePassword(novaSenha);
    mostrarAlerta('Senha alterada com sucesso!', 'success');
    document.getElementById('formSenha').reset();
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    mostrarAlerta('Erro ao alterar senha', 'error');
  }
}

// ===============================================
// UTILIDADES
// ===============================================

function mostrarAlerta(mensagem, tipo) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${tipo} alert-float`;
  alert.textContent = mensagem;
  document.body.appendChild(alert);
  
  setTimeout(() => alert.remove(), 3000);
}

function inicializarMenu() {
  // Implementar após carregar menu
}

window.mostrarSecao = mostrarSecao;
window.toggleServico = toggleServico;
window.navegarMes = navegarMes;
window.selecionarData = selecionarData;
window.selecionarHorario = selecionarHorario;
window.cancelarAgendamento = cancelarAgendamento;
