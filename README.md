# 📅 Sistema de Agendamentos Online

## 🎯 **Sobre o Projeto**

Sistema completo de gerenciamento de agendamentos desenvolvido para **salões de beleza**, **clínicas**, **consultórios** e **estabelecimentos de serviços** que precisam organizar horários, atender clientes e controlar seu negócio de forma profissional e automatizada.

Uma solução moderna, responsiva e intuitiva que elimina agendamentos em papel, planilhas desorganizadas e mensagens perdidas no WhatsApp, centralizando tudo em uma plataforma web acessível de qualquer dispositivo.

---

## 👥 **Público-Alvo**

### **Ideal para:**
- 💇 **Salões de Beleza** (cabeleireiros, manicures, esteticistas)
- 🏥 **Clínicas e Consultórios** (médicos, dentistas, fisioterapeutas)
- 💼 **Profissionais Autônomos** (personal trainers, advogados, psicólogos)
- 🏪 **Pequenas Empresas de Serviços** (oficinas, assistências técnicas)
- 🎓 **Centros de Ensino** (aulas particulares, cursos, treinamentos)
- 🐾 **Pet Shops e Veterinários** (banho, tosa, consultas)

### **Benefícios:**
✅ Reduz **cancelamentos de última hora** com histórico de visitas  
✅ Evita **conflitos de horário** com verificação automática  
✅ Melhora a **experiência do cliente** com agendamento online 24/7  
✅ Aumenta **eficiência operacional** com calendário visual  
✅ Facilita **gestão financeira** com relatórios de faturamento  

---

## 🚀 **Principais Funcionalidades**

### **👤 Para Clientes:**
- ✅ **Agendamento Online** – Escolha serviços, data e horário em tempo real
- ✅ **Histórico de Agendamentos** – Veja agendamentos passados e futuros
- ✅ **Chat em Tempo Real** – Converse diretamente com o estabelecimento
- ✅ **Perfil Personalizável** – Atualize dados pessoais a qualquer momento
- ✅ **Notificações** – Receba confirmações e lembretes de horários
- ✅ **Dark Mode** – Interface adaptável para conforto visual

### **🛠️ Para Administradores:**
- 📊 **Dashboard Completo** – Visão geral de agendamentos, receitas e estatísticas
- 📅 **Calendário Visual** – Veja todos os agendamentos do mês em um clique
- 👥 **Gestão de Clientes** – Cadastro, edição, histórico e total de visitas
- 💼 **Gestão de Equipe** – Adicione profissionais e atribua agendamentos
- 💰 **Controle Financeiro** – Faturamento mensal, despesas e lucro líquido
- 🛍️ **Catálogo de Serviços/Produtos** – Gerencie preços, duração e estoque
- 💬 **Chat Integrado** – Responda dúvidas de clientes em tempo real
- 📈 **Relatórios** – Exportação de dados para análise

---

