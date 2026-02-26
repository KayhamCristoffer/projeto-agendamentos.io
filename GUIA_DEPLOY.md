# 🚀 GUIA DE DEPLOY - Sistema de Agendamentos

**Data:** 2026-02-26  
**Status:** Pronto para Deploy  
**Versão:** 2.1.0

---

## ✅ CORREÇÕES APLICADAS

### **1. Arquivo Faltando Corrigido** ✅
- ✅ Criado `firebase/session-manager.js` (4KB)
- ✅ Gerencia timeout de sessão (1 hora de inatividade)
- ✅ Monitora atividade do usuário
- ✅ Logout automático quando inativo

### **2. Arquivos Mortos Removidos** ✅
- ❌ Deletado `assets/cliente-app.js`
- ❌ Deletado `assets/main.js`
- ❌ Deletado `assets/menu.js`
- ❌ Deletado `assets/style.css`
- ❌ Deletado `assets/cliente-new.css`

### **3. Arquivos Adicionados** ✅
- ✅ `firebase-security-rules.json` - Regras de segurança
- ✅ `firebase-data-backup.json` - Backup dos dados
- ✅ `ANALISE_PROJETO.md` - Documentação da análise
- ✅ `GUIA_DEPLOY.md` - Este arquivo

---

## 📁 ESTRUTURA FINAL DO PROJETO

```
projeto-agendamentos.io/
├── 📄 HTML (5 arquivos)
│   ├── index.html         ← Landing page
│   ├── login.html         ← Login
│   ├── cadastro.html      ← Cadastro
│   ├── cliente.html       ← Painel cliente
│   └── admin.html         ← Painel admin
│
├── 📁 assets/ (4 JS)
│   ├── theme.js           ← Tema claro/escuro
│   ├── toast.js           ← Notificações
│   ├── business-rules.js  ← Regras de negócio
│   └── correcoes.js       ← Correções admin
│
├── 📁 firebase/ (4 JS)
│   ├── firebase-config.js    ← Configuração
│   ├── services-config.js    ← Serviços
│   ├── database.js           ← Funções DB
│   └── session-manager.js    ← Gerenciamento de sessão ✨ NOVO
│
├── 📁 img/ (2 imagens)
│   ├── kay.jpg
│   └── placeholder.svg
│
├── 📄 Documentação
│   ├── README.md
│   ├── ANALISE_PROJETO.md        ✨ NOVO
│   └── GUIA_DEPLOY.md            ✨ NOVO
│
└── 📄 Firebase
    ├── firebase-security-rules.json  ✨ NOVO
    └── firebase-data-backup.json     ✨ NOVO
```

---

## 🔥 PASSO 1: CONFIGURAR FIREBASE

### **A) Atualizar Security Rules**

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em: **Realtime Database** → **Rules**
4. Copie o conteúdo de `firebase-security-rules.json`
5. Cole no editor
6. Clique em **"Publish"**

### **B) Importar Dados**

1. No Firebase Console, vá em: **Realtime Database** → **Data**
2. Clique nos **3 pontinhos** (⋮) no topo direito
3. Selecione: **"Import JSON"**
4. Faça upload do arquivo: `firebase-data-backup.json`
5. Confirme a importação

⚠️ **ATENÇÃO:** Isso substituirá TODOS os dados existentes!

**Recomendação:** Fazer backup antes de importar.

---

## 🌐 PASSO 2: FAZER COMMIT E PUSH

```bash
# 1. Ver status
cd /home/user/webapp/projeto-agendamentos.io
git status

# 2. Adicionar todos os arquivos
git add -A

# 3. Commit
git commit -m "fix: Corrigir estrutura do projeto

✅ Correções:
- Criado firebase/session-manager.js (faltante)
- Removidos 5 arquivos não utilizados
- Adicionadas Firebase Security Rules
- Adicionado backup de dados do Firebase
- Criada documentação completa

❌ Removidos arquivos mortos:
- assets/cliente-app.js
- assets/main.js
- assets/menu.js
- assets/style.css
- assets/cliente-new.css

📄 Novos arquivos:
- firebase/session-manager.js
- firebase-security-rules.json
- firebase-data-backup.json
- ANALISE_PROJETO.md
- GUIA_DEPLOY.md

🎯 Status: Pronto para deploy"

# 4. Push para GitHub
git push origin main
```

