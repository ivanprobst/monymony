// Libs
import * as React from "react";
import { types, Instance } from "mobx-state-tree";
import { v4 as uuidv4 } from "uuid";

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
    addMessage(message: Pick<IMessage, "type" | "text">) {
      const id = uuidv4();
      self.messages.set(id, { ...message, id });
    },
    deleteMessage(id: IMessage["id"]) {
      self.messages.delete(id);
    },
    deleteAllMessages() {
      self.messages.clear();
    },
  }));

// Context
export const MessageContext = React.createContext(MessagesStore.create());
