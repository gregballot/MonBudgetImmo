import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = "Mon Simulateur Immo - Calculez votre budget immobilier gratuitement",
  description = "Simulateur immobilier gratuit pour calculer votre budget d'achat. Estimez votre capacité d'emprunt, mensualités et prix maximum selon votre salaire. Outil simple et fiable basé sur les recommandations HCSF.",
  keywords = "simulateur immobilier, budget immobilier, calcul emprunt, capacité d'emprunt, mensualité crédit, achat immobilier, taux d'endettement, HCSF, crédit immobilier",
  canonical = "https://mon-simulateur-immo.fr/",
  ogImage = "https://mon-simulateur-immo.fr/og-image.png",
  ogType = "website",
  structuredData
}) => {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Mon Simulateur Immo",
    "description": "Simulateur immobilier gratuit pour calculer votre budget d'achat immobilier",
    "url": "https://mon-simulateur-immo.fr/",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "author": {
      "@type": "Person",
      "name": "Grégoire"
    },
    "creator": {
      "@type": "Person",
      "name": "Grégoire"
    },
    "keywords": "simulateur immobilier, budget immobilier, calcul emprunt, capacité d'emprunt",
    "inLanguage": "fr-FR"
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Mon Simulateur Immo" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO; 
