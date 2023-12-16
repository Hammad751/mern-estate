// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-b081d.firebaseapp.com",
  projectId: "real-estate-b081d",
  storageBucket: "real-estate-b081d.appspot.com",
  messagingSenderId: "383373227408",
  appId: "1:383373227408:web:79eb604425d345051aef15"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);