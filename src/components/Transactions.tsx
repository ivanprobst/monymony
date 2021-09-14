// Libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";

// Components
import MessageBox from "./MessageBox";

// Models
import {
  TransactionContext,
  ITransaction,
  ITransactionsOrdering,
} from "../models/transaction";
import { MessageContext } from "../models/message";

// Component
const TransactionRow = observer(function ({
  transaction: { id, date, description, type, category, amount, isSelected },
}: {
  transaction: {
    id: ITransaction["id"];
    date: ITransaction["date"];
    description: ITransaction["description"];
    type: ITransaction["type"];
    category: ITransaction["category"];
    amount: ITransaction["amount"];
    isSelected: ITransaction["isSelected"];
  };
}) {
  // Definitions
  const transactionsStore = React.useContext(TransactionContext);

  return (
    <tr className="h-8 even:bg-gray-100 hover:bg-mblue-light">
      <td>
        <label className="block pl-2">
          <input
            type="checkbox"
            name={id}
            className="text-mblue"
            onChange={() => {
              transactionsStore.toggleSelectedTransaction(id);
            }}
            checked={isSelected}
          />
          <span className="ml-1 text-xs">{id}</span>
        </label>
      </td>
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
});

// Component
function TransactionsTableHeader({
  orderParameter,
  children,
}: {
  orderParameter: ITransactionsOrdering["parameter"];
  children: string;
}) {
  // Definitions
  const transactionsStore = React.useContext(TransactionContext);

  return (
    <td
      className="p-2"
      onClick={() => {
        transactionsStore.setOrdering(orderParameter);
      }}
    >
      {children}{" "}
      {transactionsStore.ordering.parameter === orderParameter ? (
        transactionsStore.ordering.way === "up" ? (
          <ChevronUpIcon className="inline h-4 w-4 text-mred" />
        ) : (
          <ChevronDownIcon className="inline h-4 w-4 text-mred" />
        )
      ) : (
        ""
      )}
    </td>
  );
}

// Render
export default observer(function TransactionsList() {
  // Definitions
  const transactionsStore = React.useContext(TransactionContext);
  const messageStore = React.useContext(MessageContext);

  return (
    <section className="grid grid-cols-6">
      <div className="col-span-5 pl-2 pr-2">
        <table className="w-full">
          <thead className="border-b-2 font-bold text-base">
            <tr className="cursor-pointer">
              <td>
                <label className="block pl-2">
                  <input
                    type="checkbox"
                    name="select-all-transactions"
                    className="text-mblue"
                    onChange={transactionsStore.selectAllTransactions}
                  />
                </label>
              </td>
              <TransactionsTableHeader orderParameter={"date"}>
                Date
              </TransactionsTableHeader>
              <TransactionsTableHeader orderParameter={"description"}>
                Description
              </TransactionsTableHeader>
              <TransactionsTableHeader orderParameter={"category"}>
                Category
              </TransactionsTableHeader>
              <TransactionsTableHeader orderParameter={"amount"}>
                Amount
              </TransactionsTableHeader>
            </tr>
          </thead>
          <tbody>
            {transactionsStore.orderedTransactionsList.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
              ></TransactionRow>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 text-center border-l-2">
        <button
          className="w-4/5 p-2 text-mred border-2 border-mred"
          onClick={() => {
            messageStore.addMessage(
              transactionsStore.deleteSeletedTransactions(),
            );
          }}
        >
          Delete transaction(s)
        </button>
      </div>

      {messageStore.messages.size > 0 && <MessageBox></MessageBox>}
    </section>
  );
});
