import express, { Request, Response } from "express";
import { Socket, Server } from "socket.io";

interface Room {
  users_socket_id: Array<string>;
  status: "active" | "inactive";
  text: string;
  saved_text?: string;
}

const sessions: Record<string, Room> = {};
const users: Record<string, string> = {}; // true_user_id, socket_id

// Data Access Layer
function joinRoom(room_id: string, user_id: string): void {
  if (!sessions[room_id]) {
    sessions[room_id] = {
      users_socket_id: [user_id],
      status: "active",
      text: "",
    };
  } else {
    sessions[room_id].users_socket_id.push(user_id);
    sessions[room_id].status = "active";
  }
}

function saveRoom(room_id: string, text: string): void {
  if (!sessions[room_id]) {
    sessions[room_id] = {
      users_socket_id: [],
      status: "active",
      text: text,
    };
  } else {
    sessions[room_id].text = text;
  }
}

function saveText(room_id: string, text: string): void {
  if (!sessions[room_id]) {
    sessions[room_id] = {
      users_socket_id: [],
      status: "active",
      text: text,
      saved_text: text,
    };
  } else {
    sessions[room_id].text = text;
    sessions[room_id].saved_text = text;
  }
}

// Socket callbacks
function roomUpdate(
  io: Server,
  socket: Socket,
  room_id: string,
  text: string
): void {
  console.log(room_id + "  " + socket.id + " text changed:", text);
  io.to(room_id).emit("/room/update", { text });
  saveRoom(room_id, text);
}

function roomUpdateFromDb(io: Server, socket: Socket, room_id: string): void {
  if (sessions[room_id]) {
    const text = sessions[room_id].text;
    roomUpdate(io, socket, room_id, text);
  }
}

function loadTextFromDb(io: Server, socket: Socket, room_id: string): void {
  if (sessions[room_id] && sessions[room_id].saved_text) {
    const text = sessions[room_id].saved_text!;
    roomUpdate(io, socket, room_id, text);
  }
}

function initSocketListeners(io: Server, socket: Socket, room_id: string) {
  socket.on("/room/update", (text) => roomUpdate(io, socket, room_id, text));

  socket.on("/room/save", (text) => saveText(room_id, text));

  socket.on("/room/load", () => loadTextFromDb(io, socket, room_id));
}

export const roomRouter = (io: Server) => {
  const router = express.Router();

  // API to join a room
  router.post("/join", (req: Request, res: Response) => {
    const room_id = req.body.room_id as string;
    const user_id = req.body.user_id as string;

    if (!room_id) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    try {
      joinRoom(room_id, user_id);

      res.status(201).json({
        message: "Session created successfully",
        room_id: room_id,
        info: sessions[room_id],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving session" });
    }

    io.once("connection", (socket: Socket) => {
      console.log("Room.ts: User connected:", socket.id);

      socket.join(room_id);
      console.log(socket.id + " joined room:", room_id);
      roomUpdateFromDb(io, socket, room_id);

      initSocketListeners(io, socket, room_id);
    });
  });

  // API to save text
  router.post("/save", (req: Request, res: Response) => {
    try {
      const room_id = req.body.room_id as string;
      const text = req.body.text as string;

      if (!(room_id in sessions)) {
        return res.status(400).json({ error: "Invalid roomId provided" });
      }

      saveText(room_id, text);

      res.status(201).json({
        message: "Session saved successfully",
        info: sessions[room_id],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving session" });
    }
  });

  // WebSocket style API
  io.on("connection", (socket: Socket) => {
    console.log("Room.ts: User connected:", socket.id);

    socket.on("/room/join", (room_id: string) => {
      socket.join(room_id);
      console.log(socket.id + " joined room:", room_id);
      joinRoom(room_id, socket.id);
      roomUpdateFromDb(io, socket, room_id);

      initSocketListeners(io, socket, room_id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return router;
};

export default roomRouter;
