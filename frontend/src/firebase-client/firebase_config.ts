import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
// TODO: Change the way the config is loaded to support switching between dev and prod
const firebaseConfig = require("./firebase_config_dev.json");

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };
