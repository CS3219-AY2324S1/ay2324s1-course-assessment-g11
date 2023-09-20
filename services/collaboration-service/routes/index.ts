import express, { Request, Response } from 'express';
import { Socket } from 'socket.io';
import { io } from '../app';

export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket: Socket) => {
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
