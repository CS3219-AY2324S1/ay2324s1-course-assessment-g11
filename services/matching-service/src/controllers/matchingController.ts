import { Request, Response } from "express";
import { Socket } from "socket.io";
import { io } from "../app";
import prisma from "../prismaClient";
import { getRandomQuestionOfDifficulty } from "../questionAdapter";
import { EnumRoomStatus } from "@prisma/client";

export const MAX_WAITING_TIME = 60 * 1000; // 60 seconds

export async function handleConnection(socket: Socket) {
  let userId = (socket.handshake.query.username as string) || "";
  console.log(`User connected: ${socket.id} and username ${userId}`);

  const { count: earlierWaitingCount } = await prisma.waitingUser.deleteMany({
    where: {
      userId: userId,
    },
  });

  if (earlierWaitingCount >= 1) {
    console.log(`User ${userId} was waiting in the queue in another session`);
    socket.emit(
      "error",
      "You are already waiting in the queue in another session. You will be removed from the queue."
    );
  }

  // Join the room if the user is in a match
  const existingMatch = await prisma.match.findFirst({
    where: {
      OR: [{ userId1: userId }, { userId2: userId }],
    },
  });

  if (existingMatch) {
    socket.join(existingMatch.roomId);
    socket.emit("matchFound", existingMatch);
  }

  return userId;
}

export function handleDisconnect(socket: Socket, userId: string) {
  return () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove user from queue if they disconnect
    prisma.waitingUser
      .deleteMany({
        where: {
          userId: userId,
        },
      })
      .catch((err) => {
        console.log(err);
      });

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
      });
  };
}

export function handleLooking(
  socket: Socket,
  userId: string
): (difficulties: string[], programmingLang: string) => Promise<void> {
  return async (difficulties: string[], programmingLang: string) => {
    if (!difficulties || !programmingLang) {
      console.log(`Invalid request from user ${userId}`);
      socket.emit("error", "Invalid request");
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

    console.log(`User ${userId} is looking for a match with difficulties ${difficulties} and language ${programmingLang}. Initial state of queue: `, await prisma.waitingUser.findMany());

    let { newMatch: foundMatch, matchingUser } = await prisma.$transaction(
      async (tx) => {
        const matchingUser = await tx.waitingUser.findFirst({
          where: {
            progLang: programmingLang,
            difficulty: {
              hasSome: difficulties,
            },
            createdAt: {
              gte: new Date(Date.now() - MAX_WAITING_TIME),
            },
          },
        });
        if (matchingUser) {
          const commonDifficulty = matchingUser.difficulty.find((v) =>
            difficulties.includes(v)
          );
          const newMatch = await tx.match.create({
            data: {
              userId1: matchingUser.userId,
              userId2: userId,
              chosenDifficulty: commonDifficulty || "easy",
              chosenProgrammingLanguage: programmingLang,
            },
          });
          await tx.room.create({
            data: {
              room_id: newMatch.roomId,
              status: EnumRoomStatus.active,
              text: "",
            },
          });
          await tx.waitingUser.deleteMany({
            where: {
              userId: {
                in: [matchingUser.userId, userId],
              },
            },
          });
          return { newMatch, matchingUser };
        } else {
          await tx.waitingUser.create({
            data: {
              userId: userId,
              progLang: programmingLang,
              difficulty: difficulties,
              socketId: socket.id,
            },
          });
          return {
            newMatch: null,
            matchingUser: null,
          };
        }
      }
    );

    if (!foundMatch) {
      console.log(`No match found yet. Queued user ${userId}. Current queue: `, await prisma.waitingUser.findMany());
      return;
    }

    const qnId = await getRandomQuestionOfDifficulty(
      foundMatch.chosenDifficulty
    );
    foundMatch = await prisma.match.update({
      where: {
        roomId: foundMatch.roomId,
      },
      data: {
        questionId: qnId,
      },
    });

    console.log(
      `Match found for user ${userId} with user ${
        foundMatch.userId1 === userId ? foundMatch.userId2 : foundMatch.userId1
      }, difficulty ${foundMatch.chosenDifficulty} and language ${foundMatch.chosenProgrammingLanguage}.
      Current queue: `,
      await prisma.waitingUser.findMany()
    );

    // Inform both users of the match
    socket.emit("matchFound", foundMatch);
    io.to(matchingUser?.socketId || "").emit("matchFound", foundMatch);
  };
}

export function handleCancelLooking(userId: string): () => Promise<void> {
  return async () => {
    await prisma.waitingUser.deleteMany({
      where: {
        userId: userId,
      },
    });
    console.log(`User ${userId} is no longer looking for a match. In queue now: `, await prisma.waitingUser.findMany());
  };
}

export function handleJoinRoom(
  userId: string,
  socket: Socket
): (roomId: string) => void {
  return (roomId: string) => {
    // TODO: Check if the user is in a match with relevant room id
    console.log(`User ${socket.id} is joining room ${roomId}`);
    socket.join(roomId);
  };
}

export function handleLeaveMatch(
  userId: string,
  socket: Socket
): () => Promise<void> {
  return async () => {
    console.log(`User ${userId} has left the match`);
    // socket.emit("userLeft", userId);

    const deletedRoom = await prisma.$transaction(async (tx) => {
      const match = await tx.match.findFirst({
        where: {
          OR: [{ userId1: userId }, { userId2: userId }],
        },
      });
      if (!match) {
        console.log(`User ${userId} is not currently matched with anyone.`);
        socket.emit("error", "You are not currently matched with anyone.");
        return;
      }
      return await tx.match.delete({
        where: {
          roomId: match?.roomId,
        },
      });
    });

    if (deletedRoom) {
      console.log(`Room ${deletedRoom} has been deleted`);
      io.to(deletedRoom.roomId).emit("matchLeft", deletedRoom);
    }
  };
}

export function handleSendMessage(
  userId: string,
  socket: Socket
): (message: string) => Promise<void> {
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
