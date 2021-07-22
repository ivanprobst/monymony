// Libs
import { iTransaction } from "../utils/types";
import {
  CONFIG_CATEGORY_TO_GROUP,
  CONFIG_GROUP_TO_TYPE,
} from "../utils/configurations";

// Component
function Transaction({ transaction }: { transaction: iTransaction }) {
  return (
    <tr className="h-8 even:bg-gray-100 hover:bg-mblue-light">
      <td className="p-2">{transaction.index}</td>
      <td className="p-2">{transaction.date}</td>
      <td className="p-2">{transaction.description}</td>
      <td className="p-2">
        {transaction.category}
        {CONFIG_GROUP_TO_TYPE[
          CONFIG_CATEGORY_TO_GROUP[transaction.category]
        ] === "costs"
          ? " (costs)"
          : " (revenues)"}
      </td>
      <td className="p-2">{transaction.amount.toLocaleString("en")}</td>
    </tr>
  );
}

// Render
export default function TransactionsList({
  cleanTransactions,
}: {
  cleanTransactions: iTransaction[];
}) {
  return (
    <table className="w-full">
      <thead className="border-b-2 font-bold">
        <tr>
          <td className="p-2">Index</td>
          <td className="p-2">Date</td>
          <td className="p-2">Description</td>
          <td className="p-2">Category</td>
          <td className="p-2">Amount</td>
        </tr>
      </thead>
      <tbody>
        {cleanTransactions.map((transaction) => (
          <Transaction
            key={transaction.index}
            transaction={transaction}
          ></Transaction>
        ))}
      </tbody>
    </table>
  );
}
