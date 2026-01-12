# 🚀 CORREÇÕES AUTOMÁTICAS APLICADAS E PRÓXIMOS PASSOS

## ✅ O QUE JÁ FOI FEITO:

1. **✅ `firebase/services-config.js` CRIADO**
   - 12 serviços pré-configurados
   - Funções: `getTodosServicos()`, `getServicoPorId()`, `getServicosPorIds()`

2. **✅ `assets/menu.js` CRIADO**
   - Menu de navegação reutilizável
   - Mostra/oculta link Admin baseado em role
   - Toggle de tema integrado
   - Função de logout

3. **✅ `assets/style.css` ATUALIZADO**
   - Grid de serviços com cards selecionáveis
   - Grid data/horário lado a lado
   - Grid de horários disponíveis
   - Calendário visual melhorado
   - Lista de usuários
   - Modais aprimorados
   - Responsividade completa

4. **✅ `firebase/database.js` JÁ CORRIGIDO** (commit anterior)
   - Funções adaptadas para estrutura do banco
   - IDs corretos dos usuários

5. **✅ `exportar-dados.json` ATUALIZADO**
   - IDs corretos: IEtDxVZXgZOP0M3R8OApILWvKTS2, Q9BILOCpHxcV291uMuBQnQrpWRW2, HmogEGttECZtausr6AL12v1f2VT2

---

## 📝 CORREÇÕES QUE VOCÊ PRECISA FAZER MANUALMENTE:

Devido ao limite de tamanho, não consigo reescrever todos os 4 arquivos HTML completos de uma vez.  
**COPIE E COLE** as correções abaixo em cada arquivo:

---

### 1️⃣ CLIENTE.HTML - CORREÇÕES

**1.1) Adicionar scripts no `<head>` (antes do `</head>`):**

```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
```

**1.2) SUBSTITUIR todo o `<body>` por:**

