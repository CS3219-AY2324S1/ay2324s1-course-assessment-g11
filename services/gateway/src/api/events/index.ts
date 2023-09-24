/**
 * These routes are meant to be called by "useLogin.ts", "useLogout.ts" and "useDeleteOwnAccount.ts"
 * in the frontend.
 * In turn,these routes are meant to emit asynchronous events to send them to other services
 *
 * But for now, this will simply use synchronous HTTP calls and is only supported for
 * the user-service and its database.
 *
 * TODO: Change this to emit as asynchronous events/messages
 */

import express from "express";
const eventRouter = express.Router();

// Remember to change this
const userServiceAddress = "http://localhost:5001"

/**
 * Route for userLoggedIn event
 * Request body should contain details of the logged-in user
 *
 * Will attempt to create a new entry for the user's uid in the user-service database.
 * Regardless of whether user is actually new or not
 * Reason is because for GitHub OAuth, new users use the normal login button to register
 */
eventRouter.post("/userLoggedIn", async function(req : express.Request, res : express.Response) {
  const copiedRequestHeaders : HeadersInit = new Headers()
  Object.keys(req.headers).forEach((key) => {
    copiedRequestHeaders.set(key, req.get(key) as string)
  })
  const proxyResponse = await fetch(userServiceAddress, {
    method: "POST",
    body: req.body,
    headers: copiedRequestHeaders
  })

  const copiedResponseHeaders : any = {}
  for (const key of proxyResponse.headers.keys()) {
    copiedResponseHeaders[key] = proxyResponse.headers.get(key)
  }

  if (proxyResponse.status === 400 && proxyResponse.headers.get("Is-User-Already-Found") === "true") {
    // Change status to 200 OK since this is expected behaviour
    res.status(200).set(copiedResponseHeaders).json(proxyResponse.body);
  } else {
    res.status(proxyResponse.status).set(copiedResponseHeaders).json(proxyResponse.body);
  }
})

/**
 * Route for userLoggedIn event
 * Request body should contain details of the logged-in user
 *
 * Will attempt to create a new entry for the user's uid in the user-service database
 */
eventRouter.post("/userLoggedOut", async function(req : express.Request, res : express.Response) {
  // Unimplemented route.
  // In the future, it is meant to kick user out of the room
  console.log("This route is not implemented yet.")
  res.sendStatus(501);
})

eventRouter.delete("/userDeleted/:uid", async function(req : express.Request, res : express.Response) {
  const uidToDelete = req.params.uid;
  const proxyResponse = await fetch(userServiceAddress + "/" + uidToDelete, {
    method: "DELETE"
  })

  const copiedResponseHeaders : any = {}
  for (const key of proxyResponse.headers.keys()) {
    copiedResponseHeaders[key] = proxyResponse.headers.get(key)
  }
  res.status(proxyResponse.status).set(copiedResponseHeaders).json(proxyResponse.body);
})

export default eventRouter;
