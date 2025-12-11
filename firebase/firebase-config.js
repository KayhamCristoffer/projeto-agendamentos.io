// Import the functions you need from the SDKs you need

////// import { initializeApp } from "firebase/app";
////// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
////// const analytics = getAnalytics(app);

// Inicializa Auth e Database
const auth = firebase.auth();
const db = firebase.database();