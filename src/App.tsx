// Libs
import * as React from 'react';

// Components
import Header from './components/Header/Header';
import Charts from './components/Charts/Charts';
import Grids from './components/Grids/Grids';
import Transactions from './components/Transactions/Transactions';

// Assets
import {iTransaction, category} from './types';
import './App.css';

export default function App() {

  // Definitions
  const [cleanTransactions, setCleanTransactions] = React.useState<iTransaction[]>(
    [{
      index: 0,
      date: '',
      description: '',
      category: '',
      amount: 0
    }]);

  const tabs = {
    0: <Charts></Charts>,
    1: <Grids></Grids>,
    2: <Transactions cleanTransactions={cleanTransactions}></Transactions>
  };

  type tabOptions = keyof typeof tabs;

  const [currentTab, setCurrentTab] = React.useState<tabOptions>(2);

  const switchTab = (tab: tabOptions) => setCurrentTab(tab);

  // LOADING
  React.useEffect(() => {
    fetch(process.env.REACT_APP_GSHEET_URL + '?key=' + process.env.REACT_APP_GAPI_KEY)
      .then(res => res.json())
      .then((data) => {
        setCleanTransactions(
          data.values.slice(1).map((rawTransaction: Array< string | number | category >) => {
            return {
              index: rawTransaction[0],
              date: rawTransaction[1],
              description: rawTransaction[2],
              category: rawTransaction[6],
              amount: rawTransaction[5]
            }
          })
        );
      })
      .catch((err) => {console.log('error');})
  },
    []
  );

  console.log('Clean transactions: ', cleanTransactions);
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
