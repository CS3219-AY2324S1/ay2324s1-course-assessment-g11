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

/* Routers */
app.use("/test", require("./routes/index"));
app.use("/session", require("./routes/session"));

/* Middlewares */
app.use(bodyParser.json()); // what this?
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.listen(PORT, () => {
  console.log("listening on *:5001");
});
