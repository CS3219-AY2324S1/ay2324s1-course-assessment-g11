import express, { Request, Response } from 'express';
import { Socket } from 'socket.io';
import { io } from '../app';

export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/index.html");
});
