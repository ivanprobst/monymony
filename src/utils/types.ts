import { createContext } from "react";
import {
  CONFIG_CATEGORY_TO_GROUP,
  CONFIG_GROUP_STRUCTURE,
  CONFIG_GROUP_TO_TYPE,
} from "./configurations";
import { types, Instance } from "mobx-state-tree";

// MobX types
export const Transaction = types
  .model("Transaction", {
    id: types.identifier,
    date: "", // DD.MM.YYYY
    description: "",
    category: "No category",
    amount: 0,
  })
  .views((self) => ({
    get month() {
      return parseInt(self.date.split(".")[1]);
    },
    get group() {
      return CONFIG_CATEGORY_TO_GROUP[self.category];
    },
    get costOrRevenue() {
      return CONFIG_GROUP_TO_TYPE[CONFIG_CATEGORY_TO_GROUP[self.category]]; // ??? Can we reuse the group view?
    },
  }));

export interface ITransaction extends Instance<typeof Transaction> {}

export const TransactionStore = types
  .model("TransactionStore", {
    transactions: types.optional(types.map(Transaction), {}),
  })
  .views((self) => ({
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
    addTransaction(id: string, newRawTransaction: ITransaction) {
      self.transactions.set(id, Transaction.create(newRawTransaction));
    },
  }));

export const TransactionContext = createContext(TransactionStore.create());

// TYPES
const tmpCatArray: Array<string> = CONFIG_GROUP_STRUCTURE.reduce(
  (acc: Array<string>, group) => {
    return acc.concat(...group.categories);
  },
  [],
);
export type Category = typeof tmpCatArray[number];

export interface iGroupConfig {
  name: string;
  type: "revenues" | "costs";
  categories: Array<Category>;
}

export interface iTransactionError {
  index: string;
  description: string;
  message: string;
}
