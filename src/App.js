import React, { useEffect, useRef, useState } from 'react';
import './App.css';

export default function App() {
  const navbarRef = useRef(null);
  const homeRef = useRef(null);
  const cocktailsRef = useRef(null);

  useEffect(() => {
    window.onscroll = function() {myFunction()};

    var navbar = document.getElementById("navbar");

    var fixed = navbar.offsetTop;

    function myFunction() {
      if (window.scrollY >= fixed) {
        navbar.classList.add("fixed")
      } else {
        navbar.classList.remove("fixed");
      }
    }
  }, []);

  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      const topOffset = ref.current.getBoundingClientRect().top + window.scrollY - navbarRef.current.clientHeight;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    console.log("Previous button clicked");
  };

  const handleNext = () => {
    console.log("Next button clicked");
  };
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupImageSrc, setPopupImageSrc] = useState("");
  
  const handlePopUp = (src) => {
    setShowPopup(true);
    setPopupImageSrc(src);
  };
  
  const closePopup = () => {
    setShowPopup(false);
    setPopupImageSrc("");
  };
  
  const handleFilters = () => {
    console.log("Filters button clicked");
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
              <div className="home-page-photo-container" onClick={() => handlePopUp(require("./logo512.png"))}>
                  <img className="home-page-photo" loading="lazy" src={require("./logo512.png")}/>
              </div>
            </div>
          </div>
        </div>
        
        
        <div className="cocktail-list" ref={cocktailsRef}>
          <div className="cocktail-list-header">
            <div className="cocktail-list-button" onClick={() => handleFilters()}>
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
            <div className="cocktail-container">
              <div className="cocktail-photo-container" onClick={() => handlePopUp(require("./logo512.png"))}>
                  <img className="cocktail-photo" loading="lazy" src={require("./logo512.png")}/>
              </div>

              <div className="cocktail-name">
                  cocktail 1
              </div>  
            </div>
              
            <div className="cocktail-container">
              <div className="cocktail-photo-container" onClick={() => handlePopUp(require("./logo512.png"))}>
                  <img className="cocktail-photo" loading="lazy" src={require("./logo512.png")}/>
              </div>

              <div className="cocktail-name">
                  cocktail 2
              </div>  
            </div>
              
            <div className="cocktail-container">
              <div className="cocktail-photo-container" onClick={() => handlePopUp(require("./logo512.png"))}>
                  <img className="cocktail-photo" loading="lazy" src={require("./logo512.png")}/>
              </div>

              <div className="cocktail-name">
                  cocktail 3
              </div>  
            </div>
              
            <div className="cocktail-container">
              <div className="cocktail-photo-container" onClick={() => handlePopUp(require("./logo512.png"))}>
                  <img className="cocktail-photo" loading="lazy" src={require("./logo512.png")}/>
              </div>

              <div className="cocktail-name">
                  cocktail 4
              </div>  
            </div>
              
            <div className="cocktail-container">
              <div className="cocktail-photo-container" onClick={() => handlePopUp(require("./logo512.png"))}>
                  <img className="cocktail-photo" loading="lazy" src={require("./logo512.png")}/>
              </div>

              <div className="cocktail-name">
                  cocktail 5
              </div>  
            </div>
              
            <div className="cocktail-container">
              <div className="cocktail-photo-container" onClick={() => handlePopUp(require("./logo512.png"))}>
                  <img className="cocktail-photo" loading="lazy" src={require("./logo512.png")}/>
              </div>

              <div className="cocktail-name">
                  cocktail 6
              </div>  
            </div>
              
            <div className="cocktail-container">
              <div className="cocktail-photo-container" onClick={() => handlePopUp(require("./logo512.png"))}>
                  <img className="cocktail-photo" loading="lazy" src={require("./logo512.png")}/>
              </div>

              <div className="cocktail-name">
                  cocktail 7
              </div>  
            </div>
              
            <div className="cocktail-container">
              <div className="cocktail-photo-container" onClick={() => handlePopUp(require("./logo512.png"))}>
                  <img className="cocktail-photo" loading="lazy" src={require("./logo512.png")}/>
              </div>

              <div className="cocktail-name">
                  cocktail 8
              </div>  
            </div>
              
            <div className="cocktail-container">
              <div className="cocktail-photo-container" onClick={() => handlePopUp(require("./logo512.png"))}>
                  <img className="cocktail-photo" loading="lazy" src={require("./logo512.png")}/>
              </div>

              <div className="cocktail-name">
                  cocktail 9
              </div>  
            </div>

            {showPopup && (
                <div className="popup">
                  <div className="popup-container">
                    <span onClick={closePopup}>&times;</span>
                    <img src={popupImageSrc} alt="Popup Photo" />
                    <div className="recipe" >
                      receita
                    </div>
                  </div>
                </div>
            )}

            <div className="grid-movement" >
              <div className="cocktail-list-button" onClick={() => handlePrevious()}>
                prev
              </div>
              <div className="cocktail-list-button" onClick={() => handleNext()}>
                next
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}