// Import libs
import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// Import: components and models
import App from "./App";
import { UserContext } from "./models/user";
import { getAuth, User } from "firebase/auth";

function UserProvider({ children }: { children: JSX.Element }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      console.log("auth change detected: ", authUser);
      setCurrentUser(authUser);
    });
  }, [auth, user]);

  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
