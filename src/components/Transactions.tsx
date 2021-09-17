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
import MessageBox from "./MessageBox";
import {
  TransactionContext,
  ITransaction,
  ITransactionsOrdering,
} from "../models/transaction";
import { MessageContext } from "../models/message";

// COMPONENT
const TransactionRow = observer(function ({
  transaction: { id, date, description, type, category, amount },
}: {
  transaction: {
    id: ITransaction["id"];
    date: ITransaction["date"];
    description: ITransaction["description"];
    type: ITransaction["type"];
    category: ITransaction["category"];
    amount: ITransaction["amount"];
  };
}) {
  // State and context
  const transactionsStore = React.useContext(TransactionContext);

  // Helper
  const toggleSelection = function (event: React.FormEvent<HTMLInputElement>) {
    transactionsStore.toggleSelectedTransaction(event.currentTarget.name);
  };

  // Render
  return (
    <tr className="h-8 even:bg-gray-100 hover:bg-mblue-light">
      <td>
        <label className="block pl-2">
          <input
            type="checkbox"
            name={id}
            className="text-mblue"
            onChange={toggleSelection}
            checked={transactionsStore.isTransactionSelected(id)}
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

// COMPONENT
function TransactionsTableHeader({
  orderParameter,
  children,
}: {
  orderParameter: ITransactionsOrdering["parameter"];
  children: string;
}) {
  // State and context
  const transactionsStore = React.useContext(TransactionContext);

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
  const transactionsStore = React.useContext(TransactionContext);
  const messageStore = React.useContext(MessageContext);
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
  const creationConfirmation = function (confirmation: {
    status: string;
    data: string;
  }) {
    if (confirmation.status === "success") {
      messageStore.addMessage({
        text: `New transaction created: ${confirmation.data}`,
        type: "confirmation",
      });
    } else {
      messageStore.addMessage({
        text: `Error: ${confirmation.data}`,
        type: "error",
      });
    }
  };

  // Helper
  const processForm = async function (event: React.FormEvent) {
    event.preventDefault();
    // ??? Add data sanity checks here
    const confirmation = await transactionsStore.createTransactionInDB({
      date: formData.date,
      description: formData.description,
      category: formData.category,
      amount: parseInt(formData.amount) ?? 0,
    });

    creationConfirmation(confirmation);

    transactionsStore.loadTransactionsFromDB(); // ??? rough reload, check if the best
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
      <button className="p-2 text-mred border-2 border-mred">
        Create transaction
      </button>
    </form>
  );
}

// MAIN
export default observer(function TransactionsList() {
  // State and context
  const transactionsStore = React.useContext(TransactionContext);
  const messageStore = React.useContext(MessageContext);

  // Render
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
