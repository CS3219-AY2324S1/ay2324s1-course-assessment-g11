import { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { io } from "../app";
import prisma from "../prismaClient";
import EventEmitter from "events";
import { Match } from "@prisma/client";
import { getRandomQuestionOfDifficulty } from "../questionAdapter";

export const MAX_WAITING_TIME = 60 * 1000; // 60 seconds

export type UserMatchReq = {
  userId: string;
  difficulties: string[];
  programmingLang: string;
};

export const userQueuesByProgrammingLanguage: {
  [language: string]: UserMatchReq[];
} = {
  python: [],
  java: [],
  "c++": [],
};

export const waitingUsers: Map<string, EventEmitter> = new Map(); // key: user id, val: Event

export function handleConnection(socket: Socket) {
  let userId = (socket.handshake.query.username as string) || "";
  console.log(`User connected: ${socket.id} and username ${userId}`);

  let userMatchReq: UserMatchReq = {
    userId: userId,
    difficulties: [],
    programmingLang: "python",
  };

  if (waitingUsers.has(userId)) {
    console.log(`User ${userId} is waiting in the queue in another session`);
    socket.emit(
      "error",
      "You are already waiting in the queue in another session."
    );
    socket.disconnect();
  } else {
    prisma.match
      .findFirst({
        where: {
          OR: [{ userId1: userId }, { userId2: userId }],
        },
      })
      .then((existingMatch) => {
        if (existingMatch) {
          console.log(
            `User ${userId} is already matched with user ${
              existingMatch.userId1 === userId
                ? existingMatch.userId2
                : existingMatch.userId1
            }`
          );
          socket.emit("error", "You are already matched with someone.");
          socket.join(existingMatch.roomId);
          socket.emit("matchFound", existingMatch);
        }
      })
      .catch((err) => {
        console.log(err);
        socket.emit("error", "An error occurred.");
      });
  }

  let timer = setTimeout(() => {}, 0);
  return { userId, userMatchReq, timer };
}

export function handleDisconnect(
  socket: Socket,
  // eslint-disable-next-line no-undef
  timer: NodeJS.Timeout,
  userId: string,
  userMatchReq: UserMatchReq
) {
  return () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove user from queue if they disconnect
    clearTimeout(timer);
    if (waitingUsers.has(userId)) {
      console.log(`User ${userId} disconnected while waiting for a match`);
      userQueuesByProgrammingLanguage[userMatchReq.programmingLang] =
        userQueuesByProgrammingLanguage[userMatchReq.programmingLang]?.filter(
          (user) => user.userId !== userId
        );
      waitingUsers.get(userId)?.removeAllListeners();
      waitingUsers.delete(userId);
    }
    // Match should not be cancelled since the user might reconnect but we can notify the other user
    prisma.match
      .findFirst({
        where: {
          OR: [{ userId1: userId }, { userId2: userId }],
        },
      })
      .then((match) => {
        if (match) {
          const matchingUserId =
            match?.userId1 === userId ? match?.userId2 : match?.userId1;
          console.log(
            `Notifying user ${matchingUserId} that user ${userId} has disconnected`
          );
          io.to(match?.roomId || "").emit(
            "receiveMessage",
            "Server",
            "Your partner has disconnected"
          );
        }
      })
      .catch((err) => {
        console.log(err);
        socket.emit("error", "An error occurred.");
      });
  };
}

