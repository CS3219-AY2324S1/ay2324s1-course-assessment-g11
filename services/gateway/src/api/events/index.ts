/**
 * These routes are meant to be called by "useLogin.ts", "useLogout.ts" and "useDeleteOwnAccount.ts"
 * in the frontend.
 * In turn,these routes are meant to emit asynchronous events to send them to other services
 */

import express from "express";
import {BasicUserDetails, eventNames, roomNames} from "../../../../../event_types/event_definitions";
import {Server as SocketIOServer, Socket} from "socket.io";

export const createEventRoutes = (serverIo : SocketIOServer) => {
  const eventRouter = express.Router();

  /**
   * Route for userLoggedIn event
   * Request body should contain details of the logged-in user
   *
   * Will attempt to create a new entry for the user's uid in the user-service database.
   * Regardless of whether user is actually new or not
   * Reason is because for GitHub OAuth, new users use the normal login button to register
   */
  eventRouter.post("/userLoggedIn", async function(req : express.Request, res : express.Response) {
    const userDetails : BasicUserDetails = {
      uid: req.body.uid,
      displayName: req.body.displayName,
      photoUrl: req.body.photoUrl
    }

    serverIo.to(roomNames.userRoom).emit(eventNames.userLoggedIn, userDetails);
    res.sendStatus(201);
  })

  eventRouter.post("/userLoggedOut/:uid", async function(req : express.Request, res : express.Response) {
    const loggedOutUid = req.params.uid;
    serverIo.to(roomNames.userRoom).emit(eventNames.userLoggedOut, loggedOutUid);

    res.sendStatus(200);
  })

  eventRouter.delete("/userDeleted/:uid", async function(req : express.Request, res : express.Response) {
    const uidToDelete = req.params.uid;
    serverIo.to(roomNames.userRoom).emit(eventNames.userDeleted, uidToDelete);

    res.sendStatus(204);
  })

  return eventRouter
}
