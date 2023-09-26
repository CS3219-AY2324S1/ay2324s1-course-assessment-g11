import express, { Request, Response } from "express";

export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.sendFile(__dirname + "/index.html");
});
