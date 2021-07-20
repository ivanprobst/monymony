// Libs
import * as React from "react";
import { Switch, Route, Link } from "react-router-dom";

import axios from "axios";
import { ThemeProvider } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import "@fontsource/roboto";
import "@fontsource/material-icons";

// Components
import ChartViewer from "./components/Charts";
import GridViewer from "./components/Grids";
import TransactionsList from "./components/Transactions";

// Assets
import { iTransaction, category } from "./utils/types";
import "./App.css";
import { theme } from "./theme";

export default function App() {
  // Definitions
  const [cleanTransactions, setCleanTransactions] = React.useState<
    iTransaction[]
  >([]);

  // LOADING
  React.useEffect(() => {
    getGSheetData();
  }, []);

  console.log("Clean transactions: ", cleanTransactions);
  // RENDER
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <Grid container>
            <Grid item xs={6}>
              <h1>Mony mony</h1>
            </Grid>
            <Grid item xs={6}>
              <nav>
                <Link to="/transactions">Transactions</Link>
                &nbsp;|&nbsp;
                <Link to="/grid">Grid</Link>
                &nbsp;|&nbsp;
                <Link to="/chart">Chart</Link>
                &nbsp;-&nbsp;
                <button
                  onClick={() => {
                    getGSheetData();
                  }}
                >
                  Refresh
                </button>
              </nav>
            </Grid>
          </Grid>
        </header>

        <div className="App-body">
          <Switch>
            <Route path="/transactions">
              <TransactionsList
                cleanTransactions={cleanTransactions}
              ></TransactionsList>
            </Route>
            <Route path="/grid">
              <GridViewer cleanTransactions={cleanTransactions}></GridViewer>
            </Route>
            <Route path="/chart">
              <ChartViewer cleanTransactions={cleanTransactions}></ChartViewer>
            </Route>
            <Route path="/">
              <ChartViewer cleanTransactions={cleanTransactions}></ChartViewer>
            </Route>
          </Switch>
        </div>
      </div>
    </ThemeProvider>
  );

  // HELPERS
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
}
