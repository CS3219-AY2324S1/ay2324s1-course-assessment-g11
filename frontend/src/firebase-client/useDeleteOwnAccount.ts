import { auth } from "./firebase_config";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { userApiPathAddress } from "@/gateway-address/gateway-address";
import { GithubAuthProvider, reauthenticateWithCredential, signInWithPopup } from "firebase/auth";

export const useDeleteOwnAccount = () => {
  const { dispatch } = useContext(AuthContext);
  const deleteOwnAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true);
        const provider = new GithubAuthProvider();
        const oAuthResult = await signInWithPopup(auth, provider);
        const credential = GithubAuthProvider.credentialFromResult(oAuthResult);
        if (!credential) {
          throw new Error("Could not get credential");
        }
        await reauthenticateWithCredential(currentUser, credential);
        
        await fetch(userApiPathAddress + currentUser.uid, {
          method: "DELETE",
          headers: {
            "User-Id-Token": idToken,
            "User-Id": currentUser.uid
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
