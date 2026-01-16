# Plano de Implementação Completo - Sistema de Agendamentos

## Status Atual (2026-01-16)

### ✅ Corrigido
1. **admin.html**: Estrutura de seções corrigida (Clientes e Equipe movidas para dentro do container)
2. **Pasta /img**: Criada para fotos da equipe (com placeholder.svg)
3. **Login/Cadastro**: Adicionado botão visualizar senha (👁️/🙈)

### 🔄 Em Andamento
- Melhorias de cores dark mode
- Sistema de serviços CRUD
- Sistema de produtos (Ponto de Vendas)
- Sistema de faturamento

---

## Funcionalidades a Implementar

### 1. Aba SERVIÇOS (Admin)
**Localização**: admin.html
**Estrutura Firebase**: `/servicos/{servicoId}`

**Campos:**
- nome
- descricao
- preco
- duracao (minutos)
- icone (emoji)
- ativo (boolean)
- criadoEm
- atualizadoEm

**Funcionalidades:**
- ✅ Listar todos os serviços
- ➕ Adicionar novo serviço
- ✏️ Editar serviço existente
- 🗑️ Excluir serviço
- 🔄 Ativar/Desativar serviço

---

### 2. Aba PONTO DE VENDAS (Admin)
**Localização**: admin.html
**Estrutura Firebase**: `/produtos/{produtoId}`

**Campos:**
- nome
- descricao
- preco
- estoque
- categoria (shampoo, condicionador, tratamento, etc.)
- ativo (boolean)
- criadoEm
- atualizadoEm

**Funcionalidades:**
- 📦 Listar produtos
- ➕ Adicionar produto
- ✏️ Editar produto
- 🗑️ Excluir produto
- 📊 Controle de estoque
- Cliente pode adicionar produtos ao agendamento (opcional)

---

### 3. Aba FATURAMENTO (Admin)
**Localização**: admin.html
**Estrutura Firebase**: `/faturamento/`

#### 3.1 Subtab: Profissionais
**Estrutura**: `/faturamento/profissionais/{profissionalId}`
- nome (referência à equipe)
- totalAtendimentos
- totalGerado
- comissao (%)
- totalComissao
- periodo (mes/ano)

#### 3.2 Subtab: Extrato
**Estrutura**: `/faturamento/extrato/{extratoId}`
- descricao
- cliente (nome)
- data
- tipo ('receita' | 'despesa')
- valor
- categoria
- observacoes

**Funcionalidades:**
- 📊 Dashboard de faturamento
- 👥 Listagem de profissionais com métricas
- 💰 Cálculo automático de comissões
- 📝 Registro manual de receitas/despesas
- 🔍 Filtros por período, profissional, tipo
- 📈 Gráficos de desempenho

---

### 4. Melhorias em CLIENTES (Admin)
**Estrutura Firebase**: `/usuarios/{userId}` (atualizar)

**Adicionar Campos:**
- whatsapp
- totalVisitas
- ultimaVisita
- historicoAgendamentos[]

**Funcionalidades:**
- 📱 Exibir WhatsApp
- 📊 Total de visitas
- 📅 Data da última visita
- 📞 Botão para abrir WhatsApp
- 📈 Histórico de agendamentos

---

### 5. Dashboard FINANCEIRO (Admin)
**Localização**: admin.html (nova seção principal)

**Componentes:**
- 💰 Card: Receita Total
- 💸 Card: Despesas Totais
- 📈 Card: Lucro Líquido
- 🎯 Card: Meta Mensal
- 📊 Gráfico: Receita vs Despesas (mês)
- 📈 Gráfico: Evolução mensal
- 🎯 Progress bar: % da meta alcançada

**Funcionalidades:**
- Filtro por período
- Definir metas mensais
- Comparação com mês anterior
- Export para PDF/Excel

---

### 6. FORMAS DE PAGAMENTO
**Localização**: cliente.html (formulário de agendamento)
**Estrutura**: Adicionar ao agendamento

**Opções:**
- Dinheiro
- PIX
- Cartão de Débito
- Cartão de Crédito
- Transferência

**Campos adicionais:**
- formaPagamento
- statusPagamento ('pendente' | 'pago' | 'cancelado')
- valorPago
- produtos[] (opcional)

---

## Estrutura de Dados Firebase Atualizada

```json
{
  "servicos": {
    "{servicoId}": {
      "nome": "Corte Masculino",
      "descricao": "Corte de cabelo masculino",
      "preco": 50,
      "duracao": 30,
      "icone": "✂️",
      "ativo": true,
      "criadoEm": "2026-01-16T10:00:00.000Z",
      "atualizadoEm": "2026-01-16T10:00:00.000Z"
    }
  },
  "produtos": {
    "{produtoId}": {
      "nome": "Shampoo Anti-Caspa",
      "descricao": "Shampoo para tratamento de caspa",
      "preco": 45,
      "estoque": 20,
      "categoria": "shampoo",
      "ativo": true,
      "criadoEm": "2026-01-16T10:00:00.000Z"
    }
  },
  "faturamento": {
    "profissionais": {
      "{profissionalId}": {
        "nome": "João Silva",
        "totalAtendimentos": 45,
        "totalGerado": 2250,
        "comissao": 30,
        "totalComissao": 675,
        "periodo": "2026-01"
      }
    },
    "extrato": {
      "{extratoId}": {
        "descricao": "Corte + Barba - Cliente João",
        "cliente": "João Silva",
        "data": "2026-01-16T14:30:00.000Z",
        "tipo": "receita",
        "valor": 85,
        "categoria": "servico",
        "profissional": "{profissionalId}"
      }
    },
    "metas": {
      "2026-01": {
        "valor": 10000,
        "alcancado": 6500
      }
    }
  },
  "agendamentos": {
    "{agendamentoId}": {
      "...campos existentes...",
      "formaPagamento": "PIX",
      "statusPagamento": "pago",
      "produtos": [
        {
          "id": "{produtoId}",
          "nome": "Shampoo",
          "preco": 45,
          "quantidade": 1
        }
      ]
    }
  },
  "usuarios": {
    "{userId}": {
      "...campos existentes...",
      "whatsapp": "+5511999999999",
      "totalVisitas": 12,
      "ultimaVisita": "2026-01-15T14:00:00.000Z"
    }
  }
}
```

---

## Firebase Rules Atualizadas

```json
{
  "rules": {
    "servicos": {
      ".read": "auth != null",
      ".write": "root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
    },
    "produtos": {
      ".read": "auth != null",
      ".write": "root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
    },
    "faturamento": {
      ".read": "root.child('usuarios').child(auth.uid).child('role').val() === 'admin'",
      ".write": "root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

---

## Ordem de Implementação

1. ✅ Corrigir admin.html (estrutura)
2. ✅ Pasta /img e suporte a fotos
3. ✅ Visualizar senha no login
4. 🔄 Aba Serviços (CRUD)
5. ⏳ Aba Produtos/Ponto de Vendas (CRUD)
6. ⏳ Aba Faturamento (profissionais + extrato)
7. ⏳ Dashboard Financeiro
8. ⏳ Formas de pagamento
9. ⏳ Melhorias em Clientes
10. ⏳ Cores dark mode
11. ⏳ Atualizar Firebase rules
12. ⏳ Gerar arquivo de importação
13. ⏳ Commit e push final

---

**Status**: Documento criado em 2026-01-16
**Próximos passos**: Implementar aba de Serviços