export function handleLooking(
  socket: Socket,
  userId: string,
  userMatchReq: UserMatchReq,
  // eslint-disable-next-line no-undef
  timer: NodeJS.Timeout
): (...args: any[]) => void {
  return async (difficulties: string[], programmingLang: string) => {
    if (!difficulties || !programmingLang) {
      console.log(`Invalid request from user ${userId}`);
      socket.emit("error", "Invalid request");
      return;
    }
    if (waitingUsers.has(userId)) {
      console.log(`User ${userId} is already in the queue`);
      socket.emit("error", "You are already in the queue.");
      return;
    }

    let hasError = false;
    const existingMatch = await prisma.match
      .findFirst({
        where: {
          OR: [{ userId1: userId }, { userId2: userId }],
        },
      })
      .catch((err) => {
        console.log(err);
        socket.emit("error", "An error occurred in lookingForMatch.");
        hasError = true;
      });

    if (hasError) {
      return;
    }

    if (existingMatch) {
      console.log(
        `User ${userId} is already matched with user ${
          existingMatch.userId1 === userId
            ? existingMatch.userId2
            : existingMatch.userId1
        }`
      );
      socket.emit("error", "You are already matched with someone.");
      socket.join(existingMatch.roomId);
      socket.emit("matchFound", existingMatch);
      return;
    }

    userMatchReq.difficulties = difficulties;
    userMatchReq.programmingLang = programmingLang;

    console.log(
      `User ${userId} is looking for a match with difficulties ${difficulties} and programming language ${programmingLang}`
    );

    // Attempt to find a match for the user
    const matchedUser = userQueuesByProgrammingLanguage[programmingLang]?.find(
      (userMatchReq) =>
        userId !== userMatchReq.userId &&
        userMatchReq.difficulties.find((v) => difficulties.includes(v))
    );
    const matchId = matchedUser?.userId;
    const difficulty = matchedUser?.difficulties.find((v) =>
      difficulties.includes(v)
    );

    if (matchId) {
      console.log(
        `Match found for user ${userId} with user ${matchId} and difficulty ${difficulty}`
      );

      const questionId = await getRandomQuestionOfDifficulty(
        difficulty! ?? "easy"
      ).then(
        // difficulties???? need to intersect difficulties or not
        (questionId) => {
          return questionId;
        }
      );

      // Inform both users of the match
      const newMatch = await prisma
        .$transaction([
          prisma.match.create({
            data: {
              userId1: userId,
              userId2: matchId,
              chosenDifficulty: difficulty || "easy",
              chosenProgrammingLanguage: programmingLang,
              questionId: questionId,
            },
          }),
          // prisma.user.update({
          //   where: { id: userId },
          //   data: { matchedUserId: matchId },
          // }),
          // prisma.user.update({
          //   where: { id: matchId },
          //   data: { matchedUserId: userId },
          // }),
        ])
        .catch((err) => {
          console.log(err);
          socket.emit("error", "An error occurred in lookingForMatch.");
          hasError = true;
        })
        .then((res) => {
          return res && res[0];
        });
      if (hasError || !newMatch) {
        return;
      }
      waitingUsers.get(matchId)?.emit("matchFound", newMatch);
      socket.emit("matchFound", newMatch);
      socket.join(newMatch.roomId);
      // Remove both users from the queue
      userQueuesByProgrammingLanguage[programmingLang] =
        userQueuesByProgrammingLanguage[programmingLang].filter(
          (user) => user.userId !== matchId && user.userId !== userId
        );
      waitingUsers.delete(matchId);
      waitingUsers.delete(userId);
    } else {
      // Add user to the queue
      userQueuesByProgrammingLanguage[programmingLang] =
        userQueuesByProgrammingLanguage[programmingLang] || [];
      userQueuesByProgrammingLanguage[programmingLang].push({
        userId: userId,
        difficulties,
        programmingLang,
      });
      let event = new EventEmitter();
      waitingUsers.set(userId, event);
      event.on("matchFound", (match: Match) => {
        console.log(
          `Match found for user ${userId} with user ${
            match.userId1 === userId ? match.userId2 : match.userId1
          } and difficulty ${match.chosenDifficulty}`
        );
        socket.join(match.roomId);
        socket.emit("matchFound", match);
        clearTimeout(timer);
      });
      timer = setTimeout(() => {
        if (waitingUsers.has(userId)) {
          console.log(`No match found for user ${userId} yet.`);
          userQueuesByProgrammingLanguage[programmingLang] =
            userQueuesByProgrammingLanguage[programmingLang].filter(
              (user) => user.userId !== userId
            );
          waitingUsers.delete(userId);
          socket.emit("matchNotFound");
        }
      }, MAX_WAITING_TIME);
      console.log(`Queueing user ${userId}.`);
    }
  };
}
export function handleCancelLooking(
  userId: string,
  // eslint-disable-next-line no-undef
  timer: NodeJS.Timeout,
  userMatchReq: UserMatchReq
): (...args: any[]) => void {
  return async () => {
    console.log(`User ${userId} is no longer looking for a match`);
    clearTimeout(timer);
    userQueuesByProgrammingLanguage[userMatchReq.programmingLang] =
      userQueuesByProgrammingLanguage[userMatchReq.programmingLang].filter(
        (user) => user.userId !== userId
      );
    waitingUsers.delete(userId);
  };
}

export function handleLeaveMatch(
  userId: string,
  socket: Socket
): (...args: any[]) => void {
  return async () => {
    console.log(`User ${userId} has left the match`);

    const match = await prisma.match
      .findFirst({
        where: {
          OR: [{ userId1: userId }, { userId2: userId }],
        },
      })
      .catch((err) => {
        console.log(err);
        socket.emit("error", "An error occurred in leaveMatch.");
      });

    if (match) {
      // Notify the matched user
      const matchingUserId =
        match?.userId1 === userId ? match?.userId2 : match?.userId1;
      console.log(
        `Notifying user ${matchingUserId} that user ${userId} has left the match`
      );
      io.to(match.roomId).emit("matchLeft", match);

      await prisma
        .$transaction([
          prisma.user.update({
            where: { id: userId },
            data: { matchedUserId: null },
          }),
          prisma.user.update({
            where: {
              id: match.userId1 === userId ? match.userId2 : match.userId1,
            },
            data: { matchedUserId: null },
          }),
          prisma.match.delete({
            where: {
              roomId: match?.roomId,
            },
          }),
        ])
        .catch((err) => {
          console.log(err);
          socket.emit("error", "An error occurred in leaveMatch.");
        });
    }
  };
}

