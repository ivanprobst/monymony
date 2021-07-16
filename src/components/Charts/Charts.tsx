// Libs
import * as React from "react";
import { Container, Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import {
	ResponsiveContainer,
	CartesianGrid,
	XAxis,
	YAxis,
	LineChart,
	Line,
	Tooltip,
	ReferenceLine,
} from "recharts";

// Assets
import {
	configMonths,
	configGroups,
	CONFIG_CHART_COLOR,
	iTransaction,
} from "../../types";

export default function Charts({
	cleanTransactions,
}: {
	cleanTransactions: Array<iTransaction>;
}) {
	// Definitions
	const averageData: { [group: string]: number } = {};
	const regressionData: { [group: string]: { [type: string]: number } } = {};
	const [chartData, setChartData] = React.useState<
		Array<{
			month: string;
			[group: string]: number | string;
		}>
	>([]);
	const [dataToDisplay, setDataToDisplay] = React.useState<{
		[group: string]: boolean;
	}>({
		...configGroups.reduce(
			(passed: { [group: string]: boolean }, group) => {
				passed[group.name] = false;
				return passed;
			},
			{ Income: true },
		),
	});

	React.useEffect(() => {
		// Build empty data
		const groupsObj = configGroups.reduce(
			(passed: { [group: string]: number }, group) => {
				passed[group.name] = 0;
				return passed;
			},
			{},
		);
		const newChartData: Array<{
			month: string;
			[group: string]: number | string;
		}> = configMonths.map((monthKey) => ({
			month: monthKey,
			Income: 0,
			...groupsObj,
		}));

		// Cat > group map
		const catGroupMap: { [category: string]: string } = {};
		for (const group of configGroups) {
			for (const category of group.categories) {
				catGroupMap[category] = group.name;
			}
		}

		// Build totals
		for (const transaction of cleanTransactions) {
			const monthIndex = parseInt(transaction.date.split(".")[1]) - 1;
			newChartData[monthIndex][catGroupMap[transaction.category]] =
				(newChartData[monthIndex][
					catGroupMap[transaction.category]
				] as number) + transaction.amount;
		}

		// Build income
		for (const monthIndex in configMonths) {
			for (const group of configGroups) {
				let newIncome =
					(newChartData[monthIndex][group.name] as number) *
					(group.type === "revenues" ? 1 : -1);
				newChartData[monthIndex]["Income"] =
					(newChartData[monthIndex]["Income"] as number) + newIncome;
			}
		}

		console.log("Chart data: ", newChartData);
		setChartData(newChartData);
	}, [cleanTransactions]);

	// Build averages and linear regression
	const groupList = configGroups.map((group) => group.name).concat(["Income"]);
	for (const group of groupList) {
		//let sum = 0;
		let sumX = 0;
		let sumY = 0;
		let sumX2 = 0;
		let sumXY = 0;
		for (let i = 0; i < configMonths.length; i++) {
			if (chartData[i] !== undefined) {
				//sum += chartData[i][group] as number;
				sumX += i;
				sumX2 += i * i;
				sumY += chartData[i][group] as number;
				sumXY += (chartData[i][group] as number) * i;
			}
		}
		averageData[group] = sumY / configMonths.length;
		regressionData[group] = {
			a:
				(sumY * sumX2 - sumX * sumXY) /
				(configMonths.length * sumX2 - sumX * sumX),
			b:
				(configMonths.length * sumXY - sumX * sumY) /
				(configMonths.length * sumX2 - sumX * sumX),
		};
	}
	console.log("reg: ", regressionData);

	// Checkbox controler
	const checkboxTicked = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDataToDisplay({
			...dataToDisplay,
			[event.target.name]: event.target.checked,
		});
	};

	// RENDER
	return (
		<Container>
			<h2>Chart</h2>
			<Grid container spacing={3}>
				<Grid item xs={10}>
					<ResponsiveContainer width="95%" height={500}>
						<LineChart
							margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
							data={chartData}
						>
							<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
							<XAxis dataKey="month" />
							<YAxis />
							<Tooltip />
							{Object.keys(dataToDisplay).reduce(
								(passed: Array<JSX.Element>, current) => {
									if (dataToDisplay[current]) {
										return passed
											.concat([
												<Line
													key={`amount_${current}`}
													type="monotone"
													dataKey={current}
													stroke={CONFIG_CHART_COLOR[current]["colorCode"]}
													dot={{
														stroke: CONFIG_CHART_COLOR[current]["colorCode"],
														strokeWidth: 1,
													}}
												></Line>,
											])
											.concat([
												<ReferenceLine
													label="Average"
													key={`average_${current}`}
													stroke={CONFIG_CHART_COLOR[current]["colorCode"]}
													strokeDasharray="1 5"
													y={averageData[current]}
												/>,
											])
											.concat([
												<ReferenceLine
													label="Trend"
													key={`trend_${current}`}
													stroke={CONFIG_CHART_COLOR[current]["colorCode"]}
													strokeDasharray="4 4"
													segment={[
														{
															x: configMonths[0],
															y: regressionData[current]["a"],
														},
														{
															x: configMonths[configMonths.length - 1],
															y:
																configMonths.length *
																	regressionData[current]["b"] +
																regressionData[current]["a"],
														},
													]}
												/>,
											]);
									}
									return passed;
								},
								[],
							)}
						</LineChart>
					</ResponsiveContainer>
				</Grid>
				<Grid item xs={2}>
					{Object.keys(dataToDisplay).map((group) => (
						<FormControlLabel
							key={group}
							control={
								<Checkbox
									checked={dataToDisplay[group]}
									onChange={checkboxTicked}
									name={group}
									color="primary"
									classes={{
										colorPrimary: CONFIG_CHART_COLOR[group]["class"],
									}}
								/>
							}
							label={group}
						/>
					))}
				</Grid>
			</Grid>
		</Container>
	);
}
