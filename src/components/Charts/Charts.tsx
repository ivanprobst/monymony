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
import { iTransaction } from "../../utils/types";
import {
  CONFIG_MONTHS,
  CONFIG_GROUP_STRUCTURE,
  CONFIG_GROUP_LIST,
  CONFIG_CHART_COLOR,
  CONFIG_CATEGORY_TO_GROUP,
} from "../../utils/configurations";

// Types
type CurveToDisplayMap = {
  [curveName: string]: boolean;
};

type ChartDataset = Array<{
  month: string;
  dataset: { [groupName: string]: number };
}>;

type ChartReferenceSet = {
  [groupName: string]: { [referenceType: string]: number };
};

// COMP: Chart
function Chart({
  curvesToDisplay,
  chartLinesDataset,
  chartReferenceData,
}: {
  curvesToDisplay: CurveToDisplayMap;
  chartLinesDataset: ChartDataset;
  chartReferenceData: ChartReferenceSet;
}) {
  return (
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
                        x: CONFIG_MONTHS[0],
                        y: chartReferenceData[curveName]["a"],
                      },
                      {
                        x: CONFIG_MONTHS[CONFIG_MONTHS.length - 1],
                        y:
                          CONFIG_MONTHS.length *
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
  );
}

// COMP: CurveSelector
function CurveSelector({
  curvesToDisplay,
  curveToggler,
}: {
  curvesToDisplay: CurveToDisplayMap;
  curveToggler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      {Object.entries(curvesToDisplay).map(([curveName, displayCurve]) => (
        <FormControlLabel
          key={curveName}
          control={
            <Checkbox
              checked={displayCurve}
              onChange={curveToggler}
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
    </>
  );
}

// RENDER
export default function ChartViewer({
  cleanTransactions,
}: {
  cleanTransactions: Array<iTransaction>;
}) {
  // States
  const [curvesToDisplay, setCurvesToDisplay] =
    React.useState<CurveToDisplayMap>({
      ...CONFIG_GROUP_LIST.reduce(
        (accumulator: { [group: string]: boolean }, groupName) => ({
          ...accumulator,
          [groupName]: false,
        }),
        { Income: true },
      ),
    });

  // Helpers
  const toggleCurveCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurvesToDisplay({
      ...curvesToDisplay,
      [event.target.name]: event.target.checked,
    });
  };

  // Build empty chart lines dataset
  const chartLinesDataset: ChartDataset = CONFIG_MONTHS.map((monthKey) =>
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

  // Calculate dataset totals
  for (const transaction of cleanTransactions) {
    const monthIndex = parseInt(transaction.date.split(".")[1]) - 1;
    chartLinesDataset[monthIndex]["dataset"][
      CONFIG_CATEGORY_TO_GROUP[transaction.category]
    ] =
      (chartLinesDataset[monthIndex]["dataset"][
        CONFIG_CATEGORY_TO_GROUP[transaction.category]
      ] as number) + transaction.amount;
  }

  // Calculate dataset income
  for (const monthIndex in CONFIG_MONTHS) {
    for (const group of CONFIG_GROUP_STRUCTURE) {
      let newIncome =
        chartLinesDataset[monthIndex]["dataset"][group.name] *
        (group.type === "revenues" ? 1 : -1);
      chartLinesDataset[monthIndex]["dataset"]["Income"] =
        chartLinesDataset[monthIndex]["dataset"]["Income"] + newIncome;
    }
  }

  // Calculate references lines: averages and linear regression
  const chartReferenceData: ChartReferenceSet = {};
  const groupList = CONFIG_GROUP_STRUCTURE.map((group) => group.name).concat([
    "Income",
  ]);
  for (const group of groupList) {
    let sumX = 0;
    let sumY = 0;
    let sumX2 = 0;
    let sumXY = 0;
    for (let i = 0; i < CONFIG_MONTHS.length; i++) {
      if (chartLinesDataset[i] !== undefined) {
        sumX += i;
        sumX2 += i * i;
        sumY += chartLinesDataset[i]["dataset"][group];
        sumXY += chartLinesDataset[i]["dataset"][group] * i;
      }
    }
    chartReferenceData[group] = {
      average: sumY / CONFIG_MONTHS.length,
      a:
        (sumY * sumX2 - sumX * sumXY) /
        (CONFIG_MONTHS.length * sumX2 - sumX * sumX),
      b:
        (CONFIG_MONTHS.length * sumXY - sumX * sumY) /
        (CONFIG_MONTHS.length * sumX2 - sumX * sumX),
    };
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={10}>
        <Chart
          curvesToDisplay={curvesToDisplay}
          chartLinesDataset={chartLinesDataset}
          chartReferenceData={chartReferenceData}
        ></Chart>
      </Grid>
      <Grid item xs={2}>
        <CurveSelector
          curvesToDisplay={curvesToDisplay}
          curveToggler={toggleCurveCheckbox}
        ></CurveSelector>
      </Grid>
    </Grid>
  );
}
