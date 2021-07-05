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
    for (const transactionItem of cleanTransactions) {
      if (newGrid[transactionItem.category] === undefined) {
        newGrid[transactionItem.category] = new Array(12).fill(0);
      }
      newGrid[transactionItem.category][parseInt(transactionItem.date.split('.')[1]) - 1] += transactionItem.amount;
    }
    console.log(newGrid);
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
                  <TableRow ><TableCell>---</TableCell></TableRow>
                </>
              )
            })
          }
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
    const catList = Object.keys(gridRowModel[group]);

    return (
      <>
      {
        monthModel.map(month => {
          let currentTot = 0;
          for(const cat of catList) {
            currentTot += gridData[cat] === undefined ? 0 : gridData[cat][month - 1];
          }
          return <TableCell>{currentTot}</TableCell>;
        })
      }
      </>
    );
  }
}
