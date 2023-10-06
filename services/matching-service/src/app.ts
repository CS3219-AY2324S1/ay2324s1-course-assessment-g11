import express from "express";
import { Server } from "socket.io";
import matchingRoutes from "./routes/matchingRoutes";
import prisma from "./prismaClient";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/matching-service", matchingRoutes);

const httpServer = require("http").createServer(app);
const io = new Server(httpServer);

app.set("io", io);

const usersQueue: number[] = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Remove user from queue if they disconnect
    const index = usersQueue.indexOf(parseInt(socket.id));
    if (index > -1) {
      usersQueue.splice(index, 1);
    }
  });

  socket.on("lookingForMatch", async (userId: number) => {
    console.log(`User ${userId} is looking for a match`);

    // Add user to the queue
    usersQueue.push(userId);

    // Attempt to find a match for the user
    const matchId = usersQueue.find((id) => id !== userId);
    if (matchId) {
      console.log(`Match found for user ${userId} with user ${matchId}`);

      // Inform both users of the match
      socket.emit("matchFound", userId, matchId);
      io.to(matchId.toString()).emit("matchFound", matchId, userId);

      // Update the database with the matched users (pseudo-code)
      await prisma.user.update({
        where: { id: userId },
        data: { matchedUserId: matchId },
      });

      await prisma.user.update({
        where: { id: matchId },
        data: { matchedUserId: userId },
      });

      // Remove the matched users from the queue
      usersQueue.splice(usersQueue.indexOf(userId), 1);
      usersQueue.splice(usersQueue.indexOf(matchId), 1);
    } else {
      console.log(`No match found for user ${userId} yet.`);
    }
  });

  socket.on("leaveMatch", async (userId: number) => {
    console.log(`User ${userId} has left the match`);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.matchedUserId) {
      // Notify the matched user
      io.to(user.matchedUserId.toString()).emit("matchLeft", userId);

      // Update database to remove matchedUserId for both users
      await prisma.user.update({
        where: { id: userId },
        data: { matchedUserId: null },
      });
      await prisma.user.update({
        where: { id: user.matchedUserId },
        data: { matchedUserId: null },
      });
    }
  });

  socket.on("sendMessage", async (userId: number, message: string) => {
    console.log(`User ${userId} sent a message: ${message}`);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.matchedUserId) {
      // Forward the message to the matched user
      io.to(user.matchedUserId.toString()).emit(
        "receiveMessage",
        userId,
        message
      );
    } else {
      // Error handling if the user tries to send a message without a match
      socket.emit("error", "You are not currently matched with anyone.");
    }
  });

  socket.on("matchFound", async (userId: number, matchedUserId: number) => {
    // todo - in the FE handle this
  });
});

httpServer.listen(port, () => {
  console.log(`Matching service is running at http://localhost:${port}`);
});
