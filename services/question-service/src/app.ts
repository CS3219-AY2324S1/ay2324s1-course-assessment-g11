import express, { Express } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http, { Server as HTTPServer } from "http";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json";
import cors from "cors";

import { router as indexRouter } from "./routes";

const app: Express = express();
const server: HTTPServer = http.createServer(app);
const PORT: number = parseInt(process.env.PORT || "5004");

/* Middlewares */
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* Routers */
app.use("/api/question-service", indexRouter);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});
