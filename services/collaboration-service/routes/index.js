var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  io.once("connection", (socket) => {
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
