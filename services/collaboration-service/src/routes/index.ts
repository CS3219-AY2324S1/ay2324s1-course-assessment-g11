import express from "express";
import { Server as SocketIOServer } from "socket.io";

export const createTestRoute = (io: SocketIOServer) => {
  const router = express.Router();

  router.get("/", (req: Request, res: any) => {
    res.sendFile(__dirname + "/index.html");

    io.once("connection", (socket: any) => {
      console.log("User connected:", socket.id);

      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        console.log(socket.id + " joined room:", roomId);

        socket.on("textchange", (text: string) => {
          io.to(roomId).emit("textchange", { text });
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  });

  return router;
};
