// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'express'.
const express = require("express");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'router'.
const router = express.Router();
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { v4: uuidv4 } = require("uuid"); // Import the v4 function from the uuid library

// Simulated database to store session information
const sessions = {};

// API to create a collaborative session
router.post("/create", (req: any, res: any) => {
  // Extract user information from the request (assuming user1 and user2 IDs)
  const { user1_id, user2_id } = req.body;

  console.log(user1_id);
  console.log(user2_id);

  if (!user1_id || !user2_id || user1_id == user2_id) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  const session_id = uuidv4();

  // Create a database entry for the session
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
  // @ts-expect-error TS(2304): Cannot find name 'io'.
  io.once("connection", (socket: any) => {
    socket.join(roomName);
    console.log(socket.id + " joined room:" + roomName);
  });
});

// API to save session information
router.post("/save", (req: any, res: any) => {
  try {
    const { session_id, text } = req.body;
    console.log(session_id);

    // @ts-expect-error TS(2360): The left-hand side of an 'in' expression must be a... Remove this comment to see the full error message
    if (!session_id in sessions) {
      return res.status(400).json({ error: "Invalid sessionId provided" });
    }

    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const session = sessions[session_id];
    session.text = text;
    session.status = "active";

    res.status(200).json({
      message: "Session saved successfully",
      session_id: session.session_id,
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

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = router;
