import express from "express";
import { updateMatchQuestion } from "../controllers/matchingController";

const router = express.Router();

router.patch("/match/:room_id", updateMatchQuestion);
router.get("/demo", (req, res) => res.sendFile(__dirname + "/index.html"));

export default router;