```html
<body>
  <!-- Menu será inserido aqui automaticamente -->
  
  <div class="container container-wide" style="margin-top: 80px; padding: 24px;">
    <!-- Tabs de Navegação -->
    <div class="flex gap-2 mb-3" style="border-bottom: 2px solid var(--border-color); overflow-x: auto;">
      <button class="btn btn-ghost" id="tabAgendar" onclick="mostrarSecao('agendar')" style="border-radius: 0; border-bottom: 3px solid var(--primary-color); white-space: nowrap;">
        📅 Agendar Novo
      </button>
      <button class="btn btn-ghost" id="tabPendentes" onclick="mostrarSecao('pendentes')" style="border-radius: 0; white-space: nowrap;">
        ⏳ Pendentes
      </button>
      <button class="btn btn-ghost" id="tabHistorico" onclick="mostrarSecao('historico')" style="border-radius: 0; white-space: nowrap;">
        ✅ Histórico
      </button>
      <button class="btn btn-ghost" id="tabPerfil" onclick="mostrarSecao('perfil')" style="border-radius: 0; white-space: nowrap;">
        👤 Perfil
      </button>
    </div>

    <!-- Seção: Agendar Novo -->
    <div id="secaoAgendar" class="fade-in">
      <h3>📅 Novo Agendamento</h3>
      <p style="color: var(--text-secondary); margin-bottom: 24px;">Selecione um ou mais serviços e escolha data/horário</p>
      
      <form id="formAgendar">
        <!-- Grid de Serviços -->
        <div class="form-group">
          <label class="form-label">Selecione os Serviços</label>
          <div id="servicosGrid" class="servicos-grid">
            <!-- Serviços serão inseridos aqui -->
          </div>
        </div>

        <!-- Resumo de Serviços Selecionados -->
        <div id="resumoServicos" class="servicos-selecionados" style="display: none;">
          <h4 style="margin-top: 0;">Serviços Selecionados:</h4>
          <div id="listaServicosSelecionados"></div>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; font-weight: 700;">
            <span>Total:</span>
            <span>
              <span id="duracaoTotal">0 min</span> • 
              <span id="precoTotal">R$ 0,00</span>
            </span>
          </div>
        </div>

        <!-- Grid de Data e Horário -->
        <div class="data-hora-grid">
          <!-- Data -->
          <div class="form-group">
            <label class="form-label">📅 Selecione a Data</label>
            <input class="form-input" type="date" id="dataAgendamento" required>
          </div>

          <!-- Horário -->
          <div class="form-group">
            <label class="form-label">🕐 Selecione o Horário</label>
            <div id="horariosDisponiveis" class="horarios-grid">
              <p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">
                Selecione os serviços e a data primeiro
              </p>
            </div>
            <input type="hidden" id="horarioSelecionado" required>
          </div>
        </div>

        <!-- Observações -->
        <div class="form-group">
          <label class="form-label">💬 Observações (opcional)</label>
          <textarea class="form-input" id="observacoes" rows="3" placeholder="Alguma observação adicional?"></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-full">
          ✅ Confirmar Agendamento
        </button>
      </form>

      <div id="mensagemAgendar" class="mt-2"></div>
    </div>

    <!-- Seção: Pendentes -->
    <div id="secaoPendentes" class="hidden">
      <h3>⏳ Agendamentos Pendentes</h3>
      <div id="listaPendentes">
        <div class="spinner"></div>
      </div>
    </div>

    <!-- Seção: Histórico -->
    <div id="secaoHistorico" class="hidden">
      <h3>✅ Histórico de Agendamentos</h3>
      <div id="listaHistorico">
        <div class="spinner"></div>
      </div>
    </div>

    <!-- Seção: Perfil -->
    <div id="secaoPerfil" class="hidden">
      <h3>👤 Meu Perfil</h3>
      
      <form id="formPerfil" style="max-width: 500px;">
        <div class="form-group">
          <label class="form-label">Nome Completo</label>
          <input class="form-input" type="text" id="perfilNome" required>
        </div>

        <div class="form-group">
          <label class="form-label">Telefone</label>
          <input class="form-input" type="tel" id="perfilTelefone" required maxlength="15">
        </div>

        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input class="form-input" type="email" id="perfilEmail" disabled>
        </div>

        <button type="submit" class="btn btn-primary">
          💾 Salvar Alterações
        </button>
      </form>

      <hr style="margin: 24px 0; border: none; border-top: 1px solid var(--border-color);">

      <h4>🔒 Alterar Senha</h4>
      <form id="formSenha" style="max-width: 500px;">
        <div class="form-group">
          <label class="form-label">Nova Senha</label>
          <input class="form-input" type="password" id="novaSenha" minlength="6">
        </div>

        <div class="form-group">
          <label class="form-label">Confirmar Nova Senha</label>
          <input class="form-input" type="password" id="confirmarSenha" minlength="6">
        </div>

        <button type="submit" class="btn btn-warning">
          🔑 Alterar Senha
        </button>
      </form>

      <div id="mensagemPerfil" class="mt-2"></div>
    </div>
  </div>

  <!-- Modal de Chat -->
  <div id="modalChat" class="modal hidden">
    <div class="modal-content" style="width: 90%; max-width: 600px;">
      <div class="modal-header">
        <h3 style="margin: 0;">💬 Chat com a Empresa</h3>
        <button class="modal-close" onclick="fecharChat()">×</button>
      </div>
      <div class="chat-messages" id="chatMessages" style="height: 400px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 16px;"></div>
      <div style="display: flex; gap: 8px;">
        <input type="text" class="form-input" id="chatInput" placeholder="Digite sua mensagem..." style="flex: 1; margin: 0;">
        <button class="btn btn-primary" onclick="enviarMensagemChat()">📤 Enviar</button>
        <button class="btn btn-refresh" onclick="carregarMensagensChat()">🔄</button>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script src="firebase/firebase-config.js"></script>
  <script src="firebase/services-config.js"></script>
  <script src="firebase/database.js"></script>
  <script src="assets/theme.js"></script>
  <script src="assets/menu.js"></script>
  
  <script>
    let usuarioAtual = null;
    let perfil Atual = null;
    let servicosSelecionados = [];
    let agendamentoAtualChat = null;

    // Inicializar
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = 'login.html';
        return;
      }

      usuarioAtual = user;
      const dados = await inicializarMenu('cliente');
      perfilAtual = dados.perfil;
      
      carregarServicos();
      configurarDataMinima();
      carregarPerfil();
    });

    // Carregar serviços como grid
    function carregarServicos() {
      const container = document.getElementById('servicosGrid');
      const servicos = getTodosServicos();
      
      container.innerHTML = '';
      servicos.forEach(servico => {
        const card = document.createElement('div');
        card.className = 'servico-card';
        card.dataset.id = servico.id;
        card.innerHTML = `
          <span class="servico-icon">${servico.icon}</span>
          <div class="servico-nome">${servico.nome}</div>
          <div class="servico-descricao">${servico.descricao}</div>
          <div class="servico-info">
            <span class="servico-preco">${formatarPreco(servico.preco)}</span>
            <span class="servico-duracao">⏱️ ${formatarDuracao(servico.duracao)}</span>
          </div>
        `;
        
        card.onclick = () => toggleServico(servico.id);
        container.appendChild(card);
      });
    }

    // Toggle seleção de serviço
    function toggleServico(servicoId) {
      const card = document.querySelector(`[data-id="${servicoId}"]`);
      const index = servicosSelecionados.indexOf(servicoId);
      
      if (index > -1) {
        servicosSelecionados.splice(index, 1);
        card.classList.remove('selected');
      } else {
        servicosSelecionados.push(servicoId);
        card.classList.add('selected');
      }
      
      atualizarResumo();
      
      // Recarregar horários se data já selecionada
      const data = document.getElementById('dataAgendamento').value;
      if (data && servicosSelecionados.length > 0) {
        carregarHorarios();
      }
    }

    // Atualizar resumo de serviços
    function atualizarResumo() {
      const resumo = document.getElementById('resumoServicos');
      const lista = document.getElementById('listaServicosSelecionados');
      
      if (servicosSelecionados.length === 0) {
        resumo.style.display = 'none';
        return;
      }
      
      resumo.style.display = 'block';
      
      const servicos = getServicosPorIds(servicosSelecionados);
      const duracaoTotal = servicos.reduce((sum, s) => sum + s.duracao, 0);
      const precoTotal = servicos.reduce((sum, s) => sum + s.preco, 0);
      
      lista.innerHTML = servicos.map(s => `
        <div class="servico-selecionado-item">
          <span>${s.icon} ${s.nome} - ${formatarPreco(s.preco)} (${formatarDuracao(s.duracao)})</span>
          <button type="button" class="servico-remover" onclick="toggleServico('${s.id}')">×</button>
        </div>
      `).join('');
      
      document.getElementById('duracaoTotal').textContent = formatarDuracao(duracaoTotal);
      document.getElementById('precoTotal').textContent = formatarPreco(precoTotal);
    }

    // Configurar data mínima
    function configurarDataMinima() {
      const input = document.getElementById('dataAgendamento');
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      input.min = amanha.toISOString().split('T')[0];
      input.addEventListener('change', carregarHorarios);
    }

    // Carregar horários disponíveis
    async function carregarHorarios() {
      const data = document.getElementById('dataAgendamento').value;
      
      if (!data || servicosSelecionados.length === 0) {
        document.getElementById('horariosDisponiveis').innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Selecione os serviços e a data</p>';
        return;
      }

      const servicos = getServicosPorIds(servicosSelecionados);
      const duracaoTotal = servicos.reduce((sum, s) => sum + s.duracao, 0);
      
      const container = document.getElementById('horariosDisponiveis');
      container.innerHTML = '<div class="spinner" style="grid-column: 1/-1;"></div>';

      try {
        const horarios = await obterHorariosDisponiveis(data, duracaoTotal);
        
        container.innerHTML = '';
        
        if (horarios.length === 0) {
          container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--danger);">Nenhum horário disponível nesta data</p>';
          return;
        }

        horarios.forEach(horario => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'horario-btn';
          btn.textContent = horario;
          btn.onclick = () => selecionarHorario(horario);
          container.appendChild(btn);
        });
      } catch (error) {
        console.error('Erro:', error);
        container.innerHTML = '<p style="grid-column: 1/-1; color: var(--danger);">Erro ao carregar horários</p>';
      }
    }

    // Selecionar horário
    function selecionarHorario(horario) {
      document.querySelectorAll('.horario-btn').forEach(btn => btn.classList.remove('selected'));
      event.target.classList.add('selected');
      document.getElementById('horarioSelecionado').value = horario;
    }

    // Enviar agendamento
    document.getElementById('formAgendar').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (servicosSelecionados.length === 0) {
        mostrarMensagemAgendar('❌ Selecione pelo menos um serviço', 'erro');
        return;
      }

      const data = document.getElementById('dataAgendamento').value;
      const horario = document.getElementById('horarioSelecionado').value;
      const observacoes = document.getElementById('observacoes').value;

      if (!horario) {
        mostrarMensagemAgendar('❌ Selecione um horário', 'erro');
        return;
      }

      const servicos = getServicosPorIds(servicosSelecionados);
      const duracaoTotal = servicos.reduce((sum, s) => sum + s.duracao, 0);
      const precoTotal = servicos.reduce((sum, s) => sum + s.preco, 0);

      const dados = {
        clienteId: usuarioAtual.uid,
        clienteNome: perfilAtual.nomeCompleto,
        clienteTelefone: perfilAtual.telefone,
        servicos: servicos.map(s => ({
          id: s.id,
          nome: s.nome,
          preco: s.preco,
          duracao: s.duracao
        })),
        dataHora: `${data}T${horario}:00.000Z`,
        duracaoTotal,
        precoTotal,
        observacoes: observacoes || '',
        status: 'pendente'
      };

      try {
        await salvarAgendamento(dados);
        mostrarMensagemAgendar('✅ Agendamento realizado com sucesso!', 'sucesso');
        
        // Limpar formulário
        servicosSelecionados = [];
        document.querySelectorAll('.servico-card').forEach(c => c.classList.remove('selected'));
        document.getElementById('formAgendar').reset();
        atualizarResumo();
        document.getElementById('horariosDisponiveis').innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Selecione os serviços e a data</p>';
        
        setTimeout(() => mostrarSecao('pendentes'), 2000);
      } catch (error) {
        console.error('Erro:', error);
        mostrarMensagemAgendar('❌ Erro ao criar agendamento', 'erro');
      }
    });

    function mostrarMensagemAgendar(texto, tipo) {
      const msg = document.getElementById('mensagemAgendar');
      msg.className = tipo === 'sucesso' ? 'alert alert-success' : 'alert alert-error';
      msg.textContent = texto;
    }

    // Navegação entre seções
    function mostrarSecao(secao) {
      ['secaoAgendar', 'secaoPendentes', 'secaoHistorico', 'secaoPerfil'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
      });
      
      ['tabAgendar', 'tabPendentes', 'tabHistorico', 'tabPerfil'].forEach(id => {
        document.getElementById(id).style.borderBottom = 'none';
      });

      if (secao === 'agendar') {
        document.getElementById('secaoAgendar').classList.remove('hidden');
        document.getElementById('tabAgendar').style.borderBottom = '3px solid var(--primary-color)';
      } else if (secao === 'pendentes') {
        document.getElementById('secaoPendentes').classList.remove('hidden');
        document.getElementById('tabPendentes').style.borderBottom = '3px solid var(--primary-color)';
        carregarPendentes();
      } else if (secao === 'historico') {
        document.getElementById('secaoHistorico').classList.remove('hidden');
        document.getElementById('tabHistorico').style.borderBottom = '3px solid var(--primary-color)';
        carregarHistorico();
      } else if (secao === 'perfil') {
        document.getElementById('secaoPerfil').classList.remove('hidden');
        document.getElementById('tabPerfil').style.borderBottom = '3px solid var(--primary-color)';
      }
    }

    // Carregar pendentes
    async function carregarPendentes() {
      const container = document.getElementById('listaPendentes');
      container.innerHTML = '<div class="spinner"></div>';

      try {
        const agendamentos = await listarAgendamentosPorUsuario(usuarioAtual.uid);
        const pendentes = Object.entries(agendamentos || {})
          .filter(([id, ag]) => ag.status === 'pendente')
          .map(([id, ag]) => ({ id, ...ag }));

        if (pendentes.length === 0) {
          container.innerHTML = '<p class="text-center">Nenhum agendamento pendente</p>';
          return;
        }

        container.innerHTML = '';
        pendentes.forEach(ag => {
          const card = criarCardAgendamento(ag, 'pendente');
          container.appendChild(card);
        });
      } catch (error) {
        console.error('Erro:', error);
        container.innerHTML = '<p style="color: var(--danger);">Erro ao carregar agendamentos</p>';
      }
    }

    // Carregar histórico
    async function carregarHistorico() {
      const container = document.getElementById('listaHistorico');
      container.innerHTML = '<div class="spinner"></div>';

      try {
        const agendamentos = await listarAgendamentosPorUsuario(usuarioAtual.uid);
        const concluidos = Object.entries(agendamentos || {})
          .filter(([id, ag]) => ag.status === 'concluido')
          .map(([id, ag]) => ({ id, ...ag }));

        if (concluidos.length === 0) {
          container.innerHTML = '<p class="text-center">Nenhum agendamento concluído</p>';
          return;
        }

        container.innerHTML = '';
        concluidos.forEach(ag => {
          const card = criarCardAgendamento(ag, 'concluido');
          container.appendChild(card);
        });
      } catch (error) {
        console.error('Erro:', error);
        container.innerHTML = '<p style="color: var(--danger);">Erro ao carregar histórico</p>';
      }
    }

    // Criar card de agendamento
    function criarCardAgendamento(ag, tipo) {
      const card = document.createElement('div');
      card.className = 'card mb-2';
      
      const data = new Date(ag.dataHora);
      const dataFormatada = data.toLocaleDateString('pt-BR');
      const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      const servicosTexto = ag.servicos.map(s => s.nome).join(', ');

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; gap: 16px;">
          <div style="flex: 1;">
            <span class="badge ${tipo === 'pendente' ? 'badge-warning' : 'badge-success'}" style="margin-bottom: 8px;">
              ${tipo === 'pendente' ? '⏳ Pendente' : '✅ Concluído'}
            </span>
            <h4 style="margin: 8px 0;">${servicosTexto}</h4>
            <p style="font-size: 14px; margin: 4px 0;">📅 ${dataFormatada} às ${horaFormatada}</p>
            <p style="font-size: 14px; margin: 4px 0;">⏱️ ${formatarDuracao(ag.duracaoTotal)}</p>
            <p style="font-size: 14px; margin: 4px 0;">💰 ${formatarPreco(ag.precoTotal)}</p>
            ${ag.observacoes ? `<p style="font-size: 13px; margin-top: 8px;">💬 ${ag.observacoes}</p>` : ''}
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${tipo === 'pendente' ? `
              <button class="btn btn-sm btn-danger" onclick="cancelarAgendamento('${ag.id}')">
                ❌ Cancelar
              </button>
            ` : ''}
            <button class="btn btn-sm btn-primary" onclick="abrirChat('${ag.id}')">
              💬 Chat
            </button>
          </div>
        </div>
      `;
      
      return card;
    }

    // Cancelar agendamento
    async function cancelarAgendamento(id) {
      if (!confirm('Deseja cancelar este agendamento?')) return;

      try {
        await alterarStatusAgendamento(id, 'cancelado');
        alert('✅ Agendamento cancelado!');
        carregarPendentes();
      } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao cancelar agendamento');
      }
    }

    // Chat
    function abrirChat(agendamentoId) {
      agendamentoAtualChat = agendamentoId;
      document.getElementById('modalChat').classList.remove('hidden');
      carregarMensagensChat();
    }

    function fecharChat() {
      document.getElementById('modalChat').classList.add('hidden');
      agendamentoAtualChat = null;
    }

    function carregarMensagensChat() {
      const container = document.getElementById('chatMessages');
      
      listarMensagens(agendamentoAtualChat, (mensagens) => {
        container.innerHTML = '';
        mensagens.forEach(msg => {
          const div = document.createElement('div');
          div.style.cssText = `
            padding: 8px 12px;
            margin-bottom: 8px;
            border-radius: 8px;
            max-width: 70%;
            ${msg.userId === usuarioAtual.uid ? 
              'background: var(--primary-color); color: white; margin-left: auto;' : 
              'background: var(--bg-secondary);'
            }
          `;
          div.innerHTML = `
            <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">${msg.nome}</div>
            <div>${msg.texto}</div>
            <div style="font-size: 10px; opacity: 0.7; margin-top: 4px;">
              ${new Date(msg.timestamp).toLocaleTimeString('pt-BR')}
            </div>
          `;
          container.appendChild(div);
        });
        container.scrollTop = container.scrollHeight;
      });
    }

    async function enviarMensagemChat() {
      const input = document.getElementById('chatInput');
      const texto = input.value.trim();
      
      if (!texto) return;

      await enviarMensagem(agendamentoAtualChat, {
        userId: usuarioAtual.uid,
        nome: perfilAtual.nomeCompleto,
        texto
      });

      input.value = '';
      carregarMensagensChat();
    }

    // Perfil
    async function carregarPerfil() {
      if (perfilAtual) {
        document.getElementById('perfilNome').value = perfilAtual.nomeCompleto || '';
        document.getElementById('perfilTelefone').value = perfilAtual.telefone || '';
        document.getElementById('perfilEmail').value = perfilAtual.email || usuarioAtual.email;
      }
    }

    document.getElementById('formPerfil').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const dados = {
        nomeCompleto: document.getElementById('perfilNome').value,
        telefone: document.getElementById('perfilTelefone').value,
        email: usuarioAtual.email,
        role: perfilAtual.role
      };

      try {
        await atualizarPerfilUsuario(usuarioAtual.uid, dados);
        await usuarioAtual.updateProfile({ displayName: dados.nomeCompleto });
        mostrarMensagemPerfil('✅ Perfil atualizado!', 'sucesso');
        perfilAtual = await obterPerfilUsuario(usuarioAtual.uid);
      } catch (error) {
        console.error('Erro:', error);
        mostrarMensagemPerfil('❌ Erro ao atualizar perfil', 'erro');
      }
    });

    document.getElementById('formSenha').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const novaSenha = document.getElementById('novaSenha').value;
      const confirmarSenha = document.getElementById('confirmarSenha').value;

      if (novaSenha !== confirmarSenha) {
        mostrarMensagemPerfil('❌ As senhas não coincidem', 'erro');
        return;
      }

      try {
        await usuarioAtual.updatePassword(novaSenha);
        mostrarMensagemPerfil('✅ Senha alterada!', 'sucesso');
        document.getElementById('formSenha').reset();
      } catch (error) {
        console.error('Erro:', error);
        if (error.code === 'auth/requires-recent-login') {
          mostrarMensagemPerfil('❌ Faça login novamente antes de alterar a senha', 'erro');
        } else {
          mostrarMensagemPerfil('❌ Erro ao alterar senha', 'erro');
        }
      }
    });

    function mostrarMensagemPerfil(texto, tipo) {
      const msg = document.getElementById('mensagemPerfil');
      msg.className = tipo === 'sucesso' ? 'alert alert-success' : 'alert alert-error';
      msg.textContent = texto;
    }

    // Máscara telefone
    document.getElementById('perfilTelefone').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      e.target.value = value;
    });

    // Enter no chat
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        enviarMensagemChat();
      }
    });
  </script>
</body>
```

---

### ⚠️ ARQUIVO MUITO GRANDE

Devido ao limite de tamanho da resposta, NÃO CONSIGO enviar todas as correções de uma vez.

## 🎯 SOLUÇÃO:

**COMECE COM** `cliente.html` usando o código acima.

Depois me peça:
- "Agora corrija admin.html"
- "Agora corrija login.html"  
- "Agora corrija index.html"

E eu enviarei cada um separadamente.

---

## 📦 COMMIT ATUAL:

Commit `be88a2c` contém:
- ✅ services-config.js
- ✅ menu.js
- ✅ CSS atualizado
- ✅ database.js corrigido
- ✅ exportar-dados.json

**PRÓXIMO PASSO:** Aplicar correção do cliente.html acima e me pedir a próxima página.
