import React from 'react';
import ReactMarkdown from 'react-markdown';

function ComparisonOverlay({ pair, onClose }) {
  return (
    <div className="overlay-backdrop">
      <div className="split-view-container">
        <div className="split-view-header">
          <h2>Comparing: {pair.original.title}</h2>
          <button className="close-btn" onClick={onClose}>✕ Close</button>
        </div>
        
        <div className="split-view-body">
          <div className="split-panel left-panel">
            <div className="panel-label">📝 Original Scrape</div>
            <div className="scroll-content">
              {pair.original.content}
            </div>
          </div>

          <div className="split-panel right-panel">
            <div className="panel-label enhanced">✨ AI Researched & Synthesized</div>
            <div className="scroll-content">
              <ReactMarkdown>{pair.enhanced?.content || "No AI version found."}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonOverlay;