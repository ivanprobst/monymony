// Import: libs
import * as React from "react";
import { types, Instance, castToSnapshot } from "mobx-state-tree";

// Import: components and models
import { TransactionStore } from "./transaction";
import { MessageStore } from "./message";
import { ConfigurationStore } from "./configuration";

// Stores init
const transactionStore = TransactionStore.create();
const messageStore = MessageStore.create();
const configurationStore = ConfigurationStore.create();

// RootStore init
const RootStore = types.model("RootStore", {
  transactionStore: types.optional(TransactionStore, {}),
  messageStore: types.optional(MessageStore, {}),
  configurationStore: types.optional(ConfigurationStore, {}),
});
export interface IRootStore extends Instance<typeof RootStore> {}

const rootStore = RootStore.create({
  transactionStore: castToSnapshot(transactionStore),
  messageStore: castToSnapshot(messageStore),
  configurationStore: castToSnapshot(configurationStore),
});

export const RootContext = React.createContext(rootStore);
