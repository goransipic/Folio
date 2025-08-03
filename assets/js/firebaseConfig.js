// src/firebase.js
import { initializeApp } from "firebase/app";
// example for Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDUqIlHcBSbD0I9NjDKfaDMdTkMfxmXk3s",
  authDomain: "folio-af776.firebaseapp.com",
  projectId: "folio-af776",
  storageBucket: "folio-af776.firebasestorage.app",
  messagingSenderId: "394494170771",
  appId: "1:394494170771:web:5eb7622ff17c2879ef5f66",
  measurementId: "G-MHVR9GDG3N"
};

const app = initializeApp(firebaseConfig);

export default app ;
