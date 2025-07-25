import React from "react";
import "./Footer.scss";
import GithubIcon from "../../Icons/GithubIcon";
import LinkedinIcon from "../../Icons/LinkedinIcon";

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-motto">
        Calculez votre budget immobilier en un éclair.
      </div>
      <div className="footer-author">
        <span>Réalisé par Grégoire Ballot</span>
        <div className="footer-social">
          <a 
            href="https://github.com/gregballot/MonBudgetImmo"
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link github-link"
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
          <a 
            href="https://www.linkedin.com/in/gregoireballot/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link linkedin-link"
            aria-label="LinkedIn"
          >
            <LinkedinIcon />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 
