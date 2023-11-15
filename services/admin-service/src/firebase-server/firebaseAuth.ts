import process from "process";
import { App } from "firebase-admin/lib/app";
import admin from "firebase-admin";
import { Auth, getAuth } from "firebase-admin/auth";

// Will not work unless you have the correct service account details saved in the environment variable
const serviceAccountObject: object = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT as string
);

const firebaseApp: App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountObject),
});

export const firebaseAuth: Auth = getAuth(firebaseApp);
