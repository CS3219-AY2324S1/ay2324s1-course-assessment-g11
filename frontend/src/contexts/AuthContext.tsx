import { createContext, useEffect, useReducer } from "react";
import { authReducer } from "../reducers/authReducer";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-client/firebase_config";

export var AuthContext = createContext("MemeMan");

const AuthContextProvider = ({ children }) => {
  const initial_state = {
    user: null,
    authIsReady: false,
  };
  const [state, dispatch] = useReducer(authReducer, initial_state);

  console.log(state);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
  {children}
  </AuthContext.Provider>
);
};

export default AuthContextProvider;
