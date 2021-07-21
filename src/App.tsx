// Libs
import * as React from "react";
import { Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import { ThemeProvider } from "@material-ui/core/styles";
import { Grid, Container } from "@material-ui/core";

// Components
import ChartViewer from "./components/Charts";
import GridViewer from "./components/Grids";
import TransactionsList from "./components/Transactions";

// Assets
import { iTransaction, category } from "./utils/types";
import "./App.css";
import { theme } from "./theme";

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
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <Grid container>
            <Grid item xs={6}>
              <h1 className="text-2xl">Mony mony</h1>
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
          <Container>
            <Switch>
              <Route path="/transactions">
                <h2>Transactions</h2>
                <TransactionsList
                  cleanTransactions={cleanTransactions}
                ></TransactionsList>
              </Route>
              <Route path="/grid">
                <h2>Grid</h2>
                <GridViewer cleanTransactions={cleanTransactions}></GridViewer>
              </Route>
              <Route path="/chart">
                <h2>Chart</h2>
                <ChartViewer
                  cleanTransactions={cleanTransactions}
                ></ChartViewer>
              </Route>
              <Route path="/">
                <h2>Chart</h2>
                <ChartViewer
                  cleanTransactions={cleanTransactions}
                ></ChartViewer>
              </Route>
            </Switch>
          </Container>
        </div>
      </div>
    </ThemeProvider>
  );
}
