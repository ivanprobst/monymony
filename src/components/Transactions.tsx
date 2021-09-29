// Import: libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import Dayjs from "dayjs";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/solid";

// Import: models
import { RootContext } from "../models/root";
import { ITransaction, ITransactionsOrdering } from "../models/transaction";

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
  // Context
  const transactionsStore = React.useContext(RootContext).transactionStore;

  // Handler
  const handleTransactionSelection = function (
    event: React.MouseEvent<HTMLTableRowElement>,
  ) {
    transactionsStore.toggleSelectedTransaction(event.currentTarget.id);
  };

  // Render
  return (
    <tr
      id={id}
      className="h-8 even:bg-gray-100 hover:bg-mblue-light"
      onClick={handleTransactionSelection}
    >
      <td className="group relative">
        <label className="block pl-2">
          <input
            type="checkbox"
            name={id}
            className="text-mblue"
            readOnly={true}
            checked={transactionsStore.isTransactionSelected(id)}
          />
        </label>

        <span className="invisible absolute top-0 left-7 z-10 p-1 bg-white text-gray-700 border-2 border-gray-100 rounded group-hover:visible">
          {id}
        </span>
      </td>

      <td className="p-2">{Dayjs(date).format("MMM D, YYYY")}</td>
      <td className="p-2">{description}</td>
      <td className="p-2">{category}</td>
      <td className="p-2">
        {type === "costs" ? (
          <ChevronDoubleDownIcon className="inline h-4 w-4 text-mred" />
        ) : type === "revenues" ? (
          <ChevronDoubleUpIcon className="inline h-4 w-4 text-green-500" />
        ) : (
          <></>
        )}
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
  // Context
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
        <DotsHorizontalIcon className="inline h-4 w-4 text-white" />
      )}
    </td>
  );
}

// COMPONENT
export const TransactionDeletionButton = observer(function () {
  // Context
  const transactionsStore = React.useContext(RootContext).transactionStore;

  // Handler
  const handleDeleteSelected = function () {
    transactionsStore.selectedTransactions.forEach((id) =>
      transactionsStore.deleteTransactionInDB(id),
    );
  };

  return (
    <button
      disabled={transactionsStore.selectedTransactions.size === 0}
      className="w-full p-2 text-mred border-2 border-mred disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleDeleteSelected}
    >
      Delete selected transactions
    </button>
  );
});

// COMPONENT
export const TransactionCreationForm = function () {
  // Context
  const transactionsStore = React.useContext(RootContext).transactionStore;

  // State
  const [formData, setFormData] = React.useState({
    date: "2021-01-01",
    description: "",
    category: "",
    amount: "",
  });

  // Handler
  const handleInputUpdate = function (
    event: React.FormEvent<HTMLInputElement>,
  ) {
    setFormData({
      ...formData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  // Handler
  const handleSubmit = function (event: React.FormEvent) {
    event.preventDefault();
    transactionsStore.createNewTransactionInDB({
      date: formData.date,
      description: formData.description,
      category: formData.category,
      amount: parseInt(formData.amount),
    });
  };

  // Render
  return (
    <form className="inline-block w-full">
      <input
        className="w-full mb-4 shadow leading-tight"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleInputUpdate}
        required
      />
      <input
        className="w-full mb-4 shadow leading-tight"
        name="description"
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputUpdate}
        required
      />
      <input
        className="w-full mb-4 shadow leading-tight"
        name="category"
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={handleInputUpdate}
        required
      />
      <input
        className="w-full mb-4 shadow leading-tight"
        name="amount"
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleInputUpdate}
        required
      />
      <button
        onClick={handleSubmit}
        disabled={
          formData.date === "" ||
          formData.description === "" ||
          formData.category === "" ||
          formData.amount === ""
        }
        className="w-full p-2 text-mred border-2 border-mred disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create transaction
      </button>
    </form>
  );
};

// MAIN
export default observer(function TransactionsList() {
  // Context
  const transactionsStore = React.useContext(RootContext).transactionStore;

  // State
  const [selectAll, setSelectAll] = React.useState(false);

  // Handler
  const handleSelectAll = function () {
    if (!selectAll) {
      transactionsStore.selectAllTransactions();
    } else {
      transactionsStore.unselectAllTransactions();
    }
    setSelectAll(!selectAll);
  };

  // Render
  return (
    <table className="w-full table-auto">
      <thead className="border-b-2 font-bold">
        <tr className="cursor-pointer">
          <td>
            <label className="block pl-2">
              <input
                type="checkbox"
                name="select-all-transactions"
                className="text-mblue"
                checked={selectAll}
                onChange={handleSelectAll}
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
  );
});
