import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import matchingRoutes from "./routes/matchingRoutes";
import {
  handleConnection,
  handleDisconnect,
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

io.on("connection", (socket) => {
  let { userId, userMatchReq, timer } = handleConnection(socket);

  socket.on(
    "disconnect",
    handleDisconnect(socket, timer, userId, userMatchReq)
  );

  socket.on(
    "lookingForMatch",
    handleLooking(socket, userId, userMatchReq, timer)
  );

  socket.on("cancelLooking", handleCancelLooking(userId, timer, userMatchReq));

  socket.on("leaveMatch", handleLeaveMatch(userId, socket));

  socket.on("sendMessage", handleSendMessage(userId, socket));

  socket.on("matchFound", async (userId: string, matchedUserId: string) => {
    // todo - in the FE handle this
  });
});

httpServer.listen(port, () => {
  console.log(`matching-service is running on the port ${port}`);
});
