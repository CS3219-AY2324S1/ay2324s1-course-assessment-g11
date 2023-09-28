import express, {Express} from 'express';
import cors from 'cors';
import { setupLogging } from "./logging/logging";
import { setupAdmin, setupUserIdMatch, setupIsLoggedIn } from "./auth/auth";
import { setupProxies } from "./proxy/proxy";
import { proxied_routes } from "./proxied_routes/proxied_routes";
import { createEventRoutes } from "./api/events/index";
import {createServer} from "http";
import {Server, Socket} from "socket.io";
import {ClientToServerEvents, eventNames, ServerToClientEvents} from "../../../event_types/event_definitions";


const app : Express = express()
const server = createServer(app)
const io = new Server<ServerToClientEvents,ClientToServerEvents>(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "DELETE"],
  },
});

io.on("connection", (socket: Socket) => {
  socket.on(eventNames.joinEventRoom, (eventRoomId: string) => {
    socket.join(eventRoomId);
  })
});


const port = 4000;
//const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

app.use('/events', createEventRoutes(io));

setupLogging(app);
setupIsLoggedIn(app, proxied_routes);
setupUserIdMatch(app, proxied_routes);
setupAdmin(app, proxied_routes);
setupProxies(app, proxied_routes);

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})