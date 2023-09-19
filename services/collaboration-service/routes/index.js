var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  const io = req.server_config.io;

  res.sendFile(__dirname + "/index.html");

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(socket.id + " joined room:", roomId);

      socket.on("textchange", (text) => {
        io.to(roomId).emit("textchange", { text });
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
});

module.exports = router;
