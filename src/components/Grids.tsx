// Libs
import * as React from "react";
import { observer } from "mobx-react-lite";

// Models
import { RootContext } from "../models/root";
import { ITransaction } from "../models/transaction";

// Component
function GridDataCell({
  value,
  isTotal,
}: {
  value: number;
  isTotal?: boolean;
}) {
  return (
    <td
      className={`p-2 text-right ${value === 0 ? "text-gray-300" : ""} ${
        isTotal ? "border-l" : ""
      }`}
    >
      {value.toLocaleString("en")}
    </td>
  );
}

// Component
const GridDataRow = observer(function GridDataRow({
  category,
  group,
}: {
  category?: ITransaction["category"];
  group?: ITransaction["group"];
}) {
  const transactionsStore = React.useContext(RootContext).transactionStore;
  const configurationStore = React.useContext(RootContext).configurationStore;

  return (
    <tr>
      <td className={`p-2 pl-4 ${category ? "" : "font-bold"}`}>
        {category ? category : "Total"}
      </td>
      {configurationStore.monthsList.map((month, index) => (
        <GridDataCell
          key={(category ? category : group ? group : "") + index}
          value={transactionsStore.totalFromCategoryOrGroup(
            category ? "category" : "group",
            category ? category : group ? group : "",
            index + 1,
          )}
        ></GridDataCell>
      ))}
      <GridDataCell
        value={transactionsStore.totalFromCategoryOrGroup(
          category ? "category" : "group",
          category ? category : group ? group : "",
        )}
        isTotal={true}
      ></GridDataCell>
    </tr>
  );
});

// Component
function GridGroupSection({ group }: { group: string }) {
  const configurationStore = React.useContext(RootContext).configurationStore;

  return (
    <>
      <tr className="border-t-4">
        <td className="p-2 pt-4 font-bold text-base">{group}</td>
      </tr>
      {configurationStore.categoriesFromGroup(group)?.map((category) => (
        <GridDataRow key={category} category={category}></GridDataRow>
      ))}
      <GridDataRow group={group}></GridDataRow>
    </>
  );
}

// RENDER
export default function GridFull() {
  const configurationStore = React.useContext(RootContext).configurationStore;

  return (
    <table className="w-full">
      <thead className="font-bold">
        <tr className="text-right">
          <td></td>
          {configurationStore.monthsList.map((month) => (
            <td key={month} className="p-2 text-base">
              {month}
            </td>
          ))}
          <td className="p-2 border-l text-base">Total</td>
        </tr>
      </thead>

      <tbody>
        {configurationStore.groupsList.map((group) => (
          <GridGroupSection key={group} group={group}></GridGroupSection>
        ))}
      </tbody>
    </table>
  );
}
