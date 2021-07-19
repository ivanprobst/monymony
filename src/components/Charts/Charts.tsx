// Libs
import * as React from "react";
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";
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
  CONFIG_GROUP_LIST,
  CONFIG_CHART_COLOR,
  CONFIG_CATEGORY_TO_GROUP,
  iTransaction,
} from "../../types";

// RENDER
export default function Charts({
  cleanTransactions,
}: {
  cleanTransactions: Array<iTransaction>;
}) {
  // Curves display handling
  const [curvesToDisplay, setCurvesToDisplay] = React.useState<{
    [curve: string]: boolean;
  }>({
    ...CONFIG_GROUP_LIST.reduce(
      (accumulator: { [group: string]: boolean }, groupName) => ({
        ...accumulator,
        [groupName]: false,
      }),
      { Income: true },
    ),
  });

  const toggleCurveCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurvesToDisplay({
      ...curvesToDisplay,
      [event.target.name]: event.target.checked,
    });
  };

  // Build empty chart lines dataset
  const chartLinesDataset: Array<{
    month: string;
    dataset: { [group: string]: number };
  }> = configMonths.map((monthKey) =>
    CONFIG_GROUP_LIST.reduce(
      (
        accumulator: { month: string; dataset: { [group: string]: number } },
        groupName,
      ) => {
        const test = { ...accumulator };
        test.dataset[groupName] = 0;
        return test;
      },
      { month: monthKey, dataset: { Income: 0 } },
    ),
  );

  // Build totals
  for (const transaction of cleanTransactions) {
    const monthIndex = parseInt(transaction.date.split(".")[1]) - 1;
    chartLinesDataset[monthIndex]["dataset"][
      CONFIG_CATEGORY_TO_GROUP[transaction.category]
    ] =
      (chartLinesDataset[monthIndex]["dataset"][
        CONFIG_CATEGORY_TO_GROUP[transaction.category]
      ] as number) + transaction.amount;
  }

  // Build income
  for (const monthIndex in configMonths) {
    for (const group of configGroups) {
      let newIncome =
        chartLinesDataset[monthIndex]["dataset"][group.name] *
        (group.type === "revenues" ? 1 : -1);
      chartLinesDataset[monthIndex]["dataset"]["Income"] =
        chartLinesDataset[monthIndex]["dataset"]["Income"] + newIncome;
    }
  }

  // Build references lines: averages and linear regression
  const chartReferenceData: { [group: string]: { [type: string]: number } } =
    {};
  const groupList = configGroups.map((group) => group.name).concat(["Income"]);
  for (const group of groupList) {
    let sumX = 0;
    let sumY = 0;
    let sumX2 = 0;
    let sumXY = 0;
    for (let i = 0; i < configMonths.length; i++) {
      if (chartLinesDataset[i] !== undefined) {
        sumX += i;
        sumX2 += i * i;
        sumY += chartLinesDataset[i]["dataset"][group];
        sumXY += chartLinesDataset[i]["dataset"][group] * i;
      }
    }
    chartReferenceData[group] = {
      average: sumY / configMonths.length,
      a:
        (sumY * sumX2 - sumX * sumXY) /
        (configMonths.length * sumX2 - sumX * sumX),
      b:
        (configMonths.length * sumXY - sumX * sumY) /
        (configMonths.length * sumX2 - sumX * sumX),
    };
  }

  return (
    <>
      <h2>Chart</h2>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <ResponsiveContainer width="95%" height={500}>
            <LineChart
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              data={chartLinesDataset}
            >
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              {Object.entries(curvesToDisplay).reduce(
                (curveList: Array<JSX.Element>, [curveName, displayCurve]) => {
                  if (displayCurve) {
                    return curveList
                      .concat([
                        <Line
                          key={`amount_${curveName}`}
                          type="monotone"
                          dataKey={`dataset.${curveName}`}
                          stroke={CONFIG_CHART_COLOR[curveName]["colorCode"]}
                          dot={{
                            stroke: CONFIG_CHART_COLOR[curveName]["colorCode"],
                            strokeWidth: 1,
                          }}
                        ></Line>,
                      ])
                      .concat([
                        <ReferenceLine
                          label="Average"
                          key={`average_${curveName}`}
                          stroke={CONFIG_CHART_COLOR[curveName]["colorCode"]}
                          strokeDasharray="1 5"
                          y={chartReferenceData[curveName]["average"]}
                        />,
                      ])
                      .concat([
                        <ReferenceLine
                          label="Trend"
                          key={`trend_${curveName}`}
                          stroke={CONFIG_CHART_COLOR[curveName]["colorCode"]}
                          strokeDasharray="4 4"
                          segment={[
                            {
                              x: configMonths[0],
                              y: chartReferenceData[curveName]["a"],
                            },
                            {
                              x: configMonths[configMonths.length - 1],
                              y:
                                configMonths.length *
                                  chartReferenceData[curveName]["b"] +
                                chartReferenceData[curveName]["a"],
                            },
                          ]}
                        />,
                      ]);
                  }
                  return curveList;
                },
                [],
              )}
            </LineChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={2}>
          {Object.entries(curvesToDisplay).map(([curveName, displayCurve]) => (
            <FormControlLabel
              key={curveName}
              control={
                <Checkbox
                  checked={displayCurve}
                  onChange={toggleCurveCheckbox}
                  name={curveName}
                  color="primary"
                  classes={{
                    colorPrimary: CONFIG_CHART_COLOR[curveName]["class"],
                  }}
                />
              }
              label={curveName}
            />
          ))}
        </Grid>
      </Grid>
    </>
  );
}
