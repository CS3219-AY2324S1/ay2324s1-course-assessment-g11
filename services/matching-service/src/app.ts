import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import matchingRoutes from "./routes/matchingRoutes";
import prisma from "./prismaClient";

const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());
app.use(logger("dev"));
app.use("/api/matching-service", matchingRoutes);

const httpServer = require("http").createServer(app);
const io = new Server(httpServer);

app.set("io", io);

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

const waitingUsers: Map<string, string> = new Map(); // key: user id, val: socket id

const matchedUsers: Map<string, {username: string, socketId: string}> = new Map(); // key: user id, val: socket id

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  let userMatchReq: UserMatchReq = {
    userId: "",
    difficulties: [],
    programmingLang: "python"
  };

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove user from queue if they disconnect
    if (waitingUsers.has(userMatchReq.userId)) {
      console.log(`User ${userMatchReq.userId} disconnected while waiting for a match`);
      userQueuesByProgrammingLanguage[userMatchReq.programmingLang] = userQueuesByProgrammingLanguage[userMatchReq.programmingLang].filter(user => user.userId !== userMatchReq.userId);
      waitingUsers.delete(userMatchReq.userId);
    }
    if (matchedUsers.has(userMatchReq.userId)) {
      console.log(`User ${userMatchReq.userId} disconnected while in a match`);
      const matchingUser = matchedUsers.get(userMatchReq.userId);
      io.to(matchingUser?.socketId || "").emit("matchLeft", userMatchReq.userId);
      matchedUsers.delete(userMatchReq.userId);
      matchedUsers.delete(matchingUser?.username || "");
    }
  });

  socket.on("lookingForMatch", async (userId: string, difficulties: string[], programmingLang: string) => {
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
    userMatchReq.difficulties = difficulties;
    userMatchReq.programmingLang = programmingLang;

    console.log(`User ${userId} is looking for a match with difficulties ${difficulties} and programming language ${programmingLang}`);

    // Add user to the queue
    userQueuesByProgrammingLanguage[programmingLang].push({ userId: userId, difficulties, programmingLang });
    // usersQueue.push(userId);
    waitingUsers.set(userId, socket.id);

    // Attempt to find a match for the user
    const matchedUser = userQueuesByProgrammingLanguage[programmingLang]
      .find((userMatchReq) => userMatchReq.userId !== userId &&
        userMatchReq.difficulties.filter(v => difficulties.includes(v)));
    const matchId = matchedUser?.userId;
    const difficulty = matchedUser?.difficulties.find(v => difficulties.includes(v));
    if (matchId) {
      console.log(`Match found for user ${userId} with user ${matchId} and difficulty ${difficulty}`);

      // Inform both users of the match
      socket.emit("matchFound", userId, matchId);
      const matchingSocketId = waitingUsers.get(matchId)?.toString() || "";
      matchedUsers.set(userId, {username: matchId, socketId: matchingSocketId});
      matchedUsers.set(matchId, {username: userId, socketId: socket.id});
      io.to(matchingSocketId).emit("matchFound", matchId, userId);

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
      userQueuesByProgrammingLanguage[programmingLang] = userQueuesByProgrammingLanguage[programmingLang].filter(user => user.userId !== userId && user.userId !== matchId);
      waitingUsers.delete(userId);
      waitingUsers.delete(matchId);

    } else {
      console.log(`No match found for user ${userId} yet.`);
    }
  });

  socket.on("cancelLooking", async () => {
    console.log(`User ${userMatchReq.userId} is no longer looking for a match`);
    userQueuesByProgrammingLanguage[userMatchReq.programmingLang] = userQueuesByProgrammingLanguage[userMatchReq.programmingLang].filter(user => user.userId !== userMatchReq.userId);
    waitingUsers.delete(userMatchReq.userId);
  })

  socket.on("leaveMatch", async () => {
    console.log(`User ${userMatchReq.userId} has left the match`);

    const user = await prisma.user.findUnique({ where: { id: userMatchReq.userId } });

    if (user?.matchedUserId) {
      // Notify the matched user
      const matchingUser = matchedUsers.get(userMatchReq.userId);
      console.log(`Notifying user ${user.matchedUserId} that user ${userMatchReq.userId} has left the match using socket ${matchingUser?.socketId}`);
      io.to(matchingUser?.socketId || "").emit("matchLeft", userMatchReq.userId);
      
      matchedUsers.delete(userMatchReq.userId);
      matchedUsers.delete(matchingUser?.username || "");

      // Update database to remove matchedUserId for both users
      await prisma.user.update({
        where: { id: userMatchReq.userId },
        data: { matchedUserId: null },
      });
      await prisma.user.update({
        where: { id: user.matchedUserId },
        data: { matchedUserId: null },
      });
    }
  });

  socket.on("sendMessage", async (userId: string, message: string) => {
    console.log(`User ${userId} sent a message: ${message}`);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.matchedUserId) {
      // Forward the message to the matched user
      io.to(matchedUsers.get(user.matchedUserId)?.socketId || "").emit(
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
