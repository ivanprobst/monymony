// Libs
import * as React from "react";
import { Grid, ButtonGroup, Button } from "@material-ui/core";
import "@fontsource/roboto";
import "@fontsource/material-icons";

// Components
import Charts from "./components/Charts/Charts";
import Grids from "./components/Grids/Grids";
import Transactions from "./components/Transactions/Transactions";

// Assets
import { iTransaction, category } from "./types";
import "./App.css";

export default function App() {
  // Definitions
  const [cleanTransactions, setCleanTransactions] = React.useState<
    iTransaction[]
  >([]);

  const tabs = {
    0: <Charts></Charts>,
    1: <Grids></Grids>,
    2: <Transactions cleanTransactions={cleanTransactions}></Transactions>,
  };

  type tabOptions = keyof typeof tabs;

  const [currentTab, setCurrentTab] = React.useState<tabOptions>(2);

  // LOADING
  React.useEffect(() => {
    fetch(
      process.env.REACT_APP_GSHEET_URL +
        "?key=" +
        process.env.REACT_APP_GAPI_KEY
    )
      .then((res) => res.json())
      .then((data) => {
        setCleanTransactions(
          data.values
            .slice(1)
            .map((rawTransaction: Array<string | number | category>) => {
              return {
                index: rawTransaction[0],
                date: rawTransaction[1],
                description: rawTransaction[2],
                category: rawTransaction[6],
                amount: rawTransaction[5],
              };
            })
        );
      })
      .catch((err) => {
        console.log("error");
      });
  }, []);

  console.log("Clean transactions: ", cleanTransactions);
  // RENDER
  return (
    <div className="App">
      <header className="App-header">
        <Grid container>
          <Grid item xs={6}>
            <h1>Mony mony</h1>
          </Grid>
          <Grid item xs={6}>
            <ButtonGroup variant="contained" color="primary">
              <Button
                onClick={() => {
                  setCurrentTab(0);
                }}
              >
                Charts
              </Button>
              <Button
                onClick={() => {
                  setCurrentTab(1);
                }}
              >
                Grid
              </Button>
              <Button
                onClick={() => {
                  setCurrentTab(2);
                }}
              >
                Transactions
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </header>
      <div className="App-body">{tabs[currentTab]}</div>
    </div>
  );
}
