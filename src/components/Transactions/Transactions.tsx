// Libs
import {TableContainer, Table, TableHead, TableBody, TableRow, TableCell} from '@material-ui/core';

// Components
import TransactionRow from "./TransactionRow";

export default function Transactions({rawFinancials}: {rawFinancials: [ string | number ][]}) {

  // RENDER
  return (
    <div className="Transactions">
      Transactions:
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {rawFinancials[0].map(transactionHeadCell =>(
                <TableCell key={transactionHeadCell}>{transactionHeadCell}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rawFinancials.slice(1).map(transactionData => (
              <TransactionRow key={transactionData[0]} transactionData={transactionData}></TransactionRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}