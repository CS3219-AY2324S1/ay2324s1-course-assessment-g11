import {beforeEach, expect, describe, it, vi} from 'vitest'
import indexRouter from '../../src/routes/index'
import userDatabaseFunctionsMock from '../../src/db/__mocks__/functions'
import express from 'express';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

import request from 'supertest';

vi.mock('../../src/db/functions')

const app = express();
app.use(indexRouter);

const fullNewUser = { uid: '1', displayName: 'Test User', photoUrl: "fakeUrl", matchDifficulty: 0,
  matchProgrammingLanguage: "Python" };

describe('/index', () => {
  /**
   * Note: Since this test is for testing the index.ts file, the /api/user-service is not prepended
   * to the routes.
   */
  beforeEach(() => {
    vi.restoreAllMocks();
  })

  describe('createUser', () => {
    it('[POST] to / with no new user yet', async () => {

      // Used to add the user
      userDatabaseFunctionsMock.createUser.mockResolvedValueOnce(fullNewUser);

      // The function being tested
      const response = await request(app).post('/').send(fullNewUser);
      expect(response.status).toStrictEqual(201);
      expect(response.body).toStrictEqual(fullNewUser);
    })

    it('[POST] to / with uid already in database', async () => {

      // Simulate a return null for user already in database
      userDatabaseFunctionsMock.createUser.mockResolvedValueOnce(null);

      // The function being tested
      const response = await request(app).post('/').send(fullNewUser);
      expect(response.status).toStrictEqual(400);
    })

    it('[POST] to / when database is unavailable', async () => {
      // Simulate a database error
      userDatabaseFunctionsMock.createUser.mockRejectedValueOnce(new Error());

      // The function being tested
      const response = await request(app).post('/').send(fullNewUser);
      expect(response.status).toStrictEqual(500);
    })
  })

  describe('getUserByUid', () => {
    it('[GET] /1', async () => {

      // Used to get back the user
      userDatabaseFunctionsMock.getUserByUid.mockResolvedValueOnce(fullNewUser);

      // The function being tested
      const response = await request(app).get('/1').send();
      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual(fullNewUser);
    })

    it('[GET] /1 but user does not exist', async () => {
      // Used to get back no user
      userDatabaseFunctionsMock.getUserByUid.mockResolvedValueOnce(null);

      // The function being tested
      const response = await request(app).get('/1').send();
      expect(response.status).toStrictEqual(404);
    })

    it('[GET] /1 when database is unavailable', async () => {
      // Simulate a database error
      userDatabaseFunctionsMock.getUserByUid.mockRejectedValueOnce(new Error());

      // The function being tested
      const response = await request(app).get('/1').send();
      expect(response.status).toStrictEqual(500);
    })
  })

  describe('updateUserByUid', () => {
    it('[PUT] /1', async () => {

      // Used to get back the user
      userDatabaseFunctionsMock.updateUserByUid.mockResolvedValueOnce(fullNewUser);

      // The function being tested
      const response = await request(app).put('/1').send();
      expect(response.status).toStrictEqual(200);
      expect(response.body).toStrictEqual(fullNewUser);
    })

    it('[PUT] /1 but user does not exist', async () => {
      // Used to get back no user
      userDatabaseFunctionsMock.updateUserByUid.mockRejectedValueOnce(new PrismaClientKnownRequestError('',{
        code: "P2025",
        clientVersion: "Not important"
      }));

      // The function being tested
      const response = await request(app).put('/1').send();
      expect(response.status).toStrictEqual(404);
    })

    it('[PUT] /1 when database is unavailable', async () => {
      // Simulate a database error
      userDatabaseFunctionsMock.updateUserByUid.mockRejectedValueOnce(new Error());

      // The function being tested
      const response = await request(app).put('/1').send();
      expect(response.status).toStrictEqual(500);
    })
  })

  describe('deleteUserByUid', () => {
    it('[DELETE] /1', async () => {

      // Used to get back the user
      userDatabaseFunctionsMock.deleteUserByUid.mockResolvedValueOnce(fullNewUser);

      // The function being tested
      const response = await request(app).delete('/1').send();
      expect(response.status).toStrictEqual(204);
    })

    it('[DELETE] /1 but user does not exist', async () => {
      // Used to get back no user
      userDatabaseFunctionsMock.deleteUserByUid.mockRejectedValueOnce(new PrismaClientKnownRequestError('',{
        code: "P2025",
        clientVersion: "Not important"
      }));

      // The function being tested
      const response = await request(app).delete('/1').send();
      expect(response.status).toStrictEqual(404);
    })

    it('[DELETE] /1 when database is unavailable', async () => {
      // Simulate a database error
      userDatabaseFunctionsMock.deleteUserByUid.mockRejectedValueOnce(new Error());

      // The function being tested
      const response = await request(app).delete('/1').send();
      expect(response.status).toStrictEqual(500);
    })
  })
})
