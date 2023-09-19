const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); // Import the v4 function from the uuid library

// Simulated database to store session information
const sessions = {};

// API to create a collaborative session
router.post("/create", (req, res) => {
  const io = req.server_config.io;

  // Extract user information from the request (assuming user1 and user2 IDs)
  const { user1_id, user2_id } = req.body;

  console.log(user1_id);
  console.log(user2_id);

  if (!user1_id || !user2_id || user1_id == user2_id) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  const session_id = uuidv4();

  // Create a database entry for the session
  sessions[session_id] = {
    user1_id,
    user2_id,
    status: "active",
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
  io.on("connection", (socket) => {
    socket.join(roomName);
    console.log(socket.id + " joined room:", roomId);
  });
});

// Export the router
module.exports = router;
