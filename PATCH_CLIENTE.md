# PATCH FINAL - Cliente.html

## Adicionar antes do fechamento de </div> principal (antes do modal de chat)

```html
    <!-- Seção: Equipe -->
    <div id="secaoEquipe" class="hidden">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">👥 Nossa Equipe</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Conheça nossos profissionais</p>
      <div id="listaEquipeCliente" class="grid md:grid-cols-3 gap-6"></div>
    </div>
  </div>

  <!-- Modal Perfil -->
  <div id="modalPerfil" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">👤 Meu Perfil</h3>
        <button onclick="fecharModalPerfil()" class="text-2xl hover:text-gray-600">&times;</button>
      </div>
      <form id="formPerfilModal" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Nome</label>
          <input type="text" id="perfilNomeModal" required class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Telefone</label>
          <input type="tel" id="perfilTelefoneModal" required maxlength="15" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">E-mail</label>
          <input type="email" id="perfilEmailModal" disabled class="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600">
        </div>
        <button type="submit" class="w-full bg-primary hover:bg-blue-700 text-white py-2 rounded-lg">
          💾 Salvar Alterações
        </button>
      </form>
      <hr class="my-4">
      <h4 class="font-bold mb-2">🔒 Alterar Senha</h4>
      <form id="formSenhaModal" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Nova Senha</label>
          <input type="password" id="novaSenhaModal" minlength="6" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Confirmar Senha</label>
          <input type="password" id="confirmaSenhaModal" minlength="6" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
        </div>
        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
          🔑 Alterar Senha
        </button>
      </form>
    </div>
  </div>
```

## Adicionar no JavaScript (antes do fechamento do script)

```javascript
// Modal Perfil
function abrirModalPerfil() {
  document.getElementById('modalPerfil').classList.remove('hidden');
  carregarDadosPerfilModal();
}

function fecharModalPerfil() {
  document.getElementById('modalPerfil').classList.add('hidden');
}

async function carregarDadosPerfilModal() {
  try {
    const perfil = await obterPerfilUsuario(usuarioAtual.uid);
    document.getElementById('perfilNomeModal').value = perfil.nome || perfil.nomeCompleto || '';
    document.getElementById('perfilTelefoneModal').value = perfil.telefone || '';
    document.getElementById('perfilEmailModal').value = usuarioAtual.email;
    
    // Adicionar máscara no telefone
    document.getElementById('perfilTelefoneModal').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      if (value.length > 6) {
        value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0,2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
      e.target.value = value;
    });
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
  }
}

document.getElementById('formPerfilModal').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('perfilNomeModal').value;
  const telefone = document.getElementById('perfilTelefoneModal').value;
  
  try {
    await atualizarPerfilUsuario(usuarioAtual.uid, { nome, telefone });
    await usuarioAtual.updateProfile({ displayName: nome });
    document.getElementById('nomeUsuario').textContent = nome;
    alert('Perfil atualizado com sucesso!');
    fecharModalPerfil();
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao atualizar perfil. Tente novamente.');
  }
});

document.getElementById('formSenhaModal').addEventListener('submit', async (e) => {
  e.preventDefault();
  const novaSenha = document.getElementById('novaSenhaModal').value;
  const confirmaSenha = document.getElementById('confirmaSenhaModal').value;
  
  if (novaSenha !== confirmaSenha) {
    alert('As senhas não coincidem!');
    return;
  }
  
  try {
    await usuarioAtual.updatePassword(novaSenha);
    alert('Senha alterada com sucesso!');
    document.getElementById('formSenhaModal').reset();
    fecharModalPerfil();
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao alterar senha. Faça login novamente e tente.');
  }
});

// Toggle nome outra pessoa
function toggleNomeOutraPessoa() {
  const tipo = document.querySelector('input[name="agendadoPara"]:checked').value;
  const campo = document.getElementById('campoNomeOutraPessoa');
  const input = document.getElementById('nomeOutraPessoa');
  
  if (tipo === 'terceiro') {
    campo.classList.remove('hidden');
    input.required = true;
  } else {
    campo.classList.add('hidden');
    input.required = false;
  }
}

// Equipe Cliente
async function carregarEquipeCliente() {
  const lista = document.getElementById('listaEquipeCliente');
  try {
    const equipe = await listarEquipe();
    
    if (!equipe || Object.keys(equipe).length === 0) {
      lista.innerHTML = '<div class="col-span-3 text-center py-8 text-gray-600 dark:text-gray-400">Nenhum membro cadastrado</div>';
      return;
    }
    
    lista.innerHTML = Object.entries(equipe).map(([id, m]) => {
      const jaCurtiu = m.curtidasUsuarios && m.curtidasUsuarios[usuarioAtual.uid];
      return `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <img src="${m.foto}" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover">
          <h3 class="text-center font-bold text-xl text-gray-900 dark:text-white">${m.nome}</h3>
          <p class="text-center text-sm text-primary font-semibold">${m.cargo}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">${m.bio}</p>
          <button onclick="curtirMembroCliente('${id}')" 
                  class="w-full mt-4 py-2 rounded-lg font-semibold transition ${jaCurtiu ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-red-500 hover:text-white'}">
            ❤️ ${m.curtidas || 0} ${m.curtidas === 1 ? 'Curtida' : 'Curtidas'}
          </button>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Erro ao carregar equipe:', error);
    lista.innerHTML = '<div class="col-span-3 text-center py-8 text-red-600">Erro ao carregar equipe</div>';
  }
}

async function curtirMembroCliente(membroId) {
  try {
    await curtirMembroEquipe(membroId, usuarioAtual.uid);
    await carregarEquipeCliente();
  } catch (error) {
    console.error('Erro ao curtir:', error);
    alert('Erro ao curtir. Tente novamente.');
  }
}

