import {expect, describe, it} from 'vitest'

import app from "../src/app"

import request from 'supertest';

const fullNewUser = { uid: '1', displayName: 'Test User', photoUrl: "fakeUrl", matchDifficulty: 0,
  matchProgrammingLanguage: "Python" };

const updatedNewUser = { uid: '1', displayName: 'Test User', photoUrl: "fakeUrl", matchDifficulty: 1,
  matchProgrammingLanguage: "Python"};

const updatePayload = { matchDifficulty: 1 };

const userIdHeader = "User-Id";

describe('/index', () => {
  describe('Sample App Workflow', () => {
    it('Step 1: Add user 1 to database should pass with status 201', async () => {
      // The function being tested
      const response = await request(app).post('/api/user-service').send(fullNewUser);
      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual(fullNewUser);
    })

    it('Step 2: Retrieve details of user 1 from database should pass', async () => {
      // The function being tested
      const response = await request(app).get('/api/user-service/1').send();
      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual(fullNewUser);
    })

    it('Step 3a: Update details of user 1 from database by user 2 should fail with error 400', async () => {
      // The function being tested
      const response = await request(app)
        .put('/api/user-service/1')
        .set(userIdHeader, "2")
        .send(updatePayload);
      expect(response.status).toStrictEqual(400);
    })

    it('Step 3: Update details of user 1 from database should pass', async () => {
      // The function being tested
      const response = await request(app)
        .put('/api/user-service/1')
        .set(userIdHeader, "1")
        .send(updatePayload);
      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual(updatedNewUser);
    })

    it('Step 4: Retrieve details of updated user 1 from database should pass', async () => {
      // The function being tested
      const response = await request(app).get('/api/user-service/1').send();
      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual(updatedNewUser);
    })

    it('Step 5: Attempt to add duplicate user 1 to database should give status 200', async () => {
      const response = await request(app).post('/api/user-service').send(fullNewUser);
      expect(response.status).toStrictEqual(200);
    })

    it('Step 6a: Delete user 1 from database by user 2 should fail with status 400', async () => {
      const response = await request(app)
        .delete('/api/user-service/1')
        .set(userIdHeader, "2")
        .send();
      expect(response.status).toStrictEqual(400);
    })

    it('Step 6: Delete user 1 from database', async () => {
      const response = await request(app)
        .delete('/api/user-service/1')
        .set(userIdHeader, "1")
        .send();
      expect(response.status).toStrictEqual(204);
    })

    it('Step 7: Retrieve details of now deleted user 1 should fail', async () => {
      // The function being tested
      const response = await request(app).get('/api/user-service/1').send();
      expect(response.status).toStrictEqual(404);
    })

    it('Step 8: Update details of now deleted user 1 should fail', async () => {
      // The function being tested
      const response = await request(app)
        .put('/api/user-service/1')
        .set(userIdHeader, "1")
        .send(updatePayload);
      expect(response.status).toStrictEqual(404);
    })

    it('Step 9: Deleting the now deleted user 1 should fail', async () => {
      // The function being tested
      const response = await request(app)
        .delete('/api/user-service/1')
        .set(userIdHeader, "1")
        .send();
      expect(response.status).toStrictEqual(404);
    })
  })

})
