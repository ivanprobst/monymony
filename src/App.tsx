// Libs
import * as React from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import axios from "axios";
import { RefreshIcon } from "@heroicons/react/solid";

// Components
import ChartViewer from "./components/Charts";
import GridViewer from "./components/Grids";
import TransactionsList from "./components/Transactions";

// Assets
import { iTransaction, iTransactionError, Category } from "./utils/types";
import {
  CONFIG_MONTHS,
  CONFIG_CATEGORY_LIST,
  CONFIG_CATEGORY_TO_GROUP,
} from "./utils/configurations";

// RENDER
export default function App() {
  // States
  const [cleanTransactions, setCleanTransactions] = React.useState<
    Array<iTransaction>
  >([]);
  const [transactionErrorList, setTransactionErrorList] = React.useState<
    Array<iTransactionError>
  >([]);

  // Helpers
  function getGSheetData() {
    setCleanTransactions([]);
    setTransactionErrorList([]);
    axios
      .get(
        `${process.env.REACT_APP_GSHEET_URL}?key=${process.env.REACT_APP_GAPI_KEY}`,
      )
      .then((res) => {
        const data = res.data;
        const errorArr: Array<iTransactionError> = [];
        const indexMem = new Set();
        setCleanTransactions(
          data.values
            .slice(1)
            .reduce(
              (
                acc: Array<iTransaction>,
                [index, date, description, category, amount]: [
                  string,
                  string,
                  string,
                  string,
                  string,
                ],
              ) => {
                let errorMsg = "";
                if (indexMem.has(index)) {
                  errorMsg = "index already exists";
                } else if (Number.isNaN(parseInt(date.split(".")[1]))) {
                  errorMsg = "date format can not be parsed";
                } else if (
                  parseInt(date.split(".")[1]) > CONFIG_MONTHS.length
                ) {
                  errorMsg = "month is not in within config range"; // REALLY A PROBLEM???
                } else if (!CONFIG_CATEGORY_LIST.includes(category)) {
                  errorMsg = "category does not exist in config";
                } else if (Number.isNaN(parseInt(amount))) {
                  errorMsg = "amount is not a number";
                }

                if (errorMsg !== "") {
                  errorArr.push({
                    index: index,
                    description: description,
                    message: errorMsg,
                  });
                  return acc;
                } else {
                  indexMem.add(index);
                  return acc.concat({
                    index,
                    date,
                    monthIndex: parseInt(date.split(".")[1]) - 1,
                    description,
                    category: category as Category,
                    groupName: CONFIG_CATEGORY_TO_GROUP[category],
                    amount: parseInt(amount),
                  });
                }
              },
              [],
            ),
        );
        setTransactionErrorList(errorArr);
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  }

  // Loading
  React.useEffect(() => {
    getGSheetData();
  }, []);

  console.log("latest transaction list: ", cleanTransactions);

  return (
    <>
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
                cleanTransactions.length === 0 ? "animate-spin-slow" : ""
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
            <h2 className="section-title">Transactions</h2>
            <TransactionsList
              cleanTransactions={cleanTransactions}
              transactionErrorList={transactionErrorList}
            ></TransactionsList>
          </Route>
          <Route path="/grid">
            <h2 className="section-title">Grid</h2>
            <GridViewer cleanTransactions={cleanTransactions}></GridViewer>
          </Route>
          <Route path="/chart">
            <h2 className="section-title">Chart</h2>
            <ChartViewer cleanTransactions={cleanTransactions}></ChartViewer>
          </Route>
          <Route path="/">
            <h2 className="section-title">Chart</h2>
            <ChartViewer cleanTransactions={cleanTransactions}></ChartViewer>
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
    </>
  );
}
