# User Service

## Pre-requisites:
1. Install dependencies using `yarn install`
2. Run `yarn prisma generate`
3. `yarn workspace matching-service run dev`
4. Look at [index.html](./src/routes/index.html) to see how to use the API

## API:
**Note:** All API endpoints are prefixed with `/api/matching-service`

Matching service **DOES NOT** use REST API. It uses socket.io to communicate with the client.
The flow is:

1. Client connects to /api/matching-service using socket.io and provides their username
2. Client can send messages to the server using socket.io as such:
```js
const username = "alice";
const socket = io('http://localhost:5002/api/matching-service', {query: `username=${username}`});
const difficulties = ["easy", "medium", "hard"];
const programmingLanguage = "java";
socket.emit('lookingForMatch', difficulties, programmingLanguage); // Looks for a new match
socket.emit('cancelLooking'); // Stop looking for a new match
socket.emit('leaveMatch'); // Leave the current match (only if you are in a match)
socket.emit('sendMatchMessage', "Hello World!"); // Send a message to the other user in the match
```
3. Client should listen for messages from the server as such:
```js
socket.on('matchFound', (match) => {
    console.log(match); // See Match type in prisma schema
});
socket.on('matchNotFound', () => {
    console.log("Probably timed out, can't find a match");
});
socket.on('matchLeft', () => {
    console.log("Your match left the match"); // Other user emitted "leaveMatch"
});
socket.on("receiveMessage", (message) => {
    console.log(message); // Message from the other user or the server
});
socket.on("error", (error) => {
    console.log(error); // Error from the server
});
```
4. When a client wants to look for a match, the match request is placed in an in-memory queue. The server will try to match the user with another user in the queue. If a match is found, both users will be notified and will join a room. The server will then send a message to the client with the match information. If a match is not found after a specified time (60 seconds), the client will be notified and the request will be removed from the queue.

Notes:

We use socket.io instead of traditional HTTP REST API
Matched users will join a room
We use EventEmitters to notify the other waiting user of a new match


Extensions:

Store the waiting users on a persistent queue in case the service dies (Use redis possibly)
Remove REST API code
