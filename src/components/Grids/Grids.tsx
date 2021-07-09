// Libs
import * as React from "react";
import {TableContainer, Table, TableHead, TableBody, TableRow, TableCell} from '@material-ui/core';
import {iTransaction, gridRowModel, iGridData, monthModel} from '../../types';

export default function Grids({cleanTransactions}: {cleanTransactions: iTransaction[]}) {
  // Definitions
  const [gridData, setGridData] = React.useState<
    iGridData
  >({});

  // LOADING
  React.useEffect(() => {
    const newGrid: iGridData = {};
    for (const group of Object.keys(gridRowModel)) {
      newGrid[`Total ${group}`] = new Array(12).fill(0);
      newGrid[`Profit ${group}`] = new Array(12).fill(0);;
      for (const category of Object.keys(gridRowModel[group])) {
        newGrid[category] = new Array(12).fill(0);
      }
    }

    for (const transactionItem of cleanTransactions) {
      if (newGrid[transactionItem.category] === undefined) {
        throw new Error(`Missing category: ${transactionItem.category}`);
      }
      newGrid[transactionItem.category][parseInt(transactionItem.date.split('.')[1]) - 1] += transactionItem.amount;
    }

    const currentProfits = [...newGrid['Total Revenues']];
    for (const group of Object.keys(gridRowModel)) {
      for(const month of monthModel) {
        let currentTot = 0;
        for (const category of Object.keys(gridRowModel[group])) {
          currentTot += newGrid[category][month - 1];
        }
        currentProfits[month - 1] += currentTot;
        newGrid[`Total ${group}`][month - 1] = currentTot;
        newGrid[`Profit ${group}`][month - 1] = currentProfits[month - 1];
      }
    }

    console.log('griddata: ', newGrid);

    setGridData(newGrid);
  }, [cleanTransactions]);

  // RENDER
  return (
    <div className="Grids">
      <h2>Grid</h2>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>January</TableCell>
              <TableCell>February</TableCell>
              <TableCell>March</TableCell>
              <TableCell>April</TableCell>
              <TableCell>May</TableCell>
              <TableCell>June</TableCell>
              <TableCell>July</TableCell>
              <TableCell>August</TableCell>
              <TableCell>September</TableCell>
              <TableCell>October</TableCell>
              <TableCell>November</TableCell>
              <TableCell>December</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {
            Object.keys(gridRowModel).map(groupItem => {
              return(
                <>
                  <TableRow ><TableCell>{groupItem}</TableCell></TableRow>
                  {
                    Object.keys(gridRowModel[groupItem]).map((categoryItem) => {
                      return (
                        <TableRow>
                          <TableCell>{categoryItem}</TableCell>
                          <AmountCells category={categoryItem}></AmountCells>
                        </TableRow>
                      )
                    })
                  }
                  <TableRow >
                    <TableCell>Total: {groupItem}</TableCell>
                    <TotalCells group={groupItem}></TotalCells>
                  </TableRow>
                  <TableRow >
                    <TableCell>Profit after {groupItem}</TableCell>
                    <ProfitCells group={groupItem}></ProfitCells>
                  </TableRow>
                  <TableRow ><TableCell>---</TableCell></TableRow>
                </>
              )
            })
          }
            <TableRow>
              <TableCell>Final income</TableCell>
              <ProfitCells group="Investments"></ProfitCells>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )

  // HELPER COMPS
  function AmountCells({category}: {category: string}) {
    if(gridData[category] === undefined) {
      return <></>;
    }
    else {
      return (
        <>
        {
          gridData[category].map(amountItem => <TableCell>{amountItem}</TableCell>)
        }
        </>
      )
    }
  }

  function TotalCells({group}: {group: string}) {
    if(gridData[`Total ${group}`] === undefined) {
      return <></>;
    }
    else {
      return (
        <>
        {
          gridData[`Total ${group}`].map(amount =>  <TableCell>{amount}</TableCell>)
        }
        </>
      );
    }
  }

  function ProfitCells({group}: {group: string}) {
    if(gridData[`Profit ${group}`] === undefined) {
      return <></>;
    }
    else {
      return (
        <>
        {
          gridData[`Profit ${group}`].map(amount => <TableCell>{amount}</TableCell>)
        }
        </>
      );
    }
  }
}
