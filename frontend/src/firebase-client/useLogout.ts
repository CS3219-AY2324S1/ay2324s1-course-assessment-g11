
import { signOut } from "firebase/auth";
import { auth } from "./firebase_config";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import {gatewayEventAddress} from "@/firebase-client/gateway-address";

export const useLogout = () => {
  const { dispatch } = useContext(AuthContext);
  const logout = async () => {
    try {
      const currentUser = auth.currentUser;
      await fetch(gatewayEventAddress + "userLoggedOut/" + currentUser.uid, {
        method: "POST"
      });
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
