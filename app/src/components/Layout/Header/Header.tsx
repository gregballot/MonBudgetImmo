import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "./Header.scss";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <img src={logo} alt="Logo Mon Simulateur Immo" className="header-logo" />
          <span className="header-title">Mon Simulateur Immo</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link to="/simulateur">Simulateur</Link>
          <Link to="/a-propos">À propos</Link>
        </nav>

        {/* Mobile Burger Menu Button */}
        <button 
          className={`burger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}>
        <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-nav-links">
            <Link to="/simulateur" onClick={closeMenu}>Simulateur</Link>
            <Link to="/a-propos" onClick={closeMenu}>À propos</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 
