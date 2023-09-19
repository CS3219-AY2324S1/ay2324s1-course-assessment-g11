const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(socket.id + " joined room:", roomId);

    socket.on("textchange", (text) => {
      io.to(roomId).emit("textchange", { text });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
});

server.listen(PORT, () => {
  console.log("listening on *:5001");
});
