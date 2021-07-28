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
import { iTransaction, category } from "./utils/types";

// RENDER
export default function App() {
  // States
  const [cleanTransactions, setCleanTransactions] = React.useState<
    iTransaction[]
  >([]);

  // Helpers
  function getGSheetData() {
    setCleanTransactions([]);
    axios
      .get(
        `${process.env.REACT_APP_GSHEET_URL}?key=${process.env.REACT_APP_GAPI_KEY}`,
      )
      .then((res) => {
        const data = res.data;
        setCleanTransactions(
          data.values
            .slice(1)
            .map(
              ([index, date, description, category, amount]: [
                number,
                string,
                string,
                category,
                string,
              ]) => {
                return {
                  index,
                  date,
                  description,
                  category,
                  amount: parseInt(amount),
                };
              },
            ),
        );
      })
      .catch((err) => {
        console.log("error");
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
