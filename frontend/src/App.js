import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to your local Laravel CRUD API [cite: 24]
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/articles');
        setArticles(response.data);
      } catch (error) {
        console.error("API Connection Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <div className="loader">✨ Initializing Phase 3 Dashboard...</div>;

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="badge-main">BEYONDCHATS ASSIGNMENT</div>
        <h1>Article Automation System</h1>
        <p>Comparison View: Original Scrapes vs. AI-Enhanced Articles </p>
      </header>

      <main className="grid">
        {articles.map((article) => (
          <article 
            key={article.id} 
            className={article.title.includes('[Updated]') ? 'card enhanced' : 'card original'}
          >
            <header className="card-header">
              <span className="type-label">
                {article.title.includes('[Updated]') ? '✨ AI ENHANCED' : '📝 ORIGINAL'}
              </span>
              <span className="id-tag">ID: {article.id}</span>
            </header>
            
            <h2 className="article-title">{article.title.replace('[Updated] ', '')}</h2>
            
            <div className="article-body">
              {/* ReactMarkdown renders headers and lists from the AI synthesis [cite: 20] */}
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            <footer className="card-footer">
              <a href={article.url} target="_blank" rel="noreferrer" className="source-link">
                View Source URL ↗
              </a>
            </footer>
          </article>
        ))}
      </main>
    </div>
  );
}

export default App;