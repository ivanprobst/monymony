// Import: libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/outline";

// Import: components and models
import { MessageContext, IMessage } from "../models/message";

// COMPONENT
function MessageIcon({ type }: { type: string }) {
  switch (type) {
    case "error":
      return (
        <ExclamationCircleIcon className="inline mb-1 mr-1 h-6 w-6 text-mred" />
      );
    case "confirmation":
      return (
        <CheckCircleIcon className="inline mb-1 mr-1 h-6 w-6 text-green-500" />
      );
    default:
      return (
        <InformationCircleIcon className="inline mb-1 mr-1 h-6 w-6 text-mblue" />
      );
  }
}

// COMPONENT
function MessageRow({ message: { type, text, id } }: { message: IMessage }) {
  const messageStore = React.useContext(MessageContext);

  // Render
  return (
    <li>
      <MessageIcon type={type} />
      {text}
      <button onClick={() => messageStore.deleteMessage(id)}>
        <TrashIcon className="inline mb-1 ml-1 h-4 w-4 text-mred" />
      </button>
    </li>
  );
}

// MAIN
export default observer(function MessageBox() {
  const messageStore = React.useContext(MessageContext);

  // Render
  return (
    <div className="fixed bottom-10 left-5 p-2 pt-3 bg-white border-mblue border-2">
      <ul>
        {messageStore.messagesList.map((message: IMessage) => (
          <MessageRow key={message.id} message={message}></MessageRow>
        ))}
      </ul>
      <button
        className="absolute -top-2 -right-2"
        onClick={messageStore.deleteAllMessages}
      >
        <XCircleIcon className="h-6 w-6 text-mblue bg-white" />
      </button>
    </div>
  );
});
