// Libs
import * as React from "react";
import axios from "axios";
import { ThemeProvider } from "@material-ui/core/styles";
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
import { theme } from "./theme";

export default function App() {
	// Definitions
	const [cleanTransactions, setCleanTransactions] = React.useState<
		iTransaction[]
	>([]);

	const tabs = {
		0: <Charts cleanTransactions={cleanTransactions}></Charts>,
		1: <Grids cleanTransactions={cleanTransactions}></Grids>,
		2: <Transactions cleanTransactions={cleanTransactions}></Transactions>,
	};

	type tabOptions = keyof typeof tabs;

	const [currentTab, setCurrentTab] = React.useState<tabOptions>(0);

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
							<ButtonGroup variant="contained" color="primary">
								<Button
									onClick={() => {
										getGSheetData();
									}}
								>
									<span className="material-icons">refresh</span>
								</Button>
								<Button
									onClick={() => {
										setCurrentTab(0);
									}}
								>
									<span className="material-icons">insights</span>
									&nbsp;&nbsp;Chart
								</Button>
								<Button
									onClick={() => {
										setCurrentTab(1);
									}}
								>
									<span className="material-icons">apps</span>&nbsp;&nbsp;Grid
								</Button>
								<Button
									onClick={() => {
										setCurrentTab(2);
									}}
								>
									<span className="material-icons">segment</span>
									&nbsp;&nbsp;Transactions
								</Button>
							</ButtonGroup>
						</Grid>
					</Grid>
				</header>
				<div className="App-body">{tabs[currentTab]}</div>
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
