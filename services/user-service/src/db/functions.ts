import { count } from "console";
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

  async getAttemptById(attemptId: string) {
    try {
      const attempt = await prismaClient.attempt.findUnique({
        where: {
          id: attemptId,
        },
      });
      return attempt;
    } catch (error: any) {
      console.error(`Error retrieving attempt: ${error.message}`);
      throw error;
    }
  },

  async createAttemptOfUser(data: {
    uid: string;
    question_id: string;
    answer: string;
    solved: boolean;
  }) {
    try {
      const user = await prismaClient.appUser.findUnique({
        where: {
          uid: data.uid,
        },
      });

      if (user) {
        const attempt = await prismaClient.attempt.create({
          data: {
            question_id: data.question_id,
            answer: data.answer,
            solved: data.solved,
            users: {
              connect: {
                uid: data.uid,
              },
            },
          },
        });
        return attempt;
      } else {
        console.error(`User with uid ${data.uid} not found.`);
        return null;
      }
    } catch (error: any) {
      console.error(`Error creating attempt: ${error.message}`);
      throw error;
    }
  },

  async setMatchPreferenceOfUser(
    uid: string,
    data: {
      matchDifficulty: string;
      matchProgrammingLanguage: string;
    }
  ) {
    try {
      const updatedResult = await prismaClient.appUser.update({
        where: {
          uid: uid,
        },
        data: {
          matchDifficulty: data["matchDifficulty"],
          matchProgrammingLanguage: data["matchProgrammingLanguage"],
        },
      });
      return updatedResult;
    } catch (error: any) {
      console.error(`Error setting match preference: ${error.message}`);
      throw error;
    }
  },

  async getLeaderboard() {
    try {
      const leaderboard = await prismaClient.appUser.findMany({
        select: {
          uid: true,
          displayName: true,
          photoUrl: true,
          _count: {
            select: {
              attempts: true,
            },
          },
        },
        orderBy: {
          attempts: { _count: "desc" },
        },
        take: 20,
      });
      return leaderboard.map((user) => {
        return {
          uid: user.uid,
          displayName: user.displayName,
          photoUrl: user.photoUrl,
          attempts: user._count.attempts,
        };
      });
    } catch (error: any) {
      console.error(`Error retrieving leaderboard: ${error.message}`);
      throw error;
    }
  },
};

export default userDatabaseFunctions;
