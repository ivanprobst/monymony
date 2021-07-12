// Libs
import * as React from "react";
import {
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from "@material-ui/core";
import { iTransaction, gridRowModel, iGridData } from "../../types";
import { configColumns } from "../../types";

// Components
import GridCell from "./GridCell";

export default function Grids({
	cleanTransactions,
}: {
	cleanTransactions: iTransaction[];
}) {
	// Definitions
	const [gridData, setGridData] = React.useState<iGridData>({});

	// LOADING
	React.useEffect(() => {
		const newGrid: iGridData = {};
		// Build empty grid
		for (const group of Object.keys(gridRowModel)) {
			newGrid[`Total ${group}`] = new Array(configColumns.length + 1).fill(0);
			newGrid[`Profit ${group}`] = new Array(configColumns.length + 1).fill(0);
			for (const category of Object.keys(gridRowModel[group])) {
				newGrid[category] = new Array(configColumns.length + 1).fill(0);
			}
		}

		// Add category data
		for (const transactionItem of cleanTransactions) {
			if (newGrid[transactionItem.category] === undefined) {
				throw new Error(`Missing category: ${transactionItem.category}`);
			}
			newGrid[transactionItem.category][
				parseInt(transactionItem.date.split(".")[1]) - 1
			] += transactionItem.amount;
		}

		// Add total and profit for each group
		const currentProfits = [...newGrid["Total Revenues"]];
		for (const group of Object.keys(gridRowModel)) {
			for (
				let columnIndex = 0;
				columnIndex < configColumns.length;
				columnIndex++
			) {
				let currentTot = 0;
				for (const category of Object.keys(gridRowModel[group])) {
					currentTot += newGrid[category][columnIndex];
				}
				currentProfits[columnIndex] += currentTot;
				newGrid[`Total ${group}`][columnIndex] = currentTot;
				newGrid[`Profit ${group}`][columnIndex] = currentProfits[columnIndex];
			}
		}

		// Add total for each row
		for (const rowKey of Object.keys(newGrid)) {
			let totalRow = 0;
			for (let i = 0; i < configColumns.length; i++) {
				totalRow += newGrid[rowKey][i];
			}
			newGrid[rowKey][configColumns.length] = totalRow;
		}

		console.log("griddata: ", newGrid);

		setGridData(newGrid);
	}, [cleanTransactions]);

	// RENDER
	return (
		<>
			<h2>Grid</h2>
			<TableContainer>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							{configColumns.map((columnValue) => (
								<TableCell align="right">{columnValue}</TableCell>
							))}
							<TableCell>Total</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.keys(gridRowModel).map((groupItem) => {
							return (
								<>
									<TableRow>
										<TableCell variant="head">{groupItem}</TableCell>
									</TableRow>
									{Object.keys(gridRowModel[groupItem]).map((categoryItem) => {
										return (
											<TableRow>
												<TableCell>{categoryItem}</TableCell>
												<AmountCells category={categoryItem}></AmountCells>
											</TableRow>
										);
									})}
									<TableRow>
										<TableCell variant="head">Total</TableCell>
										<TotalCells group={groupItem}></TotalCells>
									</TableRow>
									<TableRow>
										<TableCell variant="head">Profit</TableCell>
										<ProfitCells group={groupItem}></ProfitCells>
									</TableRow>
									<TableRow>
										<TableCell>&nbsp;</TableCell>
									</TableRow>
								</>
							);
						})}
						<TableRow>
							<TableCell variant="head">Final income</TableCell>
							<ProfitCells group="Investments"></ProfitCells>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);

	// HELPER COMPS
	function AmountCells({ category }: { category: string }) {
		if (gridData[category] === undefined) {
			return <></>;
		} else {
			return (
				<>
					{gridData[category].map((amountItem) => (
						<GridCell value={amountItem} type="category"></GridCell>
					))}
				</>
			);
		}
	}

	function TotalCells({ group }: { group: string }) {
		if (gridData[`Total ${group}`] === undefined) {
			return <></>;
		} else {
			return (
				<>
					{gridData[`Total ${group}`].map((amount) => (
						<GridCell value={amount} type="total"></GridCell>
					))}
				</>
			);
		}
	}

	function ProfitCells({ group }: { group: string }) {
		if (gridData[`Profit ${group}`] === undefined) {
			return <></>;
		} else {
			return (
				<>
					{gridData[`Profit ${group}`].map((amount) => (
						<GridCell value={amount} type="profit"></GridCell>
					))}
				</>
			);
		}
	}
}
