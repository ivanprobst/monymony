// Libs
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { iTransaction } from "../utils/types";

// COMP: Transaction
function Transaction({ transaction }: { transaction: iTransaction }) {
  return (
    <TableRow className="TransactionsRow">
      <TableCell>{transaction.index}</TableCell>
      <TableCell>{transaction.date}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>{transaction.category}</TableCell>
      <TableCell>{transaction.amount}</TableCell>
    </TableRow>
  );
}

// RENDER: TransactionsList
export default function TransactionsList({
  cleanTransactions,
}: {
  cleanTransactions: iTransaction[];
}) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow className="TransactionsRow">
            <TableCell>Index</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cleanTransactions.map((transaction) => (
            <Transaction
              key={transaction.index}
              transaction={transaction}
            ></Transaction>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
