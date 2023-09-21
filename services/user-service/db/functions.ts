import prismaClient from "./prismaClient";

const userDatabaseFunctions = {
  async createUser(data : any) {
    const checkUid = data.uid;
    return prismaClient.appUser.findUnique({
      where: {
        uid: checkUid
      }
    }).then((user) => {
      if (user === null) {
        // User does not exist. Create the new user and return it.
        return prismaClient.appUser.create({
          data: data
        }).then((user) => {
          return user;
        });
      } else {
        // Signal that new user was not created since user already exists.
        return null;
      }
    });
  },

  async getUserByUid(uid : string) {
    // Will return null if no such user exists
    const result = await prismaClient.appUser.findUnique({
      where: {
        uid: uid,
      },
    });
    return result;
  },

  async updateUserByUid(uid : string, data : any) {
    // Will throw error if user does not exist
    const updatedResult = await prismaClient.appUser.update({
      where: {
        uid: uid
      },
      data: data
    });
    return updatedResult;
  },

  async deleteUserByUid(uid : string) {
    // Will throw error if user does not exist
    await prismaClient.appUser.delete({
      where: {
        uid: uid
      },
    });
  }
}

export default userDatabaseFunctions;
