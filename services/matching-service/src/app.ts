import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import matchingRoutes from "./routes/matchingRoutes";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/matching", matchingRoutes);

const httpServer = require("http").createServer(app);
const io = new Server(httpServer);

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on("lookingForMatch", async (userId: number) => {
    // Handle user looking for a match
    // You can call your matching logic here and emit events when a match is found
  });
});

httpServer.listen(port, () => {
  console.log(`Matching service is running at http://localhost:${port}`);
});
