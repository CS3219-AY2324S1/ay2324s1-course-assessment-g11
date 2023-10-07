import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { debounce } from "lodash";

type UseCollaborationProps = {
  roomId: string;
  userId: string;
};

const useCollaboration = ({ roomId, userId }: UseCollaborationProps) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [text, setText] = useState<string>("");
  const textRef = useRef<string>(text);

  useEffect(() => {
    const socketConnection = io("http://localhost:5003/");
    setSocket(socketConnection);

    socketConnection.emit("/room/join", roomId, userId);

    // if is my own socket connection, don't update text
    if (socket && socket.id !== socketConnection.id) {
      console.log("update");
      socketConnection.on("/room/update", ({ text }: { text: string }) => {
        setText(text);
      });
    }

    return () => {
      socketConnection.disconnect();
    };
  }, [roomId, userId]);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    if (!socket) return;

    const handleTextChange = debounce(() => {
      socket.emit("/room/update", textRef.current);
    }, 10);

    handleTextChange();

    return () => handleTextChange.cancel();
  }, [text, socket]);

  return { text, setText };
};

export default useCollaboration;
