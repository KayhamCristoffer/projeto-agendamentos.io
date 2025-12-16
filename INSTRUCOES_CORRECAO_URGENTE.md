# 🔧 INSTRUÇÕES DE CORREÇÃO URGENTE

## 📊 DADOS DO FIREBASE

**Arquivo:** `exportar-dados.json` contém a estrutura COMPLETA do banco de dados.

### Como importar no Firebase:
1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto
3. Realtime Database → ⋮ (três pontos) → Importar JSON
4. Selecione o arquivo `exportar-dados.json`
5. Confirme a importação

---

## 🐛 PROBLEMAS IDENTIFICADOS E SOLUÇÕES

### 1. ❌ ERRO AO FAZER LOGIN

**Problema:** Login não redireciona corretamente  
**Causa:** Estrutura do banco não corresponde ao código  
**Solução:** ✅ Arquivo `database.js` JÁ CORRIGIDO

### 2. ❌ TELEFONE SEM LIMITE

**Problema:** Campo aceita mais de 11 dígitos  
**Solução:**  

Em `login.html` linha 228-235, o código JÁ limita a 11 dígitos:
```javascript
document.getElementById('cadTelefone').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length <= 11) { // LIMITE JÁ APLICADO
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    e.target.value = value;
  } else {
    e.target.value = e.target.value.slice(0, 15); // (XX) XXXXX-XXXX = 15 chars
  }
});
```

### 3. ❌ MODAL DE CHAT ABRE AUTOMATICAMENTE

**Problema:** Chat abre ao carregar página do cliente  
**Solução:** Adicionar em `cliente.html` após linha 165:

```javascript
// No início do script, após linha 192:
document.getElementById('modalChat').classList.add('hidden'); // Garantir que começa oculto
```

### 4. ❌ SERVIÇOS NÃO APARECEM

**Problema:** Select de serviços vazio  
**Causa:** Arquivo `services-config.js` não carrega ou não existe  

**VERIFICAR:**  
Arquivo `/firebase/services-config.js` existe? Caso NÃO, criar:

```javascript
// firebase/services-config.js
const SERVICOS = [
  {
    id: 'corte_cabelo_masc',
    icon: '✂️',
    nome: 'Corte de Cabelo Masculino',
    descricao: 'Corte moderno e profissional',
    preco: 50,
    duracao: 30
  },
  {
    id: 'corte_cabelo_fem',
    icon: '✂️',
    nome: 'Corte de Cabelo Feminino',
    descricao: 'Corte e finalização',
    preco: 80,
    duracao: 45
  },
  {
    id: 'barba',
    icon: '🧔',
    nome: 'Barba',
    descricao: 'Aparar e modelar',
    preco: 40,
    duracao: 20
  },
  {
    id: 'corte_barba',
    icon: '✂️🧔',
    nome: 'Corte + Barba',
    descricao: 'Combo completo',
    preco: 85,
    duracao: 50
  },
  {
    id: 'manicure',
    icon: '💅',
    nome: 'Manicure',
    descricao: 'Unhas das mãos',
    preco: 60,
    duracao: 40
  },
  {
    id: 'pedicure',
    icon: '🦶',
    nome: 'Pedicure',
    descricao: 'Unhas dos pés',
    preco: 70,
    duracao: 50
  },
  {
    id: 'mani_pedi',
    icon: '💅🦶',
    nome: 'Manicure + Pedicure',
    descricao: 'Pacote completo',
    preco: 120,
    duracao: 90
  },
  {
    id: 'depilacao_facial',
    icon: '👩',
    nome: 'Depilação Facial',
    descricao: 'Depilação facial completa',
    preco: 50,
    duracao: 30
  },
  {
    id: 'depilacao_corporal',
    icon: '🧖',
    nome: 'Depilação Corporal',
    descricao: 'Depilação corpo inteiro',
    preco: 150,
    duracao: 90
  },
  {
    id: 'massagem',
    icon: '💆',
    nome: 'Massagem Relaxante',
    descricao: 'Massagem terapêutica',
    preco: 200,
    duracao: 60
  },
  {
    id: 'limpeza_pele',
    icon: '✨',
    nome: 'Limpeza de Pele',
    descricao: 'Tratamento facial completo',
    preco: 180,
    duracao: 90
  },
  {
    id: 'design_sobrancelha',
    icon: '👁️',
    nome: 'Design de Sobrancelhas',
    descricao: 'Modelagem de sobrancelhas',
    preco: 60,
    duracao: 30
  }
];

function getTodosServicos() {
  return SERVICOS;
}

function getServicoPorId(id) {
  return SERVICOS.find(s => s.id === id);
}

if (typeof window !== 'undefined') {
  window.SERVICOS = SERVICOS;
  window.getTodosServicos = getTodosServicos;
  window.getServicoPorId = getServicoPorId;
}
```

