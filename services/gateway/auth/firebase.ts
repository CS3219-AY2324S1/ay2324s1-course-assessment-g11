import admin from 'firebase-admin';
import {Auth, getAuth} from 'firebase-admin/auth';
import path from "path";
import process from "process";
import dotenv from "dotenv";
import {App} from "firebase-admin/lib/app";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env")});
const serviceAccount : object = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

const firebaseApp : App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseAuth : Auth = getAuth(firebaseApp);

export function promiseVerifyIsLoggedIn(idToken) {
  return new Promise( (resolve, reject) => {
    const isLoggedIn = firebaseAuth
      .verifyIdToken(idToken, true)
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

    if (isLoggedIn) {
      resolve();
    } else {
      reject("You are not logged in.");
    }
  });
}

export function promiseVerifyIsCorrectUser(idToken, paramGithubId) {
  return new Promise( (resolve, reject) => {
    const verifiedUserMatch = firebaseAuth
      .verifyIdToken(idToken, true)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        return firebaseAuth.getUser(uid).then(
          (userRecord) => {
            const providerDataArray = userRecord.providerData;
            for (let i = 0; i < providerDataArray.length; i++) {
              const providerData = providerDataArray[i];
              if (providerData.providerId === "github.com") {
                const foundGithubId = providerData.providerId;
                if (foundGithubId === paramGithubId) {
                  return true;
                }
              }
            }
            return false;
          }
        )
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

    if (verifiedUserMatch) {
      resolve();
    } else {
      reject("GitHub ID parameter does not match!");
    }
  });
}

export function promiseVerifyIsAdmin(idToken) {
  return new Promise( (resolve, reject) => {
    const isAdmin = firebaseAuth
      .verifyIdToken(idToken, true)
      .then((claims) => {
        if (claims.admin) {
          // Return claims.admin if it exists
          return claims.admin;
        } else {
          return false;
        }
      })
      .catch((error) => {
        // Handle error
        console.log(error);
        return false;
      });

    if (isAdmin) {
      resolve();
    } else {
      reject("Operation Forbidden. You are not an admin.");
    }
  });
}
