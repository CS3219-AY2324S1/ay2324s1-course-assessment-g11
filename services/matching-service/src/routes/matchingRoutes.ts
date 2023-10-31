import express from "express";
import * as matchingController from "../controllers/matchingController";

const router = express.Router();

router.get("/:userId/findMatch", matchingController.findMatch);
router.post("/:userId/leave", matchingController.leaveMatch);
router.get("/match/:room_id", matchingController.getMatch);
router.patch("/match/:room_id", matchingController.updateMatchQuestion);
router.get("/demo", (req, res) => res.sendFile(__dirname + "/index.html"));

export default router;