---

## 🧪 PASSO 3: TESTAR LOCALMENTE

### **A) Iniciar Servidor Local**

```bash
cd /home/user/webapp/projeto-agendamentos.io

# Opção 1: Python
python3 -m http.server 8000

# Opção 2: Node.js
npx http-server -p 8000
```

### **B) Acessar no Navegador**

```
http://localhost:8000/index.html
```

### **C) Checklist de Testes**

- [ ] **index.html** carrega corretamente
- [ ] **login.html** abre ao clicar em "Entrar"
- [ ] **cadastro.html** abre ao clicar em "Criar Conta"
- [ ] Login funciona (redireciona para cliente.html ou admin.html)
- [ ] Cadastro funciona (cria usuário e redireciona)
- [ ] **Toast** aparece nas notificações
- [ ] **Tema** claro/escuro funciona
- [ ] **session-manager.js** carrega sem erro 404
- [ ] Console do navegador sem erros críticos

---

## 🚀 PASSO 4: DEPLOY EM PRODUÇÃO

### **Opção A: Firebase Hosting (Recomendado)**

```bash
# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar
firebase init hosting

# Configurações:
# - Public directory: . (raiz)
# - Single-page app: No
# - Automatic builds: No

# 4. Deploy
firebase deploy --only hosting
```

### **Opção B: GitHub Pages**

1. Repositório → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **(root)**
4. Salvar

Acesse: `https://kayhamcristoffer.github.io/projeto-agendamentos.io/`

### **Opção C: Vercel**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# Seguir instruções
```

### **Opção D: Netlify**

1. Acesse: https://app.netlify.com
2. Clique em: **"Add new site"** → **"Import an existing project"**
3. Conecte ao GitHub
4. Selecione o repositório
5. Deploy!

---

## 🔐 PASSO 5: CONFIGURAR DOMÍNIO (Opcional)

### **Firebase Hosting**

```bash
firebase hosting:channel:deploy production
```

### **GitHub Pages**

1. Settings → Pages → Custom domain
2. Digite: `seudominio.com`
3. Adicionar registros DNS:

```
Tipo: A
Nome: @
Valor: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
```

---

## 📊 VERIFICAÇÃO PÓS-DEPLOY

### **Checklist Final**

- [ ] Site acessível publicamente
- [ ] HTTPS ativo (🔒)
- [ ] Firebase conectado
- [ ] Login/Cadastro funcionando
- [ ] Dados carregando corretamente
- [ ] Sem erros no console
- [ ] Responsivo (mobile/desktop)
- [ ] Tema claro/escuro OK
- [ ] Notificações Toast OK

### **URLs para Testar**

```
https://seusite.com/              → Landing page
https://seusite.com/login.html    → Login
https://seusite.com/cadastro.html → Cadastro
https://seusite.com/cliente.html  → Cliente
https://seusite.com/admin.html    → Admin
```

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### **1. Erro 404 em session-manager.js**
**Solução:** Verificar se o arquivo foi commitado corretamente
```bash
git ls-files | grep session-manager
```

### **2. Firebase não conecta**
**Solução:** Verificar `firebase/firebase-config.js` com credenciais corretas

### **3. Dados não carregam**
**Solução:** 
- Verificar Firebase Security Rules publicadas
- Verificar se dados foram importados
- Verificar console do navegador

### **4. Login não funciona**
**Solução:**
- Verificar Email/Password habilitado no Firebase Authentication
- Verificar credenciais de teste

---

## 📞 SUPORTE

**Repositório:** https://github.com/KayhamCristoffer/projeto-agendamentos.io

**Documentação:**
- `README.md` - Visão geral
- `ANALISE_PROJETO.md` - Análise técnica
- `GUIA_DEPLOY.md` - Este arquivo

---

## ✅ STATUS FINAL

| Item | Status |
|------|--------|
| Arquivos mortos removidos | ✅ |
| session-manager.js criado | ✅ |
| Firebase Rules atualizadas | ⏳ Fazer no console |
| Dados importados | ⏳ Fazer no console |
| Commit realizado | ⏳ Pendente |
| Push para GitHub | ⏳ Pendente |
| Deploy | ⏳ Pendente |

---

**Próxima ação:** Fazer commit e push para GitHub! 🚀
