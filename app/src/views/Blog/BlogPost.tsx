import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import blogArticles from '../../data/blogArticles';
import './Blog.scss';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  // Convert markdown-style content to HTML (simple implementation)
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="content-h1">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="content-h2">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="content-h3">{line.substring(4)}</h3>;
        }
        
        // Lists
        if (line.startsWith('- ')) {
          const nextLines = content.split('\n').slice(index);
          const listItems = [];
          let i = 0;
          while (i < nextLines.length && (nextLines[i].startsWith('- ') || nextLines[i] === '')) {
            if (nextLines[i].startsWith('- ')) {
              listItems.push(nextLines[i].substring(2));
            }
            i++;
          }
          if (listItems.length > 0 && line === nextLines[0]) {
            return (
              <ul key={index} className="content-list">
                {listItems.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: formatInlineElements(item) }} />
                ))}
              </ul>
            );
          }
          return null; // Already processed in ul above
        }
        
        // Tables (simple detection)
        if (line.includes('|') && line.split('|').length > 2) {
          const nextLines = content.split('\n').slice(index);
          const tableRows = [];
          let i = 0;
          while (i < nextLines.length && nextLines[i].includes('|') && nextLines[i].split('|').length > 2) {
            if (!nextLines[i].includes('---')) { // Skip separator line
              tableRows.push(nextLines[i].split('|').filter(cell => cell.trim()));
            }
            i++;
          }
          if (tableRows.length > 0 && line === nextLines[0]) {
            return (
              <table key={index} className="content-table">
                <thead>
                  <tr>
                    {tableRows[0].map((header, i) => (
                      <th key={i}>{header.trim()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} dangerouslySetInnerHTML={{ __html: formatInlineElements(cell.trim()) }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          }
          return null;
        }
        
        // Regular paragraphs
        if (line.trim() && !line.startsWith('#') && !line.includes('|')) {
          return (
            <p key={index} className="content-paragraph" 
               dangerouslySetInnerHTML={{ __html: formatInlineElements(line) }} />
          );
        }
        
        // Empty lines
        if (!line.trim()) {
          return <br key={index} />;
        }
        
        return null;
      })
      .filter(Boolean);
  };

  const formatInlineElements = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="content-link">$1</a>');
  };

  // Get related articles
  const relatedArticles = blogArticles
    .filter(a => a.id !== article.id)
    .filter(a => a.tags.some(tag => article.tags.includes(tag)))
    .slice(0, 3);

  return (
    <>
      <SEO
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
        keywords={article.tags.join(', ')}
        canonical={`https://mon-simulateur-immo.fr/blog/${article.slug}`}
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.excerpt,
          "datePublished": article.publishDate,
          "dateModified": article.publishDate,
          "author": {
            "@type": "Person",
            "name": "Grégoire Ballot"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Mon Simulateur Immo",
            "logo": {
              "@type": "ImageObject",
              "url": "https://mon-simulateur-immo.fr/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://mon-simulateur-immo.fr/blog/${article.slug}`
          },
          "keywords": article.tags.join(', ')
        }}
      />
      
      <div className="blog-post">
        <div className="post-header">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span className="separator">›</span>
            <Link to="/blog">Blog</Link>
            <span className="separator">›</span>
            <span className="current">{article.title}</span>
          </nav>
          
          <div className="post-meta">
            <time dateTime={article.publishDate}>
              {new Date(article.publishDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>
            <span className="read-time">{article.readTime} min de lecture</span>
          </div>
          
          <h1 className="post-title">{article.title}</h1>
          
          <div className="post-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="post-content">
          {formatContent(article.content)}
        </div>
        
        <div className="post-cta">
          <div className="cta-box">
            <h3>Calculez votre Capacité d'Emprunt</h3>
            <p>
              Appliquez les conseils de cet article avec notre simulateur gratuit.
              Obtenez votre capacité d'emprunt en 30 secondes !
            </p>
            <Link to="/simulateur" className="cta-button">
              Utiliser le Simulateur
            </Link>
          </div>
        </div>

        {relatedArticles.length > 0 && (
          <div className="related-articles">
            <h3>Articles Connexes</h3>
            <div className="related-grid">
              {relatedArticles.map((related) => (
                <article key={related.id} className="related-card">
                  <h4>
                    <Link to={`/blog/${related.slug}`}>
                      {related.title}
                    </Link>
                  </h4>
                  <p>{related.excerpt}</p>
                  <div className="article-meta">
                    <time dateTime={related.publishDate}>
                      {new Date(related.publishDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </time>
                    <span className="read-time">{related.readTime} min</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        
        <div className="post-navigation">
          <Link to="/blog" className="back-to-blog">
            ← Retour au blog
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogPost;