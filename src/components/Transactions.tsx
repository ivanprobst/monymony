// Import: libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";

// Import: components and models
import { RootContext } from "../models/root";
import { ITransaction, ITransactionsOrdering } from "../models/transaction";
import MessageBox from "./MessageBox";

// COMPONENT
const TransactionRow = observer(function ({
  transaction: { id, date, description, category, group, type, amount },
}: {
  transaction: {
    id: ITransaction["id"];
    date: ITransaction["date"];
    description: ITransaction["description"];
    category: ITransaction["category"];
    group: ITransaction["group"];
    type: ITransaction["type"];
    amount: ITransaction["amount"];
  };
}) {
  // State and context
  const transactionsStore = React.useContext(RootContext).transactionStore;

  // Helper
  const toggleSelection = function (
    event: React.MouseEvent<HTMLTableRowElement>,
  ) {
    transactionsStore.toggleSelectedTransaction(event.currentTarget.id);
  };

  // Render
  return (
    <tr
      id={id}
      className="h-8 even:bg-gray-100 hover:bg-mblue-light"
      onClick={toggleSelection}
    >
      <td className="group relative">
        <label className="block pl-2">
          <input
            type="checkbox"
            name={id}
            className="text-mblue"
            onChange={() => {}}
            checked={transactionsStore.isTransactionSelected(id)}
          />
        </label>
        <span className="invisible absolute top-0 left-7 z-10 p-1 bg-white text-gray-700 border-2 border-gray-100 rounded group-hover:visible">
          {id}
        </span>
      </td>
      <td className="p-2">{date}</td>
      <td className="p-2">{description}</td>
      <td className="p-2">{category}</td>
      <td className="p-2">
        {type &&
          (type === "costs" ? (
            <ChevronDoubleDownIcon className="inline h-4 w-4 text-mred" />
          ) : (
            <ChevronDoubleUpIcon className="inline h-4 w-4 text-green-500" />
          ))}
        &nbsp;{group}
      </td>
      <td className="p-2">{amount.toLocaleString("en")}</td>
    </tr>
  );
});

// COMPONENT
function TransactionsTableHeader({
  orderParameter,
  children,
}: {
  orderParameter: ITransactionsOrdering["parameter"];
  children: string;
}) {
  // State and context
  const transactionsStore = React.useContext(RootContext).transactionStore;

  // Render
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

// COMPONENT
function CreateTransactionForm() {
  // State and context
  const transactionsStore = React.useContext(RootContext).transactionStore;
  const [formData, setFormData] = React.useState({
    date: "2021-01-01",
    description: "",
    category: "",
    amount: "",
  });

  // Helper
  const handleChange = function (event: React.FormEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  // Helper
  const processForm = function (event: React.FormEvent) {
    event.preventDefault();
    // ??? Add data sanity checks here
    transactionsStore.createTransactionInDB({
      date: formData.date,
      description: formData.description,
      category: formData.category,
      amount: parseInt(formData.amount) ?? 0,
    });
  };

  // Render
  return (
    <form className="p-2" onSubmit={processForm}>
      <input
        className="mb-4 shadow text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        className="mb-4 shadow text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        name="description"
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        className="mb-4 shadow text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        name="category"
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
      />
      <input
        className="mb-4 shadow text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        name="amount"
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <button
        disabled={transactionsStore.isLoading}
        className="p-2 text-mred border-2 border-mred disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create transaction
      </button>
    </form>
  );
}

// MAIN
export default observer(function TransactionsList() {
  // State and context
  const transactionsStore = React.useContext(RootContext).transactionStore;
  const messageStore = React.useContext(RootContext).messageStore;
  const configurationStore = React.useContext(RootContext).configurationStore;

  // Render
  return (
    <section className="grid grid-cols-6">
      <div className="col-span-5 pl-2 pr-2">
        <table className="w-full table-auto">
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
              <TransactionsTableHeader orderParameter={"group"}>
                Group
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
          disabled={transactionsStore.isLoading}
          className="w-4/5 p-2 text-mred border-2 border-mred disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={transactionsStore.deleteSelectedTransactionsInDB}
        >
          Delete transaction(s)
        </button>
        <hr className="m-2" />
        <h2 className="text-lg">Create a transaction</h2>
        <CreateTransactionForm />
      </div>

      {messageStore.messages.size > 0 && <MessageBox></MessageBox>}
    </section>
  );
});
