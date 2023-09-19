import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

export default function Home() {
  const [text, setText] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');

  useEffect(() => {
    socket.on('textchange', ({ text }) => {
      setText(text);
    });
  }, []);

  const handleJoinRoom = () => {
    const roomIdValue = roomId.trim();
    if (roomIdValue) {
      socket.emit('join-room', roomIdValue);
      console.log('Joined room');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    socket.emit('textchange', newText);
  };

  return (
    <div>
      <h1>Text Collaboration Room</h1>
      <input
        type="text"
        id="roomId"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button id="joinButton" onClick={handleJoinRoom}>
        Join Room
      </button>

      <textarea
        id="textEditor"
        rows={10}
        cols={50}
        value={text}
        onChange={handleTextChange}
      />
    </div>
  );
}
