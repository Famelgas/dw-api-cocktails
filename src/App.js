import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import './fonts/Comfortaa.ttf';

const App = () => {
  const navbarRef = useRef(null);
  const homeSection = useRef(null);
  const cocktailSection = useRef(null);
  const [homeCocktail, setHomeCocktail] = useState({});


  const [showPopup, setShowPopup] = useState(false);
  const [popupImageSrc, setPopupImageSrc] = useState("");
  const [popupCocktail, setPopupCocktail] = useState(null);


  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  
  const [originalCocktails, setOriginalCocktails] = useState([]);
  const [cocktailsOrder, setCocktailsOrder] = useState([]);
  const [cocktailsCategory, setCocktailsCategory] = useState([]);

  
  const [showCocktails, setShowCocktails] = useState([]);
  const [currentCocktailIndex, setCurrentCocktailIndex] = useState(0);



  useEffect(() => {
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    }

    window.onscroll = function () {
      scrollFunc();
    };

    var navbar = document.getElementById("navbar");
    var fixed = navbar.offsetTop;

    function scrollFunc() {
      if (window.scrollY >= fixed) {
        navbar.classList.add("fixed");
      } else {
        navbar.classList.remove("fixed");
      }
    }

    fetchHomeCocktail();
    fetchInitialCocktails();
    fetchCategories();


    const backgroundFetchCocktailsOrder = async () => {
      try {
        await fetchCocktailsOrder();
      } catch (error) {
        console.error("Error fetching cocktails by order:", error);
      }
    };


    backgroundFetchCocktailsOrder();

    const intervalHomePage = setInterval(() => {
      fetchHomeCocktail();
    }, 5000);

    return () => {
      clearInterval(intervalHomePage);
    };
  }, []);


  
  // fetch



  const fetchHomeCocktail = () => {
    try {
      fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php/")
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setHomeCocktail(data.drinks[0]);
        })
        .catch(error => {
          console.error("Error fetching home cocktail:", error);
        });
    } catch (error) {
      console.error("Error fetching home cocktail:", error);
      throw error;
    }
  };
  

  const fetchInitialCocktails = async () => {
    try {
      const initialCocktails = await fetchCocktails();
      setOriginalCocktails(initialCocktails);
      setShowCocktails(initialCocktails);
    } catch (error) {
      console.error("Error fetching initial cocktails:", error);
    }
  };


  const fetchCategories = () => {
    try {
      fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list")
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const categories = data.drinks || [];
          setCategories(categories);
        })
        .catch(error => {
          console.error("Error fetching categories:", error);
        });
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };
  

  const fetchCocktails = async () => {
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
          
        if (!originalCocktails.some(c => c.idDrink === cocktail.idDrink)) {
          cocktails.push(cocktail);
        } else {
          i--;
        }
      }
  
      return cocktails;
    } catch (error) {
      console.error("Error fetching cocktails:", error);
      throw error;
    }
  };


  const fetchCocktailsCategory = async (category) => {
    try {
      const data = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`).then(response => response.json());
      const cocktailsList = data.drinks || [];
  
      const cocktailsWithDetails = await Promise.all(cocktailsList.map(async cocktail => {
        const cocktailDetails = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`).then(response => response.json());
        return cocktailDetails.drinks[0];
      }));
  
      setCocktailsCategory((prevCocktails) => [...prevCocktails, ...cocktailsWithDetails]);
      setShowCocktails(cocktailsWithDetails);
  
      return cocktailsWithDetails;
    } catch (error) {
      console.error("Error fetching cocktails by category:", error);
      throw error;
    }
  };
  
  
  const fetchCocktailsOrder = async () => {
    try {
      const cocktails = [];
  
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  
      for (let letter = 'a'.charCodeAt(0); letter <= 'z'.charCodeAt(0); letter++) {
        await delay(2000);
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${String.fromCharCode(letter)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (!data.drinks || data.drinks.length === 0) {
          break;
        }
  
        cocktails.push(...data.drinks);
      }
  
      setCocktailsOrder(cocktails);
  
      return cocktails;
    } catch (error) {
      console.error("Error fetching cocktails by order:", error);
      throw error;
    }
  };



  // ingredients

  
  const getIngredients = (cocktail) => {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredientKey = `strIngredient${i}`;
      const measureKey = `strMeasure${i}`;
  
      if (cocktail.hasOwnProperty(ingredientKey) && cocktail[ingredientKey]) {
        const ingredient = `${cocktail[ingredientKey]} - ${cocktail[measureKey] || 'to taste'}`;
        ingredients.push(ingredient);
      }
    }
  
  
    return ingredients;
  };



  // filters



  const applyFilters = async () => {
    try {
      if (selectedCategory || selectedOrder) {
        if (selectedCategory) {
          const filteredCocktails = await fetchCocktailsCategory(selectedCategory);
          setShowCocktails(filteredCocktails);
        }
        if (selectedOrder) {
          if (selectedOrder === 'asc') {
            cocktailsOrder.sort((a, b) => a.strDrink.localeCompare(b.strDrink));
          } else if (selectedOrder === 'desc') {
            cocktailsOrder.sort((a, b) => b.strDrink.localeCompare(a.strDrink));
          }
          setShowCocktails(cocktailsOrder);
        }
        if (selectedCategory && selectedOrder) {
          const filteredCocktails = await fetchCocktailsCategory(selectedCategory);
          const filteredCocktailsSort = filteredCocktails;
          if (selectedOrder === 'asc') {
            filteredCocktailsSort.sort((a, b) => a.strDrink.localeCompare(b.strDrink));
          } else if (selectedOrder === 'desc') {
            filteredCocktailsSort.sort((a, b) => b.strDrink.localeCompare(a.strDrink));
          }
          setShowCocktails(filteredCocktailsSort);
        }
      } else {
        setShowCocktails(originalCocktails);
      }
  
      closePopup();
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };
  
  
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedOrder(null);
    setShowCocktails(originalCocktails);
    closePopup();
  };


  // popup


  const handlePopUp = (cocktail) => {
    setShowPopup(true);
    
    if (cocktail === null) {
      setPopupImageSrc("");
      setPopupCocktail(null);
    } else {
      setPopupImageSrc(cocktail.strDrinkThumb);
      setPopupCocktail(cocktail);
    }
  };
  
  const closePopup = () => {
    setShowPopup(false);
    setPopupImageSrc("");
  };


  // prev e next

  
  const handlePrev = () => {
    setCurrentCocktailIndex(prevIndex => Math.max(prevIndex - 9, 0));
  };
  
  const handleNext = async () => {
    if (currentCocktailIndex + 9 >= showCocktails.length) {
      if (selectedCategory) {
        getNextCocktailsCategory();
      } else if (selectedOrder) {
        getNextCocktailsOrder();
      } else {
        await getNextCocktails();
      }
    }
  
    setCurrentCocktailIndex((prevIndex) => prevIndex + 9);
  };
  
  
  const getNextCocktails = async () => {
    const newCocktails = await fetchCocktails();
    setOriginalCocktails((prevCocktails) => [...prevCocktails, ...newCocktails]);
    setShowCocktails((prevCocktails) => [...prevCocktails, ...newCocktails]);
  };
  
  const getNextCocktailsOrder = () => {
    const nextIndex = currentCocktailIndex + 9;
    const newCocktails = cocktailsOrder.slice(nextIndex, nextIndex + 9);
  
    if (newCocktails.length === 0) {
      fetchCocktailsOrder(selectedOrder).then((moreCocktails) => {
        setCocktailsOrder((prevCocktails) => [...prevCocktails, ...moreCocktails]);
        setShowCocktails((prevCocktails) => [...prevCocktails, ...moreCocktails]);
      });
    } else {
      setShowCocktails(newCocktails);
      setCurrentCocktailIndex(nextIndex);
    }
  };
  
  const getNextCocktailsCategory = () => {
    const nextIndex = currentCocktailIndex + 9;
    const newCocktails = cocktailsCategory.slice(nextIndex, nextIndex + 9);
  
    if (newCocktails.length === 0) {
      fetchCocktailsCategory(selectedCategory).then((moreCocktails) => {
        setCocktailsCategory((prevCocktails) => [...prevCocktails, ...moreCocktails]);
        setShowCocktails((prevCocktails) => [...prevCocktails, ...moreCocktails]);
      });
    } else {
      setShowCocktails(newCocktails);
      setCurrentCocktailIndex(nextIndex);
    }
  };
  

  // scroll


  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      const topOffset = ref.current.getBoundingClientRect().top + window.scrollY - navbarRef.current.clientHeight;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  
  // search


  const handleSearchButton = () => {
    const searchInput = document.getElementById("searchInput").value;


    if (searchInput !== "") {
      handleSearch(searchInput);
    }
  };


  const handleSearch = async (searchText) => {
    try {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      const searchResults = data.drinks || [];
      setShowCocktails(searchResults);
  
      setSelectedCategory(null);
      setSelectedOrder(null);
      setCurrentCocktailIndex(0);
      closePopup();
    } catch (error) {
      console.error("Error fetching cocktails by search:", error);
    }
  };
  

  // page

  return (
    <div className="App">
      <div className="landing">
        <div className="landing-text">
          <p>COCKTAILS<br />on the go</p>
        </div>
      </div>

      <div id="navbar" ref={navbarRef}>
        <div className="header-button" onClick={() => scrollToRef(homeSection)}>
          home
        </div>
        <div className="header-button" onClick={() => scrollToRef(cocktailSection)}>
          cocktails
        </div>
      </div>

      <div className="page">
        <div className="home" ref={homeSection}>
          <div className="home-container">
            <div className="home-page-cocktail—border">
              <div className="home-page-photo" onClick={() => handlePopUp(homeCocktail)}>
                <img src={homeCocktail.strDrinkThumb} alt="Cocktail" />
              </div>
            </div>
          </div>
        </div>

        <div className="cocktail-list" ref={cocktailSection}>
          <div className="cocktail-list-header">
            <div className="cocktail-list-button" onClick={() => handlePopUp(null)}>
              filters
            </div>

            <div className="cocktail-list-searchbar">
              <input type="text" id="searchInput" className="cocktail-list-searchbar-input" placeholder="Enter search..." />
              <div className="cocktail-list-button" onClick={() => handleSearchButton()}>
                search
              </div>
            </div>
          </div>

          <div className="cocktail-list-grid">
            {showCocktails.slice(currentCocktailIndex, currentCocktailIndex + 9).map((cocktail, index) => (
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
                      {getIngredients(popupCocktail).map((ingredient, index) => {
                        return <li key={index}>{ingredient}</li>;
                      })}
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

          {showPopup && !popupCocktail && (
            <div className="popup">
              <div className="popup-container">
                <span onClick={closePopup}>&times;</span>

                <div className="filters-page">

                  <div className="filters-container">
                    <div className="filters-content">
                      <h3>Categories</h3>
                      <div className="filters-options">
                        <ul>
                          {categories.map((filter, index) => (
                            <li
                              key={index}
                              onClick={() => setSelectedCategory(selectedCategory === filter.strCategory ? null : filter.strCategory)}
                              className={selectedCategory === filter.strCategory ? 'selected' : ''}
                            >
                              {filter.strCategory}
                            </li>
                          ))}
                        </ul>

                      </div>

                    </div>
                    
                    <div className="vl"></div>

                    <div className="filters-content">
                    
                      <div className="filters-content">
                        <h3>Order By</h3>
                        <div className="filters-options">
                          <ul>
                            <li
                              onClick={() => setSelectedOrder('asc')}
                              className={selectedOrder === 'asc' ? 'selected' : ''}
                            >
                              Ascending
                            </li>
                            <li
                              onClick={() => setSelectedOrder('desc')}
                              className={selectedOrder === 'desc' ? 'selected' : ''}
                            >
                              Descending
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="filters-buttons">
                    <div className="cocktail-list-button" onClick={applyFilters}>
                      apply
                    </div>
                    <div className="cocktail-list-button" onClick={resetFilters}>
                      reset
                    </div>
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