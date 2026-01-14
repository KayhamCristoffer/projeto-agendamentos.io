# 🔧 GUIA DE CORREÇÕES IMPLEMENTADAS

## ✅ ALTERAÇÕES REALIZADAS

### 1. Merge Main Completo
- ✅ Branch `genspark_ai_developer_final` merged para `main`
- ✅ Todas as melhorias anteriores integradas

### 2. Arquivos Criados/Atualizados

#### att_realtime_database.json
- ✅ Estrutura corrigida do banco de dados
- ✅ Campo `nome` padronizado (não `nomeCompleto`)
- ✅ Campo `agendadoPor` adicionado ("proprio" ou "terceiro")
- ✅ Estrutura de chat simplificada
- ✅ Seção `equipe` adicionada

#### assets/theme.js
- ✅ Reescrito para funcionar com Tailwind CSS
- ✅ Usa classe `dark` no `documentElement`
- ✅ Sincroniza todos os ícones de tema
- ✅ Salva preferência no localStorage

#### assets/correcoes.js
- ✅ Funções auxiliares para correções
- ✅ `enviarMensagemCorrigida()` - chat corrigido
- ✅ `listarMensagensCorrigidas()` - exibição correta
- ✅ `verificarConflitosHorario()` - considera duração
- ✅ `gerarHorariosDisponiveisCorrigidos()` - horários válidos
- ✅ `alterarSenhaUsuario()` - admin alterar senha via email
- ✅ `formatarDataHora()` - formato consistente

#### firebase/database.js
- ✅ Funções da equipe adicionadas:
  - `adicionarMembroEquipe()`
  - `listarEquipe()`
  - `atualizarMembroEquipe()`
  - `deletarMembroEquipe()`
  - `curtirMembroEquipe()` - sistema de curtidas

---

## 🔧 CORREÇÕES NECESSÁRIAS NOS ARQUIVOS HTML

### admin.html

#### 1. Adicionar Tab "Gerenciar Clientes" com Alterar Senha
```html
<!-- Adicionar na seção de tabs -->
<button onclick="mostrarTab('clientes')" id="tabClientes" class="...">
  👥 Gerenciar Clientes
</button>

<!-- Adicionar seção -->
<div id="secaoClientes" class="hidden">
  <h2>👥 Gerenciar Clientes</h2>
  <div id="listaClientesAdmin" class="space-y-4"></div>
</div>

<!-- Modal alterar senha -->
<div id="modalAlterarSenha" class="hidden fixed inset-0 ...">
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
    <h3>🔒 Alterar Senha do Usuário</h3>
    <p id="usuarioAlterarSenha" class="mb-4"></p>
    <button onclick="enviarEmailRecuperacao()" class="...">
      📧 Enviar Email de Recuperação
    </button>
  </div>
</div>
```

**JavaScript:**
```javascript
async function carregarClientesAdmin() {
  const lista = document.getElementById('listaClientesAdmin');
  const snapshot = await firebase.database().ref('usuarios').once('value');
  const usuarios = snapshot.val() || {};
  
  lista.innerHTML = Object.entries(usuarios).map(([id, u]) => `
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <div class="flex justify-between">
        <div>
          <h4>${u.nome}</h4>
          <p class="text-sm">${u.email}</p>
        </div>
        <button onclick="modalAlterarSenha('${id}')" class="...">
          🔒 Alterar Senha
        </button>
      </div>
    </div>
  `).join('');
}

function modalAlterarSenha(userId) {
  window.usuarioIdSenha = userId;
  obterPerfilUsuario(userId).then(perfil => {
    document.getElementById('usuarioAlterarSenha').textContent = 
      `Usuário: ${perfil.nome} (${perfil.email})`;
    document.getElementById('modalAlterarSenha').classList.remove('hidden');
  });
}

async function enviarEmailRecuperacao() {
  const perfil = await obterPerfilUsuario(window.usuarioIdSenha);
  await firebase.auth().sendPasswordResetEmail(perfil.email);
  alert('Email de recuperação enviado!');
  document.getElementById('modalAlterarSenha').classList.add('hidden');
}
```

