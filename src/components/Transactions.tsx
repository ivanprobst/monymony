// Libs
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/solid";

// Assets
import { iTransaction, iTransactionError } from "../utils/types";
import { CONFIG_GROUP_TO_TYPE } from "../utils/configurations";

// Component
function Transaction({ transaction }: { transaction: iTransaction }) {
  return (
    <tr className="h-8 even:bg-gray-100 hover:bg-mblue-light">
      <td className="p-2">{transaction.index}</td>
      <td className="p-2">{transaction.date}</td>
      <td className="p-2">{transaction.description}</td>
      <td className="p-2">
        {CONFIG_GROUP_TO_TYPE[transaction.groupName] === "costs" ? (
          <ChevronDoubleDownIcon className="inline h-4 w-4 text-mred" />
        ) : (
          <ChevronDoubleUpIcon className="inline h-4 w-4 text-green-500" />
        )}
        &nbsp;{transaction.category}
      </td>
      <td className="p-2">{transaction.amount.toLocaleString("en")}</td>
    </tr>
  );
}

// Render
export default function TransactionsList({
  cleanTransactions,
  transactionErrorList,
}: {
  cleanTransactions: iTransaction[];
  transactionErrorList: Array<iTransactionError>;
}) {
  return (
    <section className="grid grid-cols-5">
      <div className="col-span-4 pl-2 pr-2">
        <table className="w-full">
          <thead className="border-b-2 font-bold text-base">
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
}
