// Libs
import * as React from "react";
import { observer } from "mobx-react-lite";
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
import { TransactionContext, ConfigurationContext } from "../utils/types";

// Types
interface GroupCurveToDisplayMap {
  [group: string]: boolean;
}

type ChartDataset = Array<{
  month: string;
  dataset: { [group: string]: number };
}>;

interface ChartTrendSet {
  [groupName: string]: {
    average: number;
    regressionA: number;
    regressionB: number;
  };
}

// Component
function Chart({
  groupCurvesToDisplay,
  chartDataset,
  chartTrendSet,
}: {
  groupCurvesToDisplay: GroupCurveToDisplayMap;
  chartDataset: ChartDataset;
  chartTrendSet: ChartTrendSet;
}) {
  const config = React.useContext(ConfigurationContext);

  return (
    <ResponsiveContainer width="95%" minHeight={500}>
      <LineChart
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        data={chartDataset}
      >
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        {Object.entries(groupCurvesToDisplay)
          .filter(([, displayCurves]) => displayCurves)
          .map(([group]) => {
            return [
              <Line
                key={`amount_${group}`}
                type="monotone"
                dataKey={`dataset.${group}`}
                stroke={config.colorThemeFromGroup(group)?.colorCode}
              ></Line>,

              <ReferenceLine
                key={`average_${group}`}
                stroke={config.colorThemeFromGroup(group)?.colorCode}
                strokeDasharray="1 5"
                y={chartTrendSet[group]["average"]}
              />,

              <ReferenceLine
                label="Trend"
                key={`trend_${group}`}
                stroke={config.colorThemeFromGroup(group)?.colorCode}
                strokeDasharray="4 4"
                segment={[
                  {
                    x: config.monthsList[0],
                    y: chartTrendSet[group]["regressionA"],
                  },
                  {
                    x: config.monthsList[config.numberOfMonths - 1],
                    y:
                      config.numberOfMonths *
                        chartTrendSet[group]["regressionB"] +
                      chartTrendSet[group]["regressionA"],
                  },
                ]}
              />,
            ];
          })}
      </LineChart>
    </ResponsiveContainer>
  );
}

// Component
function CurveController({
  groupCurvesToDisplay,
  curveToggler,
}: {
  groupCurvesToDisplay: GroupCurveToDisplayMap;
  curveToggler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const config = React.useContext(ConfigurationContext);

  return (
    <>
      {Object.entries(groupCurvesToDisplay).map(([group, displayCurves]) => (
        <label key={group} className="block mb-2">
          <input
            className={`text-${config.colorThemeFromGroup(group)?.colorClass}`}
            name={group}
            type="checkbox"
            onChange={curveToggler}
            checked={displayCurves}
          />
          <span className="ml-2 text-base">{group}</span>
        </label>
      ))}
    </>
  );
}

// Render
export default observer(function ChartViewer() {
  // Definitions
  const allTransactions = React.useContext(TransactionContext);
  const config = React.useContext(ConfigurationContext);

  const [groupCurvesToDisplay, setCurvesToDisplay] =
    React.useState<GroupCurveToDisplayMap>(
      Object.fromEntries(config.groupsList.map((group) => [[group], true])),
    );

  // Helpers
  const toggleCurveCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurvesToDisplay({
      ...groupCurvesToDisplay,
      [event.target.name]: event.target.checked,
    });
  };

  // Build standard dataset
  const chartDataset: ChartDataset = [];
  config.monthsList.forEach((month, monthIndex) => {
    const dataset = Object.fromEntries(
      config.groupsList.map((group) => [
        [group],
        allTransactions.totalFromCategoryOrGroup(
          "group",
          group,
          monthIndex + 1,
        ),
      ]),
    );

    chartDataset.push({
      month,
      dataset,
    });
  });

  // Build trends dataset
  const chartTrendSet: ChartTrendSet = {};
  config.groupsList.forEach((group) => {
    let sumX = 0;
    let sumY = 0;
    let sumX2 = 0;
    let sumXY = 0;

    config.monthsList.forEach((month, monthIndex) => {
      sumX += monthIndex;
      sumX2 += monthIndex * monthIndex;
      sumY += chartDataset[monthIndex]["dataset"][group];
      sumXY += chartDataset[monthIndex]["dataset"][group] * monthIndex;
    });

    chartTrendSet[group] = {
      average: sumY / config.numberOfMonths,
      regressionA:
        (sumY * sumX2 - sumX * sumXY) /
        (config.numberOfMonths * sumX2 - sumX * sumX),
      regressionB:
        (config.numberOfMonths * sumXY - sumX * sumY) /
        (config.numberOfMonths * sumX2 - sumX * sumX),
    };
  });

  return (
    <section className="grid grid-cols-5">
      <div className="col-span-4">
        <Chart
          groupCurvesToDisplay={groupCurvesToDisplay}
          chartDataset={chartDataset}
          chartTrendSet={chartTrendSet}
        ></Chart>
      </div>
      <div>
        <CurveController
          groupCurvesToDisplay={groupCurvesToDisplay}
          curveToggler={toggleCurveCheckbox}
        ></CurveController>
      </div>
    </section>
  );
});
