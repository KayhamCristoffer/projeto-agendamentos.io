# 🎓 TUTORIAL COMPLETO - SISTEMA DE AGENDAMENTOS ONLINE

## 📋 ÍNDICE

1. [Introdução](#introdução)
2. [Instalação e Configuração](#instalação-e-configuração)
3. [Primeiro Acesso](#primeiro-acesso)
4. [Fluxo do Cliente](#fluxo-do-cliente)
5. [Fluxo do Administrador](#fluxo-do-administrador)
6. [Funcionalidades Avançadas](#funcionalidades-avançadas)
7. [Personalização](#personalização)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## 1. INTRODUÇÃO

### O que é este sistema?

O **Sistema de Agendamentos Online** é uma plataforma web completa para gerenciar agendamentos de serviços. Ideal para:
- Salões de beleza
- Barbearias
- Clínicas
- Consultórios
- Espaços de coworking
- Qualquer negócio que precise agendar serviços

### Principais recursos:
- ✅ Agendamento online 24/7
- 👥 Gerenciamento de equipe
- ✂️ Cadastro de serviços ilimitados
- 🛍️ Ponto de vendas (produtos)
- 💰 Controle financeiro
- 📊 Relatórios e estatísticas
- 🌓 Modo claro/escuro
- 📱 100% responsivo (mobile/tablet/desktop)

---

## 2. INSTALAÇÃO E CONFIGURAÇÃO

### 2.1 Requisitos

**Mínimo:**
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet
- Conta no Firebase (gratuita)

**Recomendado:**
- Domínio próprio
- Certificado SSL (HTTPS)
- Firebase Blaze Plan (para funcionalidades avançadas)

### 2.2 Configuração do Firebase

#### Passo 1: Criar projeto no Firebase

1. Acesse https://console.firebase.google.com/
2. Clique em "Adicionar projeto"
3. Nome do projeto: "Sistema Agendamentos" (ou nome desejado)
4. Aceite os termos
5. Desabilite Google Analytics (opcional)
6. Clique em "Criar projeto"

#### Passo 2: Ativar Autenticação

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Em "Sign-in method", habilite "E-mail/senha"
4. Salvar

#### Passo 3: Ativar Realtime Database

1. No menu lateral, clique em "Realtime Database"
2. Clique em "Criar banco de dados"
3. Localização: sua região (ex: us-central1)
4. Regras: "Modo bloqueado" (vamos configurar depois)
5. Habilitar

#### Passo 4: Obter credenciais

1. Clique no ícone de engrenagem (⚙️) → "Configurações do projeto"
2. Role até "Seus aplicativos"
3. Clique no ícone `</>` (Web)
4. Apelido do app: "Web App"
5. **NÃO marque** Firebase Hosting por enquanto
6. Clique em "Registrar app"
7. Copie o objeto `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://SEU_PROJECT_ID.firebaseio.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

#### Passo 5: Atualizar arquivo de configuração

1. Abra o arquivo `firebase/firebase-config.js`
2. Substitua o `firebaseConfig` pelo seu:

```javascript
// ============================================
// Configuração do Firebase
// Sistema de Agendamentos Online
// ============================================

const firebaseConfig = {
  apiKey: "COLE_SUA_API_KEY_AQUI",
  authDomain: "COLE_SEU_AUTH_DOMAIN_AQUI",
  databaseURL: "COLE_SEU_DATABASE_URL_AQUI",
  projectId: "COLE_SEU_PROJECT_ID_AQUI",
  storageBucket: "COLE_SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "COLE_SEU_SENDER_ID_AQUI",
  appId: "COLE_SEU_APP_ID_AQUI"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referências
const auth = firebase.auth();
const db = firebase.database();

// Exportar para uso global
window.firebase = firebase;
window.auth = auth;
window.db = db;

console.log('✅ Firebase inicializado com sucesso!');
```

3. Salve o arquivo

#### Passo 6: Configurar Security Rules

1. No Firebase Console, vá em "Realtime Database"
2. Clique na aba "Regras"
3. Copie o conteúdo do arquivo `firebase-security-rules.json` do projeto
4. Cole no editor de regras
5. Clique em "Publicar"

#### Passo 7: Criar primeiro usuário admin

1. No Firebase Console, vá em "Authentication"
2. Clique em "Adicionar usuário"
3. Email: seu-email@exemplo.com
4. Senha: sua-senha-segura
5. Clique em "Adicionar usuário"
6. **Copie o UID** do usuário criado
7. Vá em "Realtime Database"
8. Clique em "+" para adicionar dados
9. Estrutura:

```json
{
  "usuarios": {
    "UID_COPIADO_AQUI": {
      "nome": "Seu Nome",
      "nomeCompleto": "Seu Nome Completo",
      "email": "seu-email@exemplo.com",
      "telefone": "(11) 98765-4321",
      "whatsapp": "(11) 98765-4321",
      "role": "admin",
      "totalVisitas": 0,
      "ultimaVisita": null,
      "criadoEm": "2026-02-26T10:00:00.000Z",
      "atualizadoEm": "2026-02-26T10:00:00.000Z"
    }
  }
}
```

10. Clique em "Adicionar"

#### Passo 8: Testar configuração

1. Abra o arquivo `index.html` no navegador
2. Clique em "Entrar"
3. Faça login com o email e senha do admin
4. Você deve ser redirecionado para `admin.html`
5. Se funcionou, parabéns! 🎉

---

## 3. PRIMEIRO ACESSO

### 3.1 Configuração Inicial (Admin)

Após fazer login como admin pela primeira vez:

#### 1. Cadastrar Equipe

1. Vá na aba "👥 Equipe"
2. Clique em "➕ Adicionar Membro"
3. Preencha:
   - **Nome:** João Silva
   - **Cargo:** Barbeiro
   - **Biografia:** Especialista em cortes masculinos
   - **Foto (URL):** https://exemplo.com/foto.jpg (opcional)
4. Clique em "Adicionar"
5. Repita para todos os membros da equipe

#### 2. Cadastrar Serviços

1. Vá na aba "✂️ Serviços"
2. Clique em "➕ Adicionar"
3. Preencha:
   - **Nome:** Corte de Cabelo Masculino
   - **Descrição:** Corte profissional com acabamento
   - **Preço:** 40.00
   - **Duração (min):** 60
   - **Ícone:** ✂️
   - **Ativo:** ✅ Sim
4. Clique em "Salvar"
5. Adicione mais serviços:
   - Barba (R$ 25, 30min)
   - Corte + Barba (R$ 60, 90min)
   - Hidratação (R$ 35, 45min)

#### 3. Cadastrar Produtos (opcional)

1. Vá na aba "🛍️ Ponto de Vendas"
2. Clique em "➕ Adicionar"
3. Preencha:
   - **Nome:** Pomada Modeladora
   - **Descrição:** Fixação forte, efeito natural
   - **Preço:** 35.00
   - **Estoque:** 20
   - **Código:** POM001
   - **Ativo:** ✅ Sim
4. Clique em "Salvar"

#### 4. Configurar Horários de Funcionamento

Atualmente os horários são fixos no código:
- **Abertura:** 8:00
- **Fechamento:** 19:00
- **Intervalo de agendamento:** 30 minutos

Para alterar, edite `assets/business-rules.js`:

```javascript
schedule: {
  openTime: 9,   // 9:00 (abrir mais tarde)
  closeTime: 20, // 20:00 (fechar mais tarde)
  interval: 15,  // 15 minutos (mais slots)
  // ...
}
```

---

## 4. FLUXO DO CLIENTE

### 4.1 Criar Conta

1. Acesse `cadastro.html`
2. Preencha o formulário:
   - **Nome Completo:** Maria Oliveira
   - **Telefone/WhatsApp:** (11) 91234-5678
   - **E-mail:** maria@email.com
   - **Senha:** SenhaSegura123
   - **Confirmar Senha:** SenhaSegura123
3. Clique em "Criar Conta"
4. Aguarde toast de sucesso ✅
5. Será redirecionado automaticamente para `cliente.html`

### 4.2 Fazer Login

1. Acesse `login.html`
2. Digite seu e-mail e senha
3. Clique em "Entrar"
4. Será redirecionado para `cliente.html`

### 4.3 Criar Agendamento

#### Passo 1: Selecionar Profissional

1. Na aba "📅 Agendar Novo"
2. Em "Para quem é o agendamento?"
   - Selecione "Para mim" (agendamento para você)
   - OU "Para outra pessoa" (digite o nome da pessoa)
3. Em "Selecione o Profissional" **(obrigatório)**
   - Escolha o profissional desejado no dropdown
   - Ex: João Silva - Barbeiro

#### Passo 2: Selecionar Serviços

1. No grid de serviços, clique nos cards desejados
2. Serviços selecionados ficam com borda azul
3. O **Resumo** aparece abaixo mostrando:
   - Lista de serviços selecionados
   - **Preço Total:** R$ XXX,XX
   - **Duração Total:** Xh YYmin

#### Passo 3: Escolher Data e Horário

1. Após selecionar pelo menos 1 serviço, a seção de data/horário é liberada
2. Clique no campo "Data"
3. Selecione uma data no calendário
4. Aguarde carregar os horários disponíveis
5. Clique em um horário disponível (verde)
6. Horário selecionado fica com borda azul

#### Passo 4: Adicionar Observações (opcional)

1. Role até "Observações"
2. Digite qualquer informação adicional
3. Ex: "Prefiro corte mais curto nas laterais"

#### Passo 5: Finalizar Agendamento

1. Clique no botão "Agendar"
2. Sistema valida:
   - ✅ Profissional selecionado
   - ✅ Pelo menos 1 serviço selecionado
   - ✅ Data selecionada
   - ✅ Horário selecionado
   - ✅ Se for terceiro, nome preenchido
3. Aguarde toast de sucesso ✅
4. Formulário é resetado
5. Você é redirecionado para a aba "⏳ Pendentes"
6. Veja seu agendamento na lista

### 4.4 Visualizar Agendamentos

#### Aba "⏳ Pendentes":
- Mostra todos os agendamentos com status "pendente"
- Cards com:
  - Data e hora
  - Profissional
  - Serviços
  - Preço total
  - Duração
  - Botão "Cancelar"

#### Aba "✅ Histórico":
- Mostra todos os agendamentos (confirmados, concluídos, cancelados)
- Mesmo layout dos pendentes
- Badges de status coloridos:
  - 🟡 Pendente (amarelo)
  - 🔵 Confirmado (azul)
  - 🟢 Concluído (verde)
  - 🔴 Cancelado (vermelho)

### 4.5 Cancelar Agendamento

1. Na aba "⏳ Pendentes"
2. Localize o agendamento
3. Clique em "Cancelar"
4. Confirme a ação no popup
5. Aguarde toast de sucesso ✅
6. Agendamento move para "Histórico" com status "Cancelado"

### 4.6 Ver Perfil

1. Clique na aba "👤 Perfil"
2. Veja suas informações:
   - Nome completo
   - E-mail
   - Telefone/WhatsApp
   - Total de visitas
   - Última visita
3. Clique em "Editar Perfil" para alterar dados
4. Salve e aguarde toast de sucesso ✅

### 4.7 Conhecer a Equipe

1. Clique na aba "👥 Equipe"
2. Veja cards de todos os profissionais
3. Cada card mostra:
   - Foto
   - Nome
   - Cargo
   - Biografia
   - Total de curtidas
4. Clique em "❤️ Curtir" para curtir um profissional
5. Clique novamente para descurtir

---

## 5. FLUXO DO ADMINISTRADOR

### 5.1 Fazer Login como Admin

1. Acesse `login.html`
2. Digite e-mail e senha do admin
3. Será redirecionado para `admin.html`
4. Verá o nome no topo: "Olá, Admin"

### 5.2 Dashboard (Estatísticas)

No topo da página, veja 5 cards coloridos:
- **Total:** Total de agendamentos
- **Pendentes:** Aguardando confirmação (amarelo)
- **Confirmados:** Confirmados pelo admin (azul)
- **Concluídos:** Serviços realizados (verde)
- **Cancelados:** Cancelados (vermelho)

### 5.3 Gerenciar Calendário

#### Aba "📅 Calendário":
1. Navegue entre meses com "◀ Mês Anterior" e "Mês Seguinte ▶"
2. Veja todos os agendamentos do mês
3. Cards agrupados por data
4. Cada card mostra:
   - Horário
   - Cliente
   - Profissional
   - Serviços
   - Status (badge colorido)
5. Clique em "Ver Detalhes" para abrir modal com:
   - Todas as informações
   - Chat com o cliente
   - Botões de ação (Confirmar, Cancelar, Concluir)

#### Criar Novo Agendamento:
1. Clique no botão verde "➕ Novo Agendamento" (topo da página)
2. Preencha modal:
   - Cliente (dropdown ou "Novo cliente")
   - Profissional
   - Serviços
   - Data
   - Horário
   - Observações
3. Clique em "Agendar"
4. Aguarde toast de sucesso ✅

### 5.4 Gerenciar Clientes

#### Aba "👥 Clientes":

**Listar Clientes:**
- Veja cards de todos os clientes cadastrados
- Cada card mostra:
  - Nome completo
  - E-mail
  - Telefone/WhatsApp
  - Total de visitas
  - Última visita
  - Data de cadastro
  - Botões: Editar | Excluir

**Adicionar Cliente:**
1. Clique em "➕ Adicionar Cliente"
2. Preencha modal:
   - Nome completo
   - E-mail
   - Telefone/WhatsApp
   - Senha inicial
3. Clique em "Criar Cliente"
4. Aguarde toast de sucesso ✅
5. Cliente recebe credenciais por e-mail (implementar)
6. **Atenção:** Sua sessão de admin é mantida

**Editar Cliente:**
1. Clique em "Editar" no card do cliente
2. Modifique os campos desejados
3. Clique em "Salvar"
4. Aguarde toast de sucesso ✅

**Excluir Cliente:**
1. Clique em "Excluir" no card do cliente
2. Confirme a ação (⚠️ **ação irreversível!**)
3. Aguarde toast de sucesso ✅
4. Cliente é removido do banco de dados
5. **Nota:** Agendamentos do cliente também são removidos

### 5.5 Gerenciar Equipe

#### Aba "👥 Equipe":

**Listar Membros:**
- Veja cards de todos os profissionais
- Cada card mostra:
  - Foto
  - Nome
  - Cargo
  - Biografia
  - Total de curtidas
  - Botões: Editar | Excluir

**Adicionar Membro:**
1. Clique em "➕ Adicionar Membro"
2. Preencha modal:
   - Nome
   - Cargo
   - Biografia
   - URL da foto (opcional)
3. Clique em "Adicionar"
4. Aguarde toast de sucesso ✅

**Editar Membro:**
1. Clique em "Editar"
2. Modifique os campos
3. Salve
4. Aguarde toast de sucesso ✅

**Excluir Membro:**
1. Clique em "Excluir"
2. Confirme
3. Aguarde toast de sucesso ✅

### 5.6 Gerenciar Serviços

#### Aba "✂️ Serviços":

**Listar Serviços:**
- Grid responsivo (1/2/3 colunas)
- Cards mostram:
  - Ícone + Nome
  - Descrição
  - Preço (formatado)
  - Duração
  - Status (Ativo/Inativo)
  - Botões: Editar | Excluir

**Adicionar Serviço:**
1. Clique em "➕ Adicionar"
2. Preencha:
   - Nome
   - Descrição
   - Preço (apenas números, ex: 40.00)
   - Duração em minutos (ex: 60)
   - Ícone (emoji, ex: ✂️)
   - Ativo: Sim/Não
3. Clique em "Salvar"
4. Aguarde toast de sucesso ✅

**Editar Serviço:**
1. Clique em "Editar"
2. Modifique
3. Salve
4. Aguarde toast ✅

**Excluir Serviço:**
1. Clique em "Excluir"
2. Confirme
3. Aguarde toast ✅
4. **Atenção:** Serviços não podem ser excluídos se houver agendamentos futuros usando-os

### 5.7 Gerenciar Produtos (Ponto de Vendas)

#### Aba "🛍️ Ponto de Vendas":

**Listar Produtos:**
- Grid responsivo
- Cards mostram:
  - Nome
  - Descrição
  - Preço
  - Estoque
  - Código
  - Status
  - Botões: Editar | Excluir

**Adicionar Produto:**
1. Clique em "➕ Adicionar"
2. Preencha:
   - Nome
   - Descrição
   - Preço
   - Estoque inicial
   - Código (SKU)
   - Categoria (opcional)
   - Ativo: Sim/Não
3. Salve
4. Aguarde toast ✅

**Editar Produto:**
- Mesmo fluxo de serviços

**Vender Produto:**
1. Clique em "Vender" no card
2. Digite quantidade
3. Confirme
4. Estoque é atualizado automaticamente
5. Transação registrada em Faturamento

### 5.8 Faturamento

#### Aba "💰 Faturamento":

**Resumo Mensal:**
- 3 cards no topo:
  - **Receitas:** Total de vendas (verde)
  - **Despesas:** Total de gastos (vermelho)
  - **Lucro:** Receitas - Despesas (azul)

**Extrato:**
- Tabela com todas as transações
- Colunas:
  - Data
  - Descrição
  - Tipo (Receita/Despesa)
  - Valor

**Adicionar Despesa:**
1. Clique em "➕ Nova Despesa"
2. Preencha:
   - Descrição (ex: "Aluguel")
   - Valor (ex: 2000.00)
   - Data
   - Categoria (opcional)
   - Recorrente: Sim/Não
3. Salve
4. Aguarde toast ✅
5. Despesa aparece no extrato

**Despesas Recorrentes:**
1. Clique em "⚙️ Despesas Recorrentes"
2. Veja lista de despesas que se repetem mensalmente
3. Adicione nova:
   - Descrição
   - Valor
   - Dia do vencimento (1-31)
   - Categoria
4. Sistema cria automaticamente todo mês

### 5.9 Gerenciar Agendamentos Pendentes

#### Aba "⏳ Pendentes":

**Listar Pendentes:**
- Cards de todos os agendamentos com status "pendente"
- Ordenados por data/hora

**Ações:**

**Confirmar Agendamento:**
1. Clique em "✅ Confirmar"
2. Confirme a ação
3. Status muda para "confirmado"
4. Cliente recebe notificação (implementar)
5. Aguarde toast ✅

**Cancelar Agendamento:**
1. Clique em "❌ Cancelar"
2. Digite motivo (opcional)
3. Confirme
4. Status muda para "cancelado"
5. Cliente recebe notificação (implementar)
6. Aguarde toast ✅

**Editar Agendamento:**
1. Clique em "Editar"
2. Modifique data, hora, serviços, etc.
3. Salve
4. Aguarde toast ✅

**Abrir Chat:**
1. Clique em "💬 Chat"
2. Janela de chat abre
3. Digite mensagem
4. Enter para enviar
5. Mensagens aparecem em tempo real
6. Cliente vê no app dele

### 5.10 Gerenciar Agendamentos Confirmados

#### Aba "✅ Confirmados":

**Listar Confirmados:**
- Agendamentos confirmados, aguardando conclusão
- Mesmo layout dos pendentes

**Ações:**

**Concluir Agendamento:**
1. Clique em "✓ Concluir"
2. Opcional: adicione observações finais
3. Confirme
4. Status muda para "concluído"
5. Total de visitas do cliente é incrementado
6. Última visita é atualizada
7. Receita é registrada em Faturamento
8. Aguarde toast ✅

**Cancelar (com penalidade):**
- Mesmo fluxo de cancelamento
- Motivo obrigatório
- Possível cobrança de taxa (implementar)

---

## 6. FUNCIONALIDADES AVANÇADAS

### 6.1 Sistema de Chat

#### Como Cliente:
1. Em um agendamento pendente/confirmado
2. Clique em "💬 Chat"
3. Digite mensagem
4. Enter para enviar
5. Admin recebe em tempo real
6. Notificação de mensagens não lidas (implementar)

#### Como Admin:
1. Na lista de agendamentos
2. Clique em "💬 Chat" no card
3. Veja todo o histórico
4. Responda mensagens
5. Cliente recebe em tempo real

### 6.2 Tema Claro/Escuro

**Alterar Tema:**
1. Clique no botão de tema (🌙 / ☀️) na navbar
2. Tema alterna instantaneamente
3. Preferência é salva no navegador
4. Persiste entre sessões

**Características:**
- Todos os elementos adaptam cores
- Contraste adequado (WCAG AA)
- Transições suaves
- Ícone muda (lua → sol)

### 6.3 Notificações Toast

**Tipos:**
- ✅ **Success (Verde):** Ações bem-sucedidas
- ❌ **Error (Vermelho):** Erros e falhas
- ⚠️ **Warning (Amarelo):** Avisos importantes
- ℹ️ **Info (Azul):** Informações gerais

**Características:**
- Aparecem no canto superior direito
- Animação slide-in
- Auto-remove após 4 segundos
- Botão "✕" para fechar manualmente
- Múltiplos toasts empilham
- Responsivo (mobile: largura total)

### 6.4 Validações em Tempo Real

**Campos com Validação:**

**E-mail:**
- Formato válido: `exemplo@dominio.com`
- Mensagem de erro se inválido

**Telefone:**
- Aceita: (11) 98765-4321 ou 11987654321
- Valida 10-11 dígitos
- Formata automaticamente

**Senha:**
- Mínimo 6 caracteres
- Mensagem de erro se muito curta

**Confirmar Senha:**
- Deve ser igual à senha
- Mensagem de erro se diferente

**Nome:**
- Mínimo 3 caracteres
- Mensagem de erro se muito curto

**Preço:**
- Apenas números
- Maior ou igual a 0
- Formato: 40.00

**Duração:**
- Apenas números inteiros
- Maior que 0
- Em minutos

### 6.5 Formatações Automáticas

**Preço:**
- Input: 4000
- Output: R$ 4.000,00

**Telefone:**
- Input: 11987654321
- Output: (11) 98765-4321

**Data:**
- Input: 2026-02-26
- Output: 26/02/2026

**Data/Hora:**
- Input: 2026-02-26T14:30
- Output: 26/02/2026 14:30

**Duração:**
- Input: 90 (minutos)
- Output: 1h30min

### 6.6 Horários Inteligentes

**Geração Automática:**
- Sistema gera slots de acordo com:
  - Horário de abertura (default: 8h)
  - Horário de fechamento (default: 19h)
  - Intervalo (default: 30min)
  - Duração dos serviços selecionados

**Verificação de Conflitos:**
- Não permite agendar em horários ocupados
- Considera duração total dos serviços
- Evita sobreposição de horários
- Exclui horários passados (se for hoje)

**Exemplo:**
- Serviços: Corte (60min) + Barba (30min) = 90min total
- Se agendar às 10:00, bloqueia até 11:30
- Próximo horário disponível: 11:30 ou depois

### 6.7 Multi-Seleção de Serviços

**Como funciona:**
1. Cliente pode selecionar múltiplos serviços
2. Preço total = soma de todos os serviços
3. Duração total = soma de todas as durações
4. Horários gerados consideram duração total
5. Todos os serviços são salvos no agendamento

**Benefícios:**
- Cliente economiza tempo
- Profissional otimiza agenda
- Pagamento único
- Melhor experiência

### 6.8 Agendamento para Terceiros

**Cenário:**
Cliente quer agendar para outra pessoa (filho, cônjuge, amigo)

**Como funciona:**
1. Seleciona "Para outra pessoa"
2. Campo "Nome completo da pessoa" aparece
3. Preenche o nome
4. Restante do fluxo é igual
5. No agendamento fica salvo:
   - `clienteId`: ID do cliente que agendou
   - `clienteNome`: Nome do cliente que agendou
   - `agendadoPara`: "terceiro"
   - `nomeOutraPessoa`: Nome da pessoa que vai receber o serviço

**Vantagens:**
- Pais podem agendar para filhos
- Empresas podem agendar para funcionários
- Presente de serviço

---

## 7. PERSONALIZAÇÃO

### 7.1 Alterar Cores

**Tailwind Config (admin.html, cliente.html):**

```javascript
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Azul padrão
        // Mude para sua cor:
        // primary: '#10b981', // Verde
        // primary: '#ef4444', // Vermelho
        // primary: '#f59e0b', // Laranja
        // primary: '#8b5cf6', // Roxo
      }
    }
  }
}
```

**Cards de Estatísticas:**

Localize e modifique as classes dos cards:

```html
<!-- Total -->
<div class="bg-gradient-to-br from-purple-500 to-purple-700 ...">
  <!-- Mude para:
  <div class="bg-gradient-to-br from-blue-500 to-blue-700 ...">
  -->
</div>
```

### 7.2 Alterar Horário de Funcionamento

**Arquivo:** `assets/business-rules.js`

```javascript
schedule: {
  openTime: 8,   // 8:00 - Horário de abertura
  closeTime: 19, // 19:00 - Horário de fechamento
  interval: 30,  // 30 minutos - Intervalo entre slots

  // Exemplo: Abrir às 9h, fechar às 21h, slots de 15min
  // openTime: 9,
  // closeTime: 21,
  // interval: 15,
}
```

**Horário de Almoço:**

Para bloquear horário de almoço, edite `assets/correcoes.js`:

```javascript
for (let h = horaInicio; h < horaFim; h++) {
  for (let m = 0; m < 60; m += intervalo) {
    // Pular horário de almoço (12h às 13h)
    if (h === 12 || (h === 13 && m === 0)) continue;
    
    // Resto do código...
  }
}
```

### 7.3 Adicionar Novos Campos

**Exemplo: Adicionar "CPF" ao cadastro**

**1. HTML (cadastro.html):**

```html
<div>
  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    CPF *
  </label>
  <input 
    type="text" 
    id="cpf" 
    placeholder="000.000.000-00"
    required
    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
  >
</div>
```

**2. JavaScript (cadastro.html):**

```javascript
// Capturar valor
const cpf = document.getElementById('cpf').value;

// Validar
if (!BusinessRules.validation.isValidCPF(cpf)) {
  Toast.error('CPF inválido');
  return;
}

// Salvar no perfil
await db.ref(`usuarios/${user.uid}`).set({
  // ... outros campos
  cpf: cpf,
  // ...
});
```

**3. Validação (business-rules.js):**

```javascript
validation: {
  // ... outras validações
  
  isValidCPF(cpf) {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    
    // Validação completa do CPF (algoritmo)
    // https://www.geradorcpf.com/algoritmo_do_cpf.htm
    // ... implementar algoritmo
    
    return true;
  }
}
```

### 7.4 Adicionar Novas Abas

**Exemplo: Aba "Promoções" no admin**

**1. HTML (admin.html):**

```html
<!-- Adicionar botão na barra de tabs -->
<button 
  onclick="mostrarTab('promocoes')" 
  id="tabPromocoes" 
  class="px-6 py-3 font-semibold text-gray-600 dark:text-gray-400 hover:text-primary whitespace-nowrap"
>
  🎉 Promoções
</button>

<!-- Adicionar seção -->
<div id="secaoPromocoes" class="hidden">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
    🎉 Gerenciar Promoções
  </h2>
  <!-- Conteúdo da aba -->
</div>
```

**2. JavaScript (admin.html):**

```javascript
function mostrarTab(tab) {
  // ... código existente
  
  // Adicionar case
  else if (tab === 'promocoes') {
    carregarPromocoes();
  }
}

async function carregarPromocoes() {
  // Buscar promoções do Firebase
  const snapshot = await db.ref('promocoes').once('value');
  const promocoes = snapshot.val();
  
  // Renderizar na tela
  // ...
}
```

**3. Firebase (criar nó):**

```json
{
  "promocoes": {
    "promo1": {
      "nome": "Black Friday",
      "desconto": 20,
      "validade": "2026-11-30",
      "servicos": ["servico1", "servico2"],
      "ativo": true
    }
  }
}
```

### 7.5 Customizar E-mails

**Atualmente:** Sistema não envia e-mails automáticos

**Para implementar:**

1. Ativar Firebase Cloud Functions
2. Criar função de envio de e-mail
3. Usar serviço como SendGrid, Mailgun ou Nodemailer

**Exemplo de função (Node.js):**

```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.enviarConfirmacaoAgendamento = functions.database
  .ref('/agendamentos/{agendamentoId}')
  .onCreate(async (snapshot, context) => {
    const agendamento = snapshot.val();
    
    // Configurar transporte
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'seu-email@gmail.com',
        pass: 'sua-senha-app'
      }
    });
    
    // Compor e-mail
    const mailOptions = {
      from: 'seu-email@gmail.com',
      to: agendamento.clienteEmail,
      subject: 'Agendamento Criado com Sucesso!',
      html: `
        <h1>Olá ${agendamento.clienteNome}!</h1>
        <p>Seu agendamento foi criado com sucesso.</p>
        <p><strong>Data:</strong> ${agendamento.dataHora}</p>
        <p><strong>Serviços:</strong> ${agendamento.servicos.map(s => s.nome).join(', ')}</p>
        <p><strong>Total:</strong> R$ ${agendamento.precoTotal.toFixed(2)}</p>
      `
    };
    
    // Enviar
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!');
  });
```

---

## 8. TROUBLESHOOTING

### 8.1 Problemas Comuns

#### Erro: "Firebase não está definido"

**Causa:** Arquivo `firebase-config.js` não carregado corretamente

**Solução:**
1. Verifique se o arquivo existe em `firebase/firebase-config.js`
2. Verifique se está sendo importado no HTML:
```html
<script src="firebase/firebase-config.js"></script>
```
3. Verifique se o caminho está correto
4. Abra o console do navegador (F12) e veja erros

---

#### Erro: "Permission denied" no Firebase

**Causa:** Security Rules não configuradas corretamente

**Solução:**
1. Vá no Firebase Console → Realtime Database → Regras
2. Cole o conteúdo de `firebase-security-rules.json`
3. Clique em "Publicar"
4. Aguarde alguns segundos

---

#### Erro: "Usuário não autenticado"

**Causa:** Sessão expirou ou usuário não fez login

**Solução:**
1. Faça logout (`logout()`)
2. Faça login novamente
3. Limpe cookies e cache do navegador
4. Verifique se o Firebase Auth está ativo no Console

---

#### Erro: "Horários não estão carregando"

**Causa:** Serviços não foram carregados ou data não foi selecionada

**Solução:**
1. Verifique se há serviços cadastrados no Firebase (`servicos/`)
2. Verifique se você selecionou pelo menos 1 serviço
3. Verifique se selecionou uma data
4. Abra o console (F12) e veja erros

---

#### Erro: "Profissionais não aparecem no dropdown"

**Causa:** Não há membros cadastrados na equipe

**Solução:**
1. Faça login como admin
2. Vá na aba "👥 Equipe"
3. Adicione pelo menos 1 membro
4. Recarregue a página `cliente.html`
5. Profissionais devem aparecer

---

#### Erro: "Toast não aparece"

**Causa:** Arquivo `toast.js` não carregado

**Solução:**
1. Verifique se `assets/toast.js` existe
2. Verifique se está sendo importado:
```html
<script src="assets/toast.js"></script>
```
3. Abra console e veja erros
4. Verifique se a função está sendo chamada corretamente:
```javascript
Toast.success('Mensagem');
```

---

#### Erro: "Agendamento não salva"

**Possíveis Causas e Soluções:**

**1. Campos obrigatórios não preenchidos:**
- Verifique se selecionou profissional
- Verifique se selecionou pelo menos 1 serviço
- Verifique se selecionou data e horário

**2. Horário já ocupado:**
- Escolha outro horário
- Sistema não permite agendamentos simultâneos

**3. Security Rules bloqueando:**
- Verifique se as regras estão publicadas
- Verifique se o usuário está autenticado

**4. Erro de rede:**
- Verifique sua conexão com a internet
- Recarregue a página

---

### 8.2 Debug Avançado

#### Ativar Debug Mode

**1. Abrir Console do Navegador:**
- Windows/Linux: `F12` ou `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

**2. Ver Logs:**
- Aba "Console"
- Procure por mensagens com `✅`, `❌`, `⚠️`
- Logs começam com emoji para facilitar identificação

**3. Ver Dados do Firebase:**
- No console, digite:
```javascript
firebase.auth().currentUser
```
- Para ver usuário logado

```javascript
firebase.database().ref('agendamentos').once('value').then(s => console.log(s.val()))
```
- Para ver todos os agendamentos

**4. Ver Regras de Negócio:**
```javascript
BusinessRules
```
- Para ver objeto completo

```javascript
BusinessRules.validation.isValidEmail('teste@email.com')
```
- Para testar validação

---

### 8.3 Resetar Sistema

**Resetar Banco de Dados:**

⚠️ **ATENÇÃO:** Isso apaga TODOS os dados!

1. Firebase Console → Realtime Database
2. Clique nos 3 pontinhos no nó raiz
3. Clique em "Excluir"
4. Confirme

**Resetar Autenticação:**

1. Firebase Console → Authentication
2. Aba "Users"
3. Selecione todos
4. Clique em "Excluir usuários"
5. Confirme

**Recomeçar do Zero:**

1. Siga passos acima para limpar tudo
2. Siga "Configuração do Firebase" (seção 2.2)
3. Crie novo admin
4. Cadastre equipe, serviços, produtos

---

## 9. FAQ (Perguntas Frequentes)

### Geral

**P: O sistema é gratuito?**
R: Sim! O código é open-source. Você precisa apenas de uma conta gratuita no Firebase.

**P: Preciso saber programar?**
R: Para usar, não. Para personalizar, conhecimentos básicos de HTML/CSS/JavaScript ajudam.

**P: Funciona offline?**
R: Não no momento. Requer conexão com internet para sincronizar com Firebase.

**P: Quantos usuários suporta?**
R: Firebase gratuito: até 100 usuários simultâneos. Para mais, upgrade para plano Blaze.

**P: Posso usar domínio próprio?**
R: Sim! Configure no Firebase Hosting ou hospede em seu servidor.

### Técnico

**P: Qual tecnologia é usada?**
R: HTML, CSS (Tailwind), JavaScript (ES6+), Firebase (Auth + Realtime Database).

**P: É responsivo?**
R: Sim! Funciona perfeitamente em mobile, tablet e desktop.

**P: Tem dark mode?**
R: Sim! Tema claro e escuro, com persistência entre sessões.

**P: Posso integrar com outros sistemas?**
R: Sim! Firebase possui APIs REST. Você pode integrar com qualquer sistema.

**P: Suporta múltiplos idiomas?**
R: Não no momento. Atualmente apenas português. Contribuições são bem-vindas!

### Funcionalidades

**P: Posso ter mais de um admin?**
R: Sim! Basta criar usuários com `role: 'admin'` no banco de dados.

**P: Clientes podem cancelar agendamentos?**
R: Sim! Na aba "Pendentes" do `cliente.html`.

**P: Admin recebe notificações de novos agendamentos?**
R: Não no momento. Implementar com Firebase Cloud Messaging ou e-mail.

**P: Posso cobrar online?**
R: Não no momento. Integração com gateway de pagamento precisa ser implementada.

**P: Suporta múltiplas unidades/filiais?**
R: Não no momento. Sistema é single-tenant. Multi-tenancy requer modificações.

### Segurança

**P: Os dados são seguros?**
R: Sim! Firebase usa HTTPS e as Security Rules protegem os dados.

**P: Senhas são criptografadas?**
R: Sim! Firebase Auth cuida disso automaticamente.

**P: Posso fazer backup dos dados?**
R: Sim! No Firebase Console, vá em Realtime Database → Exportar JSON.

**P: E se perder senha de admin?**
R: Use "Esqueci minha senha" no login ou redefina pelo Firebase Console.

### Suporte

**P: Onde reporto bugs?**
R: Abra uma issue no GitHub: https://github.com/KayhamCristoffer/projeto-agendamentos.io/issues

**P: Como sugiro melhorias?**
R: Abra uma issue no GitHub ou faça um Pull Request.

**P: Tem comunidade/fórum?**
R: Veja Discussions no GitHub do projeto.

**P: Posso contratar suporte pago?**
R: Entre em contato através do GitHub ou e-mail listado no perfil.

---

## 🎉 PARABÉNS!

Você concluiu o tutorial completo do Sistema de Agendamentos Online!

Agora você sabe:
- ✅ Configurar do zero
- ✅ Usar como cliente
- ✅ Administrar como admin
- ✅ Personalizar o sistema
- ✅ Resolver problemas comuns

**Próximos Passos:**
1. Personalize as cores e horários
2. Cadastre sua equipe e serviços
3. Compartilhe o link com seus clientes
4. Monitore as estatísticas
5. Contribua com melhorias no GitHub

**Boa sorte com seu negócio! 🚀**

---

**Documentação completa:** README-MELHORIAS.md  
**Repositório:** https://github.com/KayhamCristoffer/projeto-agendamentos.io  
**Versão:** 2.0.0  
**Última atualização:** 26/02/2026
