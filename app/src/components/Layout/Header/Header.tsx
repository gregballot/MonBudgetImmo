import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import SunIcon from "../../Icons/SunIcon";
import MoonIcon from "../../Icons/MoonIcon";
import { useTheme } from "../../../hooks/useTheme";
import "./Header.scss";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

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

        {/* Desktop Navigation and Theme Toggle */}
        <div className="header-right">
          <nav className="header-nav desktop-nav">
            <Link to="/simulateur">Simulateur</Link>
            <Link to="/a-propos">À propos</Link>
          </nav>

          {/* Theme Toggle Button */}
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>

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
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}>
        <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-nav-links">
            <Link to="/simulateur" onClick={closeMenu}>Simulateur</Link>
            <Link to="/a-propos" onClick={closeMenu}>À propos</Link>
            <button
              className="mobile-theme-toggle"
              onClick={() => {
                toggleDarkMode();
                closeMenu();
              }}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? "☀️ Mode clair" : "🌙 Mode sombre"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