## 🔧 **Tecnologias Utilizadas**

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Framework CSS:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **Backend/Database:** [Firebase](https://firebase.google.com/)
  - Firebase Authentication (autenticação de usuários)
  - Firebase Realtime Database (armazenamento de dados em tempo real)
- **Hospedagem:** Compatível com GitHub Pages, Netlify, Vercel, Firebase Hosting

---

## 📂 **Estrutura do Projeto**

```
projeto-agendamentos.io/
├── index.html              # Landing page inicial
├── login.html              # Login e cadastro de usuários
├── cliente.html            # Área do cliente (agendamentos, perfil, chat)
├── admin.html              # Painel administrativo completo
├── firebase/
│   ├── firebase-config.js  # Configuração do Firebase
│   ├── database.js         # Funções do banco de dados
│   └── services-config.js  # Configurações de serviços
├── assets/
│   ├── theme.js            # Sistema de tema claro/escuro
│   └── style.css           # Estilos personalizados
└── README.md               # Este arquivo
```

---

## 🎨 **Recursos Visuais**

- **Design Responsivo** – Funciona perfeitamente em desktop, tablet e smartphone
- **Dark Mode** – Alternância entre tema claro e escuro
- **Interface Intuitiva** – Navegação simples e amigável
- **Feedback Visual** – Animações e transições suaves
- **Acessibilidade** – Cores contrastantes e textos legíveis

---

## 🔐 **Segurança e Privacidade**

- ✅ Autenticação segura via Firebase Authentication
- ✅ Senhas criptografadas automaticamente
- ✅ Controle de acesso por perfis (admin/cliente)
- ✅ Dados armazenados em servidor Firebase (Google Cloud)
- ✅ Conexão HTTPS obrigatória em produção

---

## 🌍 **Adaptação para Outros Setores**

Este sistema pode ser facilmente adaptado para diferentes nichos de mercado:

### **🏥 Clínicas e Consultórios**
- Renomear "Serviços" para "Consultas" ou "Procedimentos"
- Adicionar campo de "Convênio Médico"
- Incluir upload de exames/documentos

### **🎓 Centros Educacionais**
- Renomear para "Aulas" ou "Treinamentos"
- Adicionar campo de "Disciplina" ou "Curso"
- Incluir material didático anexado

### **🏪 Oficinas e Assistências Técnicas**
- Renomear para "Ordens de Serviço"
- Adicionar campo de "Equipamento" e "Defeito"
- Incluir status de reparo

### **🐾 Pet Shops**
- Adicionar campo de "Nome do Pet" e "Raça"
- Incluir histórico de vacinas
- Adicionar fotos do pet

### **Como Adaptar:**
1. Edite os textos nos arquivos HTML (busque por "Agendamento", "Serviço", etc)
2. Personalize os ícones (emojis podem ser substituídos facilmente)
3. Ajuste os campos do formulário conforme sua necessidade
4. Atualize as cores no Tailwind CSS (edite `tailwind.config`)

---

## 📋 **Pré-requisitos**

1. **Conta no Firebase** (gratuita)
2. **Navegador moderno** (Chrome, Firefox, Edge, Safari)
3. **Conexão com internet** (para acessar CDNs e Firebase)

---

## ⚙️ **Instalação e Configuração**

### **1. Clonar o Repositório**
```bash
git clone https://github.com/KayhamCristoffer/projeto-agendamentos.io.git
cd projeto-agendamentos.io
```

### **2. Configurar Firebase**
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative **Authentication** (método Email/Password)
4. Ative **Realtime Database** (modo teste ou regras personalizadas)
5. Copie as credenciais do projeto
6. Edite o arquivo `firebase/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO.firebaseio.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};
```

### **3. Importar Estrutura de Dados**
1. No Firebase Console, vá em **Realtime Database**
2. Importe o arquivo `firebase-update-structure.json` (fornecido no projeto)
3. Ou crie manualmente os nós: `usuarios`, `agendamentos`, `servicos`, `produtos`, `equipe`, `faturamento`, `chats`

### **4. Testar Localmente**
```bash
# Usar qualquer servidor HTTP local
python -m http.server 8000
# Ou
npx http-server
```
Acesse `http://localhost:8000`

### **5. Deploy (Produção)**

**Opção 1: Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**Opção 2: GitHub Pages**
1. Faça push do código para GitHub
2. Vá em Settings → Pages
3. Selecione a branch `main` e a pasta `/root`
4. Seu site estará em `https://SEU_USUARIO.github.io/projeto-agendamentos.io`

**Opção 3: Netlify/Vercel**
1. Conecte seu repositório GitHub
2. Deploy automático a cada commit

---

## 📖 **Como Usar**

### **Primeiro Acesso:**
1. Abra `login.html`
2. Clique em **"Cadastre-se"**
3. Preencha os dados (nome, email, telefone, senha)
4. Faça login com suas credenciais

### **Como Cliente:**
1. Acesse `cliente.html` após login
2. Escolha serviços desejados
3. Selecione data e horário disponível
4. Confirme o agendamento
5. Acompanhe seus agendamentos nas abas **Pendentes** e **Histórico**

### **Como Administrador:**
1. Acesse `admin.html` após login (necessário perfil admin no Firebase)
2. Visualize dashboard com estatísticas
3. Gerencie clientes, serviços, produtos e equipe
4. Confirme/cancele agendamentos
5. Controle financeiro na aba **Faturamento**

---

## 🤝 **Contribuindo**

Contribuições são bem-vindas! Para contribuir:

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

---

## 📄 **Licença**

Este projeto é open-source e está disponível sob a licença MIT. Você é livre para usar, modificar e distribuir conforme necessário.

---

## 📧 **Contato e Suporte**

- **Repositório:** [GitHub - projeto-agendamentos.io](https://github.com/KayhamCristoffer/projeto-agendamentos.io)
- **Issues:** Reporte bugs e sugira melhorias na aba Issues do GitHub
- **Documentação Completa:** Consulte os arquivos `.md` na raiz do projeto

---

## 🎉 **Agradecimentos**

Desenvolvido com ❤️ para ajudar pequenos e médios empreendedores a digitalizarem seus negócios de forma acessível e profissional.

---

**⭐ Se este projeto foi útil para você, deixe uma estrela no GitHub!**
