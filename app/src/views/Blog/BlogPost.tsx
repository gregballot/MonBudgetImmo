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

  // Convert markdown-style content to HTML (improved implementation)
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="content-h1">{line.substring(2)}</h1>);
        i++;
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="content-h2">{line.substring(3)}</h2>);
        i++;
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="content-h3">{line.substring(4)}</h3>);
        i++;
      } 
      // Lists
      else if (line.startsWith('- ')) {
        const listItems = [];
        while (i < lines.length && lines[i].startsWith('- ')) {
          listItems.push(lines[i].substring(2));
          i++;
        }
        elements.push(
          <ul key={i} className="content-list">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineElements(item) }} />
            ))}
          </ul>
        );
      }
      // Tables
      else if (line.includes('|') && line.split('|').length > 2 && !line.includes('---')) {
        const tableRows = [];
        while (i < lines.length && lines[i].includes('|') && lines[i].split('|').length > 2) {
          if (!lines[i].includes('---')) {
            tableRows.push(lines[i].split('|').filter(cell => cell.trim()));
          }
          i++;
        }
        if (tableRows.length > 0) {
          elements.push(
            <table key={i} className="content-table">
              <thead>
                <tr>
                  {tableRows[0].map((header, idx) => (
                    <th key={idx}>{header.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} dangerouslySetInnerHTML={{ __html: formatInlineElements(cell.trim()) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
      }
      // Regular paragraphs
      else if (line.trim() && !line.startsWith('#')) {
        elements.push(
          <p key={i} className="content-paragraph" 
             dangerouslySetInnerHTML={{ __html: formatInlineElements(line) }} />
        );
        i++;
      }
      // Empty lines
      else if (!line.trim()) {
        elements.push(<br key={i} />);
        i++;
      }
      // Skip unknown lines
      else {
        i++;
      }
    }

    return elements;
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