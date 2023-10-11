// import { AuthContext } from "@/contexts/AuthContext";
// import { useEffect, useState, useCallback, useContext } from "react";
// import { io, Socket } from "socket.io-client";

// const SERVER_URL = "http://localhost:5002/"; // Replace with your server's URL

// interface Match {
//   // Define the properties of a Match based on your backend structure
//   userId1: string;
//   userId2: string;
//   chosenDifficulty: string;
//   chosenProgrammingLang: string;
//   // Add other properties as needed
// }

// interface UseMatchmakingHook {
//   socket: Socket | null;
//   match: Match | null;
//   message: string;
//   error: string;
//   joinQueue: (difficulties: string[], programmingLang: string) => void;
//   sendMessage: (message: string) => void;
//   leaveMatch: () => void;
//   cancelLooking: () => void;
// }

// export function useMatchmaking(): UseMatchmakingHook {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [match, setMatch] = useState<Match | null>(null);
//   const [message, setMessage] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   const { user: currentUser, authIsReady } = useContext(AuthContext);

//   // Initialize socket connection
//   useEffect(() => {
//     const newSocket = io(SERVER_URL, {
//       autoConnect: false,
//       query: { username: currentUser?.email },
//     });
//     setSocket(newSocket);
//     newSocket.connect();

//     return () => {
//       newSocket.close();
//     };
//   }, []);

//   // Setup socket event listeners
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("connect", () => {
//       console.log("Connected to server");
//     });

//     socket.on("matchFound", (match: Match) => {
//       console.log("Match found:", match);
//       setMatch(match);
//     });

//     socket.on("receiveMessage", (userId: string, message: string) => {
//       console.log("Message received:", message);
//       setMessage(message);
//     });

//     socket.on("error", (error: string) => {
//       console.error("An error occurred:", error);
//       setError(error);
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected from server");
//     });

//     return () => {
//       socket.off("connect");
//       socket.off("matchFound");
//       socket.off("receiveMessage");
//       socket.off("error");
//       socket.off("disconnect");
//     };
//   }, [socket]);

//   const joinQueue = useCallback(
//     (difficulties: string[], programmingLang: string) => {
//       if (!socket) return;

//       socket.emit("lookingForMatch", difficulties, programmingLang);
//     },
//     [socket]
//   );

//   const sendMessage = useCallback(
//     (message: string) => {
//       if (!socket) return;

//       socket.emit("sendMessage", message);
//     },
//     [socket]
//   );

//   const leaveMatch = useCallback(() => {
//     if (!socket) return;

//     socket.emit("leaveMatch");
//   }, [socket]);

//   const cancelLooking = useCallback(() => {
//     if (!socket) return;

//     socket.emit("cancelLooking");
//   }, [socket]);

//   return {
//     socket,
//     match,
//     message,
//     error,
//     joinQueue,
//     sendMessage,
//     leaveMatch,
//     cancelLooking,
//   };
// }

// export default useMatchmaking;
