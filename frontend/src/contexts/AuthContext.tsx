import * as React from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase-client/firebase_config";

type AuthState = {
  user: User | null;
  authIsReady: boolean;
  isAdmin: boolean;
}

const initial_state : AuthState = {
  user: null,
  authIsReady: false,
  isAdmin: false
};

export var AuthContext = React.createContext<{
  user: User | null;
  authIsReady: boolean;
  isAdmin: boolean;
  dispatch: React.Dispatch<any>;
}>({
  ...initial_state,
  dispatch: () => null
});

const authReducer = (state : AuthState, action : any) : AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, isAdmin: action.isAdmin, authIsReady: true };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children } : any) => {
  const [state, dispatch] = React.useReducer(authReducer, initial_state);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const idTokenResult = await user?.getIdTokenResult();

      dispatch({ type: "AUTH_IS_READY", payload: user, isAdmin: idTokenResult?.claims?.admin || false });
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
