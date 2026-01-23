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
