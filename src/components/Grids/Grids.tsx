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

// Components
import GridCell from "./GridCell";

// Assets
import {
	configMonths,
	configGroups,
	iTransaction,
	iGridData,
} from "../../types";

export default function Grids({
	cleanTransactions,
}: {
	cleanTransactions: Array<iTransaction>;
}) {
	// Definitions
	let gridData: iGridData = {};

	// LOADING
	// Build empty grid
	for (const group of configGroups) {
		gridData[`Total ${group.name}`] = new Array(configMonths.length + 1).fill(
			0,
		);
		gridData[`Profit ${group.name}`] = new Array(configMonths.length + 1).fill(
			0,
		);
		for (const category of group.categories) {
			gridData[category] = new Array(configMonths.length + 1).fill(0);
		}
	}

	// Fill in category rows
	for (const transaction of cleanTransactions) {
		if (gridData[transaction.category] === undefined) {
			throw new Error(
				`Category not defined in configuration: ${transaction.category}`,
			);
		}
		gridData[transaction.category][
			parseInt(transaction.date.split(".")[1]) - 1
		] += transaction.amount;
	}

	// Fill in total and profit rows
	for (let month = 0; month < configMonths.length; month++) {
		let currentProfit = 0;
		for (const group of configGroups) {
			let currentTotal = 0;
			for (const category of group.categories) {
				currentTotal += gridData[category][month];
			}
			group.type === "revenues"
				? (currentProfit += currentTotal)
				: (currentProfit -= currentTotal);
			gridData[`Total ${group.name}`][month] = currentTotal;
			gridData[`Profit ${group.name}`][month] = currentProfit;
		}
	}

	// Fill in row totals
	for (const rowKey of Object.keys(gridData)) {
		let totalRow = 0;
		for (let i = 0; i < configMonths.length; i++) {
			totalRow += gridData[rowKey][i];
		}
		gridData[rowKey][configMonths.length] = totalRow;
	}

	console.log("newest data: ", gridData);

	// RENDER
	return (
		<>
			<h2>Grid</h2>
			<TableContainer>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							{configMonths.map((columnValue) => (
								<TableCell key={columnValue} align="right">
									{columnValue}
								</TableCell>
							))}
							<TableCell>Total</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{configGroups.map((group) => (
							<>
								<TableRow key={group.name}>
									<TableCell variant="head">{group.name}</TableCell>
								</TableRow>
								{group.categories.map((category) => (
									<TableRow key={category}>
										<TableCell>{category}</TableCell>
										{gridData[category]?.map((amount, index) => (
											<GridCell
												key={`${category}_${index}`}
												value={amount}
												type="category"
											></GridCell>
										))}
									</TableRow>
								))}
								<TableRow>
									<TableCell>Total</TableCell>
									{gridData[`Total ${group.name}`]?.map((amount, index) => (
										<GridCell
											key={`${group.name}_${index}`}
											value={amount}
											type="total"
										></GridCell>
									))}
								</TableRow>
								<TableRow>
									<TableCell>Profit</TableCell>
									{gridData[`Profit ${group.name}`]?.map((amount, index) => (
										<GridCell
											key={`${group.name}_${index}`}
											value={amount}
											type="profit"
										></GridCell>
									))}
								</TableRow>
								<TableRow>
									<TableCell>&nbsp;</TableCell>
								</TableRow>
							</>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
