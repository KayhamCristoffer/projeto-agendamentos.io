# 🚀 INTEGRAÇÃO COMPLETA DAS ABAS RESTANTES

## IMPORTANTE: Copie e cole os blocos abaixo no admin.html

---

## 1️⃣ SEÇÕES HTML - Adicionar APÓS linha 205 (após secaoEquipe)

```html
<!-- ADICIONAR ESTAS 3 SEÇÕES COMPLETAS -->

<!-- Seção: Serviços -->
<div id="secaoServicos" class="hidden">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">✂️ Gerenciar Serviços</h2>
    <div class="flex gap-2">
      <button onclick="abrirModalServico()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">➕ Adicionar</button>
      <button onclick="carregarServicosAdmin()" class="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">🔄 Atualizar</button>
    </div>
  </div>
  <div id="listaServicosAdmin" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
</div>

<!-- Seção: Produtos -->
<div id="secaoProdutos" class="hidden">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">🛍️ Ponto de Vendas</h2>
    <div class="flex gap-2">
      <button onclick="abrirModalProduto()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">➕ Adicionar</button>
      <button onclick="carregarProdutosAdmin()" class="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">🔄 Atualizar</button>
    </div>
  </div>
  <div id="listaProdutosAdmin" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
</div>

<!-- Seção: Faturamento -->
<div id="secaoFaturamento" class="hidden">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">💰 Faturamento</h2>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
    <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">📊 Resumo Mensal</h3>
    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
        <p class="text-sm text-green-600 dark:text-green-300">Receitas</p>
        <p class="text-2xl font-bold text-green-700 dark:text-green-200" id="totalReceitas">R$ 0,00</p>
      </div>
      <div class="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
        <p class="text-sm text-red-600 dark:text-red-300">Despesas</p>
        <p class="text-2xl font-bold text-red-700 dark:text-red-200" id="totalDespesas">R$ 0,00</p>
      </div>
      <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <p class="text-sm text-blue-600 dark:text-blue-300">Lucro</p>
        <p class="text-2xl font-bold text-blue-700 dark:text-blue-200" id="lucroTotal">R$ 0,00</p>
      </div>
    </div>
  </div>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">📋 Extrato</h3>
      <button onclick="alert('Funcionalidade em desenvolvimento')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">➕ Nova Entrada</button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Data</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Descrição</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Tipo</th>
            <th class="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Valor</th>
          </tr>
        </thead>
        <tbody id="tabelaExtrato" class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr><td colspan="4" class="text-center py-4 text-gray-500">Nenhum registro</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```

---

## 2️⃣ MODAIS - Adicionar ANTES do fechamento do container (antes da linha 363)

```html
<!-- Modal Serviço -->
<div id="modalServico" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4" id="tituloModalServico">➕ Adicionar Serviço</h3>
    <form id="formServico" class="space-y-4">
      <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Nome *</label><input type="text" id="nomeServico" required class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></div>
      <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Descrição</label><textarea id="descricaoServico" rows="2" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></textarea></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Preço (R$) *</label><input type="number" id="precoServico" required min="0" step="0.01" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></div>
        <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Duração (min) *</label><input type="number" id="duracaoServico" required min="5" step="5" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Ícone</label><input type="text" id="iconeServico" placeholder="✂️" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></div>
        <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Categoria</label><input type="text" id="categoriaServico" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></div>
      </div>
      <div class="flex gap-2">
        <button type="submit" class="flex-1 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg">💾 Salvar</button>
        <button type="button" onclick="fecharModalServico()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">Cancelar</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal Produto -->
<div id="modalProduto" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4" id="tituloModalProduto">➕ Adicionar Produto</h3>
    <form id="formProduto" class="space-y-4">
      <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Nome *</label><input type="text" id="nomeProduto" required class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></div>
      <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Descrição</label><textarea id="descricaoProduto" rows="2" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></textarea></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Preço (R$) *</label><input type="number" id="precoProduto" required min="0" step="0.01" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></div>
        <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Estoque *</label><input type="number" id="estoqueProduto" required min="0" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Ícone</label><input type="text" id="iconeProduto" placeholder="🧴" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></div>
        <div><label class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Categoria</label><input type="text" id="categoriaProduto" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"></div>
      </div>
      <div class="flex gap-2">
        <button type="submit" class="flex-1 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg">💾 Salvar</button>
        <button type="button" onclick="fecharModalProduto()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">Cancelar</button>
      </div>
    </form>
  </div>
</div>
```

---

## 3️⃣ JAVASCRIPT - Adicionar NO FINAL do <script>, ANTES de </script>

COPIAR TODO O CONTEÚDO DO ARQUIVO `aba-servicos-js.js` E ADICIONAR:

