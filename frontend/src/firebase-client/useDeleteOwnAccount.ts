import { auth } from "./firebase_config";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { userApiPathAddress } from "@/firebase-client/gateway-address";

export const useDeleteOwnAccount = () => {
  const { dispatch } = useContext(AuthContext);
  const deleteOwnAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true);

        await fetch(userApiPathAddress + currentUser.uid, {
          method: "DELETE",
          headers: {
            "User-Id-Token": idToken,
          },
        });
        // This will delete the user from the Firebase Authentication database
        await currentUser.delete();
        dispatch({ type: "LOGOUT" });
        console.log("user logged out and deleted");
      } else {
        console.log("You are not logged in.");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return { deleteOwnAccount };
};
