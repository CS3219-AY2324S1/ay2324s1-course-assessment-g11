const prismaClient = require("./prismaClient");

const sessionDatabaseFunctions = {
  async createSession(data) {
    const checkUid = data.uid;
    const isThereExistingSession = await prismaClient.appSession
      .findUnique({
        where: {
          uid: checkUid,
        },
      })
      .then((session) => {
        return session !== null;
      });

    if (isThereExistingSession) {
      return null;
    }

    const newSession = await prismaClient.appSession.create({
      data: data,
    });

    return newSession;
  },

  async getSessionByUid(uid) {
    // Will return null if no such session exists
    const result = await prismaClient.appSession.findUnique({
      where: {
        uid: uid,
      },
    });
    return result;
  },

  async updateSessionByUid(uid, data) {
    const updatedResult = await prismaClient.appSession.update({
      where: {
        uid: uid,
      },
      data: data,
    });
    return updatedResult;
  },

  async deleteSessionByUid(uid) {
    await prismaClient.appSession.delete({
      where: {
        uid: uid,
      },
    });
  },
};

module.exports = sessionDatabaseFunctions;