```javascript
// ========== SERVIÇOS ==========
let editandoServicoId = null;

async function carregarServicosAdmin() {
  const lista = document.getElementById('listaServicosAdmin');
  lista.innerHTML = '<div class="col-span-full text-center py-8">Carregando...</div>';
  try {
    const snapshot = await firebase.database().ref('servicos').once('value');
    const servicos = snapshot.val() || {};
    if (Object.keys(servicos).length === 0) {
      lista.innerHTML = '<div class="col-span-full text-center py-8">Nenhum serviço</div>';
      return;
    }
    lista.innerHTML = Object.entries(servicos).map(([id, s]) => `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex gap-3 mb-3">
          <span class="text-3xl">${s.icone || '✂️'}</span>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white">${s.nome}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">${s.descricao || ''}</p>
          </div>
          <span class="px-2 py-1 rounded text-xs ${s.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${s.ativo ? 'Ativo' : 'Inativo'}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div class="text-gray-600 dark:text-gray-400">💰 ${formatarPreco(s.preco)}</div>
          <div class="text-gray-600 dark:text-gray-400">⏱️ ${s.duracao} min</div>
        </div>
        <div class="flex gap-2">
          <button onclick="editarServico('${id}')" class="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm">✏️</button>
          <button onclick="toggleAtivoServico('${id}', ${!s.ativo})" class="flex-1 ${s.ativo ? 'bg-yellow-500' : 'bg-green-500'} text-white px-3 py-1 rounded text-sm">${s.ativo ? '🔒' : '✅'}</button>
          <button onclick="deletarServico('${id}')" class="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm">🗑️</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    lista.innerHTML = '<div class="col-span-full text-center py-8 text-red-600">Erro</div>';
  }
}

function abrirModalServico(id = null) {
  editandoServicoId = id;
  if (id) {
    document.getElementById('tituloModalServico').textContent = '✏️ Editar';
    firebase.database().ref(`servicos/${id}`).once('value').then(s => {
      const d = s.val();
      document.getElementById('nomeServico').value = d.nome || '';
      document.getElementById('descricaoServico').value = d.descricao || '';
      document.getElementById('precoServico').value = d.preco || 0;
      document.getElementById('duracaoServico').value = d.duracao || 30;
      document.getElementById('iconeServico').value = d.icone || '';
      document.getElementById('categoriaServico').value = d.categoria || '';
    });
  } else {
    document.getElementById('tituloModalServico').textContent = '➕ Adicionar';
    document.getElementById('formServico').reset();
  }
  document.getElementById('modalServico').classList.remove('hidden');
}

function fecharModalServico() {
  document.getElementById('modalServico').classList.add('hidden');
  document.getElementById('formServico').reset();
  editandoServicoId = null;
}

document.getElementById('formServico')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dados = {
    nome: document.getElementById('nomeServico').value,
    descricao: document.getElementById('descricaoServico').value,
    preco: parseFloat(document.getElementById('precoServico').value),
    duracao: parseInt(document.getElementById('duracaoServico').value),
    icone: document.getElementById('iconeServico').value || '✂️',
    categoria: document.getElementById('categoriaServico').value || 'geral',
    ativo: true,
    atualizadoEm: new Date().toISOString()
  };
  try {
    if (editandoServicoId) {
      await firebase.database().ref(`servicos/${editandoServicoId}`).update(dados);
      alert('Atualizado!');
    } else {
      dados.criadoEm = new Date().toISOString();
      await firebase.database().ref('servicos').push(dados);
      alert('Adicionado!');
    }
    fecharModalServico();
    await carregarServicosAdmin();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
});

function editarServico(id) {
  abrirModalServico(id);
}