export function handleSendMessage(
  userId: string,
  socket: Socket
): (...args: any[]) => void {
  return async (message: string) => {
    if (!userId || !message) {
      console.log(`Invalid request from user ${userId}`);
      socket.emit("error", "Invalid request");
      return;
    }
    console.log(`User ${userId} sent a message: ${message}`);

    let hasError = false;
    const match = await prisma.match
      .findFirst({
        where: {
          OR: [{ userId1: userId }, { userId2: userId }],
        },
      })
      .catch((err) => {
        console.log(err);
        socket.emit("error", "An error occurred in sendMessage.");
        hasError = true;
      });

    if (hasError) {
      return;
    }

    const matchedUser =
      match?.userId1 === userId ? match?.userId2 : match?.userId1;

    if (matchedUser) {
      // Forward the message to the matched user
      socket.to(match?.roomId || "").emit("receiveMessage", userId, message);
    } else {
      // Error handling if the user tries to send a message without a match
      console.log(`User ${userId} is not currently matched with anyone.`);
      socket.emit("error", "You are not currently matched with anyone.");
    }
  };
}

export const findMatch = async (req: Request, res: Response) => {
  const io: Server = req.app.get("io");

  const userId = req.params.userId;
  const difficulties = req.body.difficulties || ["easy", "medium", "hard"];
  const programming_language = req.body.programming_language || "python";

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check if the user is already matched with another user
  if (user.matchedUserId) {
    const matchedUser = await prisma.user.findUnique({
      where: { id: user.matchedUserId },
    });

    if (matchedUser) {
      // Check for timeout or if the matched user has left
      const now = new Date();
      const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);

      if (
        !user.lastConnected ||
        user.lastConnected < sixtySecondsAgo ||
        !matchedUser.matchedUserId
      ) {
        // Break the match and update both users' status
        await prisma.user.update({
          where: { id: userId },
          data: { matchedUserId: null, lastConnected: null },
        });

        if (matchedUser.matchedUserId) {
          await prisma.user.update({
            where: { id: matchedUser.id },
            data: { matchedUserId: null, lastConnected: null },
          });
        }
      } else {
        // Update the lastConnected timestamp and reconnect the users
        const now = new Date();
        await prisma.user.update({
          where: { id: userId },
          data: {
            lastConnected: now,
          },
        });

        await prisma.user.update({
          where: { id: matchedUser.id },
          data: {
            lastConnected: now,
          },
        });

        // Emit match found event to both users
        io.to(userId.toString()).emit("matchFound", matchedUser);
        io.to(matchedUser.id.toString()).emit("matchFound", user);
        return res.json({ match: matchedUser });
      }
    }
  }

  if (user.isLookingForMatch) {
    return res
      .status(400)
      .json({ error: "User is already looking for a match" });
  }

  // Update user status to looking for a match
  await prisma.user.update({
    where: { id: userId },
    data: { isLookingForMatch: true },
  });

  // Try to find a match
  const match = await prisma.user.findFirst({
    where: { isLookingForMatch: true, id: { not: userId } },
  });

  if (match) {
    // Both users are matched
    await prisma.user.update({
      where: { id: userId },
      data: {
        isLookingForMatch: false,
        matchedUserId: match.id,
        lastConnected: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: match.id },
      data: {
        isLookingForMatch: false,
        matchedUserId: userId,
        lastConnected: new Date(),
      },
    });

    // This function and REST API seems to be not in use
    const questionId = await getRandomQuestionOfDifficulty(
      difficulties[0]
    ).then(
      // difficulties???? need to intersect difficulties or not
      (questionId) => {
        return questionId;
      }
    );

    // Emit match found event to both users
    io.to(userId.toString()).emit("matchFound", { match, questionId });
    io.to(match.id.toString()).emit("matchFound", { user, questionId });

    return res.json({ match, questionId });
  }

  // If no immediate match is found, keep the user in the queue
  return res.status(202).json({ message: "Looking for a match, please wait." });
};

export const leaveMatch = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.matchedUserId) {
    return res.status(400).json({ error: "User is not in a match" });
  }

  // Update both users' status
  await prisma.user.update({
    where: { id: userId },
    data: { matchedUserId: null, lastConnected: null },
  });

  await prisma.user.update({
    where: { id: user.matchedUserId },
    data: { matchedUserId: null, lastConnected: null },
  });

  res.status(200).json({ message: "Successfully left the match" });
};

export async function getMatch(req: Request, res: Response) {
  const room_id = req.params.room_id as string;

  const match = await prisma.match.findUnique({ where: { roomId: room_id } });

  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  return res.status(200).json({
    message: "Match exists",
    room_id: room_id,
    info: match,
  });
}

export async function updateMatchQuestion(req: Request, res: Response) {
  const room_id = req.params.room_id as string;

  const { questionId } = req.body;

  if (!questionId) {
    return res
      .status(400)
      .json({ error: "Invalid or missing questionId in the request body" });
  }

  const match = await prisma.match.findUnique({ where: { roomId: room_id } });

  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  try {
    const updatedMatch = await prisma.match.update({
      where: { roomId: room_id },
      data: {
        questionId,
      },
    });

    return res.status(200).json({
      message: "Match updated successfully",
      room_id: room_id,
      info: updatedMatch,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update the match" });
  }
}
