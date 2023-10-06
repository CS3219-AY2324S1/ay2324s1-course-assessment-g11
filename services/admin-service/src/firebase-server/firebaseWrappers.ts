import {firebaseAuth} from "./firebaseAuth";

const firebaseWrappers = {
  async setUserClaimsWrapper(uid: string, customUserClaims: object | null) {
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
  },

  async listAllFirebaseUsers(nextPageToken? : string) {
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
  },

  async setFirebaseUidAsAdmin(uid: string) {
    return this.setUserClaimsWrapper(uid, { admin: true })
      .then((operationCompleted) => {
        // Check if operation was completed
        return operationCompleted;
      })
  },

  async removeAdminFromFirebaseUid(uid: string) {
    return this.setUserClaimsWrapper(uid, null)
      .then((operationCompleted) => {
        // Check if operation was completed
        return operationCompleted;
      })
  }
}

export default firebaseWrappers;
