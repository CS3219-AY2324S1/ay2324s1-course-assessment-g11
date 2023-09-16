"use client";

import { signOut } from "firebase/auth";
import { auth } from "./firebase_config";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export const useLogout = () => {
  const { dispatch } = useContext(AuthContext);
  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });

      /*
        TODO: Implement connection to the Gateway to send out a UserLoggedOut event on a message queue
          This event propagates to certain microservices like the collaboration service and match service.
          If user logged out while in a room, the user is booted from that room.
          If user logged out while finding a match, the match attempt is aborted.
      */
      console.log("user logged out")
    } catch (error) {
      console.log(error.message);
    }
  };

  return { logout };
};
