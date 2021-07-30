// Assets
import { iTransaction } from "../utils/types";
import {
  CONFIG_MONTHS,
  CONFIG_GROUP_STRUCTURE,
  CONFIG_CATEGORY_TO_GROUP,
} from "../utils/configurations";

// Types
interface iGridData {
  [groupName: string]: {
    [categoryName: string]: Array<number>;
  };
}

// COMP: GridCell
function GridCell({ value, type }: { value: number; type: string }) {
  return (
    <td
      className={`p-2 text-right ${value === 0 ? "text-gray-300" : ""} ${
        type === "Profit"
          ? value < 0
            ? "bg-mred-light"
            : "bg-mgreen-light"
          : ""
      }`}
    >
      {value.toLocaleString("en")}
    </td>
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
      <tr className="border-t-4">
        <td className="p-2 pt-4 font-bold text-base">{groupName}</td>
      </tr>
      {Object.entries(groupData).map(([categoryName, categoryData]) => (
        <tr
          key={categoryName}
          className={categoryName === "Total" ? "border-t" : ""}
        >
          <td
            className={`p-2 pl-4 ${
              categoryName === "Profit" || categoryName === "Total"
                ? "font-bold"
                : ""
            }`}
          >
            {categoryName}
          </td>
          {categoryData.map((amount, index) => (
            <GridCell key={index} value={amount} type={categoryName}></GridCell>
          ))}
        </tr>
      ))}
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
    <table className="w-full">
      <thead className="font-bold">
        <tr className="text-right">
          <td></td>
          {CONFIG_MONTHS.map((month) => (
            <td key={month} className="p-2 text-base">
              {month}
            </td>
          ))}
          <td className="p-2 text-base">Total</td>
        </tr>
      </thead>

      <tbody>
        {Object.entries(gridData).map(([groupName, groupData]) => (
          <GridGroupSection
            key={groupName}
            groupName={groupName}
            groupData={groupData}
          ></GridGroupSection>
        ))}
      </tbody>
    </table>
  );
}
