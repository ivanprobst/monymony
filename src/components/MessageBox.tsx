// Libs
import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/outline";

// Models
import { MessageContext, IMessage } from "../models/message";

// Component
function MessageIcon({ type }: { type: string }) {
  switch (type) {
    case "error":
      return (
        <ExclamationCircleIcon className="inline mb-1 h-6 w-6 text-mred" />
      );
    case "confirmation":
      return <CheckCircleIcon className="inline mb-1 h-6 w-6 text-green-500" />;
    case "information":
      return (
        <InformationCircleIcon className="inline mb-1 h-6 w-6 text-mblue" />
      );
    default:
      return (
        <InformationCircleIcon className="inline mb-1 h-6 w-6 text-mblue" />
      );
  }
}

// Component
function MessageRow({ message: { type, text, id } }: { message: IMessage }) {
  const messageStore = React.useContext(MessageContext);

  return (
    <li>
      <MessageIcon type={type} />
      &nbsp;
      {text}
      &nbsp;
      <button
        onClick={() => {
          messageStore.deleteMessage(id);
        }}
      >
        <TrashIcon className="inline mb-1 h-4 w-4 text-mred" />
      </button>
    </li>
  );
}

// Render
export default observer(function MessageBox() {
  const messageStore = React.useContext(MessageContext);

  return (
    <article className="p-2 fixed bottom-10 left-5 bg-white border-mblue border-2">
      <ul>
        {messageStore.messagesList.map((message: IMessage) => (
          <MessageRow key={message.id} message={message}></MessageRow>
        ))}
      </ul>
    </article>
  );
});
