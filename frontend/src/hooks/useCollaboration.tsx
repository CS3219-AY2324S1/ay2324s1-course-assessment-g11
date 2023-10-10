import { useEffect, useState, useRef } from "react";
import { io , Socket} from "socket.io-client";
import { debounce } from "lodash";
import { TextOperationSet, createTextOpFromTexts } from "../../../utils/shared-ot";
import { TextOp } from "ot-text-unicode";

type UseCollaborationProps = {
  roomId: string;
  userId: string;
};

enum SocketEvents {
  ROOM_JOIN = "api/collaboration-service/room/join",
  ROOM_UPDATE = "api/collaboration-service/room/update",
  ROOM_SAVE = "api/collaboration-service/room/save",
  ROOM_LOAD = "api/collaboration-service/room/load",
}

var vers = 0;

const useCollaboration = ({ roomId, userId }: UseCollaborationProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [text, setText] = useState<string>("#Write your solution here");
  const textRef = useRef<string>(text);
  const prevTextRef = useRef<string>(text);

  useEffect(() => {
    const socketConnection = io("http://localhost:5003/");
    setSocket(socketConnection);

    socketConnection.emit(SocketEvents.ROOM_JOIN, roomId, userId);

    // if is my own socket connection, don't update text
    // if (socket && socket.id !== socketConnection.id) {
    //   console.log("update");
    //   socketConnection.on(SocketEvents.ROOM_UPDATE, ({ version, text }: { version: number, text: string }) => {
    //     console.log("Update vers to " + version);
    //     vers = version;
    //     setText(text);
    //   });
    // } else {
      socketConnection.on(SocketEvents.ROOM_UPDATE, ({ version, text }: { version: number, text: string }) => {
        console.log("Update vers to " + version);
        vers = version;
        setText(text);
      });

    return () => {
      socketConnection.disconnect();
    };
  }, [roomId, userId]);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    if (!socket) return;

    if (prevTextRef.current === textRef.current) return;

    const handleTextChange = debounce(() => {
      console.log(prevTextRef.current);
      console.log(textRef.current);
      console.log(vers)
      const textOp: TextOp = createTextOpFromTexts(prevTextRef.current, textRef.current);

      
      prevTextRef.current = textRef.current;
      

      console.log(textOp);

      const textOperationSet: TextOperationSet = {
        version: vers,
        operations: textOp,
      }

      socket.emit(SocketEvents.ROOM_UPDATE, textOperationSet);
    }, 5000);

    handleTextChange();

    return () => handleTextChange.cancel();
  }, [text, socket]);

  return { text, setText };
};

export default useCollaboration;
