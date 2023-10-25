import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { Match } from "@prisma/client";
import { AuthContext } from "@/contexts/AuthContext";
import {matchSocketAddress} from "@/gateway-address/gateway-address";

const SERVER_URL = matchSocketAddress;

interface MatchmakingContextValue {
  socket: Socket | null;
  match: Match | null;
  message: string;
  error: string;
  joinQueue: (difficulties: string[], programmingLang: string) => void;
  sendMessage: (message: string) => void;
  leaveMatch: () => void;
  cancelLooking: () => void;
}

export const MatchmakingContext = createContext<
  MatchmakingContextValue | undefined
>(undefined);

interface MatchmakingProviderProps {
  children: React.ReactNode;
}

export const MatchmakingProvider: React.FC<MatchmakingProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { user: currentUser, authIsReady } = useContext(AuthContext);

  const generateRandomNumber = () => {
    // Return a random number either 0 or 1 as a string
    return Math.floor(Math.random() * 2).toString();
  };

  // Initialize socket connection
  useEffect(() => {
    if (currentUser) {
      currentUser.getIdToken(true).then(
        (token) => {
          const newSocket = io(SERVER_URL, {
            autoConnect: false,
            // query: { username: currentUser?.email },
            query: { username: generateRandomNumber() },
            extraHeaders: {
              "User-Id-Token": token
            },
            path: "/match/socket.io"
          });
          setSocket(newSocket);
          newSocket.connect();

          console.log("Socket connected");

          return () => {
            newSocket.close();
          };
        }
      )
    }
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("matchFound", (match: Match) => {
      console.log("Match found:", match);
      setMatch(match);
    });

    socket.on("receiveMessage", (message: string) => {
      console.log("Message received:", message);
      setMessage(message);
    });

    socket.on("error", (error: string) => {
      console.error("An error occurred:", error);
      setError(error);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("matchFound");
      socket.off("receiveMessage");
      socket.off("error");
      socket.off("disconnect");
    };
  }, [socket]);

  const joinQueue = useCallback(
    (difficulties: string[], programmingLang: string) => {
      if (!socket) return;

      socket.emit("lookingForMatch", difficulties, programmingLang);
    },
    [socket]
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (!socket) return;

      socket.emit("sendMessage", message);
    },
    [socket]
  );

  const leaveMatch = useCallback(() => {
    if (!socket) return;

    socket.emit("leaveMatch");
  }, [socket]);

  const cancelLooking = useCallback(() => {
    if (!socket) return;

    socket.emit("cancelLooking");
  }, [socket]);

  const value = {
    socket,
    match,
    message,
    error,
    joinQueue,
    sendMessage,
    leaveMatch,
    cancelLooking,
  };

  return (
    <MatchmakingContext.Provider value={value}>
      {children}
    </MatchmakingContext.Provider>
  );
};
