## Collaboration Service

### Docs

Visit http://localhost:5001/docs for REST API docs.

WebSocket Events (copied from `routes/room.ts#initSocketListeners`):

```typescript
  socket.on("/room/join", (room_id: string) => {...};

  socket.on("/room/update", (text: string) => roomUpdate(io, socket, room_id, text));

  socket.on("/room/save", (text: string) => saveText(room_id, text));

  socket.on("/room/load", () => loadTextFromDb(io, socket, room_id));
```

### Demo

To test out or see implementation example: See `index.html`.

Visit http://localhost:5001/?room=1&user=user1
to set room and user. Open multiple tabs, and those with the same room will have same content.

To test using REST API,
Visit http://localhost:5001/?room=1&user=user1&api=rest
to use GET API instead of socket emitters to join room. (Possible concurrency risk?)
