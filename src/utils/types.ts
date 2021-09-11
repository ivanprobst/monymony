import { createContext } from "react";
import { types, Instance } from "mobx-state-tree";
import { MONTHS, GROUP_STRUCTURE } from "./configurations";

// Model: Transactions
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

export const TransactionContext = createContext(TransactionStore.create());

export interface iTransactionError {
  index: string;
  description: string;
  message: string;
}

// Model: Configurations
export const GroupConfiguration = types.model("GroupConfiguration", {
  group: types.string,
  type: types.union(types.literal("costs"), types.literal("revenues")),
  categories: types.array(types.string),
  colorTheme: types.model({
    colorClass: types.string,
    colorCode: types.string,
  }),
});

export interface IGroupConfiguration
  extends Instance<typeof GroupConfiguration> {}

export const ConfigurationStore = types
  .model("ConfigurationStore", {
    groupsConfigurations: types.array(GroupConfiguration),
    monthsConfiguration: types.array(types.string),
  })
  .views((self) => ({
    get monthsList() {
      return self.monthsConfiguration;
    },
    get numberOfMonths() {
      return self.monthsConfiguration.length;
    },
    get groupsList() {
      return self.groupsConfigurations.map(
        (groupConfiguration) => groupConfiguration.group,
      );
    },
    get categoriesList() {
      return self.groupsConfigurations.flatMap(
        (groupConfiguration) => groupConfiguration.categories,
      );
    },
    categoriesFromGroup(group: string) {
      return self.groupsConfigurations.find(
        (groupConfiguration) => group === groupConfiguration.group,
      )?.categories; // ??? Fix the potential undefined return
    },
    groupFromCategory(category: string) {
      return self.groupsConfigurations.find((groupConfiguration) =>
        groupConfiguration.categories.includes(category),
      )?.group; // ??? Fix the potential undefined return
    },
    typeFromCategory(category: string) {
      return self.groupsConfigurations.find((groupConfiguration) =>
        groupConfiguration.categories.includes(category),
      )?.type; // ??? Fix the potential undefined return
    },
    colorThemeFromGroup(group: string) {
      return self.groupsConfigurations.find(
        (groupConfiguration) => group === groupConfiguration.group,
      )?.colorTheme; // ??? Fix the potential undefined return
    },
  }))
  .actions((self) => ({
    addGroupConfiguration(groupConfiguration: IGroupConfiguration) {
      self.groupsConfigurations.push(groupConfiguration);
    },
    setMonthsConfiguration(monthsConfiguration: Array<string>) {
      self.monthsConfiguration.clear();
      monthsConfiguration.forEach((month) =>
        self.monthsConfiguration.push(month),
      ); // ??? Loop seems overkill, check how to directly assign
    },
  }));

// Context creation
const configurationStore = ConfigurationStore.create();
configurationStore.setMonthsConfiguration(MONTHS);
GROUP_STRUCTURE.forEach((groupConfiguration) => {
  configurationStore.addGroupConfiguration(
    GroupConfiguration.create(groupConfiguration),
  );
});
export const ConfigurationContext = createContext(configurationStore);
