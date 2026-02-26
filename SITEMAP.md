# SITEMAP - Sistema de Agendamentos Online

## Estrutura de Navegação

### Páginas Públicas
- / (index.html) - Landing Page
  └── /login (login.html) - Autenticação
      ├── /cadastro (cadastro.html) - Registro de novo usuário
      └── Recuperar senha (modal em login.html)

### Área do Cliente
- /cliente (cliente.html) - Dashboard do Cliente
  ├── Aba: Agendar Novo
  │   ├── Selecionar profissional
  │   ├── Selecionar serviços
  │   ├── Escolher data
  │   └── Escolher horário
  ├── Aba: Pendentes
  │   └── Lista de agendamentos pendentes
  ├── Aba: Histórico
  │   └── Todos os agendamentos (confirmados, concluídos, cancelados)
  ├── Aba: Perfil
  │   └── Dados pessoais e edição
  └── Aba: Equipe
      └── Visualizar e curtir profissionais

### Área Administrativa
- /admin (admin.html) - Painel Admin
  ├── Aba: Calendário
  │   ├── Visualização mensal
  │   ├── Navegação entre meses
  │   └── Detalhes de agendamentos
  ├── Aba: Clientes
  │   ├── Listar todos os clientes
  │   ├── Adicionar novo cliente
  │   ├── Editar cliente
  │   └── Excluir cliente
  ├── Aba: Equipe
  │   ├── Listar profissionais
  │   ├── Adicionar membro
  │   ├── Editar membro
  │   └── Excluir membro
  ├── Aba: Serviços
  │   ├── Listar serviços
  │   ├── Adicionar serviço
  │   ├── Editar serviço
  │   └── Excluir serviço
  ├── Aba: Produtos (Ponto de Vendas)
  │   ├── Listar produtos
  │   ├── Adicionar produto
  │   ├── Editar produto
  │   ├── Excluir produto
  │   └── Controle de estoque
  ├── Aba: Faturamento
  │   ├── Resumo mensal (receitas, despesas, lucro)
  │   ├── Extrato de transações
  │   ├── Adicionar despesa
  │   └── Gerenciar despesas recorrentes
  ├── Aba: Pendentes
  │   ├── Listar agendamentos pendentes
  │   ├── Confirmar agendamento
  │   ├── Cancelar agendamento
  │   └── Editar agendamento
  └── Aba: Confirmados
      ├── Listar agendamentos confirmados
      ├── Concluir agendamento
      └── Cancelar agendamento

---

## Arquitetura de Arquivos

### Estrutura de Pastas

projeto-agendamentos.io/
├── index.html                  # Landing page
├── login.html                  # Página de login
├── cadastro.html               # Página de cadastro
├── cliente.html                # Área do cliente
├── admin.html                  # Painel administrativo
├── README.md                   # Documentação principal
├── README-MELHORIAS.md         # Documentação de melhorias
├── TUTORIAL.md                 # Tutorial completo de uso
├── firebase-security-rules.json # Regras de segurança do Firebase
├── assets/                     # Recursos JavaScript
│   ├── toast.js                # Sistema de notificações
│   ├── business-rules.js       # Regras de negócio
│   ├── correcoes.js            # Funções auxiliares
│   └── theme.js                # Gerenciamento de tema
├── firebase/                   # Configuração Firebase
│   ├── firebase-config.js      # Inicialização do Firebase
│   ├── services-config.js      # Carregamento de serviços
│   ├── database.js             # Funções de banco de dados
│   └── session-manager.js      # Gerenciamento de sessão
└── img/                        # Imagens (se houver)

---

## Fluxo de Navegação

### Novo Usuário (Cliente)
1. index.html → Clica "Entrar"
2. login.html → Clica "Criar conta"
3. cadastro.html → Preenche formulário
4. cliente.html → Área do cliente (automático após cadastro)

### Usuário Existente (Cliente)
1. index.html → Clica "Entrar"
2. login.html → Faz login
3. cliente.html → Área do cliente

### Administrador
1. index.html → Clica "Entrar"
2. login.html → Faz login (role: admin)
3. admin.html → Painel administrativo

### Admin acessar Área do Cliente
- admin.html → Clica "👤 Área Cliente" (navbar)
- cliente.html → Visualiza como cliente

### Cliente acessar Painel Admin (se for admin)
- cliente.html → Clica "🛠️ Painel Admin" (navbar, apenas se role=admin)
- admin.html → Acessa painel administrativo

---

## Banco de Dados (Firebase Realtime Database)

### Estrutura de Nós

