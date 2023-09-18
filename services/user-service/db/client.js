const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

const userDatabaseClient = {
  async createUser(data) {
    const checkUid = data.uid;
    const isThereExistingUser = await prisma.appUser.findUnique({
      where: {
        uid: checkUid
      }
    }).then((user) => {
      return (user !== null);
    });

    if (isThereExistingUser) {
      return null;
    }

    const newUser = await prisma.appUser.create({
      data: data
    });

    return newUser;
  },

  async getUserByUid(uid) {
    // Will return null if no such user exists
    const result = await prisma.appUser.findUnique({
      where: {
        uid: uid,
      },
    });
    return result;
  },

  async updateUserByUid(uid, data) {
    const updatedResult = await prisma.appUser.update({
      where: {
        uid: uid
      },
      data: data
    });
    return updatedResult;
  },

  async deleteUserByUid(uid) {
    await prisma.appUser.delete({
      where: {
        uid: uid
      },
    });
  }
}

module.exports=userDatabaseClient;
