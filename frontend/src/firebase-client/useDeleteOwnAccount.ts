"use client";

import { auth } from "./firebase_config";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export const useDeleteOwnAccount = () => {
  const { dispatch } = useContext(AuthContext);
  const deleteOwnAccount = async () => {
    try {
      const currentUser = auth.currentUser;

      // This will delete the user from the Firebase Authentication database
      await currentUser.delete();
      dispatch({ type: "LOGOUT" });
      console.log("user logged out and deleted")

      /*
        TODO: Implement connection to the Gateway to send out a UserDeleted event on a message queue
          This event propagates to all the microservices to prompt them to delete all data with the
          recently deleted UID
      */
    } catch (error) {
      console.log(error.message);
    }
  };

  return { deleteOwnAccount };
};
