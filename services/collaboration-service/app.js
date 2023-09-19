const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5001;

/* Middlewares */
app.use(bodyParser.json()); // what this?
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

/* Routers */
app.use(
  "/test",
  function (req, res, next) {
    req.server_config = {
      io: io,
    };
    next();
  },
  require("./routes/index")
);
app.use(
  "/session",
  function (req, res, next) {
    req.server_config = {
      io: io,
    };
    next();
  },
  require("./routes/session")
);

server.listen(PORT, () => {
  console.log("listening on *:5001");
});
