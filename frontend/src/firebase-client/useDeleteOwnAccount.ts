
import { auth } from "./firebase_config";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import {gatewayEventAddress} from "@/firebase-client/gateway-address";

export const useDeleteOwnAccount = () => {
  const { dispatch } = useContext(AuthContext);
  const deleteOwnAccount = async () => {
    try {
      const currentUser = auth.currentUser;

      await fetch(gatewayEventAddress + "userDeleted/" + currentUser.uid, {
        method: "DELETE"
      });
      // This will delete the user from the Firebase Authentication database
      await currentUser.delete();
      dispatch({ type: "LOGOUT" });
      console.log("user logged out and deleted")
    } catch (error) {
      console.log(error.message);
    }
  };

  return { deleteOwnAccount };
};