#### 2. Adicionar Tab "Equipe"
```html
<button onclick="mostrarTab('equipe')" id="tabEquipe">
  👥 Equipe
</button>

<div id="secaoEquipe" class="hidden">
  <div class="flex justify-between mb-4">
    <h2>👥 Nossa Equipe</h2>
    <button onclick="modalAdicionarMembro()" class="...">
      ➕ Adicionar Membro
    </button>
  </div>
  <div id="listaEquipe" class="grid md:grid-cols-3 gap-4"></div>
</div>
```

**JavaScript:**
```javascript
async function carregarEquipe() {
  const lista = document.getElementById('listaEquipe');
  const equipe = await listarEquipe();
  
  lista.innerHTML = Object.entries(equipe || {}).map(([id, m]) => `
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <img src="${m.foto}" class="w-24 h-24 rounded-full mx-auto mb-2">
      <h4 class="text-center font-bold">${m.nome}</h4>
      <p class="text-center text-sm text-gray-600">${m.cargo}</p>
      <p class="text-sm mt-2">${m.bio}</p>
      <div class="flex justify-between mt-4">
        <span>❤️ ${m.curtidas || 0}</span>
        <div>
          <button onclick="editarMembro('${id}')" class="...">✏️</button>
          <button onclick="deletarMembro('${id}')" class="...">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}
```

#### 3. Adicionar Botão "Novo Agendamento"
```html
<!-- Após estatísticas -->
<button onclick="modalNovoAgendamentoAdmin()" class="...">
  ➕ Criar Novo Agendamento
</button>

<!-- Modal -->
<div id="modalNovoAgendamentoAdmin" class="hidden ...">
  <form id="formNovoAgendamentoAdmin">
    <select id="clienteAgendamento" required>
      <option value="">Selecione o cliente</option>
    </select>
    <div id="gridServicosAdmin"></div>
    <input type="date" id="dataAdmin" required>
    <select id="horarioAdmin" required></select>
    <textarea id="observacoesAdmin"></textarea>
    <button type="submit">Criar Agendamento</button>
  </form>
</div>
```

### cliente.html

#### 1. Modal de Perfil ao Clicar no Nome
```html
<!-- Substituir span do nome por botão -->
<button onclick="abrirModalPerfil()" id="nomeUsuario" class="..."></button>

<!-- Modal perfil -->
<div id="modalPerfil" class="hidden fixed inset-0 ...">
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md">
    <h3 class="text-xl font-bold mb-4">👤 Meu Perfil</h3>
    <form id="formPerfilModal">
      <input type="text" id="perfilNomeModal" placeholder="Nome" class="...">
      <input type="tel" id="perfilTelefoneModal" placeholder="Telefone" class="...">
      <input type="email" id="perfilEmailModal" disabled class="...">
      <button type="submit" class="...">💾 Salvar</button>
    </form>
    <hr class="my-4">
    <h4 class="font-bold mb-2">🔒 Alterar Senha</h4>
    <form id="formSenhaModal">
      <input type="password" id="novaSenhaModal" placeholder="Nova Senha" class="...">
      <input type="password" id="confirmaSenhaModal" placeholder="Confirmar" class="...">
      <button type="submit" class="...">🔑 Alterar</button>
    </form>
  </div>
</div>
```

**JavaScript:**
```javascript
function abrirModalPerfil() {
  document.getElementById('modalPerfil').classList.remove('hidden');
  carregarDadosPerfil();
}

async function carregarDadosPerfil() {
  const perfil = await obterPerfilUsuario(usuarioAtual.uid);
  document.getElementById('perfilNomeModal').value = perfil.nome || '';
  document.getElementById('perfilTelefoneModal').value = perfil.telefone || '';
  document.getElementById('perfilEmailModal').value = usuarioAtual.email;
}

