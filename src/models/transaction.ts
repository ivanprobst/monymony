// Import: libs
import { types, Instance, getRoot } from "mobx-state-tree";

// Import: components and models
import { IRootStore } from "./root";
import { IMessageNoID } from "./message";
import { IConfigurationStore } from "./configuration";

// MODEL
const Transaction = types
  .model("Transaction", {
    id: types.identifier,
    date: "", // DD.MM.YYYY >> YYYY-MM-DD
    description: "",
    category: "No category",
    amount: 0,
  })
  .views((self) => ({
    get month() {
      return parseInt(self.date.split("-")[1]);
    },
    get group(): string | undefined {
      const config: IConfigurationStore =
        getRoot<IRootStore>(self).configurationStore;
      return config.groupFromCategory(self.category);
    },
    get type(): string | undefined {
      const config: IConfigurationStore =
        getRoot<IRootStore>(self).configurationStore;
      return config.typeFromCategory(self.category);
    },
  }));
export interface ITransaction extends Instance<typeof Transaction> {}

// MODEL
const TransactionsOrdering = types.model("TransactionsOrdering", {
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

// MODEL
export const TransactionStore = types
  .model("TransactionStore", {
    transactions: types.map(Transaction),
    ordering: types.optional(TransactionsOrdering, {
      parameter: "date",
      way: "up",
    }),
    selectedTransactions: types.map(types.string),
    isLoading: false,
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
      return Array.from(self.transactions)
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
    deleteTransaction(id: string) {
      self.transactions.delete(id);
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
    toggleLoading() {
      self.isLoading = !self.isLoading;
    },
    loadTransactionsFromDB() {
      getRoot<IRootStore>(self).configurationStore.callAPI(
        { method: "get", collection: "transactions" },
        (data) => {
          getRoot<IRootStore>(self).transactionStore.setTransactions(
            data.transactions,
          );
        },
      );
    },
    createTransactionInDB(transaction: {
      date: ITransaction["date"];
      description: ITransaction["description"];
      category: ITransaction["category"];
      amount: ITransaction["amount"];
    }) {
      getRoot<IRootStore>(self).configurationStore.callAPI(
        { method: "post", collection: "transactions", body: transaction },
        (data) => {
          getRoot<IRootStore>(self).transactionStore.addTransaction(
            data.transaction.id,
            data.transaction,
          );

          getRoot<IRootStore>(self).messageStore.addMessage({
            type: "confirmation",
            text: `New transaction created.`,
          } as IMessageNoID);
        },
      );
    },
    deleteSelectedTransactionsInDB() {
      const ids = Array.from(self.selectedTransactions).map(([id]) => id);

      getRoot<IRootStore>(self).configurationStore.callAPI(
        { method: "delete", collection: "transactions", body: ids },
        () => {
          ids.forEach((id) =>
            getRoot<IRootStore>(self).transactionStore.deleteTransaction(id),
          );

          getRoot<IRootStore>(self).messageStore.addMessage({
            type: "confirmation",
            text: `Transaction(s) deleted.`,
          } as IMessageNoID);
        },
      );
    },
  }));
export interface ITransactionsStore extends Instance<typeof TransactionStore> {}
