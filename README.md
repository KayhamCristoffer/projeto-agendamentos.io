# 📅 Sistema de Agendamento Online

Sistema completo de agendamento para salões de beleza, barbearias e estabelecimentos de estética.

## 🚀 Funcionalidades

### 👤 Área do Cliente
- ✅ Cadastro e autenticação
- ✅ Agendamento de serviços
- ✅ Seleção de produtos (opcional)
- ✅ Chat em tempo real com admin
- ✅ Histórico de agendamentos
- ✅ Gerenciamento de perfil
- ✅ Visualização da equipe

### 👑 Área do Administrador
- ✅ Dashboard com estatísticas
- ✅ Calendário interativo
- ✅ Gerenciamento de clientes (CRUD completo)
- ✅ Gerenciamento de agendamentos
- ✅ Sistema de chat
- ✅ Gerenciamento de equipe
- ✅ CRUD de serviços
- ✅ CRUD de produtos (Ponto de Vendas)
- ✅ Faturamento e relatórios

## 🔧 Tecnologias

- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Backend**: Firebase (Authentication + Realtime Database)
- **Sessão**: Timeout automático de 1 hora

## 📦 Estrutura do Projeto

```
projeto-agendamentos.io/
├── index.html              # Página inicial
├── login.html              # Login e cadastro
├── cliente.html            # Área do cliente
├── admin.html              # Painel administrativo
├── firebase/
│   ├── firebase-config.js  # Configuração do Firebase
│   ├── database.js         # Funções do banco de dados
│   ├── services-config.js  # Carregamento de serviços
│   └── session-manager.js  # Gerenciamento de sessão
├── assets/
│   ├── theme.js            # Alternador de tema claro/escuro
│   └── correcoes.js        # Correções gerais
└── img/                    # Imagens (fotos da equipe)
```

## 🔥 Configuração do Firebase

### 1. Importar Dados

**Arquivo**: `firebase-data-servicos-produtos.json`

```bash
Firebase Console → Realtime Database → Importar JSON
```

Este arquivo contém:
- 12 serviços cadastrados
- 4 produtos cadastrados
- Todos com status ativo

### 2. Estrutura do Database

```
/
├── agendamentos/
├── chats/
├── equipe/
├── faturamento/
│   ├── extrato/
│   ├── metas/
│   └── profissionais/
├── produtos/
├── servicos/
└── usuarios/
```

### 3. Regras de Segurança

```json
{
  "rules": {
    "agendamentos": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "chats": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "servicos": {
      ".read": "auth != null",
      ".write": "root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
    },
    "produtos": {
      ".read": "auth != null",
      ".write": "root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
    },
    "equipe": {
      ".read": "auth != null",
      ".write": "root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
    },
    "faturamento": {
      ".read": "root.child('usuarios').child(auth.uid).child('role').val() === 'admin'",
      ".write": "root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
    },
    "usuarios": {
      "$uid": {
        ".read": "auth != null",
        ".write": "$uid === auth.uid || root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
      }
    }
  }
}
```

## 🎯 Como Usar

### Para Usuários (Clientes)

1. Acesse `login.html`
2. Clique em "Criar Conta"
3. Preencha os dados
4. Faça login
5. Selecione serviços e produtos
6. Escolha data/horário
7. Confirme o agendamento

### Para Administradores

1. Faça login com conta admin
2. Acesse o painel administrativo
3. Gerencie agendamentos, clientes, serviços e produtos
4. Visualize faturamento
5. Responda chats dos clientes

## ⚙️ Funcionalidades Técnicas

### Timeout de Sessão
- Logout automático após 1 hora de inatividade
- Aviso 5 minutos antes do timeout
- Renovação automática em qualquer atividade

### Carregamento Dinâmico
- Serviços carregados do Firebase em tempo real
- Produtos carregados do Firebase em tempo real
- Atualização automática de dados

### Segurança
- Autenticação Firebase
- Regras de segurança por role (admin/cliente)
- Validação de dados no frontend e backend

## 📝 Documentação Adicional

- **`FIREBASE_SETUP.md`** - 🔥 Guia completo de configuração do Firebase
  - Estrutura de dados detalhada
  - Formato de datetime correto
  - Exemplos de dados
  - Solução de problemas comuns
  - Checklist de configuração

- **`firebase-import-data.json`** - Dados completos para importação:
  - Agendamentos de exemplo
  - Usuários (admin e clientes)
  - Serviços (12 serviços)
  - Produtos (1 produto)
  - Equipe, chats e faturamento

- **`firebase-rules.json`** - Regras de segurança do Firebase

## 🐛 Solução de Problemas

### ❌ Serviços/Produtos não aparecem
**Solução**:
1. Verificar se `firebase-import-data.json` foi importado no Firebase Console
2. Abrir console do navegador (F12)
3. Verificar logs: "✅ Serviços carregados: X" ou "✅ Produtos carregados: X"
4. Se o problema persistir, consulte `FIREBASE_SETUP.md` → "Problemas Comuns"

**Causa**: O filtro `orderByChild('ativo').equalTo(true)` não funcionava com campos inexistentes.  
**Status**: ✅ **CORRIGIDO** - Agora busca todos e filtra localmente com `data.ativo !== false`

### ❌ Cadastro de usuário não salva
**Solução**:
1. Verificar se as regras do Firebase foram aplicadas (`firebase-rules.json`)
2. Ver console do navegador (F12) para erros
3. Verificar se a conexão com Firebase está ativa

**Status**: ✅ **CORRIGIDO** - Função `salvarPerfilUsuario` agora salva corretamente no Realtime Database

### ❌ Sessão expira rapidamente
**Solução**: Não é um problema! É uma funcionalidade de segurança.

**Comportamento**:
- Timeout de 1 hora de inatividade
- Aviso 5 minutos antes de expirar
- Renovação automática ao detectar qualquer atividade (mouse, teclado, clique, scroll)

**Status**: ✅ **IMPLEMENTADO** - `firebase/session-manager.js`

### ❌ Formato de data incorreto
**Problema**: Erros ao salvar datas no Firebase

**Solução**: Use sempre o formato ISO 8601:
- Para agendamentos: `YYYY-MM-DDTHH:MM` (ex: `2026-01-30T14:30`)
- Para timestamps: `YYYY-MM-DDTHH:MM:SS.SSSZ` (ex: `2026-01-26T10:00:00.000Z`)

**Documentação**: Consulte `FIREBASE_SETUP.md` → seção "Formato de Datetime"

**Status**: ✅ **PADRONIZADO** - Todos os arquivos seguem o formato correto

## 📞 Suporte

Logs úteis estão disponíveis no Console do navegador (F12 → Console)

## 📄 Licença

Este projeto é de código aberto.

---

**Desenvolvido com ❤️ usando Firebase e Tailwind CSS**
