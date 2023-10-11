import {expect, describe, it, vi, beforeAll, afterAll} from 'vitest'
import firebaseWrappers from "../src/firebase-server/firebaseWrappers";
import {firebaseAuth} from "../src/firebase-server/firebaseAuth";
import { UserRecord } from "firebase-admin/auth";
import app from "../src/app";
import request from "supertest";

const testAdminUid = 'TestAdminUid';

// Set this to be between 10 and 19 inclusive
const numberOfListedUsers = 19;

describe('Admin service /api/admin-service/index', () => {

  describe('Sample workflow for adding admin user', () => {
    afterAll(async () => {
      // Delete the admin
      firebaseAuth.deleteUser(testAdminUid).then().catch((error) => {
        if (error.code === "auth/user-not-found") {
          // Ignore because some tests do not create the admin user
          return;
        }
        // Otherwise, just throw the error
        throw error;
      });
    });

    beforeAll(async () => {
      // Create the admin
      await firebaseAuth.createUser({
        uid: testAdminUid,
        email: 'testuser@example.com',
        emailVerified: false,
        displayName: 'Test Admin'
      });
    });

    it('Step 1: Add admin rights to admin user', async () => {
      const response = await request(app).put(`/api/admin-service/setAdmin/${testAdminUid}`).send();

      const userClaims = await firebaseAuth.getUser(testAdminUid).then((userRecord) => {
        return userRecord.customClaims;
      });

      const isAdmin = userClaims.admin && userClaims.admin === true;

      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual({
        "providerId": testAdminUid
      });
      expect(isAdmin).toStrictEqual(true);
    });

    it('Step 2: Remove admin rights from admin user', async () => {
      const response = await request(app).put(`/api/admin-service/removeAdmin/${testAdminUid}`).send();

      const userClaims = await firebaseAuth.getUser(testAdminUid).then((userRecord) => {
        return userRecord.customClaims;
      });

      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual({
        "providerId": testAdminUid
      });
      expect(userClaims).toStrictEqual({});
    });
  })

  describe('Adding and removing admin to/from non-existent user', () => {
    it('Add admin rights to non-existent user', async () => {
      const response = await request(app).put(`/api/admin-service/setAdmin/${testAdminUid}`).send();

      expect(response.status).toStrictEqual(404);
    });

    it('Step 2: Remove admin rights from non-existent user', async () => {
      const response = await request(app).put(`/api/admin-service/removeAdmin/${testAdminUid}`).send();

      expect(response.status).toStrictEqual(404);
    });
  })

  describe('Sample workflow for listing users in database', () => {
    // Delete the listed users
    afterAll(async () => {
      for (let i = 0; i < numberOfListedUsers; i++) {
        firebaseAuth.deleteUser(`testUser${i}`).then().catch((error) => {
          if (error.code === "auth/user-not-found") {
            // Ignore because some tests do not create the user
            return;
          }
          // Otherwise, just throw the error
          throw error;
        });
      }
    });

    beforeAll(async () => {
      // Create the other users
      for (let i = 0; i < numberOfListedUsers; i++) {
        await firebaseAuth.createUser({
          uid: `testUser${i}`,
          email: `testGet${i}@example.com`,
          emailVerified: false,
          displayName: `Test User ${i}`
        });
      }
    });

    it(`List ${numberOfListedUsers} users in the database`, async () => {
      const firstResponse = await request(app).get(`/api/admin-service/listUsers`).send()
      expect(firstResponse.status).toStrictEqual(200);

      const firstResponseBody = firstResponse.body;
      const firstUserList = firstResponseBody.users;
      const nextPageToken = firstResponseBody.pageToken;

      expect(firstUserList.length).toStrictEqual(10);
      expect(nextPageToken).toBeTruthy(); // next page token is a string

      const secondResponse = await request(app).get(`/api/admin-service/listUsers`).set('Next-Page-Token', nextPageToken).send();
      expect(secondResponse.status).toStrictEqual(200);

      const secondResponseBody = secondResponse.body;
      const secondUserList = secondResponseBody.users;
      const secondNextPageToken = secondResponseBody.pageToken;

      // The last user in one page is carried over to be the first user in the next page

      expect(secondUserList.length).toStrictEqual(numberOfListedUsers - 10);
      expect(secondNextPageToken).toBeFalsy(); // Should not have next page token

    });
  })
})
