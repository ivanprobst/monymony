// Libs
import * as React from "react";
import { types, Instance } from "mobx-state-tree";

// Models
export const Transaction = types
  .model("Transaction", {
    id: types.identifier,
    date: "", // DD.MM.YYYY
    description: "",
    category: "No category",
    group: "No group",
    type: types.optional(
      types.union(types.literal("costs"), types.literal("revenues")),
      "costs",
    ),
    amount: 0,
  })
  .views((self) => ({
    get month() {
      return parseInt(self.date.split(".")[1]);
    },
  }));

export interface ITransaction extends Instance<typeof Transaction> {}

export const TransactionStore = types
  .model("TransactionStore", {
    transactions: types.map(Transaction),
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
  }));

export interface ITransactionError {
  index: string;
  description: string;
  message: string;
}

// Context
export const TransactionContext = React.createContext(
  TransactionStore.create(),
);
