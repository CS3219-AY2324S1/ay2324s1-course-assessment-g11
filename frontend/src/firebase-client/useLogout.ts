
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
      
      console.log("user logged out")
    } catch (error) {
      console.log(error.message);
    }
  };

  return { logout };
};
