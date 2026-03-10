import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBsWmcqwYgCZLB3oo-_ZqVrS_OxQtQ7WX0",
  authDomain: "mi-tienda-login.firebaseapp.com",
  projectId: "mi-tienda-login",
  storageBucket: "mi-tienda-login.firebasestorage.app",
  messagingSenderId: "448109980052",
  appId: "1:448109980052:web:d42e47dd8527154839c781",
  measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

// Inicializar Analytics solo si estamos en el navegador y hay measurementId
export const analytics = typeof window !== 'undefined' && process.env.REACT_APP_GA_MEASUREMENT_ID 
  ? getAnalytics(app) 
  : null;

export default app;