This project uses Firebase with GitHub authentication.

## Acknowledgments
The code for Firebase was adapted from a tutorial on freeCodeCamp: https://www.freecodecamp.org/news/github-user-authentication-using-firebase-and-reactjs-with-hooks/

## How it works
There are a few files involved in the client-side authentication:

| File                               | Purpose                                                        |
|------------------------------------|----------------------------------------------------------------|
| firebase-client/firebase_config.ts | Sets up the Firebase Auth interface                            |
| firebase-client/use*.ts | Function hooks for doing login/logout and deleting own account |
| contexts/AuthContext.tsx | Saves the logged in User within a global state                 |
| reducers/authReducer.ts | Changes the state based on login/logout actions |

## Current supported actions

| Action | Remarks |
| ---- |---------|
| Login | |
| Logout | |
| DeleteOwnAccount | Will also log the user out, so in authReducer.ts, it is treated as a LOGOUT action |

## How to use the authentication code in the front end

For saving the authentication context, wrap the app with `<AuthContextProvider>` as shown below:
```
export default function App({ Component, pageProps }: AppProps) {
  return <AuthContextProvider>
    <Component {...pageProps} />
  </AuthContextProvider>
}
```

A logout button might have the following code:
```
<button className="btn" onClick={logout}>
  {isPending ? "Loading..." : "Logout"}
</button>
```

`onClick` is used to run the `logout()` function exported from `useLogout.ts`. `isPending` is used for displaying a placeholder if the button is not yet ready.
