// Libs
import * as React from "react";
import { Container } from "@material-ui/core";
import {
	ResponsiveContainer,
	CartesianGrid,
	XAxis,
	YAxis,
	LineChart,
	Line,
	Tooltip,
	Legend,
} from "recharts";

// Assets
import { configMonths, configGroups, iTransaction } from "../../types";

export default function Charts({
	cleanTransactions,
}: {
	cleanTransactions: Array<iTransaction>;
}) {
	// Definitions
	const [chartData, setChartData] = React.useState<Array<{}>>([{}]);

	React.useEffect(() => {
		const groupsObj = configGroups.reduce(
			(passed: { [group: string]: number }, group) => {
				passed[group.name] = 0;
				return passed;
			},
			{}
		);

		// Build empty data
		const newChartData: Array<{
			month: string;
			[group: string]: number | string;
		}> = configMonths.map((monthKey) => ({
			month: monthKey,
			Income: 0,
			...groupsObj,
		}));

		const catGroupMap: { [category: string]: string } = {};
		for (const group of configGroups) {
			for (const category of group.categories) {
				catGroupMap[category] = group.name;
			}
		}

		for (const transaction of cleanTransactions) {
			const monthIndex = parseInt(transaction.date.split(".")[1]) - 1;
			newChartData[monthIndex][catGroupMap[transaction.category]] =
				(newChartData[monthIndex][
					catGroupMap[transaction.category]
				] as number) + transaction.amount;
		}

		for (const monthIndex in configMonths) {
			for (const group of configGroups) {
				let newIncome =
					(newChartData[monthIndex][group.name] as number) *
					(group.type === "revenues" ? 1 : -1);
				newChartData[monthIndex]["Income"] =
					(newChartData[monthIndex]["Income"] as number) + newIncome;
			}
		}

		setChartData(newChartData);
		console.log("Chart data: ", newChartData);
	}, [cleanTransactions]);

	const renderChart = (
		<ResponsiveContainer width="90%" height={500}>
			<LineChart
				margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
				data={chartData}
			>
				<CartesianGrid stroke="#C1D2D9" strokeDasharray="5 5" />
				<XAxis dataKey="month" />
				<YAxis />
				<Legend />
				<Tooltip />
				{configGroups.map((group) => {
					if (chartData[0] === undefined) return <></>;
					return (
						<Line
							type="monotone"
							dataKey={group.name}
							stroke="#AC3931"
							dot={{ stroke: "#AC3931", strokeWidth: 1 }}
						></Line>
					);
				})}
				<Line
					type="monotone"
					dataKey="Income"
					stroke="#537D8D"
					dot={{ stroke: "#537D8D", strokeWidth: 1 }}
				></Line>
			</LineChart>
		</ResponsiveContainer>
	);

	// RENDER
	return (
		<Container>
			<h2>Chart</h2>
			{renderChart}
		</Container>
	);
}