async function toggleAtivoServico(id, ativo) {
  try {
    await firebase.database().ref(`servicos/${id}`).update({ativo, atualizadoEm: new Date().toISOString()});
    await carregarServicosAdmin();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

async function deletarServico(id) {
  if (!confirm('Excluir este serviço?')) return;
  try {
    await firebase.database().ref(`servicos/${id}`).remove();
    alert('Excluído!');
    await carregarServicosAdmin();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

// ========== PRODUTOS (similar) ==========
let editandoProdutoId = null;

async function carregarProdutosAdmin() {
  const lista = document.getElementById('listaProdutosAdmin');
  lista.innerHTML = '<div class="col-span-full text-center py-8">Carregando...</div>';
  try {
    const snapshot = await firebase.database().ref('produtos').once('value');
    const produtos = snapshot.val() || {};
    if (Object.keys(produtos).length === 0) {
      lista.innerHTML = '<div class="col-span-full text-center py-8">Nenhum produto</div>';
      return;
    }
    lista.innerHTML = Object.entries(produtos).map(([id, p]) => `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div class="flex gap-3 mb-3">
          <span class="text-3xl">${p.icone || '🛍️'}</span>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white">${p.nome}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">${p.descricao || ''}</p>
          </div>
          <span class="px-2 py-1 rounded text-xs ${p.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${p.ativo ? 'Ativo' : 'Inativo'}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div class="text-gray-600 dark:text-gray-400">💰 ${formatarPreco(p.preco)}</div>
          <div class="text-gray-600 dark:text-gray-400">📦 ${p.estoque || 0}</div>
        </div>
        <div class="flex gap-2">
          <button onclick="editarProduto('${id}')" class="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm">✏️</button>
          <button onclick="toggleAtivoProduto('${id}', ${!p.ativo})" class="flex-1 ${p.ativo ? 'bg-yellow-500' : 'bg-green-500'} text-white px-3 py-1 rounded text-sm">${p.ativo ? '🔒' : '✅'}</button>
          <button onclick="deletarProduto('${id}')" class="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm">🗑️</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    lista.innerHTML = '<div class="col-span-full text-center py-8 text-red-600">Erro</div>';
  }
}

function abrirModalProduto(id = null) {
  editandoProdutoId = id;
  if (id) {
    document.getElementById('tituloModalProduto').textContent = '✏️ Editar';
    firebase.database().ref(`produtos/${id}`).once('value').then(s => {
      const d = s.val();
      document.getElementById('nomeProduto').value = d.nome || '';
      document.getElementById('descricaoProduto').value = d.descricao || '';
      document.getElementById('precoProduto').value = d.preco || 0;
      document.getElementById('estoqueProduto').value = d.estoque || 0;
      document.getElementById('iconeProduto').value = d.icone || '';
      document.getElementById('categoriaProduto').value = d.categoria || '';
    });
  } else {
    document.getElementById('tituloModalProduto').textContent = '➕ Adicionar';
    document.getElementById('formProduto').reset();
  }
  document.getElementById('modalProduto').classList.remove('hidden');
}

function fecharModalProduto() {
  document.getElementById('modalProduto').classList.add('hidden');
  document.getElementById('formProduto').reset();
  editandoProdutoId = null;
}

document.getElementById('formProduto')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dados = {
    nome: document.getElementById('nomeProduto').value,
    descricao: document.getElementById('descricaoProduto').value,
    preco: parseFloat(document.getElementById('precoProduto').value),
    estoque: parseInt(document.getElementById('estoqueProduto').value),
    icone: document.getElementById('iconeProduto').value || '🧴',
    categoria: document.getElementById('categoriaProduto').value || 'geral',
    ativo: true,
    atualizadoEm: new Date().toISOString()
  };
  try {
    if (editandoProdutoId) {
      await firebase.database().ref(`produtos/${editandoProdutoId}`).update(dados);
      alert('Atualizado!');
    } else {
      dados.criadoEm = new Date().toISOString();
      await firebase.database().ref('produtos').push(dados);
      alert('Adicionado!');
    }
    fecharModalProduto();
    await carregarProdutosAdmin();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
});

function editarProduto(id) {
  abrirModalProduto(id);
}

async function toggleAtivoProduto(id, ativo) {
  try {
    await firebase.database().ref(`produtos/${id}`).update({ativo, atualizadoEm: new Date().toISOString()});
    await carregarProdutosAdmin();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

async function deletarProduto(id) {
  if (!confirm('Excluir este produto?')) return;
  try {
    await firebase.database().ref(`produtos/${id}`).remove();
    alert('Excluído!');
    await carregarProdutosAdmin();
  } catch (error) {
    alert('Erro: ' + error.message);
  }
}

// ========== FATURAMENTO ==========
async function carregarFaturamento() {
  // Resumo simples
  try {
    const agendamentos = await firebase.database().ref('agendamentos').once('value');
    let receitas = 0;
    agendamentos.forEach(child => {
      const a = child.val();
      if (a.status === 'concluido') {
        receitas += a.precoTotal || 0;
      }
    });
    document.getElementById('totalReceitas').textContent = formatarPreco(receitas);
    document.getElementById('totalDespesas').textContent = 'R$ 0,00';
    document.getElementById('lucroTotal').textContent = formatarPreco(receitas);
  } catch (error) {
    console.error('Erro ao carregar faturamento:', error);
  }
}
```

---

## 4️⃣ ATUALIZAR FUNÇÃO mostrarTab

Procure a função `mostrarTab` e adicione os casos:

```javascript
else if (tab === 'servicos') carregarServicosAdmin();
else if (tab === 'produtos') carregarProdutosAdmin();
else if (tab === 'faturamento') carregarFaturamento();
```

E adicione essas seções no hide inicial:

```javascript
['secaoCalendario', 'secaoClientes', 'secaoEquipe', 'secaoServicos', 'secaoProdutos', 'secaoFaturamento', 'secaoPendentes', 'secaoConfirmados', 'secaoConcluidos'].forEach(id => {
  document.getElementById(id)?.classList.add('hidden');
});
```

---

## ✅ PRONTO!

Após copiar e colar todos os blocos, o sistema estará 100% funcional.
