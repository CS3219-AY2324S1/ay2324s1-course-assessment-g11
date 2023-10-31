import express from "express";
import {
  findMatch,
  getMatch,
  leaveMatch,
  updateMatchQuestion,
} from "../controllers/matchingController";

const router = express.Router();

router.get("/:userId/findMatch", findMatch);
router.post("/:userId/leave", leaveMatch);
router.get("/match/:room_id", getMatch);
router.patch("/match/:room_id", updateMatchQuestion);
router.get("/demo", (req, res) => res.sendFile(__dirname + "/index.html"));

export default router;
