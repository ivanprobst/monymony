// Libs
import { types, Instance } from "mobx-state-tree";
import { v4 as uuidv4 } from "uuid";

// MODEL
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
export interface IMessageNoID extends Pick<IMessage, "text" | "type"> {}

// MODEL
export const MessageStore = types
  .model("MessageStore", {
    messages: types.map(Message),
  })
  .views((self) => ({
    get messagesList() {
      return Array.from(self.messages).map(([, message]) => message);
    },
  }))
  .actions((self) => ({
    addMessage(message: IMessageNoID) {
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
export interface IMessageStore extends Instance<typeof MessageStore> {}
