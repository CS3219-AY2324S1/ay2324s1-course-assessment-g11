const  prismaClient  = require("./prismaClient")

const userDatabaseFunctions = {
  async createUser(data) {
    const checkUid = data.uid;
    const isThereExistingUser = await prismaClient.appUser.findUnique({
      where: {
        uid: checkUid
      }
    }).then((user) => {
      return (user !== null);
    });

    if (isThereExistingUser) {
      return null;
    }

    const newUser = await prismaClient.appUser.create({
      data: data
    });

    return newUser;
  },

  async getUserByUid(uid) {
    // Will return null if no such user exists
    const result = await prismaClient.appUser.findUnique({
      where: {
        uid: uid,
      },
    });
    return result;
  },

  async updateUserByUid(uid, data) {
    const updatedResult = await prismaClient.appUser.update({
      where: {
        uid: uid
      },
      data: data
    });
    return updatedResult;
  },

  async deleteUserByUid(uid) {
    await prismaClient.appUser.delete({
      where: {
        uid: uid
      },
    });
  }
}

module.exports=userDatabaseFunctions;
