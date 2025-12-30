import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyDJhCo5E5dCwopolYm8GWxwbxuh685LcvY",
  authDomain: "wefewwe-1e057.firebaseapp.com",
  projectId: "wefewwe-1e057",
  storageBucket: "wefewwe-1e057.firebasestorage.app",
  messagingSenderId: "475953043213",
  appId: "1:475953043213:web:4387a3fbb35160f7ac4244"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
