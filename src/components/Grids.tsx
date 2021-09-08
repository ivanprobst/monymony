// Libs
import { useContext } from "react";

// Assets
import { TransactionContext } from "../utils/types";
import {
  CONFIG_MONTHS,
  CONFIG_GROUP_TO_CATEGORY_LIST,
  CONFIG_GROUP_LIST,
} from "../utils/configurations";

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
function GridDataRow({
  category,
  group,
}: {
  category?: string;
  group?: string;
}) {
  const allTransactions = useContext(TransactionContext);

  return (
    <tr>
      <td className={`p-2 pl-4 ${category ? "" : "font-bold"}`}>
        {category ? category : "Total"}
      </td>
      {CONFIG_MONTHS.map((month, index) => (
        <GridDataCell
          key={(category ? category : group ? group : "") + index}
          value={allTransactions.totalFromCategoryOrGroup(
            category ? "category" : "group",
            category ? category : group ? group : "",
            index + 1,
          )}
        ></GridDataCell>
      ))}
      <GridDataCell
        value={allTransactions.totalFromCategoryOrGroup(
          category ? "category" : "group",
          category ? category : group ? group : "",
        )}
        isTotal={true}
      ></GridDataCell>
    </tr>
  );
}

// Component
function GridGroupSection({ group }: { group: string }) {
  return (
    <>
      <tr className="border-t-4">
        <td className="p-2 pt-4 font-bold text-base">{group}</td>
      </tr>
      {CONFIG_GROUP_TO_CATEGORY_LIST[group].map((category) => (
        <GridDataRow key={category} category={category}></GridDataRow>
      ))}
      <GridDataRow group={group}></GridDataRow>
    </>
  );
}

// RENDER
export default function GridFull() {
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
          <td className="p-2 border-l text-base">Total</td>
        </tr>
      </thead>

      <tbody>
        {CONFIG_GROUP_LIST.map((group) => (
          <GridGroupSection key={group} group={group}></GridGroupSection>
        ))}
      </tbody>
    </table>
  );
}