### 5. ❌ HORÁRIOS NÃO APARECEM

**Problema:** Sem opção de selecionar horário  
**Causa:** Campo de data não dispara evento  

**ADICIONAR** em `cliente.html` após linha 283:

```javascript
// Forçar configuração da data mínima ao carregar
document.addEventListener('DOMContentLoaded', () => {
  const dataInput = document.getElementById('dataAgendamento');
  const hoje = new Date();
  hoje.setDate(hoje.getDate() + 1);
  const dataMin = hoje.toISOString().split('T')[0];
  dataInput.min = dataMin;
  dataInput.value = ''; // Limpar qualquer valor
});
```

### 6. ❌ TEMA (CLARO/ESCURO) EM LOCAL RUIM

**Solução:** Adicionar botão de tema na navbar  

**SUBSTITUIR** a navbar em TODAS as páginas:

```html
<nav class="nav-bar">
  <div class="nav-container" style="display: flex; justify-content: space-between; align-items: center;">
    <a href="#" class="nav-logo">📅 Agendamentos</a>
    <div style="display: flex; align-items: center; gap: 16px;">
      <!-- Botão de tema -->
      <button onclick="toggleTheme()" class="btn btn-sm btn-ghost" style="padding: 8px 12px;">
        <span id="themeIcon">🌙</span>
      </button>
      <span id="nomeUsuario" style="color: var(--text-secondary); font-size: 14px;"></span>
      <!-- Botão Admin (se for admin) -->
      <a href="admin.html" id="btnAdmin" class="btn btn-sm btn-primary" style="display: none;">
        🛠️ Admin
      </a>
      <button class="btn btn-sm btn-ghost" onclick="logout()">Sair</button>
    </div>
  </div>
</nav>
```

E adicionar script para mostrar botão admin:

```javascript
// Após obter perfil do usuário
firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const perfil = await obterPerfilUsuario(user.uid);
  document.getElementById('nomeUsuario').textContent = perfil?.nomeCompleto || user.email;
  
  // Mostrar botão admin se for admin
  if (perfil && perfil.role === 'admin') {
    document.getElementById('btnAdmin').style.display = 'inline-block';
  }
});
```

### 7. ❌ PAINEL ADMIN NÃO CARREGA DADOS

**Problema:** Pendentes, Confirmados, Histórico vazios  
**Causa:** Nome do campo diferente no banco  

**VERIFICAR** em `admin.html` que use `clienteNome` ao invés de `nome`:

```javascript
// Ao criar cards de agendamento:
card.innerHTML = `
  <h4>${agend.clienteNome}</h4>  <!-- Era agend.nome -->
  <p>📞 ${agend.clienteTelefone || 'Não informado'}</p>
  ...
`;
```

### 8. ❌ CHAT NÃO ENVIA MENSAGENS

**Problema:** Input não dispara envio  
**Solução:** ✅ Código em `cliente.html` linha 634 JÁ FUNCIONA

Verificar se modal tem ID correto: `id="modalChat"`

### 9. ❌ CALENDÁRIO NÃO CARREGA AUTOMATICAMENTE

**Solução:** Adicionar botão de atualizar no painel admin:

