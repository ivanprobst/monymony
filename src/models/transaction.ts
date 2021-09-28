// Import: libs
import { types, Instance, getRoot } from "mobx-state-tree";
import {
  collection,
  getDocs,
  getFirestore,
  QuerySnapshot,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Import: components and models
import { IRootStore } from "./root";
import { flow } from "mobx";

// MODEL
const Transaction = types
  .model("Transaction", {
    id: types.identifier,
    date: "2021-01-01",
    description: "",
    category: "No category",
    amount: 0,
  })
  .views((self) => ({
    get month() {
      return parseInt(self.date.split("-")[1]);
    },
    get group(): string {
      const groupConfigurations =
        getRoot<IRootStore>(self).configurationStore.groupConfigurations;

      const group = groupConfigurations.find((groupConfiguration) =>
        groupConfiguration.categories.includes(self.category),
      );
      return group ? group.group : "No group";
    },
    get type(): string {
      const groupConfigurations =
        getRoot<IRootStore>(self).configurationStore.groupConfigurations;

      const group = groupConfigurations.find((groupConfiguration) =>
        groupConfiguration.categories.includes(self.category),
      );
      return group ? group.type : "No type";
    },
  }));
export interface ITransaction extends Instance<typeof Transaction> {}

// MODEL
const TransactionsOrdering = types.model("TransactionsOrdering", {
  parameter: types.union(
    types.literal("date"),
    types.literal("description"),
    types.literal("category"),
    types.literal("group"),
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
    addTransaction(transaction: ITransaction) {
      self.transactions.set(transaction.id, transaction);
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
    unselectAllTransactions() {
      self.selectedTransactions.clear();
    },
    toggleLoading() {
      self.isLoading = !self.isLoading;
    },
    loadTransactionsFromDB: flow(function* loadTransactionsFromDB() {
      try {
        const db = getFirestore();

        const transactionsSnapshot: QuerySnapshot<ITransaction> = yield getDocs(
          collection(db, "transactions"),
        );

        const data = transactionsSnapshot.docs.map((transactionSnapshot) => ({
          ...transactionSnapshot.data(),
          id: transactionSnapshot.id,
        }));

        getRoot<IRootStore>(self).transactionStore.setTransactions(data);
      } catch (error) {
        // ??? Error handling: failed to load
        console.error("Error: ", error);
      }
    }),
    createTransactionInDB: flow(function* createTransactionInDB(transaction: {
      date: ITransaction["date"];
      description: ITransaction["description"];
      category: ITransaction["category"];
      amount: ITransaction["amount"];
    }) {
      const db = getFirestore();

      try {
        const newtransaction = Transaction.create({
          ...transaction,
          id: uuidv4(),
        });
        yield setDoc(doc(db, "transactions", newtransaction.id), transaction);

        getRoot<IRootStore>(self).transactionStore.addTransaction(
          newtransaction,
        );
      } catch (error) {
        // ??? Error handling: failed to create
        console.error("Error: ", error);
      }
    }),
    deleteTransactionInDB: flow(function* deleteSelectedTransactionsInDB(
      id: string,
    ) {
      const db = getFirestore();

      try {
        yield deleteDoc(doc(db, "transactions", id));
        getRoot<IRootStore>(self).transactionStore.deleteTransaction(id);
      } catch (error) {
        // ??? Error handling: no doc found
        console.error("Error: ", error);
      }
    }),
  }));
export interface ITransactionsStore extends Instance<typeof TransactionStore> {}
