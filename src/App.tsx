// Import: libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import { Switch, Route, NavLink } from "react-router-dom";
import { RefreshIcon } from "@heroicons/react/solid";

// Import: components and models
import { RootContext } from "./models/root";
import ChartViewer from "./components/Charts";
import GridFull from "./components/Grids";
import TransactionsList from "./components/Transactions";

// MAIN
export default observer(function App() {
  // State and context
  const rootStore = React.useContext(RootContext);
  const transactionsStore = rootStore.transactionStore;
  const configurationStore = rootStore.configurationStore;

  // Helper
  const reloadDatafromDB = function () {
    transactionsStore.loadTransactionsFromDB();
  };

  // Loading
  React.useEffect(reloadDatafromDB, [transactionsStore]);

  // Render
  return (
    <>
      <RootContext.Provider value={rootStore}>
        <header className="grid grid-cols-2 p-4 bg-mred">
          <h1 className="self-center text-3xl text-white">
            <a href="/">Mony mony</a>
          </h1>
          <nav className="self-center text-right">
            <button
              className="p-2 text-white hover:text-mred-light"
              onClick={reloadDatafromDB}
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
          </nav>
        </header>

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
