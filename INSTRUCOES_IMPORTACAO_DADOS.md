# 📊 Instruções para Importação de Dados no Firebase Realtime Database

## ✅ Passo a Passo para Importar Dados

### 1️⃣ Acesse o Firebase Console
1. Vá para [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **"Realtime Database"**

### 2️⃣ Limpe o Banco de Dados Atual (Opcional)
⚠️ **ATENÇÃO:** Isso vai deletar todos os dados existentes!

1. Na visualização do Realtime Database, clique no ícone **"⋮"** (três pontos)
2. Selecione **"Delete database"** ou clique na raiz e delete tudo

### 3️⃣ Importe o Arquivo JSON

1. Na visualização do Realtime Database, clique no ícone **"⋮"** (três pontos) ao lado do nome do database
2. Selecione **"Import JSON"**
3. Clique em **"Browse"** e selecione o arquivo `ESTRUTURA_BANCO_DADOS_COMPLETA.json`
4. Clique em **"Import"**

### 4️⃣ Verifique a Importação

Após a importação, você deve ver a seguinte estrutura:

```
realtime-database-root/
├── agendamentos/
│   ├── -N9Z0_ExemploConfirmado/
│   ├── -O3A1_ExemploPendente/
│   └── -P4B2_ExemploConcluido/
├── usuarios/
│   ├── IEtDxVZXgZOP0M3R8OApILWvKTS2/ (Admin)
│   ├── JdhBfj837hDkfL29Jp1s/ (João)
│   └── KldBfi837hDkfL29Jp2s/ (Maria)
└── chats/
    └── -N9Z0_ExemploConfirmado/
```

### 5️⃣ Configure as Regras de Segurança

Copie e cole as seguintes regras no Firebase Realtime Database:

```json
{
  "rules": {
    ".read": false,
    ".write": false,

    "usuarios": {
      "$uid": {
        ".read": "auth != null && ($uid === auth.uid || (root.child('usuarios').child(auth.uid).child('role').val() === 'admin'))",
        ".write": "auth != null && ($uid === auth.uid || (root.child('usuarios').child(auth.uid).child('role').val() === 'admin'))",
        ".validate": "newData.hasChildren(['nomeCompleto', 'email', 'role'])",
        "nomeCompleto": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "email": {
          ".validate": "newData.isString() && newData.val().contains('@')"
        },
        "role": {
          ".validate": "newData.val() === 'cliente' || newData.val() === 'admin'"
        },
        "$other": {
          ".validate": true
        }
      },
      ".indexOn": ["role"]
    },

    "agendamentos": {
      "$agendamentoId": {
        ".read": "auth != null && ((root.child('usuarios').child(auth.uid).child('role').val() === 'admin') || data.child('clienteId').val() === auth.uid)",
        ".write": "auth != null && ((root.child('usuarios').child(auth.uid).child('role').val() === 'admin') || (!data.exists() && newData.child('clienteId').val() === auth.uid))",
        ".validate": "newData.hasChildren(['clienteId', 'dataHora', 'duracaoTotal', 'servicos', 'status'])",
        "clienteId": {
          ".validate": "newData.isString() && (!data.exists() || newData.val() === auth.uid || root.child('usuarios').child(auth.uid).child('role').val() === 'admin')"
        },
        "dataHora": {
          ".validate": "newData.isString()"
        },
        "duracaoTotal": {
          ".validate": "newData.isNumber() && newData.val() > 0"
        },
        "precoTotal": {
          ".validate": "newData.isNumber() && newData.val() >= 0"
        },
        "status": {
          ".validate": "newData.val() === 'pendente' || newData.val() === 'confirmado' || newData.val() === 'cancelado' || newData.val() === 'concluido'"
        },
        "servicos": {
          ".validate": "newData.hasChildren()",
          "$index": {
            ".validate": "newData.hasChildren(['id', 'nome', 'preco'])"
          }
        },
        "$other": {
          ".validate": true
        }
      },
      ".indexOn": ["clienteId", "dataHora", "status"]
    },

    "chats": {
      "$agendamentoId": {
        ".read": "auth != null && ((root.child('usuarios').child(auth.uid).child('role').val() === 'admin') || root.child('agendamentos').child($agendamentoId).child('clienteId').val() === auth.uid)",
        ".write": "auth != null && ((root.child('usuarios').child(auth.uid).child('role').val() === 'admin') || root.child('agendamentos').child($agendamentoId).child('clienteId').val() === auth.uid)",
        "mensagens": {
          "$mensagemId": {
            ".validate": "newData.hasChildren(['userId', 'texto', 'timestamp'])",
            "userId": {
              ".validate": "newData.val() === auth.uid"
            }
          },
          ".indexOn": ["timestamp"]
        }
      }
    }
  }
}
```

### 6️⃣ Crie os Usuários no Firebase Authentication

Para fazer login com os usuários de exemplo, você precisa criar as contas no Firebase Authentication:

1. No Firebase Console, vá para **"Authentication"**
2. Clique em **"Users"** e depois **"Add user"**
3. Crie os seguintes usuários:

#### Usuário Admin:
- **Email:** kayhamoliveira98@gmail.com
- **Senha:** (escolha uma senha segura)
- **User UID:** `IEtDxVZXgZOP0M3R8OApILWvKTS2`

⚠️ **IMPORTANTE:** Você precisa configurar o UID manualmente usando o Firebase Admin SDK ou console

#### Usuário Cliente 1:
- **Email:** joao@exemplo.com
- **Senha:** senha123
- **User UID:** `JdhBfj837hDkfL29Jp1s`

#### Usuário Cliente 2:
- **Email:** maria@exemplo.com
- **Senha:** senha123
- **User UID:** `KldBfi837hDkfL29Jp2s`

## 📝 Notas Importantes

### Estrutura de Agendamentos
```json
{
  "clienteId": "UID_do_usuario",
  "clienteNome": "Nome Completo",
  "clienteTelefone": "(00) 00000-0000",
  "clienteEmail": "email@exemplo.com",
  "criadoEm": "2025-12-16T14:30:00.000Z",
  "dataHora": "2025-12-20T10:30:00.000Z",
  "duracaoTotal": 50,
  "observacoes": "Observações opcionais",
  "precoTotal": 60,
  "servicos": [
    {
      "id": "corte_cabelo",
      "nome": "Corte de Cabelo",
      "preco": 35
    }
  ],
  "status": "pendente|confirmado|cancelado|concluido"
}
```

### Estrutura de Usuários
```json
{
  "criadoEm": "2025-12-16T10:00:00.000Z",
  "email": "usuario@exemplo.com",
  "nomeCompleto": "Nome Completo do Usuário",
  "role": "cliente|admin",
  "telefone": "(00) 00000-0000",
  "atualizadoEm": "2025-12-16T10:00:00.000Z"
}
```

### Estrutura de Chats
```json
{
  "lido": {
    "admin": true,
    "cliente": false
  },
  "mensagens": {
    "msgId": {
      "criadoEm": "2025-12-16T14:31:40.000Z",
      "texto": "Mensagem de texto",
      "timestamp": 1734363100000,
      "userId": "UID_do_remetente",
      "userNome": "Nome do Remetente"
    }
  }
}
```

## 🔐 Segurança

As regras de segurança garantem que:
- ✅ Apenas usuários autenticados podem acessar dados
- ✅ Clientes só veem seus próprios agendamentos
- ✅ Administradores têm acesso total
- ✅ Dados são validados antes de serem salvos
- ✅ Chats são privados entre cliente e admin

## 🆘 Problemas Comuns

### Erro: "Permission Denied"
- Verifique se as regras de segurança estão configuradas corretamente
- Certifique-se de que o usuário está autenticado
- Confirme que o UID do usuário corresponde ao clienteId do agendamento

### Dados não aparecem
- Verifique se o JSON foi importado corretamente
- Confirme que os índices estão configurados (`.indexOn`)
- Verifique o console do navegador para erros

### Login não funciona
- Certifique-se de que os usuários foram criados no Authentication
- Verifique se os UIDs correspondem aos dados do Realtime Database
- Confirme que o email e senha estão corretos

## ✅ Pronto!

Após seguir todos os passos, você poderá:
- ✅ Fazer login como administrador ou cliente
- ✅ Visualizar agendamentos
- ✅ Criar novos agendamentos
- ✅ Gerenciar status (pendente, confirmado, concluído)
- ✅ Usar o chat entre cliente e admin
