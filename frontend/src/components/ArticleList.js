import React from 'react';

function ArticleList({ pairs, onSelect }) {
  return (
    <div className="article-grid">
      {pairs.map((pair) => (
        <div key={pair.original.id} className="summary-card" onClick={() => onSelect(pair)}>
          <div className="card-badge">Topic #{pair.original.id}</div>
          <h3>{pair.original.title}</h3>
          <p className="excerpt">
            {pair.original.content.substring(0, 100)}...
          </p>
          <div className="card-footer-info">
             <span className="status-tag">Ready for Comparison</span>
             <button className="compare-btn">View Side-by-Side</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArticleList;