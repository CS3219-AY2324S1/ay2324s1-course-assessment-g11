// import { query, client_query } from "../db/index";
import express from "express";
export const router = express.Router();

router.get("/", async (req: any, res: { send: (arg0: string) => any; }, next: any) => {
  // const result = await db.query("SELECT * FROM users.users;");
  // res.json(result);
  return res.send("user-service");
});