export default function TransactionRow({transactionData}: {transactionData: [ number | string ]}) {

  // RENDER
  return (
    <div className="TransactionsRow">
      Row: {transactionData}
    </div>
  )
}