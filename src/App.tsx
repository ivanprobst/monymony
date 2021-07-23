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
              ([index, date, description, , , amount, category]: [
                number,
                string,
                string,
                any,
                any,
                string,
                category,
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

  return (
    <>
      <header className="grid grid-cols-2 p-4 bg-mred">
        <h1 className="self-center text-3xl text-white">
          <a href="/">Mony mony</a>
        </h1>
        <nav className="self-center text-right">
          <a
            href="/#"
            className="p-2 text-white hover:text-mred-light"
            onClick={getGSheetData}
          >
            <RefreshIcon className="inline h-6 w-6" />
          </a>
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

      <section className="p-8 text-sm text-gray-700">
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
      </section>

      <footer className="p-4 text-white bg-mred">© 2021 by ivanprobst</footer>
    </>
  );
}
