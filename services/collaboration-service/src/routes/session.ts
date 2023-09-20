import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Server as SocketIOServer } from "socket.io";

interface Session {
  user1_id: string;
  user2_id: string;
  status: string;
  text: string;
}

const sessions: Record<string, Session> = {};

export const createSessionRoute = (io: SocketIOServer) => {
  const router = express.Router();

  router.post("/create", (req: Request, res: Response) => {
    const { user1_id, user2_id } = req.body;

    if (!user1_id || !user2_id || user1_id == user2_id) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    const session_id = uuidv4();

    sessions[session_id] = {
      user1_id,
      user2_id,
      status: "active",
      text: "",
    };

    res.status(200).json({
      session_id,
      user1_id,
      user2_id,
      status: "active",
    });

    const roomName = `session_${session_id}`;
    io.once("connection", (socket: any) => {
      socket.join(roomName);
      console.log(`${socket.id} joined room: ${roomName}`);
    });
  });

  router.post("/save", (req: Request, res: Response) => {
    try {
      const { session_id, text } = req.body;

      if (!(session_id in sessions)) {
        return res.status(400).json({ error: "Invalid sessionId provided" });
      }

      const session = sessions[session_id];
      session.text = text;
      session.status = "active";

      res.status(200).json({
        message: "Session saved successfully",
        session_id: session_id,
        user1_id: session.user1_id,
        user2_id: session.user2_id,
        status: session.status,
        text: session.text,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving session" });
    }
  });

  return router;
};
