// Libs
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

// Assets
import { iTransaction } from "../../utils/types";
import {
  CONFIG_MONTHS,
  CONFIG_GROUP_STRUCTURE,
  CONFIG_CATEGORY_TO_GROUP,
} from "../../utils/configurations";

// Types
interface iGridData {
  [groupName: string]: {
    [categoryName: string]: Array<number>;
  };
}

// COMP: GridCell
function GridCell({ value, type }: { value: number; type: string }) {
  const cellStyle: { [key: string]: string } = {};

  if (value === 0) {
    cellStyle.color = "#aaa";
  }

  if (type === "total") {
    cellStyle.background = "#C1D2D9";
  } else if (type === "profit") {
    cellStyle.background = value < 0 ? "#D98680" : "#D3D9A7";
  }

  return (
    <TableCell align="right" style={cellStyle}>
      {value.toLocaleString("en")}
    </TableCell>
  );
}

// COMP: GridGroupSection
function GridGroupSection({
  groupName,
  groupData,
}: {
  groupName: string;
  groupData: { [categoryName: string]: Array<number> };
}) {
  return (
    <>
      <TableRow>
        <TableCell variant="head">{groupName}</TableCell>
      </TableRow>
      {Object.entries(groupData).map(([categoryName, categoryData]) => (
        <TableRow key={`${groupName}_${categoryName}`}>
          <TableCell>{categoryName}</TableCell>
          {categoryData.map((amount, index) => (
            <GridCell
              key={`${categoryName}_${index}`}
              value={amount}
              type={
                categoryName === "Total"
                  ? "total"
                  : categoryName === "Profit"
                  ? "profit"
                  : "category"
              }
            ></GridCell>
          ))}
        </TableRow>
      ))}
      <TableRow>
        <TableCell>&nbsp;</TableCell>
      </TableRow>
    </>
  );
}

// RENDER
export default function GridViewer({
  cleanTransactions,
}: {
  cleanTransactions: Array<iTransaction>;
}) {
  // Definitions
  let gridData: iGridData = {};

  // Build empty grid
  for (const group of CONFIG_GROUP_STRUCTURE) {
    gridData[group.name] = {};
    for (const category of group.categories) {
      gridData[group.name][category] = new Array(CONFIG_MONTHS.length + 1).fill(
        0,
      );
    }
    gridData[group.name]["Total"] = new Array(CONFIG_MONTHS.length + 1).fill(0);
    gridData[group.name]["Profit"] = new Array(CONFIG_MONTHS.length + 1).fill(
      0,
    );
  }

  // Fill in category rows
  for (const transaction of cleanTransactions) {
    if (
      gridData[CONFIG_CATEGORY_TO_GROUP[transaction.category]][
        transaction.category
      ] === undefined
    ) {
      throw new Error(
        `Category not defined in configuration: ${transaction.category}`,
      );
    }
    gridData[CONFIG_CATEGORY_TO_GROUP[transaction.category]][
      transaction.category
    ][parseInt(transaction.date.split(".")[1]) - 1] += transaction.amount;
  }

  // Fill in total and profit for each group
  for (let month = 0; month < CONFIG_MONTHS.length; month++) {
    let currentProfit = 0;
    for (const group of CONFIG_GROUP_STRUCTURE) {
      let currentTotal = 0;
      for (const category of group.categories) {
        currentTotal += gridData[group.name][category][month];
      }
      group.type === "revenues"
        ? (currentProfit += currentTotal)
        : (currentProfit -= currentTotal);
      gridData[group.name]["Total"][month] = currentTotal;
      gridData[group.name]["Profit"][month] = currentProfit;
    }
  }

  // Fill in total for each row
  for (const group of Object.keys(gridData)) {
    for (const rowKey of Object.keys(gridData[group])) {
      let totalRow = 0;
      for (let i = 0; i < CONFIG_MONTHS.length; i++) {
        totalRow += gridData[group][rowKey][i];
      }
      gridData[group][rowKey][CONFIG_MONTHS.length] = totalRow;
    }
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {CONFIG_MONTHS.map((month) => (
              <TableCell key={month} align="right">
                {month}
              </TableCell>
            ))}
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.entries(gridData).map(([groupName, groupData]) => (
            <GridGroupSection
              key={groupName}
              groupName={groupName}
              groupData={groupData}
            ></GridGroupSection>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
