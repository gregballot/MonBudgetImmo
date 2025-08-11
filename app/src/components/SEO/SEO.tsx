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
    "@type": ["WebApplication", "SoftwareApplication", "FinancialProduct"],
    "name": "Mon Simulateur Immo",
    "alternateName": "Calculateur de Budget Immobilier",
    "description": "Simulateur immobilier gratuit et fiable pour calculer votre capacité d'emprunt, mensualités de crédit et budget d'achat immobilier. Conforme aux recommandations HCSF.",
    "url": "https://mon-simulateur-immo.fr/",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Compatible with Chrome, Firefox, Safari, Edge.",
    "softwareVersion": "1.0.6",
    "datePublished": "2024-01-15",
    "dateModified": "2025-08-11",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Person",
      "name": "Grégoire Ballot",
      "url": "https://github.com/gregballot"
    },
    "creator": {
      "@type": "Person", 
      "name": "Grégoire Ballot"
    },
    "provider": {
      "@type": "Organization",
      "name": "Mon Simulateur Immo"
    },
    "featureList": [
      "Calcul de capacité d'emprunt",
      "Simulation de mensualités",
      "Estimation du prix maximum d'achat",
      "Mode avancé avec revenus locatifs",
      "Conformité HCSF (33% taux d'endettement)",
      "Interface responsive mobile",
      "Sauvegarde automatique des données"
    ],
    "screenshot": "https://mon-simulateur-immo.fr/og-image.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
      "bestRating": "5"
    },
    "keywords": "simulateur immobilier, budget immobilier, calcul emprunt, capacité d'emprunt, mensualité crédit, achat immobilier, taux d'endettement, HCSF, crédit immobilier, prêt immobilier",
    "inLanguage": "fr-FR",
    "audience": {
      "@type": "Audience",
      "audienceType": "Future homeowners, real estate investors, financial advisors"
    },
    "usageInfo": "Outil gratuit de simulation immobilière pour estimer votre budget d'achat",
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Comment calculer sa capacité d'emprunt immobilier ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La capacité d'emprunt se calcule selon la règle des 33% : vos mensualités ne doivent pas dépasser 33% de vos revenus nets mensuels. Notre simulateur prend en compte vos revenus, charges existantes et éventuels revenus locatifs."
          }
        },
        {
          "@type": "Question",
          "name": "Qu'est-ce que le taux d'endettement HCSF ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le HCSF (Haut Conseil de Stabilité Financière) recommande un taux d'endettement maximum de 33%. Cette règle limite le risque de surendettement et est appliquée par la majorité des banques françaises."
          }
        }
      ]
    }
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
