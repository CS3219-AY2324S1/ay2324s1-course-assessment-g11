import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
/**
 * How to use:
 *   - For dev, just leave FIREBASE_CONFIG_FILEPATH empty
 *   - For prod or simulated prod, pass in the filepath to the env variable
 */
const firebaseConfigFile = process.env.FIREBASE_CONFIG_FILEPATH || "./firebase_config_dev.json"

const firebaseConfig = require(firebaseConfigFile);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };
