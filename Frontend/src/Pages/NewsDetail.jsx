import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/PagesStyle/NewsDetails.css";
import { Helmet } from 'react-helmet';

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        // Fetch specific news item
        const response = await fetch(`https://tb-back-fyvj.onrender.com/api/news/${id}`);
        if (!response.ok) throw new Error("Failed to fetch news details");
        
        const data = await response.json();
        setNewsItem(data);

        // Fetch all news for related articles
        const allNewsResponse = await fetch("https://tb-back-fyvj.onrender.com/api/news");
        if (allNewsResponse.ok) {
          const allNews = await allNewsResponse.json();
          // Filter out current article and get 3 related ones
          const related = allNews
            .filter(item => item._id !== id)
            .slice(0, 3);
          setRelatedNews(related);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRelatedClick = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  if (loading) {
    return (
      <div className="news-detail-loading">
        <Helmet>
          <title>Loading - TechBorg E-Learning</title>
        </Helmet>
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring-animated"></div>
        </div>
        <p className="loading-text">Loading article...</p>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="news-detail-error">
        <Helmet>
          <title>Error - TechBorg E-Learning</title>
        </Helmet>
        <div className="error-icon-wrapper">
          <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="error-title">Article Not Found</h2>
        <p className="error-message">{error || "The article you're looking for doesn't exist."}</p>
        <button onClick={handleBack} className="error-back-btn">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="news-detail-wrapper">
      <Helmet>
        <title>{newsItem.title} - TechBorg E-Learning</title>
        <meta name="description" content={newsItem.content || "Read the latest news from TechBorg E-Learning"} />
      </Helmet>

      {/* Background decorations */}
      <div className="background-decorations">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="news-detail-container">
        {/* Back Button */}
        <button onClick={handleBack} className="back-button">
          <svg className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to News</span>
        </button>

        {/* Main Article */}
        <article className="article-card">
          {/* Article Header */}
          <header className="article-header">
            <div className="article-meta">
              {newsItem.category && (
                <span className="article-category">{newsItem.category}</span>
              )}
              <time className="article-date">
                <svg className="date-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(newsItem.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>

            <h1 className="article-title">{newsItem.title}</h1>
          </header>

          {/* Article Content */}
          <div className="article-content">
            <p className="article-text">{newsItem.content}</p>
          </div>

          {/* Article Footer */}
          <footer className="article-footer">
            <div className="share-section">
              <span className="share-label">Share this article:</span>
              <div className="share-buttons">
                <button className="share-btn" aria-label="Share on Twitter">
                  <svg className="share-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </button>
                <button className="share-btn" aria-label="Share on Facebook">
                  <svg className="share-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </button>
                <button className="share-btn" aria-label="Share on LinkedIn">
                  <svg className="share-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </button>
                <button className="share-btn" aria-label="Copy link">
                  <svg className="share-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </article>

        {/* Related Articles */}
        {relatedNews.length > 0 && (
          <section className="related-section">
            <h2 className="related-title">Related Articles</h2>
            <div className="related-grid">
              {relatedNews.map((item) => (
                <article 
                  key={item._id} 
                  className="related-card"
                  onClick={() => handleRelatedClick(item._id)}
                >
                  <div className="related-content">
                    {item.category && (
                      <span className="related-category">{item.category}</span>
                    )}
                    <h3 className="related-card-title">{item.title}</h3>
                    <time className="related-date">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <button className="related-link" aria-label="Read article">
                    <svg className="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default NewsDetail;