import prismaClient from "./prismaClient";

const userDatabaseFunctions = {
  async createUser(data : any) {
    const checkUid = data.uid;
    const existingUser = await prismaClient.appUser.findUnique({
      where: {
        uid: checkUid
      }
    })

    if (existingUser !== null) {
      return null;
    }

    return prismaClient.appUser.create({
      data: data
    }).then((user) => {
      return user;
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
