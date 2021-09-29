// Libs
import * as React from "react";

// Import: components
import TransactionsList, {
  TransactionCreationForm,
  TransactionDeletionButton,
} from "../components/Transactions";
import MessageBox from "../components/MessageBox";

export default function TransactionsPage() {
  return (
    <section className="grid grid-cols-10">
      <div className="col-span-7 px-2">
        <TransactionsList />
      </div>

      <div className="col-span-3 px-2 text-center border-l-2">
        <h3 className="py-2 font-bold text-sm">Manage transactions</h3>
        <TransactionCreationForm />
        <hr className="m-2" />
        <TransactionDeletionButton />
      </div>

      <MessageBox></MessageBox>
    </section>
  );
}
