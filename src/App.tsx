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

  // Definitions
  const tabs = {
    0: <Charts></Charts>,
    1: <Grids></Grids>,
    2: <Transactions></Transactions>
  };
  type tabOptions = 0 | 1 | 2;

  const [currentTab, setCurrentTab] = React.useState<tabOptions>(0);

  const switchTab = (tab: tabOptions) => setCurrentTab(tab);

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
