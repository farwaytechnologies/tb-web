import React, { useEffect, useState } from "react";
import "../Styles/PagesStyle/News.css";
import { Helmet } from 'react-helmet';
<Helmet>
  <title>TechBorg E-Learning</title>
  <meta name="description" content="TechBorg E-Learning is an advanced online learning ecosystem powered by AI and smart content delivery.
It offers learners an interactive, personalized, and industry-relevant education experience across technology, science, and innovation domains." />
  <meta name="keywords" content="react, seo, tutorial, java, javascirpt, cpp, python" />
</Helmet>
function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("https://tb-back-fyvj.onrender.com/api/news");
        if (!response.ok) throw new Error("Failed to fetch news");

        const data = await response.json();
        setNewsList(data); // Show all news, no category filtering
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="news-loading">
        <div className="spinner"></div>
        <p>Loading Newsroom...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-error">
        <div className="error-icon">⚠</div>
        <h2>Unable to Load News</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="news-wrapper">
      <div className="news-container">
        <header className="news-header">
          <div className="header-content">
            <span className="header-label">Stay Updated</span>
            <h1 className="news-title">Newsroom</h1>
            <p className="news-subtitle">Latest updates, stories, and announcements</p>
          </div>
        </header>

        <section className="news-card all-news-section">
          <div className="card-header">
            <h2 className="section-title">All News</h2>
            <span className="item-count">{newsList.length}</span>
          </div>

          <div className="stories-list">
            {newsList.length > 0 ? (
              newsList.map((story, index) => (
                <article key={story._id || index} className="story-item">
                  <div className="story-content">
                    <h3 className="story-title">{story.title}</h3>
                    <time className="story-date">
                      {new Date(story.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    {story.content && <p className="story-excerpt">{story.content}</p>}
                    {story.category && <p className="story-category">{story.category}</p>}
                  </div>

                  <button className="story-link" aria-label="Read story">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14m-7-7l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <p>No news available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default News;
