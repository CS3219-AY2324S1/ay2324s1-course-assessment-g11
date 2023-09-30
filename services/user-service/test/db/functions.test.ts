import {beforeEach, expect, describe, it, vi} from 'vitest'
import userDatabaseFunctions from '../../src/db/functions'
import prismaMock from '../../src/db/__mocks__/prismaClient'

vi.mock('../../src/db/prismaClient')

const fullNewUser = { uid: '1', displayName: 'Test User', photoUrl: "fakeUrl", matchDifficulty: 0,
  matchProgrammingLanguage: "Python" };

const partialNewUser = { uid: '1'};

describe('functions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  })
  describe('createUser', () => {
    it('createUser should return the generated user if its uid does not exist in database yet', async () => {

      // Used to add the user
      prismaMock.appUser.create.mockResolvedValueOnce(fullNewUser);

      // The function being tested
      const user = await userDatabaseFunctions.createUser(fullNewUser);
      expect(user).toStrictEqual(fullNewUser);
    })

    it('createUser should return null if user with uid already exists in database', async () => {
      // Used to simulate finding that the user is in the database
      prismaMock.appUser.findUnique.mockResolvedValueOnce(fullNewUser);

      const user = await userDatabaseFunctions.createUser(fullNewUser);
      expect(user).toStrictEqual(null);
    })

    it('createUser should only need uid to work', async () => {
      prismaMock.appUser.create.mockResolvedValueOnce(partialNewUser);
      const user = await userDatabaseFunctions.createUser(partialNewUser);
      expect(user).toStrictEqual(partialNewUser);
    })
  })
})
