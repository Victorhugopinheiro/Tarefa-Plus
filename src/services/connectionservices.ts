
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmdX43PYGRc2JvQvxShSwmaKei64MA4y8",
  authDomain: "tarefaplus-a201b.firebaseapp.com",
  projectId: "tarefaplus-a201b",
  storageBucket: "tarefaplus-a201b.firebasestorage.app",
  messagingSenderId: "883737194036",
  appId: "1:883737194036:web:5078a4be18a750536fe461"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)


export{db}

