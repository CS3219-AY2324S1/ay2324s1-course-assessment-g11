import dotenv from 'dotenv';
import admin from 'firebase-admin';
import {Auth, getAuth, UserRecord} from 'firebase-admin/auth';
import {App} from "firebase-admin/lib/app";
import path from 'path';
import process from "process";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env")});

// Will not work unless you have the correct service account details saved in the environment variable
const serviceAccountObject : object = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

const firebaseApp : App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountObject)
});

const firebaseAuth : Auth = getAuth(firebaseApp);

async function setUserClaimsWrapper(uid: string, customUserClaims: object | null) {
  return firebaseAuth.setCustomUserClaims(uid, customUserClaims).then(() => {
      return true;
    }
  ).catch((error) => {
    if (error.code === "auth/user-not-found") {
      // Given uid does not correspond to a user registered on Firebase
      return false;
    }
    // Otherwise, just throw the error
    throw error;
  });
}

async function listAllFirebaseUsers(nextPageToken? : string) {
  const maxResultsPerPage = 10;
  if (nextPageToken) {
    return firebaseAuth.listUsers(maxResultsPerPage, nextPageToken).then((listUsersResult) => {
      return listUsersResult;
    });
  } else {
    return firebaseAuth.listUsers(maxResultsPerPage).then((listUsersResult) => {
      return listUsersResult;
    });
  }
}

async function setFirebaseUidAsAdmin(uid: string) {
  return setUserClaimsWrapper(uid, { admin: true })
    .then((operationCompleted) => {
    // Check if operation was completed
    return operationCompleted;
  })
}

async function removeAdminFromFirebaseUid(uid: string) {
  return setUserClaimsWrapper(uid, null)
    .then((operationCompleted) => {
    // Check if operation was completed
    return operationCompleted;
  })
}

export { listAllFirebaseUsers, setFirebaseUidAsAdmin, removeAdminFromFirebaseUid };
