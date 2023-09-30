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

    } catch (error) {
      console.log(error);
      setError(error.message);
      setIsPending(false);
    }
  };

  return { login, error, isPending };
};
