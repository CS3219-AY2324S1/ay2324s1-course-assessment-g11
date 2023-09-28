import {expect, describe, it, vi, afterEach} from 'vitest'
import firebaseWrappers from "../../src/firebase-server/firebaseWrappers";
import {firebaseAuth} from "../../src/firebase-server/firebaseAuth";
import { UserRecord } from "firebase-admin/auth";

const testAdminUid = 'TestAdminUid';

describe('Firebase Wrappers', () => {

  describe('Set and remove admin', () => {
    afterEach(async () => {
      firebaseAuth.deleteUser(testAdminUid).then().catch((error) => {
        if (error.code === "auth/user-not-found") {
          // Ignore because some tests do not create the admin user
          return;
        }
        // Otherwise, just throw the error
        throw error;
      });
    })

    it('Set user that exists as admin', async () => {
      const newUser : UserRecord = await firebaseAuth.createUser({
        uid: testAdminUid,
        email: 'testuser@example.com',
        emailVerified: false,
        displayName: 'Test Admin'
      });

      const didOperationSucceed : boolean = await firebaseWrappers.setFirebaseUidAsAdmin(testAdminUid);
      const userClaims = await firebaseAuth.getUser(newUser.uid).then((userRecord) => {
        return userRecord.customClaims;
      });

      const isAdmin = userClaims.admin && userClaims.admin === true;

      expect(didOperationSucceed).toStrictEqual(true);
      expect(isAdmin).toStrictEqual(true);
    })

    it('Set and remove admin from user that exists', async () => {
      const newUser : UserRecord = await firebaseAuth.createUser({
        uid: testAdminUid,
        email: 'testuser@example.com',
        emailVerified: false,
        displayName: 'Test Admin'
      });

      await firebaseAuth.setCustomUserClaims(newUser.uid, { admin: true })

      const didOperationSucceed : boolean = await firebaseWrappers.removeAdminFromFirebaseUid(testAdminUid);
      const userClaims = await firebaseAuth.getUser(newUser.uid).then((userRecord) => {
        return userRecord.customClaims;
      });

      expect(didOperationSucceed).toStrictEqual(true);
      expect(userClaims).toStrictEqual({});
    })

    it('Set admin on non-existent user', async () => {
      const didOperationSucceed : boolean = await firebaseWrappers.setFirebaseUidAsAdmin(testAdminUid);
      expect(didOperationSucceed).toStrictEqual(false);
    })

    it('Remove admin on non-existent user', async () => {
      const didOperationSucceed : boolean = await firebaseWrappers.removeAdminFromFirebaseUid(testAdminUid);
      expect(didOperationSucceed).toStrictEqual(false);
    })
  })
})
