// Components
import TransactionRow from "./TransactionRow";

export default function Transactions({rawFinancials}: {rawFinancials: [ string | number ][]}) {

  // RENDER
  return (
    <div className="Transactions">
      Transactions:
      {rawFinancials.map(transactionData => (
        <TransactionRow transactionData={transactionData}></TransactionRow>
      ))}
    </div>
  )
}