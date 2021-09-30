// Import: libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import { Switch, Route, NavLink } from "react-router-dom";
import { app } from "./firebase";
import { getAuth, connectAuthEmulator, signOut } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { RefreshIcon } from "@heroicons/react/solid";

// Import: pages
import AuthPage from "./pages/AuthPage";
import TransactionsPage from "./pages/TransactionsPage";
import GridPage from "./pages/GridPage";
import ChartPage from "./pages/ChartPage";

// Import: models
import { RootContext } from "./models/root";

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

  // Init
  React.useEffect(() => {
    console.log("app init: ", app);

    const auth = getAuth();
    connectAuthEmulator(auth, "http://localhost:9099"); // TODO: escape emulator stuff for production

    const db = getFirestore();
    connectFirestoreEmulator(db, "localhost", 8080); // TODO: escape emulator stuff for production
  }, []);

  // Render
  return (
    <>
      <RootContext.Provider value={rootStore}>
        <header className="grid grid-cols-2 px-4 bg-mred">
          <h1 className="self-center py-4 text-3xl text-white">
            <a href="/">Mony mony</a>
          </h1>

          {currentUserAccount.uid && (
            <nav className="self-end text-right">
              <button
                className="inline-block mr-3 text-white hover:text-mred-light"
                onClick={transactionsStore.loadAllTransactionsFromDB}
              >
                <RefreshIcon
                  className={`h-6 w-6 ${
                    configurationStore.isLoadingData ? "animate-spin-slow" : ""
                  }`}
                />
              </button>
              <NavLink
                className="nav-button"
                activeClassName="bg-white text-mred"
                to="/transactions"
              >
                Transactions
              </NavLink>
              <NavLink
                className="nav-button"
                activeClassName="bg-white text-mred"
                to="/grid"
              >
                Grid
              </NavLink>
              <NavLink
                className="nav-button"
                activeClassName="bg-white text-mred"
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
          )}
        </header>

        <main className="flex-auto p-8 text-sm text-gray-700">
          {currentUserAccount.uid ? (
            <Switch>
              <Route path="/transactions">
                <TransactionsPage />
              </Route>
              <Route path="/grid">
                <GridPage />
              </Route>
              <Route path="/chart">
                <ChartPage />
              </Route>
              <Route path="/">
                <ChartPage />
              </Route>
            </Switch>
          ) : (
            <AuthPage />
          )}
        </main>

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
