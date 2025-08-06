import React from "react";
import SEO from "../../components/SEO/SEO";
import "./About.scss";

const APropos: React.FC = () => (
  <>
    <SEO
      title="À propos - Mon Simulateur Immo | Votre projet immobilier simplifié"
      description="Découvrez l'histoire derrière Mon Simulateur Immo. Un simulateur immobilier gratuit créé pour simplifier le calcul de votre budget d'achat immobilier. Approche innovante basée sur vos revenus."
      keywords="à propos simulateur immobilier, histoire Mon Simulateur Immo, projet immobilier, calcul budget, Grégoire simulateur"
      canonical="https://mon-simulateur-immo.fr/a-propos"
      ogType="article"
    />
    <div className="about-container">
      <div className="about-header">
                <h1 className="about-title">Votre projet immobilier, simplifié.</h1>
      </div>

      <div className="about-content">
        <section className="about-intro">
          <p className="about-text">
            Acheter un bien immobilier est un projet de vie, mais le point de départ est souvent un véritable casse-tête.
            Les questions sont toujours les mêmes : "Avec mon salaire, quel budget puis-je viser ?" ou à l'inverse,
            "Puis-je vraiment me permettre ce bien qui me fait rêver ?".
          </p>
          <p className="about-text">
            Frustré par les simulateurs existants (souvent complètement dépassés, incomplets, peu flexibles et
            qui cachent souvent un formulaire de contact), j'ai eu l'idée de créer <em>Mon Simulateur Immo</em>.
          </p>
        </section>

        <section className="about-approach">
          <h2 className="section-title">Une approche pensée pour vous</h2>
          <p className="about-text">
            La plupart des outils partent du prix d'un bien. Ici, nous pensons que la question la plus importante
            est celle de votre budget. C'est pourquoi ce simulateur a été conçu pour fonctionner dans les deux sens :
          </p>
          <ul className="feature-list">
            <li>Partez d'un prix pour estimer votre mensualité et le salaire nécessaire.</li>
            <li>Ou faites l'inverse : partez de votre salaire ou de la mensualité idéale pour découvrir concrètement
                votre capacité d'emprunt et le prix du bien que vous pouvez commencer à chercher.</li>
          </ul>
          <p className="about-text">
            L'objectif est de vous donner une vision claire et instantanée de votre pouvoir d'achat immobilier
            selon l'angle qui vous convient le mieux.
          </p>
        </section>

        <section className="about-project">
          <h2 className="section-title">Un projet personnel et transparent</h2>
          <p className="about-text">
            <em>Mon Simulateur Immo</em> n'est pas une grande entreprise. C'est un projet personnel que j'ai développé sur mon temps libre,
            avec l'envie de créer l'outil que j'aurais moi-même aimé utiliser.
          </p>
          <p className="about-text">
            Les calculs se basent sur les recommandations du Haut Conseil de Stabilité Financière (HCSF),
            notamment un taux d'endettement de 35% (assurance incluse), pour vous fournir une simulation réaliste et fiable.
          </p>
        </section>

        <section className="about-signature">
          <p className="signature-text">
            Merci de votre visite et bonne simulation !
          </p>
          <p className="author-name">Grégoire</p>
        </section>
      </div>
    </div>
  </>
);

export default APropos;
