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
import { wsMatchProxyGatewayAddress } from "@/gateway-address/gateway-address";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const SERVER_URL = wsMatchProxyGatewayAddress;

interface RequestToChangeQuestion {
  questionTitle: string,
  cb: (x: boolean) => void,
}

interface MatchmakingContextValue {
  socket: Socket | null;
  match: Match | null;
  message: string;
  error: string;
  joinQueue: (difficulties: string[], programmingLang: string) => void;
  sendMessage: (message: string) => void;
  leaveMatch: () => void;
  cancelLooking: () => void;
  changeQuestion: (questionId: string, questionTitle: string, roomId: string) => void;
  requestToChangeQuestion: RequestToChangeQuestion | null;
  setRequestToChangeQuestion: React.Dispatch<React.SetStateAction<RequestToChangeQuestion | null>>;
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
  // undefined if is loading, null if not in a match, otherwise Match
  const [match, setMatch] = useState<Match | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [requestToChangeQuestion, setRequestToChangeQuestion] = useState<RequestToChangeQuestion | null>(null);

  const { user: currentUser, authIsReady } = useContext(AuthContext);
  const router = useRouter();

  const generateRandomNumber = () => {
    // Return a random number either 0 or 1 as a string
    return Math.floor(Math.random() * 2).toString();
  };

  // Initialize socket connection
  useEffect(() => {
    if (currentUser) {
      currentUser.getIdToken(true).then((token) => {
        const newSocket = io(SERVER_URL, {
          autoConnect: false,
          query: { username: currentUser?.uid },
          //query: { username: generateRandomNumber() },
          extraHeaders: {
            "User-Id-Token": token,
          },
        });
        setSocket((oldSocket) => {
          if (oldSocket) {
            oldSocket.close();
          }
          return newSocket;
        });
        newSocket.connect();

        console.log("Socket connected");
      });
    }
    return () => {
      console.log("Socket disconnected");
      socket?.close();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    // else we should join the room if they are in an exsiting match
    // (i.e. they refreshed the page)
    if (
      match &&
      router.route !== "/interviews/match-found" &&
      router.route !== "/interviews/find-match" &&
      router.route !== "/room/${match?.roomId}"
    ) {
      router.push(`/room/${match?.roomId}`);
    }
  }, [match]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("matchFound", (match: Match) => {
      console.log("Match found:", match);
      console.log("QuestionId:", match.questionId);
      socket.emit("joinRoom", match.roomId);
      setMatch(match);
    });

    socket.on("matchLeft", (match: Match) => {
      console.log("Match left:", match);
      setMatch(null);
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

    socket.on("changeQuestion", (questionTitle: string, cb: (x: boolean) => void) => {
      setRequestToChangeQuestion({questionTitle, cb});
    });

    socket.on("questionChanged", (questionId: string) => {
      toast.info("Question is changed");
      setMatch((prevMatch) => {
        if (prevMatch) {
          return {
            ...prevMatch,
            questionId: questionId,
          };
        }
        return prevMatch;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("matchFound");
      socket.off("matchLeft");
      socket.off("receiveMessage");
      socket.off("error");
      socket.off("disconnect");
      socket.off("changeQuestion");
      socket.off("questionChanged");
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

  const changeQuestion = useCallback((questionId: string, questionTitle: string, roomId: string) => {
    if (!socket) return;

    socket.emit("changeQuestion", questionId, questionTitle, roomId);
  }, [socket]);

  const value: MatchmakingContextValue = {
    socket,
    match,
    message,
    error,
    joinQueue,
    sendMessage,
    leaveMatch,
    cancelLooking,
    changeQuestion,
    requestToChangeQuestion,
    setRequestToChangeQuestion
  };

  return (
    <MatchmakingContext.Provider value={value}>
      {children}
    </MatchmakingContext.Provider>
  );
};
