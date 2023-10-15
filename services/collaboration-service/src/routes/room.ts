import express, { Request, Response } from "express";
import { type } from "ot-text-unicode";
import { Socket, Server } from "socket.io";

import { Room } from "@prisma/client";
import {
  createOrUpdateRoomWithUser,
  removeUserFromRoom,
  updateRoomText,
  updateRoomStatus,
  getRoomText,
  saveRoomText,
  isRoomExists,
  getRoom,
  getSavedRoomText,
} from "../db/prisma-db";

import {
  OpHistoryMap,
  TextOperationSet,
  TextOperationSetWithCursor,
  getTransformedOperations,
  transformPosition,
} from "../ot";

interface SocketDetails {
  room_id: string;
  user_id: string;
}

enum SocketEvents {
  ROOM_JOIN = "api/collaboration-service/room/join",
  ROOM_UPDATE = "api/collaboration-service/room/update",
  ROOM_SAVE = "api/collaboration-service/room/save",
  ROOM_LOAD = "api/collaboration-service/room/load",
}

const socketMap: Record<string, SocketDetails> = {};
const opMap: OpHistoryMap = new OpHistoryMap();


const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET;

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
  updateRoomStatus(room_id);
}

function disconnectUserFromDb(socket_id: string): void {
  if (!socketMap[socket_id]) {
    return;
  }
  const { room_id, user_id } = socketMap[socket_id];
  removeUserFromRoom(room_id, user_id);
}

// Socket callbacks
function roomUpdate(
  io: Server,
  socket: Socket,
  room_id: string,
  text: string
): void {
  console.log(room_id + "  " + socket.id + " text changed:", text);
  const version = opMap.getLatest(room_id)?.version ?? 1;
  io.to(room_id).emit(SocketEvents.ROOM_UPDATE, { version, text });
  updateRoomText(room_id, text);
}

function roomUpdateWithCursor(
  io: Server,
  socket: Socket,
  room_id: string,
  text: string,
  cursor: number
): void {
  console.log(
    room_id + "  " + socket.id + " text changed:",
    text,
    " cursor:" + cursor
  );
  const version = opMap.getLatest(room_id)?.version ?? 1;
  socket.broadcast
    .to(room_id)
    .emit(SocketEvents.ROOM_UPDATE, { version, text });
  socket.emit(SocketEvents.ROOM_UPDATE, { version, text, cursor });
  updateRoomText(room_id, text);
}

async function handleTextOp(
  textOpSet: TextOperationSetWithCursor,
  room_id: string
): Promise<{ text: string; cursor: number }> {
  console.log(textOpSet);
  console.log(opMap.getLatest(room_id)?.version);
  var resultTextOps = textOpSet.operations;

  if (opMap.checkIfLatestVersion(room_id, textOpSet.version)) {
    textOpSet.version++;
    opMap.add(room_id, textOpSet);
  } else {
    const latestOp = textOpSet.operations;
    const mergedOp = opMap.getCombinedTextOpFromVersionToLatest(
      room_id,
      textOpSet.version + 1
    );
    const [transformedLatestOp, transformedMergedOp] = getTransformedOperations(
      latestOp,
      mergedOp
    );
    opMap.add(room_id, {
      version: textOpSet.version + 1,
      operations: transformedLatestOp,
    });
    console.log(transformedLatestOp);
    resultTextOps = transformedLatestOp;
  }

  return getRoomText(room_id).then((text) => {
    var resultText = text;

    try {
      resultText = type.apply(text, resultTextOps);
    } catch (error) {
      // gracefully skip transforming
      console.log(error);
    }

    return {
      text: resultText,
      cursor: textOpSet.cursor
        ? transformPosition(textOpSet.cursor, resultTextOps)
        : -1,
    };
  });
}

async function roomUpdateWithTextFromDb(
  io: Server,
  socket: Socket,
  room_id: string
): Promise<void> {
  await getRoomText(room_id).then((text) => {
    roomUpdate(io, socket, room_id, text);
  });
}

async function loadTextFromDb(
  io: Server,
  socket: Socket,
  room_id: string
): Promise<void> {
  await getSavedRoomText(room_id).then((text) => {
    if (text) {
      roomUpdate(io, socket, room_id, text);
    }
  });
}

function userDisconnect(socket: Socket): void {
  console.log("User disconnected:", socket.id);
  disconnectUserFromDb(socket.id);
  updateStatus(socket.id);
}

function initSocketListeners(io: Server, socket: Socket, room_id: string) {
  socket.on(
    SocketEvents.ROOM_UPDATE,
    async (textOpSet: TextOperationSetWithCursor, ackCallback) => {
      await handleTextOp(textOpSet, room_id).then(({ text, cursor }) => {
        if (cursor > -1) {
          roomUpdateWithCursor(io, socket, room_id, text, cursor);
        } else {
          roomUpdate(io, socket, room_id, text);
        }
        ackCallback();
      });
    }
  );

  socket.on(SocketEvents.ROOM_SAVE, (text: string) =>
    saveRoomText(room_id, text)
  );

  socket.on(SocketEvents.ROOM_LOAD, () => loadTextFromDb(io, socket, room_id));
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

  router.get("/:room_id", (req: Request, res: Response) => {
    const room_id = req.params.room_id as string;

    if (!isRoomExists(room_id)) {
      return res.status(404).json({ error: "Room not found" });
    }

    return res.status(200).json({
      message: "Room exists",
      room_id: room_id,
      info: getRoom(room_id),
    });
  });

  router.post("/save", (req: Request, res: Response) => {
    try {
      const room_id = req.body.room_id as string;
      const text = req.body.text as string;

      if (!isRoomExists(room_id)) {
        return res.status(400).json({ error: "Invalid roomId provided" });
      }

      saveRoomText(room_id, text);

      res.status(201).json({
        message: "Room saved successfully",
        info: getRoom(room_id),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving room" });
    }
  });

  // WebSocket style API
  io.on("connection", (socket: Socket) => {
    console.log("Room.ts: User connected:", socket.id);

    socket.on(SocketEvents.ROOM_JOIN, (room_id: string, user_id: string) => {
      socket.join(room_id);
      console.log(socket.id + " joined room:", room_id);
      createOrUpdateRoomWithUser(room_id, user_id);
      mapSocketToRoomAndUser(socket.id, room_id, user_id);
      roomUpdateWithTextFromDb(io, socket, room_id);

      initSocketListeners(io, socket, room_id);
    });

    socket.on("disconnect", () => userDisconnect(socket));
  });

  return router;
};

export default roomRouter;
