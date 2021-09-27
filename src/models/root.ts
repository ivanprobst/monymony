// Import: libs
import * as React from "react";
import { types, Instance, castToSnapshot } from "mobx-state-tree";

// Import: models
import { TransactionStore } from "./transaction";
import { MessageStore } from "./message";
import { ConfigurationStore } from "./configuration";
import { UserAccount } from "./user";

// MODEL
const RootStore = types.model("RootStore", {
  transactionStore: TransactionStore,
  messageStore: MessageStore,
  configurationStore: ConfigurationStore,
  currentUserAccount: UserAccount,
});
export interface IRootStore extends Instance<typeof RootStore> {}

// Rootstore init
const rootStore = RootStore.create({
  transactionStore: castToSnapshot(TransactionStore.create()),
  messageStore: castToSnapshot(MessageStore.create()),
  configurationStore: castToSnapshot(ConfigurationStore.create()),
  currentUserAccount: castToSnapshot(UserAccount.create()),
});

// Context init
export const RootContext = React.createContext(rootStore);
