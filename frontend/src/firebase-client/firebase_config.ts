import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = process.env.NEXT_PUBLIC_FRONTEND_FIREBASE_CONFIG
  ? JSON.parse(process.env.NEXT_PUBLIC_FRONTEND_FIREBASE_CONFIG as string)
  : {};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };
