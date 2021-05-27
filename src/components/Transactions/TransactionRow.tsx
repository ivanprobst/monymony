// Libs
import {TableRow, TableCell} from '@material-ui/core';

export default function TransactionRow({transactionData}: {transactionData: Array<number | string>}) {

  // RENDER
  return (
    <TableRow className="TransactionsRow">
      {transactionData.map(data => (
        <TableCell key={data}>{data}</TableCell>
      ))}
    </TableRow>
  )
}