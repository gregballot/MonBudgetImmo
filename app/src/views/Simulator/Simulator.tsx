import React from "react";
import SEO from "../../components/SEO/SEO";
import Calculator from "../../components/Calculator/Calculator";
import "./Simulator.scss";

const Simulateur: React.FC = () => (
  <>
    <SEO 
      title="Simulateur Immobilier Gratuit - Calculez votre budget d'achat | MonSimulateurImmo"
      description="Utilisez notre simulateur immobilier gratuit pour calculer votre budget d'achat. Estimez votre capacité d'emprunt, mensualités et prix maximum selon votre salaire. Calculs basés sur les recommandations HCSF."
      keywords="simulateur immobilier gratuit, calcul budget achat, capacité d'emprunt, mensualité crédit, prix maximum bien, taux d'endettement 35%, HCSF"
      canonical="https://monsimulateurimmo.fr/simulateur"
      ogType="website"
    />
    <div className="page-container">
      <Calculator />
    </div>
  </>
);

export default Simulateur; 
