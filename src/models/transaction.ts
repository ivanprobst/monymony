// Import: libs
import * as React from "react";
import { types, Instance } from "mobx-state-tree";
import axios from "axios";
import { flow } from "mobx";

// Import: components and models
import { IMessage } from "./message";

// Model
export const Transaction = types
  .model("Transaction", {
    id: types.identifier,
    date: "", // DD.MM.YYYY >> YYYY-MM-DD
    description: "",
    category: "No category",
    amount: 0,
    // group: "No group",
    // type: types.optional(
    //   types.union(types.literal("costs"), types.literal("revenues")),
    //   "costs",
    // ),
  })
  .views((self) => ({
    get month() {
      return parseInt(self.date.split(".")[1]);
    },
    get group() {
      return ""; // ??? add as views instead of DB props
    },
    get type() {
      return "";
    },
    get isSelected() {
      return false;
    },
  }));

export interface ITransaction extends Instance<typeof Transaction> {}

// Model
const TransactionsOrdering = types.model("ordering", {
  parameter: types.union(
    types.literal("date"),
    types.literal("description"),
    types.literal("category"),
    types.literal("amount"),
  ),
  way: types.union(types.literal("up"), types.literal("down")),
});

export interface ITransactionsOrdering
  extends Instance<typeof TransactionsOrdering> {}

// Model
const TransactionStore = types
  .model("TransactionStore", {
    transactions: types.map(Transaction),
    ordering: types.optional(TransactionsOrdering, {
      parameter: "date",
      way: "up",
    }),
    selectedTransactions: types.map(types.string),
  })
  .views((self) => ({
    get transactionsList() {
      return Array.from(self.transactions).map(
        ([, transaction]) => transaction,
      );
    },
    get numberOfTransactions() {
      return self.transactions.size;
    },
    get orderedTransactionsList() {
      return Array.from(self.transactions) // ??? improve date ordering (move date to Date format)
        .map(([, transaction]) => transaction)
        .sort((a, b) => {
          if (self.ordering.way === "up") {
            return a[self.ordering.parameter] < b[self.ordering.parameter]
              ? -1
              : 1;
          } else {
            return a[self.ordering.parameter] > b[self.ordering.parameter]
              ? -1
              : 1;
          }
        });
    },
    totalFromCategoryOrGroup(
      filterType: "category" | "group",
      filterValue: string,
      filterMonth?: number,
    ) {
      return Array.from(self.transactions)
        .filter(([, { category, group, month }]) => {
          return (
            (filterType === "category" ? category : group) === filterValue &&
            (filterMonth ? month === filterMonth : true)
          );
        })
        .reduce((acc, [, { amount }]) => acc + amount, 0);
    },
    isTransactionSelected(id: ITransaction["id"]) {
      return self.selectedTransactions.has(id);
    },
  }))
  .actions((self) => ({
    setTransactions(transactions: Array<ITransaction>) {
      const mappedTransactions = transactions.map((transaction) => [
        transaction.id,
        transaction,
      ]);
      self.transactions.clear();
      self.transactions.merge(mappedTransactions);
    },
    addTransaction(id: string, transaction: ITransaction) {
      self.transactions.set(id, Transaction.create(transaction));
    },
    setOrdering(transactionOrder: ITransactionsOrdering["parameter"]) {
      if (transactionOrder === self.ordering.parameter) {
        self.ordering.way = self.ordering.way === "up" ? "down" : "up";
      } else {
        self.ordering.parameter = transactionOrder;
      }
    },
    toggleSelectedTransaction(id: ITransaction["id"]) {
      if (self.selectedTransactions.has(id)) {
        self.selectedTransactions.delete(id);
      } else {
        self.selectedTransactions.set(id, id);
      }
    },
    selectAllTransactions() {
      self.transactions.forEach((transaction) =>
        self.selectedTransactions.set(transaction.id, transaction.id),
      );
    },
  }))
  .actions((self) => ({
    createTransactionInDB: flow(function* createTransactionInDB(transaction: {
      date: ITransaction["date"];
      description: ITransaction["description"];
      category: ITransaction["category"];
      amount: ITransaction["amount"];
    }) {
      const res = yield axios.get(
        `https://europe-west1-mony-mony-314909.cloudfunctions.net/addTransaction?transaction=${JSON.stringify(
          transaction,
        )}`,
      );

      self.setTransactions(res.data.data);
      self.setTransactions(res.data.data);
      return {
        type: "confirmation",
        text: `New transaction created.`,
      } as Pick<IMessage, "type" | "text">;
    }),
    loadTransactionsFromDB: flow(function* loadTransactionsFromDB() {
      const res = yield axios.get(
        "https://europe-west1-mony-mony-314909.cloudfunctions.net/getTransactions",
      );

      self.setTransactions(res.data.data);
    }),
    deleteSelectedTransactionsInDB: flow(
      function* deleteSelectedTransactionsInDB() {
        const ids = Array.from(self.selectedTransactions).map(([id]) => id);

        const res = yield axios.get(
          `https://europe-west1-mony-mony-314909.cloudfunctions.net/deleteTransactions?ids=${JSON.stringify(
            ids,
          )}`,
        );

        self.setTransactions(res.data.data);
        return {
          type: "confirmation",
          text: `Transaction(s) deleted.`,
        } as Pick<IMessage, "type" | "text">;
      },
    ),
  }));

// Context
export const TransactionContext = React.createContext(
  TransactionStore.create(),
);
