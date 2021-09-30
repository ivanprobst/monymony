// Import: libs
import { types, Instance, getRoot } from "mobx-state-tree";

// Import: components and models
import { IRootStore } from "./root";

// MODEL
export const UserAccount = types
  .model("UserAccount", {
    email: types.optional(types.union(types.string, types.null), null),
    uid: types.optional(types.union(types.string, types.null), null),
  })
  .actions((self) => ({
    logUserIn({ email, uid }: { email: string | null; uid: string }) {
      self.email = email;
      self.uid = uid;
      getRoot<IRootStore>(self).transactionStore.loadAllTransactionsFromDB();
    },
    logUserOut() {
      self.email = null;
      self.uid = null;
      getRoot<IRootStore>(self).transactionStore.clearAllTransactions();
      // TODO: clear all other content (messages, loading, etc.)
    },
  }));
export interface IUserAccount extends Instance<typeof UserAccount> {}
