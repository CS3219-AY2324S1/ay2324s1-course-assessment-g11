## Collaboration Service

### Demo

To test out or see implementation example: index.html
Visit `http://localhost:5001/?room=1&user=user1`
to set room and user. Open multiple tabs, and those with the same room will have same content.

To test using GET API,
Visit `http://localhost:5001/?room=1&user=user1&api=get`
to use GET API instead of socket emitters to join room. (Possible concurrency risk?)
