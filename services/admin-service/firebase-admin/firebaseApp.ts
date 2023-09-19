import dotenv from 'dotenv';
import admin from 'firebase-admin';
import {Auth, getAuth, UserRecord} from 'firebase-admin/auth';
import {App} from "firebase-admin/lib/app";
import {FirebaseError} from "firebase-admin/lib/utils/error";

dotenv.config();

const DEFAULT_PROVIDER_ID : string = "github.com"

// Will not work unless you have the correct service account details saved in the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const firebaseApp : App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseAuth : Auth = getAuth(firebaseApp);

async function getFirebaseUidFromGithubUid(githubUid: string) {
  return firebaseAuth.getUserByProviderUid(DEFAULT_PROVIDER_ID, githubUid).then(
    (user: UserRecord) => {
      return user.uid;
    }
  )
}

async function setGithubUidAsAdmin(githubUid: string) {
  return getFirebaseUidFromGithubUid(githubUid).then((providerUid) => {
    // The UID used for setting the claim is specific to Firebase
    firebaseAuth
      .setCustomUserClaims(providerUid, { admin: true })
      .then(() => {
        // The new custom claims will propagate to the user's ID token the
        // next time a new one is issued.

        // setCustomUserClaims will override any existing claims.
        // For this app, we use custom claims only to denote admin/not admin
        return true;
      })
  }).catch((error) => {
    if (error instanceof FirebaseError) {
      if (error.code === "auth/user-not-found") {
        // Github UID does not correspond to a user registered on Firebase
        return false;
      }
    }
    // Otherwise, just throw the error
    throw error;
  })
}

async function removeAdminFromGithubUid(githubUid: string) {
  return getFirebaseUidFromGithubUid(githubUid).then((providerUid) => {
    // The UID used for setting the claim is specific to Firebase
    firebaseAuth
      .setCustomUserClaims(providerUid, null)
      .then(() => {
        // The new custom claims will propagate to the user's ID token the
        // next time a new one is issued.

        // setCustomUserClaims will override any existing claims.
        // For this app, we use custom claims only to denote admin/not admin
        return true;
      })
  }).catch((error) => {
    if (error instanceof FirebaseError) {
      if (error.code === "auth/user-not-found") {
        // Github UID does not correspond to a user registered on Firebase
        return false;
      }
    }
    // Otherwise, just throw the error
    throw error;
  })
}

export { setGithubUidAsAdmin, removeAdminFromGithubUid };
