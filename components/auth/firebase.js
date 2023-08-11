// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDle8_bZZhUvPuTBkoGB__G_K_-G-Ng_jI",
  authDomain: "instagram-dev-e0fb0.firebaseapp.com",
  projectId: "instagram-dev-e0fb0",
  storageBucket: "instagram-dev-e0fb0.appspot.com",
  messagingSenderId: "780178834313",
  appId: "1:780178834313:web:d8dbc941fdeab8348cd758",
  measurementId: "G-G2YM26DK1H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app;
