import { GithubAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "./firebase_config";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useState } from "react";
import {userApiPathAddress} from "@/gateway-address/gateway-address";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
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

      const user : User = res.user;
      dispatch({ type: "LOGIN", payload: user });

      console.log(user.uid, user.displayName, user.photoURL);
      setIsPending(false);

      const idToken = await user.getIdToken(true);

      const response = await fetch(userApiPathAddress, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'User-Id-Token': idToken
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
