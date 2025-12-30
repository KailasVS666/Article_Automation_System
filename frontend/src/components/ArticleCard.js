import React from 'react';
import ReactMarkdown from 'react-markdown';

function ArticleCard({ article }) {
  // Determine if the article is an AI-enhanced version
  const isEnhanced = article.title.includes('[Updated]');
  
  // Define dynamic classes and labels based on the type
  const cardClass = isEnhanced ? 'card enhanced' : 'card original';
  const typeLabel = isEnhanced ? '✨ AI ENHANCED' : '📝 ORIGINAL';
  const labelClass = isEnhanced ? 'enhanced-label' : 'original-label';
  
  // Clean up the title for display
  const displayTitle = article.title.replace('[Updated] ', '');

  return (
    <article className={cardClass}>
      <header className="card-header">
        <span className={`type-label ${labelClass}`}>
          {typeLabel}
        </span>
        <span className="id-tag"># {article.id}</span>
      </header>
      <h2 className="article-title">{displayTitle}</h2>
      <div className="article-body">
        <ReactMarkdown
          components={{
            // Custom styling for markdown elements inside the body
            h1: ({node, ...props}) => <h3 className="md-h1" {...props} />,
            h2: ({node, ...props}) => <h4 className="md-h2" {...props} />,
            h3: ({node, ...props}) => <h5 className="md-h3" {...props} />,
            a: ({node, ...props}) => <a className="md-link" target="_blank" rel="noopener noreferrer" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="md-quote" {...props} />
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>
      <footer className="card-footer">
        <a href={article.url} target="_blank" rel="noreferrer" className="view-source-btn">
          View Source URL ↗
        </a>
      </footer>
    </article>
  );
}

export default ArticleCard;