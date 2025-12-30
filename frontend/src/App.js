import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleList from './components/ArticleList';
import ComparisonOverlay from './components/ComparisonOverlay';
import './App.css';

function App() {
  const [pairs, setPairs] = useState([]);
  const [selectedPair, setSelectedPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all articles from your Laravel API
    axios.get(`${process.env.REACT_APP_API_URL}/api/articles`)
      .then(res => {
        const all = res.data;
        // Logic to pair Original with its [Updated] version
        const originalArticles = all.filter(a => !a.title.includes('[Updated]'));
        const paired = originalArticles.map(org => ({
          original: org,
          enhanced: all.find(a => a.title === `[Updated] ${org.title}`)
        }));
        setPairs(paired);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Connection Failed", err);
        setError(err.message || "Failed to connect to the API. Make sure Laravel backend is running.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="full-loader">Initializing AI Dashboard...</div>;
  
  if (error) return (
    <div className="error-container">
      <div className="error-message">
        <h2>⚠️ Connection Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">Retry Connection</button>
      </div>
    </div>
  );

  return (
    <div className="modern-dashboard">
      <nav className="top-nav">
        <div className="logo">Article<span>Automation</span></div>
        <div className="status-pill">System Online</div>
      </nav>

      <main className="content-wrapper">
        <header className="hero-header">
          <h1>Content Transformation <span>Engine</span></h1>
          <p>Analyzing the impact of Gemini-driven research on BeyondChats blog archives.</p>
        </header>

        {pairs.length === 0 ? (
          <div className="empty-state">
            <h3>No Articles Found</h3>
            <p>Run the scraper to fetch articles from BeyondChats blog.</p>
          </div>
        ) : (
          <ArticleList pairs={pairs} onSelect={setSelectedPair} />
        )}
      </main>

      {selectedPair && (
        <ComparisonOverlay 
          pair={selectedPair} 
          onClose={() => setSelectedPair(null)} 
        />
      )}
    </div>
  );
}

export default App;