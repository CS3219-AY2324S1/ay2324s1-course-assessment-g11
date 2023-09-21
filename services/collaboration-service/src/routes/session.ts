import express, { Request, Response } from 'express';
import { Socket } from 'socket.io';
import { io } from '../app';
import { v4 as uuidv4 } from "uuid";

export const router = express.Router();

interface Session {
  user1_id: string;
  user2_id: string;
  status: "active" | "inactive";
  text: string;
}

// Simulated database to store session information
const sessions: Record<string, Session> = {};

interface CreateSessionRequest extends Request{
  body: {
    user1_id: string;
    user2_id: string;
  }
}

// API to create a collaborative session
router.post("/create", (req: CreateSessionRequest, res: Response) => {
  /*	#swagger.requestBody = {
        required: true,
        schema: {
          properties: {
              user1_id: {
                  type: "string"
              },
              user2_id: {
                  type: "string"
              }
            }
          }
      } */
  
  // Extract user information from the request (assuming user1 and user2 IDs)
  const { user1_id, user2_id } = req.body;

  console.log(user1_id);
  console.log(user2_id);

  if (!user1_id || !user2_id || user1_id == user2_id) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  const session_id: string = uuidv4();

  // Create a database entry for the session
  sessions[session_id] = {
    user1_id,
    user2_id,
    status: "active",
    text: "",
  };

  // Respond with the session details
  res.status(200).json({
    session_id,
    user1_id,
    user2_id,
    status: "active",
  });

  // Users to join the room
  const roomName = `session_${session_id}`;

  //// Todo - fix this
  io.once("connection", (socket: Socket) => {
    socket.join(roomName);
    console.log(socket.id + " joined room:" + roomName);
  });
});

interface SaveSessionRequest extends Request{
  body: {
    session_id: string;
    text: string;
  }
}

// API to save session information
router.post("/save", (req: SaveSessionRequest, res: Response) => {
  try {
    const { session_id, text } = req.body;
    console.log(session_id);

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
