// Libs
import {ButtonGroup, Button, Grid} from '@material-ui/core';

// Definitions
type tabOptions = 0 | 1 | 2;

interface tabsControlers {
  tabSwitchFn: (tab: tabOptions) => void
}

export default function Header({tabSwitchFn} : tabsControlers) {

  // RENDER
  return (
    <header className="App-header">
      <Grid container>
        <Grid item xs={6}>
          <h1>Mony mony</h1>
        </Grid>
        <Grid item xs={6}>
          <ButtonGroup variant="contained" color="primary">
            <Button onClick={() => {tabSwitchFn(0)}}>Charts</Button>
            <Button onClick={() => {tabSwitchFn(1)}}>Grid</Button>
            <Button onClick={() => {tabSwitchFn(2)}}>Transactions</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </header>
  )
}