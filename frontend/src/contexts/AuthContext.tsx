import * as React from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase-client/firebase_config";

type AuthState = {
  user: User | null;
  authIsReady: boolean;
}

const initial_state : AuthState = {
  user: null,
  authIsReady: false,
};

export var AuthContext = React.createContext<{
  user: User | null;
  authIsReady: boolean;
  dispatch: React.Dispatch<any>;
}>({
  user: null,
  authIsReady: false,
  dispatch: () => null
});

const authReducer = (state : AuthState, action : any) : AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children } : any) => {
  const [state, dispatch] = React.useReducer(authReducer, initial_state);

  console.log(state);

  React.useEffect(() => {
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
