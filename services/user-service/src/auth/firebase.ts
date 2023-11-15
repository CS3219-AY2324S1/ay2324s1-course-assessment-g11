import admin from "firebase-admin";
import { Auth, getAuth } from "firebase-admin/auth";
import process from "process";
import { App } from "firebase-admin/lib/app";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
  : {};

const firebaseApp: App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseAuth: Auth = getAuth(firebaseApp);

export function promiseVerifyIsLoggedIn(idToken: string) {
  return firebaseAuth
    .verifyIdToken(idToken, true)
    .then((decodedToken) => {
      return decodedToken.sub;
    })
    .catch(() => {
      return "";
    });
}

export function promiseVerifyIsCorrectUser(idToken: string, paramUid: string) {
  return firebaseAuth
    .verifyIdToken(idToken, true)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      return uid === paramUid;
    })
    .catch(() => {
      return false;
    });
}
