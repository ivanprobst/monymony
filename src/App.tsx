// Libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import { Switch, Route, NavLink } from "react-router-dom";
import axios from "axios";
import { RefreshIcon } from "@heroicons/react/solid";

// Components
import ChartViewer from "./components/Charts";
import GridFull from "./components/Grids";
import TransactionsList from "./components/Transactions";

// Models
import {
  TransactionContext,
  Transaction,
  ITransaction,
  ITransactionError,
} from "./models/transaction";
import { ConfigurationContext } from "./models/configuration";

// RENDER
export default observer(function App() {
  // Definitions
  const transactionsStore = React.useContext(TransactionContext);
  const config = React.useContext(ConfigurationContext);
  const [isFetchingData, setIsFetchingData] = React.useState<boolean>(false);
  const [transactionErrorList, setTransactionErrorList] = React.useState<
    Array<ITransactionError>
  >([]);

  // Helpers
  const getGSheetData = function () {
    setIsFetchingData(true);

    axios
      .get(
        `${process.env.REACT_APP_GSHEET_URL}?key=${process.env.REACT_APP_GAPI_KEY}`,
      )
      .then((res) => {
        setIsFetchingData(false);

        const errorArr: Array<ITransactionError> = [];
        const transactions: Array<[string, ITransaction]> = [];
        const indexMem = new Set();

        res.data.values
          .slice(1)
          .forEach(
            ([id, date, description, category, amount]: [
              string,
              string,
              string,
              string,
              string,
            ]) => {
              let errorMsg = "";
              if (indexMem.has(id)) {
                errorMsg = "index already exists";
              } else if (Number.isNaN(parseInt(date.split(".")[1]))) {
                errorMsg = "date format can not be parsed";
              } else if (parseInt(date.split(".")[1]) > config.numberOfMonths) {
                errorMsg = "month is not in within config range"; // ??? Is it really a problem?
              } else if (!config.categoriesList.includes(category)) {
                errorMsg = "category does not exist in config";
              } else if (Number.isNaN(parseInt(amount))) {
                errorMsg = "amount is not a number";
              }

              if (errorMsg !== "") {
                errorArr.push({
                  index: id,
                  description: description,
                  message: errorMsg,
                });
              } else {
                indexMem.add(id);

                transactions.push([
                  id,
                  Transaction.create({
                    id,
                    date,
                    description,
                    category,
                    group: config.groupFromCategory(category),
                    type: config.typeFromCategory(category),
                    amount: parseInt(amount),
                  }),
                ]);
              }
            },
          );
        transactionsStore.setTransactions(transactions);
        setTransactionErrorList(errorArr); // ??? trigs useless rerender of App; will be cleaned during backend implementation
      })
      .catch((err) => {
        setTransactionErrorList([
          {
            index: "",
            description: "",
            message: "Failed to connect to transactions source",
          },
        ]);
      });
  };

  // Loading
  React.useEffect(getGSheetData, [transactionsStore, config]); // ??? Depedency is correct?

  return (
    <>
      <TransactionContext.Provider value={transactionsStore}>
        <ConfigurationContext.Provider value={config}>
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
                <TransactionsList
                  transactionErrorList={transactionErrorList}
                ></TransactionsList>
              </Route>
              <Route path="/grid">
                <h2 className="section-title">Grid</h2>
                <GridFull></GridFull>
              </Route>
              <Route path="/chart">
                <h2 className="section-title">Chart</h2>
                <ChartViewer></ChartViewer>
              </Route>
              <Route path="/">
                <h2 className="section-title">Chart</h2>
                <ChartViewer></ChartViewer>
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
        </ConfigurationContext.Provider>
      </TransactionContext.Provider>
    </>
  );
});
