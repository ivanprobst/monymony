// Libs
import * as React from "react";
import { types, Instance } from "mobx-state-tree";

// Model
const Message = types.model("Message", {
  id: types.identifier,
  text: "",
  type: types.optional(
    types.union(
      types.literal("error"),
      types.literal("confirmation"),
      types.literal("information"),
    ),
    "information",
  ),
});

export interface IMessage extends Instance<typeof Message> {}

// Model
export const MessagesStore = types
  .model("MessagesStore", {
    messages: types.map(Message),
  })
  .views((self) => ({
    get messagesList() {
      return Array.from(self.messages).map(([, message]) => message);
    },
  }))
  .actions((self) => ({
    addMessage(message: IMessage) {
      self.messages.set(message.id, message);
    },
    deleteMessage(id: IMessage["id"]) {
      self.messages.delete(id);
    },
  }));

// Context
export const MessageContext = React.createContext(MessagesStore.create());
