// Components
import Header from './components/Header/Header'
import Transactions from './components/Transactions/Transactions'

// Assets
import './App.css';
import logo from './assets/logo.svg';

// RENDER
function App() {
  return (
    <div className="App">
      <Header></Header>
      <div className="App-body">
        <img src={logo} className="App-logo" alt="logo" />
        <Transactions></Transactions>
      </div>
    </div>
  );
}

export default App;
