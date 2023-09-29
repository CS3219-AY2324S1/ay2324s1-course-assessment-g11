
import express, {Express} from "express";
import path from "path";
import logger from "morgan";
import indexRouter from "./api/index";
import cors from "cors";
import {io} from "socket.io-client";
import {eventNames, roomNames} from "../../../event_types/event_definitions";

const port : number = parseInt(process.env.PORT || "5001");

const app : Express = express();
const gateway_url : string = process.env.GATEWAY_URL || "http://localhost:4000";
const socket = io(gateway_url);

socket.emit(eventNames.joinEventRoom, roomNames.userRoom);

socket.on(eventNames.userLoggedIn, (userDetails) => {
  // Call its own API method
  fetch(`http://localhost:${port}/`, {
    method: "POST",
    body: JSON.stringify(userDetails),
    headers: {
      'Content-Type': "application/json"
    }
  }).then()
})

socket.on(eventNames.userDeleted, (uidToDelete) => {
  // Call its own API method
  fetch(`http://localhost:${port}/${uidToDelete}`, {
    method: "DELETE"
  }).then()
})

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app;
