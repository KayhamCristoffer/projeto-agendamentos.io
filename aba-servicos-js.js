// FUNÇÕES PARA ABA DE SERVIÇOS
// Adicionar no final do <script> do admin.html, antes de </script>

// Variável para edição
let editandoServicoId = null;

// Carregar serviços
async function carregarServicosAdmin() {
  const lista = document.getElementById('listaServicosAdmin');
  lista.innerHTML = '<div class="col-span-full text-center py-8 text-gray-600 dark:text-gray-400">Carregando...</div>';
  
  try {
    const snapshot = await firebase.database().ref('servicos').once('value');
    const servicos = snapshot.val() || {};
    
    if (Object.keys(servicos).length === 0) {
      lista.innerHTML = '<div class="col-span-full text-center py-8 text-gray-600 dark:text-gray-400">Nenhum serviço cadastrado</div>';
      return;
    }
    
    lista.innerHTML = Object.entries(servicos).map(([id, s]) => `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
        <div class="flex items-start gap-3 mb-3">
          <span class="text-3xl">${s.icone || '✂️'}</span>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900 dark:text-white">${s.nome}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${s.descricao || 'Sem descrição'}</p>
          </div>
          <span class="px-2 py-1 rounded-full text-xs font-semibold ${s.ativo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}">
            ${s.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div class="text-gray-600 dark:text-gray-400">
            💰 Preço: <span class="font-semibold text-gray-900 dark:text-white">${formatarPreco(s.preco)}</span>
          </div>
          <div class="text-gray-600 dark:text-gray-400">
            ⏱️ Duração: <span class="font-semibold text-gray-900 dark:text-white">${s.duracao} min</span>
          </div>
        </div>
        ${s.categoria ? `<p class="text-xs text-gray-500 mb-3">📁 ${s.categoria}</p>` : ''}
        <div class="flex gap-2">
          <button onclick="editarServico('${id}')" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition">
            ✏️ Editar
          </button>
          <button onclick="toggleAtivoServico('${id}', ${!s.ativo})" class="flex-1 ${s.ativo ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded text-sm transition">
            ${s.ativo ? '🔒 Desativar' : '✅ Ativar'}
          </button>
          <button onclick="deletarServico('${id}')" class="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition">
            🗑️
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
    lista.innerHTML = '<div class="col-span-full text-center py-8 text-red-600">Erro ao carregar serviços</div>';
  }
}

// Abrir modal
function abrirModalServico(servicoId = null) {
  editandoServicoId = servicoId;
  
  if (servicoId) {
    // Editar
    document.getElementById('tituloModalServico').textContent = '✏️ Editar Serviço';
    firebase.database().ref(`servicos/${servicoId}`).once('value').then(snapshot => {
      const s = snapshot.val();
      document.getElementById('nomeServico').value = s.nome || '';
      document.getElementById('descricaoServico').value = s.descricao || '';
      document.getElementById('precoServico').value = s.preco || 0;
      document.getElementById('duracaoServico').value = s.duracao || 30;
      document.getElementById('iconeServico').value = s.icone || '';
      document.getElementById('categoriaServico').value = s.categoria || '';
    });
  } else {
    // Adicionar
    document.getElementById('tituloModalServico').textContent = '➕ Adicionar Serviço';
    document.getElementById('formServico').reset();
  }
  
  document.getElementById('modalServico').classList.remove('hidden');
}

// Fechar modal
function fecharModalServico() {
  document.getElementById('modalServico').classList.add('hidden');
  document.getElementById('formServico').reset();
  editandoServicoId = null;
}

// Salvar serviço
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
      // Atualizar
      await firebase.database().ref(`servicos/${editandoServicoId}`).update(dados);
      alert('Serviço atualizado com sucesso!');
    } else {
      // Adicionar
      dados.criadoEm = new Date().toISOString();
      await firebase.database().ref('servicos').push(dados);
      alert('Serviço adicionado com sucesso!');
    }
    
    fecharModalServico();
    await carregarServicosAdmin();
  } catch (error) {
    console.error('Erro ao salvar serviço:', error);
    alert('Erro ao salvar serviço: ' + error.message);
  }
});

// Editar serviço
function editarServico(id) {
  abrirModalServico(id);
}

// Ativar/Desativar serviço
async function toggleAtivoServico(id, ativo) {
  try {
    await firebase.database().ref(`servicos/${id}`).update({
      ativo: ativo,
      atualizadoEm: new Date().toISOString()
    });
    await carregarServicosAdmin();
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    alert('Erro ao atualizar serviço: ' + error.message);
  }
}

// Deletar serviço
async function deletarServico(id) {
  if (!confirm('Deseja realmente excluir este serviço?\n\n⚠️ Esta ação não pode ser desfeita!')) {
    return;
  }
  
  try {
    await firebase.database().ref(`servicos/${id}`).remove();
    alert('Serviço excluído com sucesso!');
    await carregarServicosAdmin();
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    alert('Erro ao excluir serviço: ' + error.message);
  }
}
