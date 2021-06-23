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
            {cleanTransactions.map(({index, date, description, category, amount}) => (
              <TableRow key={index} className="TransactionsRow">
                <TableCell>{index}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>{category}</TableCell>
                <TableCell>{amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
