import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-button">
          header          
        </div>
        
        <div className="header-button">
          cocktails
        </div>

      </header>
      

      <div className="page">
        <div className="landing">
          <p>COCKTAILS<br />on the go</p>
        </div>
        
        <div className="home">

          <div className="home-page-cocktail—border">
            <div className="home-page-photo">
              cocktail
            </div>
          </div>
          <div className="home-page-cocktail—border">
            <div className="home-page-photo">
              bebida
            </div>
          </div>
        </div>
        
        <div className="cocktail-list">
          <div className="cocktail-list-filters">
            filters
          </div>
          <div className="cocktail-list-search">
            search
          </div>
          <div className="cocktail-list-grid">
            grid
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
