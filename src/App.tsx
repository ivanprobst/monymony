// Import: libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import { Switch, Route, NavLink } from "react-router-dom";
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { RefreshIcon } from "@heroicons/react/solid";

// Import: components and models
import { RootContext } from "./models/root";
import ChartViewer from "./components/Charts";
import GridFull from "./components/Grids";
import TransactionsList from "./components/Transactions";
import { app } from "./firebase";

// COMPONENT
function LoginForm() {
  // Init
  const auth = getAuth();

  // State
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  // Helper
  const handleFormUpdate = function (event: React.FormEvent<HTMLInputElement>) {
    setLoginData({
      ...loginData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  // Helper
  const processLogin = function (event: React.FormEvent) {
    event.preventDefault();

    signInWithEmailAndPassword(auth, loginData.email, loginData.password).catch(
      (err) => console.error(err),
    );
  };

  // Helper
  const processSignup = function (event: React.FormEvent) {
    event.preventDefault();

    createUserWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password,
    ).catch((err) => console.error(err));
  };

  return (
    <form className="p-2">
      <input
        className="block mb-4 shadow text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        name="email"
        type="email"
        placeholder="Email"
        value={loginData.email}
        onChange={handleFormUpdate}
        required
      />
      <input
        className="block mb-4 shadow text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        name="password"
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={handleFormUpdate}
        required
      />

      <button
        disabled={loginData.email === "" || loginData.password === ""}
        onClick={processLogin}
        className="block p-2 text-mred border-2 border-mred disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Login
      </button>
      <button
        disabled={loginData.email === "" || loginData.password === ""}
        onClick={processSignup}
        className="block p-2 text-mred border-2 border-mred disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sign up
      </button>
    </form>
  );
}

// MAIN
export default observer(function App() {
  // Context
  const rootStore = React.useContext(RootContext);
  const transactionsStore = rootStore.transactionStore;
  const configurationStore = rootStore.configurationStore;
  const currentUserAccount = rootStore.currentUserAccount;

  // Helper
  const processSignout = function () {
    const auth = getAuth();
    signOut(auth).catch((error) => {
      console.error(error);
    });
  };

  // Loading
  React.useEffect(() => {
    console.log("app init: ", app);

    const auth = getAuth();
    connectAuthEmulator(auth, "http://localhost:9099");

    const db = getFirestore();
    connectFirestoreEmulator(db, "localhost", 8080);
  }, []);

  // Loading
  React.useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        currentUserAccount.logUserIn(authUser);
      } else {
        currentUserAccount.logUserOut();
      }
    });
  }, [currentUserAccount, transactionsStore]);

  // Render
  return (
    <>
      <RootContext.Provider value={rootStore}>
        <header className="grid grid-cols-2 p-4 bg-mred">
          <h1 className="self-center text-3xl text-white">
            <a href="/">Mony mony</a>
          </h1>
          {currentUserAccount.userLoggedIn ? (
            <nav className="self-center text-right">
              <button
                className="p-2 text-white hover:text-mred-light"
                onClick={transactionsStore.loadAllTransactionsFromDB}
              >
                <RefreshIcon
                  className={`inline h-6 w-6 ${
                    configurationStore.isLoadingData ? "animate-spin-slow" : ""
                  }`}
                />
              </button>
              <NavLink
                className="nav-button"
                activeClassName="bg-mred-light text-white"
                to="/transactions"
              >
                Transactions
              </NavLink>
              <NavLink
                className="nav-button"
                activeClassName="bg-mred-light text-white"
                to="/grid"
              >
                Grid
              </NavLink>
              <NavLink
                className="nav-button"
                activeClassName="bg-mred-light text-white"
                to="/chart"
              >
                Chart
              </NavLink>
              <button
                className="p-2 text-white hover:text-mred-light"
                onClick={processSignout}
              >
                Sign out {currentUserAccount.email}
              </button>
            </nav>
          ) : (
            <></>
          )}
        </header>

        {currentUserAccount.userLoggedIn ? (
          <main className="flex-auto p-8 text-sm text-gray-700">
            <Switch>
              <Route path="/transactions">
                <TransactionsList />
              </Route>
              <Route path="/grid">
                <h2 className="section-title">Grid</h2>
                <GridFull />
              </Route>
              <Route path="/chart">
                <h2 className="section-title">Chart</h2>
                <ChartViewer />
              </Route>
              <Route path="/">
                <h2 className="section-title">Chart</h2>
                <ChartViewer />
              </Route>
            </Switch>
          </main>
        ) : (
          <main>
            <LoginForm></LoginForm>
          </main>
        )}

        <footer className="p-4 text-white bg-mred">
          © 2021 by ivanprobst (
          <a
            className="underline"
            target="_blank"
            href="https://github.com/ivanprobst/monymony"
            rel="noopener noreferrer"
          >
            check out this project on GitHub
          </a>
          )
        </footer>
      </RootContext.Provider>
    </>
  );
});