document.getElementById('formPerfilModal').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('perfilNomeModal').value;
  const telefone = document.getElementById('perfilTelefoneModal').value;
  
  try {
    await atualizarPerfilUsuario(usuarioAtual.uid, { nome, telefone });
    await usuarioAtual.updateProfile({ displayName: nome });
    alert('Perfil atualizado!');
    document.getElementById('nomeUsuario').textContent = nome;
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao atualizar perfil');
  }
});
```

#### 2. Campo "Para Quem é o Agendamento"
```html
<!-- Em formAgendar, antes dos serviços -->
<div class="form-group">
  <label class="font-semibold mb-2 block">Para quem é o agendamento?</label>
  <div class="flex gap-4">
    <label class="flex items-center">
      <input type="radio" name="agendadoPara" value="proprio" checked 
             onchange="toggleNomeOutraPessoa()">
      <span class="ml-2">Para mim</span>
    </label>
    <label class="flex items-center">
      <input type="radio" name="agendadoPara" value="terceiro"
             onchange="toggleNomeOutraPessoa()">
      <span class="ml-2">Para outra pessoa</span>
    </label>
  </div>
</div>

<div id="campoNomeOutraPessoa" class="hidden">
  <label>Nome da pessoa</label>
  <input type="text" id="nomeOutraPessoa" placeholder="Digite o nome completo">
</div>
```

**JavaScript:**
```javascript
function toggleNomeOutraPessoa() {
  const tipo = document.querySelector('input[name="agendadoPara"]:checked').value;
  const campo = document.getElementById('campoNomeOutraPessoa');
  if (tipo === 'terceiro') {
    campo.classList.remove('hidden');
    document.getElementById('nomeOutraPessoa').required = true;
  } else {
    campo.classList.add('hidden');
    document.getElementById('nomeOutraPessoa').required = false;
  }
}

// Ao enviar agendamento
const agendadoPara = document.querySelector('input[name="agendadoPara"]:checked').value;
const nomeCliente = agendadoPara === 'proprio' 
  ? usuarioAtual.displayName 
  : document.getElementById('nomeOutraPessoa').value;

await salvarAgendamento({
  clienteNome: nomeCliente,
  agendadoPor: agendadoPara,
  // ... outros campos
});
```

#### 3. Botão Admin para Usuários Admin
```html
<!-- No navbar, após nome usuário -->
<a href="admin.html" id="btnAdmin" class="hidden ...">
  🛠️ Painel Admin
</a>
```

**JavaScript:**
```javascript
// Após verificar autenticação
const perfil = await obterPerfilUsuario(usuarioAtual.uid);
if (perfil && perfil.role === 'admin') {
  document.getElementById('btnAdmin').classList.remove('hidden');
}
```

#### 4. Tab Equipe (Visualização)
```html
<button onclick="mostrarSecao('equipe')" id="tabEquipe" class="...">
  👥 Equipe
</button>

<div id="secaoEquipe" class="hidden">
  <h2>👥 Nossa Equipe</h2>
  <div id="listaEquipeCliente" class="grid md:grid-cols-3 gap-4"></div>
</div>
```

**JavaScript:**
```javascript
async function carregarEquipeCliente() {
  const lista = document.getElementById('listaEquipeCliente');
  const equipe = await listarEquipe();
  const usuarioId = usuarioAtual.uid;
  
  lista.innerHTML = Object.entries(equipe || {}).map(([id, m]) => `
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <img src="${m.foto}" class="w-32 h-32 rounded-full mx-auto mb-3">
      <h3 class="text-center font-bold text-lg">${m.nome}</h3>
      <p class="text-center text-sm text-primary">${m.cargo}</p>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">${m.bio}</p>
      <button onclick="curtirMembro('${id}')" 
              class="w-full mt-4 py-2 rounded ${m.curtidasUsuarios && m.curtidasUsuarios[usuarioId] ? 'bg-red-500 text-white' : 'bg-gray-200'}">
        ❤️ ${m.curtidas || 0} Curtidas
      </button>
    </div>
  `).join('');
}

