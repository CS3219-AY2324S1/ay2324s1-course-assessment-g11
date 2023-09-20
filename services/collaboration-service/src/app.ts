import express from "express";
import http from "http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { createTestRoute } from "./routes/index";
import { createSessionRoute } from "./routes/session";

// Since JSON files don't have a default export, you might need to use this syntax:
import * as swaggerFile from "../swagger-output.json";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT: string | number = process.env.PORT || 5001;

// Routers
app.use("/test", createTestRoute(io));
app.use("/session", createSessionRoute(io));

// Middlewares
app.use(bodyParser.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
