// Libs
import {ButtonGroup, Button, Grid} from '@material-ui/core';

// RENDER
export default function Header() {
  return (
    <header className="App-header">
      <Grid container>
        <Grid item xs={6}>
          <h1>MonyMony</h1>
        </Grid>
        <Grid item xs={6}>
          <ButtonGroup variant="contained" color="primary">
            <Button>Charts</Button>
            <Button>Grid</Button>
            <Button>Transactions</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </header>
  )
}