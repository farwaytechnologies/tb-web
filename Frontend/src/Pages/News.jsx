import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/PagesStyle/News.css";
import { Helmet } from 'react-helmet';

function News() {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("https://tb-back-fyvj.onrender.com/api/news");
        if (!response.ok) throw new Error("Failed to fetch news");

        const data = await response.json();
        setNewsList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  if (loading) {
    return (
      <div className="nws-loading">
        <Helmet>
          <title>Loading - TechBorg E-Learning</title>
        </Helmet>
        <div className="nws-loading-spinner">
          <div className="nws-spinner-ring"></div>
          <div className="nws-spinner-ring-animated"></div>
        </div>
        <p className="nws-loading-text">Loading Newsroom...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nws-error">
        <Helmet>
          <title>Error - TechBorg E-Learning</title>
        </Helmet>
        <div className="nws-error-icon-wrapper">
          <svg className="nws-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="nws-error-title">Unable to Load News</h2>
        <p className="nws-error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="nws-wrapper">
      <Helmet>
        <title>Stay Updated in Tech World - TechBorg E-Learning</title>
        <meta 
          name="description" 
          content="Stay informed with the latest news, trends, and stories from the tech industry." 
        />
        <meta 
          name="keywords" 
          content="tech news, trends, technology updates, innovation, software, AI, development" 
        />
      </Helmet>

      {/* Animated background blobs */}
      <div className="nws-background-decorations">
        <div className="nws-blob nws-blob-1"></div>
        <div className="nws-blob nws-blob-2"></div>
      </div>

      <div className="nws-container">
        {/* Header Section */}
        <header className="nws-header">
          <h1 className="nws-title">Stay Updated in Tech World</h1>
          <p className="nws-subtitle">
            Stay informed with the latest news, trends, and stories from the tech industry.
          </p>
        </header>

        {/* Main News Card */}
        <section className="nws-card">
          {/* Card Header */}
          <div className="nws-card-header">
            <div className="nws-header-left">
              <div className="nws-header-icon">
                <svg className="nws-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="nws-section-title">All News</h2>
            </div>
            {/* Removed story count section */}
          </div>

          {/* Stories List */}
          <div className="nws-stories-list">
            {newsList.length > 0 ? (
              newsList.map((story, index) => (
                <article 
                  key={story._id || index} 
                  className="nws-story-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleNewsClick(story._id)}
                >
                  <div className="nws-story-hover-effect"></div>
                  
                  <div className="nws-story-content">
                    {/* Category & Date Row */}
                    <div className="nws-story-meta">
                      {story.category && (
                        <span className="nws-story-category">{story.category}</span>
                      )}
                      <time className="nws-story-date">
                        <svg className="nws-date-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(story.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    {/* Title */}
                    <h3 className="nws-story-title">{story.title}</h3>

                    {/* Excerpt */}
                    {story.content && (
                      <p className="nws-story-excerpt">{story.content}</p>
                    )}
                  </div>

                  {/* Read More Button */}
                  <button className="nws-story-link" aria-label="Read story">
                    <svg className="nws-arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </article>
              ))
            ) : (
              <div className="nws-empty-state">
                <div className="nws-empty-icon-wrapper">
                  <svg className="nws-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="nws-empty-title">No news available at the moment.</p>
                <p className="nws-empty-subtitle">Check back soon for updates!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default News;