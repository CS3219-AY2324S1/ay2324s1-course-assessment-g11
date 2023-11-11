import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import matchingRoutes from "./routes/matchingRoutes";
import {
  handleConnection,
  handleDisconnect,
  handleJoinRoom,
  handleLooking,
} from "./controllers/matchingController";
import { handleCancelLooking } from "./controllers/matchingController";
import { handleLeaveMatch } from "./controllers/matchingController";
import { handleSendMessage } from "./controllers/matchingController";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";

const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use("/api/matching-service", matchingRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

const socketIoOptions: any = {
  cors: {
    origin: process.env.FRONTEND_ADDRESS || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
  },
};

const httpServer = require("http").createServer(app);
export const io = new Server(httpServer, socketIoOptions);

app.set("io", io);

io.on("connection", async (socket) => {
  let userId = await handleConnection(socket);

  socket.on(
    "disconnect",
    handleDisconnect(socket, userId)
  );

  socket.on(
    "lookingForMatch",
    handleLooking(socket, userId)
  );

  socket.on("cancelLooking", handleCancelLooking(userId));

  socket.on("leaveMatch", handleLeaveMatch(userId, socket));

  socket.on("sendMessage", handleSendMessage(userId, socket));

  socket.on("joinRoom", handleJoinRoom(userId, socket));

});

httpServer.listen(port, () => {
  console.log(`matching-service is running on the port ${port}`);
});
