import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, getDoc, collection, deleteDoc, writeBatch, getDocs } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration using environment variables with actual project fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCDBRZKkcrlvHp5Hkf9zautKWVc_pZuG-U",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "healthcareecommerce.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "healthcareecommerce",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "healthcareecommerce.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "75076647381",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:75076647381:web:ba870772ef37678eaae55c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WK0N92BLVT"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { doc, setDoc, onSnapshot, getDoc, collection, deleteDoc, writeBatch, getDocs, signInWithPopup, signOut, onAuthStateChanged };

