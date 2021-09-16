// Import: libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import { Switch, Route, NavLink } from "react-router-dom";
import { RefreshIcon } from "@heroicons/react/solid";

// Import: components and models
import ChartViewer from "./components/Charts";
import GridFull from "./components/Grids";
import TransactionsList from "./components/Transactions";
import { TransactionContext } from "./models/transaction";
import { ConfigurationContext } from "./models/configuration";
import { MessageContext } from "./models/message";

// MAIN
export default observer(function App() {
  // State and context
  const transactionsStore = React.useContext(TransactionContext);
  const config = React.useContext(ConfigurationContext);
  const messageStore = React.useContext(MessageContext);
  const [isFetchingData, setIsFetchingData] = React.useState<boolean>(false);

  // Helper
  const getGSheetData = function () {
    setIsFetchingData(true);
    transactionsStore.loadTransactionsFromDB().then(() => {
      setIsFetchingData(false);
    });
  };

  // Loading
  React.useEffect(getGSheetData, [transactionsStore, config]); // ??? Depedency is correct?

  // Render
  return (
    <>
      <TransactionContext.Provider value={transactionsStore}>
        <ConfigurationContext.Provider value={config}>
          <MessageContext.Provider value={messageStore}>
            <header className="grid grid-cols-2 p-4 bg-mred">
              <h1 className="self-center text-3xl text-white">
                <a href="/">Mony mony</a>
              </h1>
              <nav className="self-center text-right">
                <button
                  className="p-2 text-white hover:text-mred-light"
                  onClick={getGSheetData}
                >
                  <RefreshIcon
                    className={`inline h-6 w-6 ${
                      isFetchingData === true ? "animate-spin-slow" : ""
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
          </MessageContext.Provider>
        </ConfigurationContext.Provider>
      </TransactionContext.Provider>
    </>
  );
});