{
  "usuarios": {
    "{userId}": {
      "nome": "string",
      "nomeCompleto": "string",
      "email": "string",
      "telefone": "string",
      "whatsapp": "string",
      "role": "admin | cliente",
      "totalVisitas": number,
      "ultimaVisita": "ISOString | null",
      "criadoEm": "ISOString",
      "atualizadoEm": "ISOString"
    }
  },
  "agendamentos": {
    "{agendamentoId}": {
      "clienteId": "string",
      "clienteNome": "string",
      "clienteEmail": "string",
      "agendadoPor": "proprio | terceiro",
      "nomeOutraPessoa": "string | null",
      "profissionalId": "string",
      "profissionalNome": "string",
      "profissionalCargo": "string",
      "servicos": [
        {
          "id": "string",
          "nome": "string",
          "preco": number,
          "duracao": number
        }
      ],
      "produtos": [
        {
          "id": "string",
          "nome": "string",
          "preco": number,
          "quantidade": number
        }
      ],
      "dataHora": "ISOString (YYYY-MM-DDTHH:MM)",
      "duracaoTotal": number,
      "precoTotal": number,
      "observacoes": "string",
      "status": "pendente | confirmado | concluido | cancelado",
      "criadoEm": "ISOString",
      "atualizadoEm": "ISOString"
    }
  },
  "servicos": {
    "{servicoId}": {
      "nome": "string",
      "descricao": "string",
      "preco": number,
      "duracao": number,
      "icone": "string (emoji)",
      "ativo": boolean,
      "criadoEm": "ISOString",
      "atualizadoEm": "ISOString"
    }
  },
  "produtos": {
    "{produtoId}": {
      "nome": "string",
      "descricao": "string",
      "preco": number,
      "estoque": number,
      "codigo": "string",
      "categoria": "string",
      "ativo": boolean,
      "criadoEm": "ISOString",
      "atualizadoEm": "ISOString"
    }
  },
  "equipe": {
    "{membroId}": {
      "nome": "string",
      "cargo": "string",
      "bio": "string",
      "foto": "string (URL)",
      "curtidas": number,
      "curtidasUsuarios": {
        "{userId}": boolean
      },
      "criadoEm": "ISOString",
      "atualizadoEm": "ISOString"
    }
  },
  "chats": {
    "{agendamentoId}": {
      "{mensagemId}": {
        "userId": "string",
        "nome": "string",
        "texto": "string",
        "timestamp": number,
        "criadoEm": "ISOString"
      }
    }
  },
  "faturamento": {
    "receitas": {
      "{receitaId}": {
        "descricao": "string",
        "valor": number,
        "data": "ISOString",
        "tipo": "servico | produto",
        "agendamentoId": "string | null",
        "criadoEm": "ISOString"
      }
    },
    "despesas": {
      "{despesaId}": {
        "descricao": "string",
        "valor": number,
        "data": "ISOString",
        "categoria": "string",
        "recorrente": boolean,
        "diaVencimento": number,
        "criadoEm": "ISOString"
      }
    }
  },
  "configuracoes": {
    "horarios": {
      "abertura": number,
      "fechamento": number,
      "intervalo": number
    },
    "negocio": {
      "nome": "string",
      "endereco": "string",
      "telefone": "string",
      "email": "string",
      "cnpj": "string"
    }
  }
}

---

## Dependências Externas

### CDNs
- Tailwind CSS: https://cdn.tailwindcss.com
- Firebase App: https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js
- Firebase Auth: https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js
- Firebase Database: https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js

---

## Módulos JavaScript

### assets/toast.js
- **Classe:** ToastNotification
- **Métodos:** show(), success(), error(), warning(), info()
- **Uso global:** window.Toast

### assets/business-rules.js
- **Objeto:** BusinessRules
- **Módulos:** validation, format, schedule, appointment, user, messages
- **Uso global:** window.BusinessRules

### assets/correcoes.js
- **Funções auxiliares para:**
  - Chat (enviarMensagemCorrigida, listarMensagensCorrigidas)
  - Horários (verificarConflitosHorario, gerarHorariosDisponiveisCorrigidos)
  - Utilitários (alterarSenhaUsuario, formatarDataHora)

### assets/theme.js
- **Funções:** initTheme(), toggleTheme(), updateThemeIcon()
- **Gerencia:** Dark mode (localStorage + Tailwind classes)

### firebase/firebase-config.js
- **Inicializa:** Firebase App
- **Exporta:** firebase, auth, db

### firebase/services-config.js
- **Carrega:** Serviços do Firebase
- **Funções:** carregarServicosDoFirebase(), getTodosServicos(), getServicoPorId(), gerarSlotsHorario()

### firebase/database.js
- **Funções de banco:**
  - Agendamentos (CRUD completo)
  - Usuários (perfil, admin check)
  - Chat (mensagens, leitura)
  - Horários (disponibilidade)
  - Equipe (CRUD + curtidas)

### firebase/session-manager.js
- **Gerencia:** Sessão e autenticação
- **Listener:** onAuthStateChanged
- **Redireciona:** Baseado em role (admin/cliente)

---

## Permissões e Roles

### Cliente (role: 'cliente')
- ✅ Criar agendamentos
- ✅ Ver seus agendamentos (pendentes, histórico)
- ✅ Cancelar seus agendamentos pendentes
- ✅ Ver e editar seu perfil
- ✅ Ver equipe e curtir profissionais
- ✅ Enviar mensagens no chat dos seus agendamentos
- ❌ Acessar painel administrativo
- ❌ Ver dados de outros clientes
- ❌ Criar/editar serviços, produtos, equipe
- ❌ Ver faturamento

