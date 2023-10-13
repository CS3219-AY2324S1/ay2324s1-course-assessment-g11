import express, { Request, Response } from "express";
import { Socket, Server } from "socket.io";

const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET;

interface Room {
  users: Array<string>;
  status: "active" | "inactive";
  text: string;
  saved_text?: string;
}

interface SocketDetails {
  room_id: string;
  user_id: string;
}

const sessions: Record<string, Room> = {};
const socketMap: Record<string, SocketDetails> = {};

// Data Access Layer
function mapSocketToRoomAndUser(
  socket_id: string,
  room_id: string,
  user_id: string
) {
  socketMap[socket_id] = {
    room_id: room_id,
    user_id: user_id,
  };
}

function updateStatus(socket_id: string) {
  if (!socketMap[socket_id]) {
    return;
  }
  const { room_id } = socketMap[socket_id];
  const session = sessions[room_id];
  if (!session) {
    return;
  }

  if (session.users.length === 0) {
    session.status = "inactive";
  } else {
    session.status = "active";
  }
}

function joinRoom(room_id: string, user_id: string): void {
  if (!sessions[room_id]) {
    sessions[room_id] = {
      users: [user_id],
      status: "active",
      text: "",
    };
  } else {
    sessions[room_id].users.push(user_id);
    sessions[room_id].status = "active";
  }
}

function saveRoom(room_id: string, text: string): void {
  if (!sessions[room_id]) {
    sessions[room_id] = {
      users: [],
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
      users: [],
      status: "active",
      text: text,
      saved_text: text,
    };
  } else {
    sessions[room_id].text = text;
    sessions[room_id].saved_text = text;
  }
}

function disconnectUserFromDb(socket_id: string): void {
  if (!socketMap[socket_id]) {
    return;
  }
  const { room_id, user_id } = socketMap[socket_id];
  const session = sessions[room_id];

  if (!session) {
    return;
  } else {
    const index = session.users.indexOf(user_id);
    if (index > -1) {
      sessions[room_id].users.splice(index, 1);
    }
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

function userDisconnect(socket: Socket): void {
  console.log("User disconnected:", socket.id);
  disconnectUserFromDb(socket.id);
  updateStatus(socket.id);
}

function initSocketListeners(io: Server, socket: Socket, room_id: string) {
  socket.on("/room/update", (text: string) =>
    roomUpdate(io, socket, room_id, text)
  );

  socket.on("/room/save", (text: string) => saveText(room_id, text));

  socket.on("/room/load", () => loadTextFromDb(io, socket, room_id));
}

function getTwilioAccessToken(room_id: string, user_id: string): string {
  const videoGrant = new VideoGrant({ room: room_id });
  const token = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET
  );
  token.addGrant(videoGrant);
  token.identity = user_id;
  return token.toJwt();
}

export const roomRouter = (io: Server) => {
  const router = express.Router();

  // API to get room details
  router.get("/:room_id", (req: Request, res: Response) => {
    const room_id = req.params.room_id as string;

    if (!sessions[room_id]) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.status(200).json({
      message: "Session exists",
      room_id: room_id,
      info: sessions[room_id],
    });
  });

  // API to join a room
  router.post("/join", (req: Request, res: Response) => {
    const room_id = req.body.room_id as string;
    const user_id = req.body.user_id as string;

    if (!room_id) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    try {
      joinRoom(room_id, user_id);

      const twilioAccessToken = getTwilioAccessToken(room_id, user_id);

      res.status(201).json({
        message: "Session created successfully",
        room_id: room_id,
        info: sessions[room_id],
        access_token: twilioAccessToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving session" });
    }

    io.once("connection", (socket: Socket) => {
      console.log("Room.ts: User connected:", socket.id);

      socket.join(room_id);
      mapSocketToRoomAndUser(socket.id, room_id, user_id);
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

    socket.on("/room/join", (room_id: string, user_id: string) => {
      socket.join(room_id);
      console.log(socket.id + " joined room:", room_id);
      joinRoom(room_id, user_id);
      mapSocketToRoomAndUser(socket.id, room_id, user_id);
      roomUpdateFromDb(io, socket, room_id);

      initSocketListeners(io, socket, room_id);
    });

    socket.on("disconnect", () => userDisconnect(socket));
  });

  return router;
};

export default roomRouter;