// Atualizar mostrarSecao para incluir equipe
function mostrarSecao(secao) {
  ['agendar', 'pendentes', 'historico', 'perfil', 'equipe'].forEach(s => {
    const secaoEl = document.getElementById(`secao${s.charAt(0).toUpperCase() + s.slice(1)}`);
    if (secaoEl) secaoEl.classList.add('hidden');
    const tabEl = document.getElementById(`tab${s.charAt(0).toUpperCase() + s.slice(1)}`);
    if (tabEl) tabEl.className = 'px-6 py-3 font-semibold text-gray-600 dark:text-gray-400 hover:text-primary whitespace-nowrap';
  });
  
  const secaoAtiva = document.getElementById(`secao${secao.charAt(0).toUpperCase() + secao.slice(1)}`);
  if (secaoAtiva) secaoAtiva.classList.remove('hidden');
  const tabAtiva = document.getElementById(`tab${secao.charAt(0).toUpperCase() + secao.slice(1)}`);
  if (tabAtiva) tabAtiva.className = 'px-6 py-3 font-semibold text-primary border-b-4 border-primary whitespace-nowrap';
  
  if (secao === 'equipe') carregarEquipeCliente();
}

// Verificar se é admin e mostrar botão
firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  usuarioAtual = user;
  document.getElementById('nomeUsuario').textContent = user.displayName || user.email;
  
  // Verificar se é admin
  try {
    const perfil = await obterPerfilUsuario(user.uid);
    if (perfil && perfil.role === 'admin') {
      document.getElementById('btnPainelAdmin').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Erro ao verificar perfil:', error);
  }
  
  await carregarServicos();
  await carregarPendentes();
  await carregarHistorico();
  await carregarPerfil();
});

// Atualizar envio de agendamento para incluir agendadoPor
document.getElementById('formAgendar').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (servicosSelecionados.length === 0) {
    mostrarMensagem('erro', 'Selecione pelo menos um serviço!', 'mensagemAgendar');
    return;
  }
  
  const data = document.getElementById('dataAgendamento').value;
  const horario = document.getElementById('horarioSelecionado').value;
  const obs = document.getElementById('observacoes').value;
  const agendadoPara = document.querySelector('input[name="agendadoPara"]:checked').value;
  
  let nomeCliente;
  if (agendadoPara === 'proprio') {
    nomeCliente = usuarioAtual.displayName || usuarioAtual.email;
  } else {
    nomeCliente = document.getElementById('nomeOutraPessoa').value;
    if (!nomeCliente) {
      mostrarMensagem('erro', 'Digite o nome da pessoa!', 'mensagemAgendar');
      return;
    }
  }
  
  if (!horario) {
    mostrarMensagem('erro', 'Selecione um horário!', 'mensagemAgendar');
    return;
  }
  
  const dataHora = `${data}T${horario}`;
  const totalPreco = servicosSelecionados.reduce((sum, s) => sum + s.preco, 0);
  const totalDuracao = servicosSelecionados.reduce((sum, s) => sum + s.duracao, 0);
  
  try {
    await salvarAgendamento({
      clienteId: usuarioAtual.uid,
      clienteNome: nomeCliente,
      clienteEmail: usuarioAtual.email,
      servicos: servicosSelecionados.map(s => ({ id: s.id, nome: s.nome, preco: s.preco, duracao: s.duracao })),
      dataHora: dataHora,
      duracaoTotal: totalDuracao,
      precoTotal: totalPreco,
      observacoes: obs,
      status: 'pendente',
      agendadoPor: agendadoPara
    });
    
    mostrarMensagem('sucesso', 'Agendamento criado com sucesso! Aguarde a confirmação.', 'mensagemAgendar');
    document.getElementById('formAgendar').reset();
    servicosSelecionados = [];
    atualizarResumo();
    document.getElementById('containerHorario').classList.add('hidden');
    
    setTimeout(() => {
      mostrarSecao('pendentes');
      carregarPendentes();
    }, 2000);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    mostrarMensagem('erro', 'Erro ao criar agendamento. Tente novamente.', 'mensagemAgendar');
  }
});
```

## Incluir script correcoes.js

Antes do fechamento de `</body>`, adicionar:
```html
<script src="assets/correcoes.js"></script>
```

## Usar horários corrigidos

Substituir a função que carrega horários por:
```javascript
document.getElementById('dataAgendamento').addEventListener('change', async (e) => {
  const data = e.target.value;
  if (!data || servicosSelecionados.length === 0) return;
  
  const duracao = servicosSelecionados.reduce((sum, s) => sum + s.duracao, 0);
  const container = document.getElementById('containerHorario');
  const grid = document.getElementById('gridHorarios');
  
  container.classList.remove('hidden');
  grid.innerHTML = '<div class="col-span-3 text-center py-4 text-gray-600 dark:text-gray-400">Carregando...</div>';
  
  try {
    const horarios = await gerarHorariosDisponiveisCorrigidos(data, duracao);
    if (horarios.length === 0) {
      grid.innerHTML = '<div class="col-span-3 text-center py-4 text-yellow-600">Nenhum horário disponível para esta data</div>';
      return;
    }
    grid.innerHTML = horarios.map(h => `
      <button type="button" onclick="selecionarHorario('${h}')" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-primary hover:text-white transition text-sm">
        ${h}
      </button>
    `).join('');
  } catch (error) {
    grid.innerHTML = '<div class="col-span-3 text-center py-4 text-red-600">Erro ao carregar horários</div>';
  }
});
```
