// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'express'.
var express = require("express");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'router'.
var router = express.Router();

router.get("/", (req: any, res: any) => {
  // @ts-expect-error TS(2304): Cannot find name '__dirname'.
  res.sendFile(__dirname + "/index.html");
  // @ts-expect-error TS(2304): Cannot find name 'io'.
  io.once("connection", (socket: any) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId: any) => {
      socket.join(roomId);
      console.log(socket.id + " joined room:", roomId);

      socket.on("textchange", (text: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'io'.
        io.to(roomId).emit("textchange", { text });
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
});

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = router;
