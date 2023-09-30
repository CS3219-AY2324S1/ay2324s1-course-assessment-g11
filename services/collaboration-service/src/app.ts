import express, { Express } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http, { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json";
import bodyParser from "body-parser";
import roomRouter from "./routes/room";
import demoRouter from "./routes/demo";

const app: Express = express();
const server: HTTPServer = http.createServer(app);
const socketIoOptions: any = {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
};
const io: SocketIOServer = new SocketIOServer(server, socketIoOptions);

const PORT: number = parseInt(process.env.PORT || "5003");

/* Middlewares */
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* Routers */
app.use("/demo", demoRouter);
app.use("/api/collaboration-service/room", roomRouter(io));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});
