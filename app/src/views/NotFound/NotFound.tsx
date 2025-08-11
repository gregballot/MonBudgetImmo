import React from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/SEO/SEO";
import "./NotFound.scss";

const NotFound: React.FC = () => (
  <>
    <SEO
      title="Page non trouvée - Mon Simulateur Immo"
      description="La page que vous recherchez n'existe pas. Retournez au simulateur immobilier pour calculer votre budget d'achat."
      canonical="https://mon-simulateur-immo.fr/404"
      ogType="website"
    />
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page non trouvée</h2>
        <p className="not-found-description">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="not-found-link primary">
            Retourner au simulateur
          </Link>
          <Link to="/a-propos" className="not-found-link secondary">
            À propos
          </Link>
        </div>
      </div>
    </div>
  </>
);

export default NotFound;
