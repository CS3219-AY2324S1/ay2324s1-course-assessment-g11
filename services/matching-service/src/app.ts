import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import matchingRoutes from "./routes/matchingRoutes";
import { handleConnection, handleDisconnect, handleLooking } from "./controllers/matchingController";
import { handleCancelLooking } from "./controllers/matchingController";
import { handleLeaveMatch } from "./controllers/matchingController";
import { handleSendMessage } from "./controllers/matchingController";

const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());
app.use(logger("dev"));
app.use("/api/matching-service", matchingRoutes);

const httpServer = require("http").createServer(app);
export const io = new Server(httpServer);

app.set("io", io);

io.on("connection", (socket) => {
  let { userId, userMatchReq, timer } = handleConnection(socket);

  socket.on("disconnect", handleDisconnect(socket, timer, userId, userMatchReq));

  socket.on("lookingForMatch", handleLooking(socket, userId, userMatchReq, timer));

  socket.on("cancelLooking", handleCancelLooking(userId, timer, userMatchReq))

  socket.on("leaveMatch", handleLeaveMatch(userId, socket));

  socket.on("sendMessage", handleSendMessage(userId, socket));

  socket.on("matchFound", async (userId: string, matchedUserId: string) => {
    // todo - in the FE handle this
  });


});

httpServer.listen(port, () => {
  console.log(`Matching service is running at http://localhost:${port}`);
});

