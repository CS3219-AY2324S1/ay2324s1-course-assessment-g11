import prismaClient from "./prismaClient";

const userDatabaseFunctions = {
  async createUser(data: any) {
    const checkUid = data.uid;
    const existingUser = await prismaClient.appUser.findUnique({
      where: {
        uid: checkUid,
      },
    });

    if (existingUser) {
      return null;
    }

    return prismaClient.appUser
      .create({
        data: data,
      })
      .then((user) => {
        return user;
      });
  },

  async getUserByUid(uid: string) {
    // Will return null if no such user exists
    const result = await prismaClient.appUser.findUnique({
      where: {
        uid: uid,
      },
    });
    return result;
  },

  async updateUserByUid(uid: string, data: any) {
    // Will throw error if user does not exist
    const updatedResult = await prismaClient.appUser.update({
      where: {
        uid: uid,
      },
      data: data,
    });
    return updatedResult;
  },

  async deleteUserByUid(uid: string) {
    // Will throw error if user does not exist
    await prismaClient.appUser.delete({
      where: {
        uid: uid,
      },
    });
  },

  async getAttemptsOfUser(uid: string) {
    try {
      const user = await prismaClient.appUser.findUnique({
        where: {
          uid: uid,
        },
        include: {
          attempts: true,
        },
      });

      if (user) {
        return user.attempts;
      } else {
        console.error(`User with uid ${uid} not found.`);
        return [];
      }
    } catch (error: any) {
      console.error(`Error retrieving attempts: ${error.message}`);
      throw error;
    }
  },
};

export default userDatabaseFunctions;
