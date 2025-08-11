import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import blogArticles from '../../data/blogArticles';
import './Blog.scss';

const BlogList: React.FC = () => {
  return (
    <>
      <SEO
        title="Blog Immobilier - Guides et Conseils pour votre Projet Immobilier"
        description="Découvrez nos guides complets sur l'immobilier : capacité d'emprunt, taux de crédit, frais de notaire, investissement locatif et aides au financement."
        keywords="blog immobilier, guide achat immobilier, conseils crédit immobilier, investissement locatif, PTZ, frais notaire"
        canonical="https://mon-simulateur-immo.fr/blog"
      />
      
      <div className="blog-list">
        <div className="blog-header">
          <h1>Blog Immobilier</h1>
          <p className="blog-subtitle">
            Guides, conseils et analyses pour réussir votre projet immobilier
          </p>
        </div>

        <div className="articles-grid">
          {blogArticles.map((article) => (
            <article key={article.id} className="article-card">
              <div className="article-content">
                <div className="article-meta">
                  <time dateTime={article.publishDate}>
                    {new Date(article.publishDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                  <span className="read-time">{article.readTime} min de lecture</span>
                </div>
                
                <h2 className="article-title">
                  <Link to={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>
                
                <p className="article-excerpt">
                  {article.excerpt}
                </p>
                
                <div className="article-tags">
                  {article.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Link to={`/blog/${article.slug}`} className="read-more">
                  Lire la suite →
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="blog-cta">
          <h2>Calculez votre Budget Immobilier</h2>
          <p>
            Après avoir lu nos guides, utilisez notre simulateur gratuit pour 
            estimer votre capacité d'emprunt et votre budget d'achat.
          </p>
          <Link to="/simulateur" className="cta-button">
            Accéder au Simulateur
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogList;