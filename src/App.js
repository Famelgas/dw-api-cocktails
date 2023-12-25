import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const App = () => {
  const navbarRef = useRef(null);
  const homeRef = useRef(null);
  const cocktailsRef = useRef(null);
  const [homeCocktail, setHomeCocktail] = useState({});
  const [currentCocktailIndex, setCurrentCocktailIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupImageSrc, setPopupImageSrc] = useState("");
  const [popupCocktail, setPopupCocktail] = useState(null);
  const [showFiltersPopup, setShowFiltersPopup] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);


  const [allCocktails, setAllCocktails] = useState([]);


  useEffect(() => {
    window.onscroll = function () {
      myFunction();
    };

    var navbar = document.getElementById("navbar");
    var fixed = navbar.offsetTop;

    function myFunction() {
      if (window.scrollY >= fixed) {
        navbar.classList.add("fixed");
      } else {
        navbar.classList.remove("fixed");
      }
    }

    fetchHomeCocktail();
    getNextCocktails();

    const intervalId = setInterval(() => {
      fetchHomeCocktail();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchHomeCocktail = () => {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php/")
      .then(response => response.json())
      .then(data => {
        setHomeCocktail(data.drinks[0]);
      })
      .catch(error => console.error("Error fetching home cocktail:", error));
  };

  const fetchCocktailsGrid = async () => {
    try {
      const cocktails = [];
  
      for (let i = 0; i < 9; i++) {
        const cocktail = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => data.drinks[0]);
  
        cocktails.push(cocktail);
      }
  
      return cocktails;
    } catch (error) {
      console.error("Error fetching cocktails:", error);
      throw error; // Rethrow the error to propagate it
    }
  };

  const getNextCocktails = async () => {
    const newCocktails = await fetchCocktailsGrid();
    setAllCocktails(prevCocktails => [...prevCocktails, ...newCocktails]);
  };
  
  const handlePrev = () => {
    setCurrentCocktailIndex(prevIndex => Math.max(prevIndex - 9, 0));
  };
  
  const handleNext = async () => {
    if (currentCocktailIndex + 9 >= allCocktails.length) {
      // Se estiver nos últimos cocktails, busca mais da API
      await getNextCocktails();
    }
  
    // Agora, atualize o índice
    setCurrentCocktailIndex(prevIndex => prevIndex + 9);
  };
  

  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      const topOffset = ref.current.getBoundingClientRect().top + window.scrollY - navbarRef.current.clientHeight;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const handlePopUp = (cocktail) => {
    setShowPopup(true);
    setPopupImageSrc(cocktail.strDrinkThumb);
    setPopupCocktail(cocktail);
  };
  

  const closePopup = () => {
    setShowPopup(false);
    setPopupImageSrc("");
  };

  const getIngredients = (cocktail) => {
    const ingredients = [];
  
    for (let i = 1; i <= 15; i++) {
      const ingredientKey = `strIngredient${i}`;
      const measureKey = `strMeasure${i}`;
  
      if (cocktail[ingredientKey]) {
        const ingredient = `${cocktail[ingredientKey]} - ${cocktail[measureKey] || 'to taste'}`;
        ingredients.push(ingredient);
      }
    }
  
    return ingredients;
  };  

  const openFiltersPopup = () => {
    setShowFiltersPopup(true);
  };
  
  const closeFiltersPopup = () => {
    setShowFiltersPopup(false);
  };
  
  
  const applyFilters = () => {
    // Lógica para aplicar os filtros aqui
    console.log("Filtros aplicados:", selectedFilters);
    closeFiltersPopup();
  };
  
  const resetFilters = () => {
    // Lógica para resetar os filtros aqui
    setSelectedFilters([]);
    closeFiltersPopup();
  };

  const handleSearchButton = () => {
    const searchInput = document.getElementById("searchInput").value;

    console.log("Searching...");

    if (searchInput !== "") {
      handleSearch(searchInput);
    }
  };

  const handleSearch = (searchText) => {
    console.log("Search Text:", searchText);
  };

  return (
    <div className="App">
      <div className="landing">
        <div className="landing-text">
          <p>COCKTAILS<br />on the go</p>
        </div>
      </div>

      <div id="navbar" ref={navbarRef}>
        <div className="header-button" onClick={() => scrollToRef(homeRef)}>
          home
        </div>
        <div className="header-button" onClick={() => scrollToRef(cocktailsRef)}>
          cocktails
        </div>
      </div>

      <div className="page">
        <div className="home" ref={homeRef}>
          <div className="home-container">
            <div className="home-page-cocktail—border">
              <div className="home-page-photo" onClick={() => handlePopUp(homeCocktail)}>
                <img src={homeCocktail.strDrinkThumb} alt="Cocktail" />
              </div>
            </div>
          </div>
        </div>

        <div className="cocktail-list" ref={cocktailsRef}>
          <div className="cocktail-list-header">
            <div className="cocktail-list-button" onClick={() => handlePopUp("")}>
              filters
              {showPopup && (
                <div className="popup">
                  <div className="popup-container">
                    <span onClick={closePopup}>&times;</span>
                    <div className="filters-content">
                      {/* Conteúdo do popup de filtros */}
                      <h2>Filters</h2>
                      {/* Lógica para escolher os filtros (checkboxes, dropdowns, etc.) */}
                      <button onClick={applyFilters}>Apply Filters</button>
                      <button onClick={resetFilters}>Reset Filters</button>
                    </div>
                  </div>
                </div>
              )}


            </div>

            <div className="cocktail-list-searchbar">
              <input type="text" id="searchInput" className="cocktail-list-searchbar-input" placeholder="Enter search..." />
              <div className="cocktail-list-button" onClick={() => handleSearchButton()}>
                search
              </div>
            </div>
          </div>

          <div className="cocktail-list-grid">
            {allCocktails.slice(currentCocktailIndex, currentCocktailIndex + 9).map((cocktail, index) => (
              <div key={index} className="cocktail-container">
                <div className="cocktail-photo-container" onClick={() => handlePopUp(cocktail)}>
                  <img className="cocktail-photo" loading="lazy" src={cocktail.strDrinkThumb} alt="Cocktail" />
                </div>
                <div className="cocktail-name">
                  {cocktail.strDrink}
                </div>
              </div>
            ))}
          </div>

          {showPopup && popupCocktail && (
            <div className="popup">
              <div className="popup-container">
                <span onClick={closePopup}>&times;</span>

                <div className="img-container">
                  {popupImageSrc && <img src={popupImageSrc} alt="Popup Photo" />}
                </div>

                <div className="recipe">
                  <div className="recipe-title">
                    {popupCocktail.strDrink}
                  </div>
                  <hr />
                  <div className="recipe-text">
                    <h3>Ingredients:</h3>
                    <ul>
                      {getIngredients(popupCocktail).map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <hr />
                  <div className="recipe-text">
                    <h3>Instructions:</h3>
                    <p>{popupCocktail.strInstructions}</p>
                  </div>
                </div>
              </div>
            </div>
          )}



          <div className="grid-movement">
            <div className="cocktail-list-button" onClick={() => handlePrev()}>
              prev
            </div>
            <div className="cocktail-list-button" onClick={handleNext}>
              next
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