### Administrador (role: 'admin')
- ✅ Tudo que cliente pode fazer
- ✅ Acessar painel administrativo (admin.html)
- ✅ Ver e gerenciar TODOS os agendamentos
- ✅ Criar/editar/excluir clientes
- ✅ Criar/editar/excluir membros da equipe
- ✅ Criar/editar/excluir serviços
- ✅ Criar/editar/excluir produtos
- ✅ Ver e gerenciar faturamento
- ✅ Ver estatísticas completas
- ✅ Confirmar/concluir/cancelar qualquer agendamento
- ✅ Acessar todos os chats

---

## URLs e Endpoints

### Páginas
- Landing: /index.html ou /
- Login: /login.html
- Cadastro: /cadastro.html
- Cliente: /cliente.html
- Admin: /admin.html

### Firebase Endpoints
- Authentication: {authDomain}
- Realtime Database: {databaseURL}
- Storage (se ativado): {storageBucket}

### API REST (Firebase)
- Base: https://{projectId}.firebaseio.com/
- Agendamentos: /agendamentos.json
- Usuários: /usuarios.json
- Serviços: /servicos.json
- Equipe: /equipe.json
- etc.

---

## Responsividade (Breakpoints Tailwind)

- **sm:** 640px (smartphones landscape)
- **md:** 768px (tablets)
- **lg:** 1024px (laptops)
- **xl:** 1280px (desktops)
- **2xl:** 1536px (monitores grandes)

### Adaptações Mobile
- Navbar: Links ocultam texto, mantém ícones
- Tabs: Scroll horizontal (overflow-x-auto)
- Grids: 1 coluna → 2 colunas (md) → 3 colunas (lg)
- Modais: Largura total → max-width (md)
- Estatísticas: 2 colunas → 5 colunas (md)
- Botões: Padding reduzido
- Texto: Tamanhos menores
- Tabelas: Scroll horizontal

---

## Segurança

### Firebase Security Rules
- Leitura: Usuários autenticados
- Escrita: Baseada em role e ownership
- Validação: Campos obrigatórios, tipos, valores

### Autenticação
- Firebase Auth: Gerencia tokens e sessões
- onAuthStateChanged: Verifica estado de login
- Redirecionamento: Se não autenticado → login.html

### Senhas
- Mínimo 6 caracteres
- Hash automático (Firebase Auth)
- Recuperação por e-mail

---

## Performance

### Otimizações
- CDN: Tailwind e Firebase de CDNs públicos
- Listeners: Removidos quando não necessários
- Once vs On: once() para dados únicos
- Caching: LocalStorage para tema
- Lazy: Seções carregadas sob demanda

### Métricas Recomendadas
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s

---

## SEO (Search Engine Optimization)

### Meta Tags Recomendadas

```html
<meta name="description" content="Sistema de Agendamentos Online para salões, barbearias e clínicas">
<meta name="keywords" content="agendamento, online, salão, barbearia, clínica">
<meta name="author" content="Seu Nome">
<meta property="og:title" content="Sistema de Agendamentos">
<meta property="og:description" content="Agende seus serviços online">
<meta property="og:image" content="https://seusite.com/og-image.jpg">
<meta property="og:url" content="https://seusite.com">
<meta name="twitter:card" content="summary_large_image">
```

---

## Analytics e Monitoramento

### Google Analytics (recomendado)
```html
<!-- Global site tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Firebase Analytics (incluído)
- Já está configurado com Firebase SDK
- Eventos automáticos: page_view, login, signup
- Eventos customizados: adicionar manualmente

---

## Backup e Recuperação

### Backup Manual
1. Firebase Console → Realtime Database
2. Clique nos 3 pontinhos → "Exportar JSON"
3. Salve o arquivo em local seguro
4. Frequência recomendada: Diário

### Backup Automático (Cloud Functions)
```javascript
exports.backupDatabase = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    // Exportar dados
    // Salvar no Storage
  });
```

---

## Versionamento

- **Versão Atual:** 2.0.0
- **Sistema de Versionamento:** Semantic Versioning (SemVer)
  - Major: Mudanças incompatíveis
  - Minor: Novas funcionalidades compatíveis
  - Patch: Correções de bugs

---

## Contribuindo

### Como Contribuir
1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m "Adiciona nova funcionalidade"`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Guidelines
- Código comentado
- Testes (se aplicável)
- Documentação atualizada
- Seguir padrões existentes

---

## Licença

- **Tipo:** MIT License (ou especifique)
- **Uso:** Livre para uso pessoal e comercial
- **Atribuição:** Recomendada mas não obrigatória

---

## Contatos e Links

- **Repositório GitHub:** https://github.com/KayhamCristoffer/projeto-agendamentos.io
- **Issues:** https://github.com/KayhamCristoffer/projeto-agendamentos.io/issues
- **Discussions:** https://github.com/KayhamCristoffer/projeto-agendamentos.io/discussions
- **Documentação:** README.md, README-MELHORIAS.md, TUTORIAL.md

---

**Última Atualização:** 26/02/2026
**Versão do Sistema:** 2.0.0
**Desenvolvido com ❤️ usando Firebase, Tailwind CSS e JavaScript**
