// Libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/solid";

// Models
import { TransactionContext, ITransactionError } from "../models/transaction";

// Component
function TransactionRow({
  transaction: { date, description, type, category, amount },
}: {
  transaction: {
    date: string;
    description: string;
    type: string;
    category: string;
    amount: number;
  };
}) {
  return (
    <tr className="h-8 even:bg-gray-100 hover:bg-mblue-light">
      <td className="p-2">{date}</td>
      <td className="p-2">{description}</td>
      <td className="p-2">
        {type === "costs" ? (
          <ChevronDoubleDownIcon className="inline h-4 w-4 text-mred" />
        ) : (
          <ChevronDoubleUpIcon className="inline h-4 w-4 text-green-500" />
        )}
        &nbsp;{category}
      </td>
      <td className="p-2">{amount.toLocaleString("en")}</td>
    </tr>
  );
}

// Render
export default observer(function TransactionsList({
  transactionErrorList,
}: {
  transactionErrorList: Array<ITransactionError>;
}) {
  // Definitions
  const transactionsStore = React.useContext(TransactionContext);

  return (
    <section className="grid grid-cols-5">
      <div className="col-span-4 pl-2 pr-2">
        <table className="w-full">
          <thead className="border-b-2 font-bold text-base">
            <tr>
              <td className="p-2">Date</td>
              <td className="p-2">Description</td>
              <td className="p-2">Category</td>
              <td className="p-2">Amount</td>
            </tr>
          </thead>
          <tbody>
            {Array.from(transactionsStore.transactions, ([id, transaction]) => (
              <TransactionRow
                key={id}
                transaction={transaction}
              ></TransactionRow>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pl-2 pt-2 border-l-2">
        <h3 className="text-mblue text-base">Transactions errors:</h3>
        <ul>
          {transactionErrorList.length === 0 ? (
            <li className="p-1 text-green-500">No error</li>
          ) : (
            transactionErrorList.map((errorItem) => (
              <li
                key={`${errorItem.index}_${errorItem.message}`}
                className="p-1 text-mred"
              >
                {errorItem.index} - {errorItem.description}: {errorItem.message}
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
});
