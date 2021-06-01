// Libs
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { iTransaction } from "../../types";

export default function Transactions({
  cleanTransactions,
}: {
  cleanTransactions: iTransaction[];
}) {
  // RENDER
  return (
    <div className="Transactions">
      <h2>Transactions</h2>
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
            {cleanTransactions.map((transactionData) => (
              <TableRow key={transactionData.index} className="TransactionsRow">
                <TableCell>{transactionData.index}</TableCell>
                <TableCell>{transactionData.date}</TableCell>
                <TableCell>{transactionData.description}</TableCell>
                <TableCell>{transactionData.category}</TableCell>
                <TableCell>{transactionData.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
