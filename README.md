# 📅 Sistema de Agendamentos Online

![Status](https://img.shields.io/badge/status-ativo-success)
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-orange)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📋 Sobre o Projeto

Sistema de agendamentos online desenvolvido para pequenos negócios locais que necessitam de presença digital sem custos elevados com desenvolvimento personalizado. Este projeto foi criado como parte do desafio de **Personalização e Integração Web**, combinando ferramentas low-code com customizações em HTML, CSS e JavaScript.

### 🎯 Objetivo

Permitir que pequenos empreendedores gerenciem agendamentos de serviços de forma simples, intuitiva e acessível, utilizando tecnologias web modernas e Firebase como backend.

### 👥 Público-Alvo

- Salões de beleza
- Barbearias
- Clínicas e consultórios
- Profissionais autônomos
- Pequenos negócios de serviços

## ✨ Funcionalidades

### 🔐 Autenticação de Usuários
- ✅ Criação de conta com e-mail e senha
- ✅ Login seguro via Firebase Authentication
- ✅ Gerenciamento de sessão de usuário

### 📆 Sistema de Agendamentos
- ✅ Formulário intuitivo para agendamento
- ✅ Seleção de data e horário
- ✅ Especificação do serviço desejado
- ✅ Armazenamento em tempo real no Firebase

### 🛠️ Painel Administrativo
- ✅ Visualização de todos os agendamentos
- ✅ Carregamento dinâmico dos dados
- ✅ Interface responsiva e acessível

## 🚀 Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilização moderna e responsiva
- **JavaScript (ES6+)**: Lógica de interação e integração

### Backend & Database
- **Firebase Realtime Database**: Armazenamento de dados em tempo real
- **Firebase Authentication**: Autenticação segura de usuários

### Padrões Web Aplicados
- ✅ **Responsividade**: Design adaptável a diferentes dispositivos
- ✅ **Acessibilidade**: Seguindo diretrizes WCAG
- ✅ **Performance**: Otimização de carregamento
- ✅ **Segurança**: Autenticação e validação de dados

## 📁 Estrutura do Projeto

```
projeto-agendamentos.io/
├── index.html              # Página inicial com navegação
├── login.html              # Página de autenticação
├── agendar.html           # Formulário de agendamento
├── admin.html             # Painel administrativo
├── assets/
│   └── style.css          # Estilos personalizados
├── firebase/
│   ├── firebase-config.js # Configuração do Firebase
│   └── database.js        # Funções de banco de dados
├── docs/
│   ├── DOCUMENTATION.md   # Documentação técnica
│   └── RELATORIO.md       # Relatório do projeto (Parte Teórica)
└── README.md              # Este arquivo
```

## 🔧 Como Usar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para Firebase)

### Instalação e Execução

1. **Clone o repositório**
```bash
git clone https://github.com/KayhamCristoffer/projeto-agendamentos.io.git
cd projeto-agendamentos.io
```

2. **Abra o projeto**
   - Abra o arquivo `index.html` no navegador
   - Ou utilize um servidor local:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server -p 8000
   ```

3. **Acesse no navegador**
   ```
   http://localhost:8000
   ```

### Configuração do Firebase

Para usar este projeto com seu próprio Firebase:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o **Authentication** (método Email/Senha)
3. Ative o **Realtime Database**
4. Copie as credenciais do seu projeto
5. Substitua em `firebase/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

## 🎨 Customizações Implementadas

### HTML Personalizado
- Estrutura semântica com tags apropriadas
- Atributos ARIA para acessibilidade
- Meta tags para SEO e responsividade

### CSS Customizado
- Design moderno e minimalista
- Sistema de cores consistente
- Animações e transições suaves
- Media queries para responsividade
- Flexbox e Grid Layout

### JavaScript Integrado
- Validação de formulários
- Integração com Firebase SDK
- Manipulação do DOM
- Gestão de estados de autenticação
- Feedback visual para usuário

## 📱 Responsividade

O sistema foi desenvolvido com abordagem **Mobile First**, garantindo experiência otimizada em:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## ♿ Acessibilidade

Seguindo as diretrizes **WCAG 2.1 Nível AA**:
- ✅ Contraste adequado de cores
- ✅ Navegaç��o por teclado
- ✅ Labels descritivos em formulários
- ✅ Mensagens de erro claras
- ✅ Estrutura semântica HTML5

## 🔒 Segurança

- 🔐 Autenticação via Firebase Auth
- 🔐 Validação de dados no frontend
- 🔐 Regras de segurança no Firebase
- 🔐 HTTPS para comunicação segura

## 📊 Regras do Firebase Database

Configure as seguintes regras no Firebase Realtime Database:

```json
{
  "rules": {
    "agendamentos": {
      ".read": true,
      ".write": true
    }
  }
}
```

**Nota**: Para produção, implemente regras mais restritivas baseadas em autenticação.

## 🎥 Demonstração

### Screenshots

*Em breve: screenshots das principais telas do sistema*

### Vídeo Pitch

*Link do vídeo demonstrativo será adicionado aqui*

## 📚 Documentação Adicional

- 📖 [Documentação Técnica](docs/DOCUMENTATION.md) - Detalhes de implementação
- 📝 [Relatório do Projeto](docs/RELATORIO.md) - Parte teórica e análise

## 🎓 Aprendizados

Este projeto permitiu explorar:
- Integração de APIs externas (Firebase)
- Padrões web fundamentais (HTML, CSS, JS)
- Autenticação e autorização
- Banco de dados em tempo real
- Boas práticas de desenvolvimento frontend
- Acessibilidade e responsividade
- Ética digital e privacidade

## 🚧 Melhorias Futuras

- [ ] Notificações por e-mail
- [ ] Sistema de cancelamento de agendamentos
- [ ] Calendário visual interativo
- [ ] Painel de métricas e relatórios
- [ ] Integração com Google Calendar
- [ ] Modo escuro (Dark mode)
- [ ] PWA (Progressive Web App)
- [ ] Múltiplos idiomas

## 👨‍💻 Autor

**Kayham Cristoffer**

- GitHub: [@KayhamCristoffer](https://github.com/KayhamCristoffer)
- Projeto: [projeto-agendamentos.io](https://github.com/KayhamCristoffer/projeto-agendamentos.io)

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do desafio de **Personalização e Integração Web**.

---

## 🆘 Suporte

Encontrou algum problema ou tem sugestões?
- Abra uma [issue](https://github.com/KayhamCristoffer/projeto-agendamentos.io/issues)
- Entre em contato pelo GitHub

---

**Desenvolvido com 💙 para pequenos negócios locais**
