// ============================================
// Configuração do Firebase
// Sistema de Agendamentos Online
// ============================================

// ⚠️ IMPORTANTE: Este arquivo usa o Firebase SDK v9 no modo de compatibilidade (compat)
// Para usar este projeto com seu próprio Firebase:
// 1. Acesse https://console.firebase.google.com/
// 2. Crie um novo projeto
// 3. Ative Authentication (método Email/Password)
// 4. Ative Realtime Database
// 5. Copie suas credenciais e substitua abaixo

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBVDzykztfiQ91o_CpzQHBy0eMHQQxSERE",
  authDomain: "projeto-agendamentos-6ddf3.firebaseapp.com",
  databaseURL: "https://projeto-agendamentos-6ddf3-default-rtdb.firebaseio.com",
  projectId: "projeto-agendamentos-6ddf3",
  storageBucket: "projeto-agendamentos-6ddf3.firebasestorage.app",
  messagingSenderId: "1029815341640",
  appId: "1:1029815341640:web:4c285d529a773818ef3e7d",
  measurementId: "G-J199JG5FZJ"
};

// Verificar se o Firebase já foi inicializado
if (!firebase.apps.length) {
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  console.log('🔥 Firebase inicializado com sucesso!');
} else {
  console.log('🔥 Firebase já estava inicializado');
}

// Exportar referências para uso global (modo compatibilidade)
const auth = firebase.auth();
const db = firebase.database();

// Configurações adicionais de autenticação
auth.useDeviceLanguage(); // Usar idioma do dispositivo

// Configurar persistência de autenticação
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log('✅ Persistência de autenticação configurada');
  })
  .catch((error) => {
    console.error('❌ Erro ao configurar persistência:', error);
  });

// Log de status de conexão com o database
const connectedRef = db.ref('.info/connected');
connectedRef.on('value', (snapshot) => {
  if (snapshot.val() === true) {
    console.log('✅ Conectado ao Firebase Realtime Database');
  } else {
    console.log('⚠️ Desconectado do Firebase Realtime Database');
  }
});

// Exportar para uso global
window.auth = auth;
window.db = db;