```html
<!-- No painel admin, aba Calendário -->
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
  <h3>📅 Calendário de Agendamentos</h3>
  <button class="btn btn-primary" onclick="carregarCalendario()">
    🔄 Atualizar
  </button>
</div>
```

### 10. ❌ OPÇÃO EDITAR EM PENDENTES E CONFIRMADOS

**Adicionar** botão de editar nos cards:

```javascript
// No criarCardAgendamento():
<div style="display: flex; flex-direction: column; gap: 8px;">
  <button class="btn btn-sm btn-warning" onclick="editarAgendamento('${ag.id}')">
    ✏️ Editar
  </button>
  ${isPendente ? `
    <button class="btn btn-sm btn-danger" onclick="cancelarAgendamento('${ag.id}')">
      ❌ Cancelar
    </button>
  ` : ''}
  <button class="btn btn-sm btn-primary" onclick="abrirChat('${ag.id}')">
    💬 Chat
  </button>
</div>
```

E função de editar:

```javascript
async function editarAgendamento(id) {
  const agendamento = await obterAgendamento(id);
  
  // Abrir modal ou redirecionar para formulário de edição
  // Por simplicidade, usar prompt:
  const novaObs = prompt('Nova observação:', agendamento.observacoes);
  if (novaObs !== null) {
    await atualizarAgendamento(id, { observacoes: novaObs });
    alert('✅ Agendamento atualizado!');
    carregarPendentes(); // Ou carregarConfirmados()
  }
}
```

---

## 🎨 CSS - RESPONSIVIDADE

Adicionar ao final de `assets/style.css`:

```css
/* Mobile */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column !important;
    gap: 12px;
  }
  
  .container-wide {
    padding: 12px !important;
  }
  
  #horariosDisponiveis {
    grid-template-columns: repeat(3, 1fr) !important;
  }
  
  .card {
    padding: 12px !important;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  #horariosDisponiveis {
    grid-template-columns: repeat(4, 1fr) !important;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  #horariosDisponiveis {
    grid-template-columns: repeat(6, 1fr) !important;
  }
}
```

---

## 📝 ARQUIVOS PARA DELETAR

Remover arquivos duplicados ou desnecessários:

```bash
cd /home/user/webapp/projeto-agendamentos.io

# Remover arquivos de documentação duplicados/desnecessários

```

---

## ✅ CHECKLIST DE CORREÇÃO

- [ ] Importar `exportar-dados.json` no Firebase
- [ ] Verificar/Criar `firebase/services-config.js`
- [ ] Adicionar configuração de data mínima
- [ ] Ajustar navbar com botão de tema e admin
- [ ] Corrigir referências `nome` → `clienteNome`
- [ ] Adicionar botões de editar
- [ ] Testar login com usuário admin
- [ ] Testar agendamento completo (serviço + data + horário)
- [ ] Testar chat (enviar e receber)
- [ ] Testar perfil do cliente
- [ ] Verificar responsividade (mobile/tablet/desktop)
- [ ] Limpar arquivos desnecessários

---

## 🔥 PRIORIDADE MÁXIMA

1. **IMPORTAR DADOS** (`exportar-dados.json`)
2. **CRIAR** `services-config.js`
3. **TESTAR LOGIN** com `kayhamoliveira98@gmail.com`
4. **VERIFICAR** se botão Admin aparece quando logado como admin

---

## 📞 TESTE RÁPIDO

Após fazer as correções:

1. Login com admin: kayhamoliveira98@gmail.com
2. Verificar se aparece botão "Admin" no menu
3. Clicar em "Admin" e ver se carrega dados
4. Voltar para área cliente
5. Tentar criar novo agendamento
6. Verificar se serviços aparecem
7. Selecionar data e verificar horários
8. Confirmar agendamento
9. Ir em "Pendentes" e verificar
10. Abrir chat e enviar mensagem

---

**Status:** 🔴 CORREÇÕES NECESSÁRIAS  
**Tempo estimado:** 1-2 horas de trabalho  
**Complexidade:** Média

Siga as instruções na ordem e teste cada correção antes de prosseguir.
