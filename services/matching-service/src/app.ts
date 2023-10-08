import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { io as ioClient } from "socket.io-client";
import matchingRoutes from "./routes/matchingRoutes";
import prisma from "./prismaClient";
import { Match, Prisma } from "@prisma/client";
import EventEmitter from "events";

const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());
app.use(logger("dev"));
app.use("/api/matching-service", matchingRoutes);

const httpServer = require("http").createServer(app);
const io = new Server(httpServer);

app.set("io", io);

const MAX_WAITING_TIME = 60 * 1000; // 60 seconds

type UserMatchReq = {
  userId: string;
  difficulties: string[];
  programmingLang: string;
};

const userQueuesByProgrammingLanguage: { [language: string]: UserMatchReq[] } = {
  "python": [],
  "java": [],
  "cpp": []
};

const waitingUsers: Map<string, EventEmitter> = new Map(); // key: user id, val: Event

io.on("connection", (socket) => {
  let userId = socket.handshake.query.username as string || "";
  console.log(`User connected: ${socket.id} and username ${userId}`);

  let userMatchReq: UserMatchReq = {
    userId: userId,
    difficulties: [],
    programmingLang: "python"
  };

  prisma.match.findFirst({
    where: {
      OR: [
        { userId1: userId },
        { userId2: userId }
      ]
    }
  }).then(existingMatch => {
    if (existingMatch) {
      console.log(`User ${userId} is already matched with user ${existingMatch.userId1 === userId ? existingMatch.userId2 : existingMatch.userId1}`);
      socket.emit("error", "You are already matched with someone.");
      socket.join(existingMatch.roomId);
      socket.emit("matchFound", existingMatch);
    }
  });
  let timer = setTimeout(() => { }, 0);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove user from queue if they disconnect
    clearTimeout(timer);
    if (waitingUsers.has(userMatchReq.userId)) {
      console.log(`User ${userMatchReq.userId} disconnected while waiting for a match`);
      userQueuesByProgrammingLanguage[userMatchReq.programmingLang] = userQueuesByProgrammingLanguage[userMatchReq.programmingLang].filter(user => user.userId !== userMatchReq.userId);
      waitingUsers.get(userMatchReq.userId)?.removeAllListeners();
      waitingUsers.delete(userMatchReq.userId);
    }
    // Match should not be cancelled since the user might reconnect
  });

  socket.on("lookingForMatch", async (userId: string, difficulties: string[], programmingLang: string) => {
    if (!userId || !difficulties || !programmingLang) {
      console.log(`Invalid request from user ${userId}`);
      socket.emit("error", "Invalid request");
      return;
    }
    if (waitingUsers.has(userMatchReq.userId)) {
      console.log(`User ${userId} is already in the queue`);
      return;
    }
    if (userMatchReq.userId && userMatchReq.userId !== userId) {
      console.log(`Different username. Please log in again.`);
      return;
    } else if (!userMatchReq.userId) {
      userMatchReq.userId = userId;
    }

    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { userId1: userId },
          { userId2: userId }
        ]
      }
    });

    if (existingMatch) {
      console.log(`User ${userId} is already matched with user ${existingMatch.userId1 === userId ? existingMatch.userId2 : existingMatch.userId1}`);
      socket.emit("error", "You are already matched with someone.");
      socket.join(existingMatch.roomId);
      socket.emit("matchFound", existingMatch);
      return;
    }

    userMatchReq.difficulties = difficulties;
    userMatchReq.programmingLang = programmingLang;

    console.log(`User ${userId} is looking for a match with difficulties ${difficulties} and programming language ${programmingLang}`);

    // Attempt to find a match for the user
    const matchedUser = userQueuesByProgrammingLanguage[programmingLang]
      .find((userMatchReq) => userMatchReq.userId !== userId &&
        userMatchReq.difficulties.filter(v => difficulties.includes(v)));
    const matchId = matchedUser?.userId;
    const difficulty = matchedUser?.difficulties.find(v => difficulties.includes(v));

    if (matchId) {
      console.log(`Match found for user ${userId} with user ${matchId} and difficulty ${difficulty}`);

      // Inform both users of the match
      const newMatch = await prisma.match.create({
        data: {
          userId1: userId,
          userId2: matchId,
          chosenDifficulty: difficulty || "easy",
          chosenProgrammingLanguage: programmingLang
        }
      });
      waitingUsers.get(matchId)?.emit("matchFound", newMatch);
      socket.emit("matchFound", newMatch);
      socket.join(newMatch.roomId);

      // Update the database with the matched users (pseudo-code)
      await prisma.user.update({
        where: { id: userId },
        data: { matchedUserId: matchId },
      });

      await prisma.user.update({
        where: { id: matchId },
        data: { matchedUserId: userId },
      });

      // Remove both users from the queue
      userQueuesByProgrammingLanguage[programmingLang] = userQueuesByProgrammingLanguage[programmingLang].filter(user => user.userId !== matchId && user.userId !== userId);
      waitingUsers.delete(matchId);
      waitingUsers.delete(userId);

    } else {
      // Add user to the queue
      userQueuesByProgrammingLanguage[programmingLang].push({ userId: userId, difficulties, programmingLang });
      let event = new EventEmitter();
      waitingUsers.set(userId, event);
      event.on("matchFound", (match: Match) => {
        console.log(`Match found for user ${userId} with user ${match.userId1 === userId ? match.userId2 : match.userId1} and difficulty ${match.chosenDifficulty}`);
        socket.join(match.roomId);
        socket.emit("matchFound", match);
        clearTimeout(timer);
      });
      setTimeout(() => {
        if (waitingUsers.has(userId)) {
          console.log(`No match found for user ${userId} yet.`);
          userQueuesByProgrammingLanguage[programmingLang] = userQueuesByProgrammingLanguage[programmingLang].filter(user => user.userId !== userId);
          waitingUsers.delete(userId);
          socket.emit("matchNotFound");
        }
      }, MAX_WAITING_TIME);
      console.log(`Queueing user ${userId}.`);
    }
  });

  socket.on("cancelLooking", async () => {
    console.log(`User ${userMatchReq.userId} is no longer looking for a match`);
    clearTimeout(timer);
    userQueuesByProgrammingLanguage[userMatchReq.programmingLang] = userQueuesByProgrammingLanguage[userMatchReq.programmingLang].filter(user => user.userId !== userMatchReq.userId);
    waitingUsers.delete(userMatchReq.userId);
  })

  socket.on("leaveMatch", async () => {
    console.log(`User ${userMatchReq.userId} has left the match`);

    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { userId1: userMatchReq.userId },
          { userId2: userMatchReq.userId }
        ]
      }
    });

    if (match) {
      // Notify the matched user
      await prisma.match.delete(
        {
          where: {
            roomId: match?.roomId
          }
        }
      );
      const matchingUserId = match?.userId1 === userMatchReq.userId ? match?.userId2 : match?.userId1;
      console.log(`Notifying user ${matchingUserId} that user ${userMatchReq.userId} has left the match`);
      io.to(match.roomId).emit("matchLeft", match);

      // Update database to remove matchedUserId for both users
      await prisma.user.update({
        where: { id: userMatchReq.userId },
        data: { matchedUserId: null },
      });
      await prisma.user.update({
        where: { id: matchingUserId },
        data: { matchedUserId: null },
      });
    }
  });

  socket.on("sendMessage", async (userId: string, message: string) => {
    if (!userId || !message) {
      console.log(`Invalid request from user ${userId}`);
      socket.emit("error", "Invalid request");
      return;
    }
    console.log(`User ${userId} sent a message: ${message}`);

    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { userId1: userId },
          { userId2: userId }
        ]
      }
    });

    const matchedUser = match?.userId1 === userId ? match?.userId2 : match?.userId1;

    if (matchedUser) {
      // Forward the message to the matched user
      socket.to(match?.roomId || "").emit(
        "receiveMessage",
        userId,
        message
      );
    } else {
      // Error handling if the user tries to send a message without a match
      console.log(`User ${userId} is not currently matched with anyone.`)
      socket.emit("error", "You are not currently matched with anyone.");
    }
  });

  socket.on("matchFound", async (userId: string, matchedUserId: string) => {
    // todo - in the FE handle this
  });
});

httpServer.listen(port, () => {
  console.log(`Matching service is running at http://localhost:${port}`);
});
