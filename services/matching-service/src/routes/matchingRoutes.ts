import express from "express";
import * as matchingController from "../controllers/matchingController";

const router = express.Router();

router.get("/:userId/findMatch", matchingController.findMatch);
router.post("/:userId/leave", matchingController.leaveMatch);

export default router;
