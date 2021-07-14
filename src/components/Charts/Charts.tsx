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
		const newChartData: Array<{
			month: string;
			[group: string]: number | string;
		}> = configMonths.map((monthKey) => ({
			month: monthKey,
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
			const currentVal = newChartData[monthIndex][
				catGroupMap[transaction.category]
			] as number;
			newChartData[monthIndex][catGroupMap[transaction.category]] =
				currentVal + transaction.amount;
		}

		setChartData(newChartData);
		console.log("Chart data: ", newChartData);
	}, [cleanTransactions]);

	const renderChart = (
		<ResponsiveContainer width="80%" height={400}>
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
