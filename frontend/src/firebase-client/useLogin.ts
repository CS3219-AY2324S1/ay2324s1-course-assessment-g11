import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase_config";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useState } from "react";
import {gatewayEventAddress} from "@/firebase-client/gateway-address";

export const useLogin = () => {
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const provider = new GithubAuthProvider();
  const { dispatch } = useContext(AuthContext);

  const login = async () => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithPopup(auth, provider);
      if (!res) {
        throw new Error("Could not complete signup");
      }

      const user = res.user;
      dispatch({ type: "LOGIN", payload: user });

      console.log(user.uid, user.displayName, user.photoURL);
      setIsPending(false);

      /*
        Current implementation is to send this directly to the User Service.

        TODO: Implement connection to the Gateway to send out a UserLoggedIn event on a message queue
          This event propagates to the User microservice to check if it has an entry for storing the user's data.
          If no entry (meaning that user logged in for the first time), create an entry.
      */
      const response = await fetch(gatewayEventAddress + "userLoggedIn", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            uid: user.uid,
            displayName: user.displayName,
            photoUrl: user.photoURL
          }
        )
      })


    } catch (error) {
      console.log(error);
      setError(error.message);
      setIsPending(false);
    }
  };

  return { login, error, isPending };
};
