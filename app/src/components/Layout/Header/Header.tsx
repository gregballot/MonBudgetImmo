import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "./Header.scss";

const Header: React.FC = () => (
  <header className="header">
    <div className="header-inner">
      <div className="header-left">
        <img src={logo} alt="Logo MonBudgetImmo" className="header-logo" />
        <span className="header-title">MonBudgetImmo</span>
      </div>
      <nav className="header-nav">
        <Link to="/simulateur">Simulateur</Link>
        <Link to="/a-propos">À propos</Link>
      </nav>
    </div>
  </header>
);

export default Header; 
