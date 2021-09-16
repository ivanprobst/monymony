// Libs
import * as React from "react";
import { types, Instance } from "mobx-state-tree";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// Models
import { IMessage } from "./message";

// Model
export const Transaction = types
  .model("Transaction", {
    id: types.identifier,
    date: "", // DD.MM.YYYY >> YYYY-MM-DD
    description: "",
    category: "No category",
    group: "No group",
    type: types.optional(
      types.union(types.literal("costs"), types.literal("revenues")),
      "costs",
    ),
    amount: 0,
    isSelected: false,
  })
  .views((self) => ({
    get month() {
      return parseInt(self.date.split(".")[1]);
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
  }))
  .actions((self) => ({
    setTransactions(transactions: Array<[string, ITransaction]>) {
      self.transactions.clear();
      self.transactions.merge(transactions);
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
      const transaction = self.transactions.get(id);
      if (transaction !== undefined) {
        transaction.isSelected = !transaction.isSelected;
      }
    },
    selectAllTransactions() {
      self.transactions.forEach(
        (transaction) => (transaction.isSelected = true),
      );
    },
    deleteSeletedTransactions(): IMessage {
      let count = 0;
      self.transactions.forEach((transaction) => {
        if (transaction.isSelected) {
          count++;
          self.transactions.delete(transaction.id);
        }
      });
      return {
        id: uuidv4(),
        text: `${count} transaction(s) deleted.`,
        type: "confirmation",
      };
    },
    createTransactionInDB(
      transaction: {
        date: ITransaction["date"];
        description: ITransaction["description"];
        category: ITransaction["category"];
        amount: ITransaction["amount"];
      },
      creationConfirmation: (confirmation: {
        status: string;
        data: string;
      }) => void,
    ) {
      axios
        .get(
          `https://us-central1-mony-mony-314909.cloudfunctions.net/addTransaction?transaction=${JSON.stringify(
            transaction,
          )}`,
        ) // ??? move API url somewhere else
        .then((res) => {
          creationConfirmation({ status: "success", data: res.data.id }); // ??? move confirmations status to model
        })
        .catch((err) => {
          creationConfirmation({ status: "failed", data: "post failed" });
        });
    },
  }));

// Context
export const TransactionContext = React.createContext(
  TransactionStore.create(),
);
