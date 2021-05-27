// Libs
import * as React from 'react';

// Components
import Header from './components/Header/Header';
import Charts from './components/Charts/Charts';
import Grids from './components/Grids/Grids';
import Transactions from './components/Transactions/Transactions';

// Assets
import './App.css';

export default function App() {

  const [rawFinancials, setRawFinancials] = React.useState<[ string | number ][]>([[0]]);

  // Definitions
  const tabs = {
    0: <Charts></Charts>,
    1: <Grids></Grids>,
    2: <Transactions rawFinancials={rawFinancials}></Transactions>
  };

  type tabOptions = keyof typeof tabs;

  const [currentTab, setCurrentTab] = React.useState<tabOptions>(2);

  const switchTab = (tab: tabOptions) => setCurrentTab(tab);

  // LOADING
  React.useEffect(() => {
    fetch('https://sheets.googleapis.com/v4/spreadsheets/1IZl_O6hXXfc03Suu3_lA2J5h4g29GqjaNHok0ST31yM/values/A:G?key=AIzaSyCnKMBNtZvvhvC1EHJxGuHVA9uAzxLClk0')
      .then(res => res.json())
      .then((data) => {
        setRawFinancials(data.values);
      })
      .catch((err) => {
        console.log('error');
      })
  },
    []
  );

  // RENDER
  return (
    <div className="App">
      <Header tabSwitchFn={switchTab}></Header>
      <div className="App-body">
        {tabs[currentTab]}
      </div>
    </div>
  );
}
