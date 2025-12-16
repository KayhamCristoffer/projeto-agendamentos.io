# 📋 Instruções para Importar Dados no Firebase Realtime Database

## 🔥 Passo a Passo Completo

### 1. Acesse o Firebase Console
- Vá para: https://console.firebase.google.com/
- Selecione seu projeto: **projeto-agendamentos-6ddf3**

### 2. Navegue até o Realtime Database
- No menu lateral, clique em **"Realtime Database"**
- Você verá a estrutura atual do banco de dados

### 3. **IMPORTANTE: Faça Backup dos Dados Atuais**
- Clique nos **3 pontinhos (⋮)** no canto superior direito
- Selecione **"Exportar JSON"**
- Salve o arquivo em um local seguro

### 4. Limpar Dados Antigos (Opcional)
Se você quer começar do zero:
- Clique na raiz do banco (onde está o nome do database)
- Pressione a tecla **Delete** ou clique no ícone de lixeira
- Confirme a exclusão

### 5. Importar Novos Dados

#### Opção A: Importar arquivo JSON completo
1. Clique nos **3 pontinhos (⋮)** no canto superior direito
2. Selecione **"Importar JSON"**
3. Escolha o arquivo **`ESTRUTURA_BANCO_DADOS.json`**
4. Clique em **"Importar"**

#### Opção B: Adicionar manualmente cada nó
1. Clique no **+** ao lado da raiz do database
2. Adicione cada seção (agendamentos, usuarios, chats, servicos, configuracoes)
3. Copie e cole o conteúdo de cada seção do arquivo JSON

### 6. Verificar Importação
Após importar, verifique se apareceram os seguintes nós:
- ✅ **agendamentos** (3 agendamentos de exemplo)
- ✅ **usuarios** (4 usuários: 3 clientes + 1 admin)
- ✅ **chats** (2 conversas)
- ✅ **servicos** (12 tipos de serviços)
- ✅ **configuracoes** (horário de funcionamento e dados da empresa)

### 7. Configurar Regras de Segurança

Vá na aba **"Regras"** e substitua pelas seguintes regras:

```json
{
  "rules": {
    "agendamentos": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$agendamentoId": {
        ".read": "auth != null",
        ".write": "auth != null || root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "usuarios": {
      ".read": "auth != null",
      "$userId": {
        ".read": "auth != null && ($userId === auth.uid || root.child('usuarios').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null && ($userId === auth.uid || root.child('usuarios').child(auth.uid).child('role').val() === 'admin')"
      }
    },
    "chats": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$chatId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    "servicos": {
      ".read": true,
      ".write": "auth != null && root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
    },
    "configuracoes": {
      ".read": true,
      ".write": "auth != null && root.child('usuarios').child(auth.uid).child('role').val() === 'admin'"
    }
  }
}
```

### 8. Criar Usuário Administrador no Authentication

1. Vá em **Authentication** > **Users**
2. Clique em **"Add user"**
3. Preencha:
   - Email: `kayhamoliveira98@gmail.com`
   - Password: (crie uma senha segura)
4. Copie o **User UID** gerado

### 9. Atualizar UID do Admin no Database

1. Volte ao **Realtime Database**
2. Vá até `usuarios/AbC1dEfg2HiJkL3mNoP4rS5t`
3. **DELETE** este nó antigo
4. Crie um novo nó com o **User UID** que você copiou:
   ```json
   {
     "nomeCompleto": "Kayham Oliveira",
     "nome": "Kayham Oliveira",
     "email": "kayhamoliveira98@gmail.com",
     "telefone": "(11) 96666-6666",
     "role": "admin",
     "criadoEm": "2025-12-01T00:00:00.000Z",
     "atualizadoEm": "2025-12-15T00:00:00.000Z"
   }
   ```

### 10. Testar o Sistema

1. Acesse o site: https://kayhamcristoffer.github.io/projeto-agendamentos.io/
2. Faça login como admin: `kayhamoliveira98@gmail.com`
3. Verifique se você é redirecionado para o painel admin
4. Teste criar um novo agendamento como cliente (faça logout primeiro)

## 🎯 Estrutura de Dados Explicada

### Agendamentos
Cada agendamento contém:
- **nome, telefone, email**: Dados do cliente
- **servico, servicoId**: Serviço contratado
- **dataHora**: Data e hora no formato ISO (YYYY-MM-DDTHH:MM)
- **duracao**: Duração em minutos
- **preco, precoFinal**: Valores
- **userId**: ID do usuário que criou
- **status**: pendente, confirmado, cancelado ou concluido
- **timestamp, criadoEm, atualizadoEm**: Metadados

### Usuários
Cada usuário tem:
- **nomeCompleto, nome**: Nome do usuário
- **email**: Email único
- **telefone**: Telefone formatado
- **role**: "cliente" ou "admin"
- **criadoEm, atualizadoEm**: Datas de criação e atualização

### Chats
Organizados por agendamentoId:
- **mensagens**: Lista de mensagens
  - userId, userNome: Quem enviou
  - mensagem/texto: Conteúdo
  - timestamp: Quando foi enviada
- **lido**: Timestamps de última leitura por usuário

### Serviços
Cada serviço contém:
- **id**: Identificador único
- **nome**: Nome do serviço
- **icon**: Emoji representativo
- **preco**: Valor em reais
- **duracao**: Tempo em minutos
- **descricao**: Descrição detalhada
- **ativo**: Se está disponível para agendamento

## ⚠️ Problemas Comuns

### "Permissão negada"
- Verifique se as regras de segurança estão configuradas
- Certifique-se de estar autenticado

### "Usuário admin não funciona"
- Verifique se o UID no nó `usuarios` corresponde ao UID do Authentication
- Confirme se `role: "admin"` está correto (tudo minúsculo)

### "Serviços não aparecem"
- Verifique se o nó `servicos` foi importado corretamente
- Abra o Console do navegador (F12) e veja se há erros

## 📞 Suporte

Se tiver problemas:
1. Abra o Console do navegador (F12)
2. Vá na aba "Console"
3. Procure por mensagens de erro em vermelho
4. Verifique a aba "Network" para ver se as requisições ao Firebase estão falhando

---

**Desenvolvido para facilitar a gestão de agendamentos**