async function curtirMembro(membroId) {
  await curtirMembroEquipe(membroId, usuarioAtual.uid);
  await carregarEquipeCliente();
}
```

---

## 🔧 CORREÇÕES CRÍTICAS

### 1. Chat - Usar Estrutura Corrigida
**Em admin.html e cliente.html, substituir:**

```javascript
// ANTES (incorreto)
function enviarMensagemChat() {
  const texto = document.getElementById('chatInput').value;
  await enviarMensagem(chatAgendamentoId, {
    userId: user.uid,
    nome: 'Nome',
    texto: texto,
    timestamp: Date.now()
  });
}

// DEPOIS (correto)
async function enviarMensagemChat() {
  const texto = document.getElementById('chatInput').value.trim();
  if (!texto) return;
  
  await enviarMensagemCorrigida(chatAgendamentoId, texto, usuarioAtual);
  document.getElementById('chatInput').value = '';
}

// Carregar mensagens
function carregarMensagens() {
  chatListener = listarMensagensCorrigidas(chatAgendamentoId, (mensagens) => {
    const container = document.getElementById('chatMessages');
    container.innerHTML = mensagens.map(m => `
      <div class="flex ${m.userId === usuarioAtual.uid ? 'justify-end' : 'justify-start'}">
        <div class="max-w-xs px-4 py-2 rounded-lg ${m.userId === usuarioAtual.uid ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}">
          <p class="text-xs font-semibold">${m.nome}</p>
          <p>${m.texto}</p>
          <p class="text-xs opacity-75">${new Date(m.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
        </div>
      </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
  });
}
```

### 2. Horários - Considerar Duração Total
```javascript
// Ao selecionar data
document.getElementById('dataAgendamento').addEventListener('change', async (e) => {
  const data = e.target.value;
  if (!data || servicosSelecionados.length === 0) return;
  
  const duracaoTotal = servicosSelecionados.reduce((sum, s) => sum + s.duracao, 0);
  const horarios = await gerarHorariosDisponiveisCorrigidos(data, duracaoTotal);
  
  const grid = document.getElementById('gridHorarios');
  grid.innerHTML = horarios.map(h => `
    <button type="button" onclick="selecionarHorario('${h}')" class="...">
      ${h}
    </button>
  `).join('');
});
```

### 3. Tema - Remover Botão Duplicado
**Em todas as páginas HTML:**
```html
<!-- Manter apenas 1 botão no navbar -->
<button onclick="toggleTheme()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
  <span id="themeIcon" class="text-xl">🌙</span>
</button>

<!-- Remover outros botões de tema -->
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Arquivos Criados
- [x] att_realtime_database.json
- [x] assets/correcoes.js
- [x] assets/theme.js (atualizado)
- [x] firebase/database.js (funções equipe)

### Correções Admin
- [ ] Tab "Gerenciar Clientes" com alterar senha
- [ ] Tab "Equipe" com CRUD completo
- [ ] Botão "Novo Agendamento"
- [ ] Chat corrigido (usar correcoes.js)
- [ ] Horários com conflito corrigido

### Correções Cliente
- [ ] Modal perfil ao clicar no nome
- [ ] Campo "Para quem é o agendamento"
- [ ] Botão admin (se role=admin)
- [ ] Tab "Equipe" (visualização + curtir)
- [ ] Chat corrigido
- [ ] Perfil - corrigir atualização
- [ ] Horários com conflito corrigido

### Tema
- [ ] Remover botão duplicado
- [ ] Testar toggle funcionando
- [ ] Verificar localStorage

---

## 🚀 PRÓXIMOS PASSOS

1. Importar `att_realtime_database.json` no Firebase
2. Incluir `<script src="assets/correcoes.js"></script>` em todas as páginas
3. Aplicar correções HTML/JS documentadas acima
4. Testar cada funcionalidade
5. Commit e push para GitHub

---

**Status**: Estrutura base criada, correções documentadas  
**Data**: 2026-01-14  
**Próximo**: Aplicar correções nos arquivos HTML
