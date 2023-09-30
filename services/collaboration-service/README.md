## Collaboration Service

### Docs

Visit http://localhost:5003/docs for REST API docs.

WebSocket Events (refer to `routes/room.ts#initSocketListeners`):

```typescript
  socket.on("/room/join", (room_id: string, user_id: string) => {...};

  socket.on("/room/update", (text: string) => roomUpdate(io, socket, room_id, text));

  socket.on("/room/save", (text: string) => saveText(room_id, text));

  socket.on("/room/load", () => loadTextFromDb(io, socket, room_id));

  socket.disconnect()
```

- /room/join - Join a room, same room_id gets connected together. user_id if get details of room  
- /room/update - Update the room after text change  
- /room/save - Save current text  
- /room/load - Load previously saved text (calls /room/update after retrieving text from db)  

On disconnect, removes users from session db and change status to inactive if no users are present.
To reconnect, simply join the same room again.

### Demo

To test out or see implementation example: See `demo.html`.

Visit http://localhost:5003/demo/?room=1&user=user1
to set room and user. Open multiple tabs, and those with the same room will have same content.

To test using REST API,
Visit http://localhost:5003/demo/?room=1&user=user1&api=rest
to use GET API instead of socket emitters to join room. (Possible concurrency risk?)
