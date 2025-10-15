import React, { useEffect, useState } from "react";
import "../Styles/PagesStyle/News.css";

function News() {
  const [latestStories, setLatestStories] = useState([]);
  const [pressReleases, setPressReleases] = useState([]);
  const [featuredStory, setFeaturedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/news");
        if (!response.ok) throw new Error("Failed to fetch news");

        const data = await response.json();

        const latest = data.filter((item) => item.category === "latest");
        const press = data.filter((item) => item.category === "press");
        const featured = data.find((item) => item.category === "featured");

        setLatestStories(latest);
        setPressReleases(press);
        setFeaturedStory(featured);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredPressReleases = pressReleases.filter((press) =>
    press.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <p className="news-subtitle">
              Latest updates, stories, and announcements
            </p>
          </div>
        </header>

        <div className="news-grid">
          {/* Latest Stories Section */}
          <section className="news-card latest-section">
            <div className="card-header">
              <h2 className="section-title">Latest Stories</h2>
              <span className="item-count">{latestStories.length}</span>
            </div>
            <div className="stories-list">
              {latestStories.length > 0 ? (
                latestStories.map((story, index) => (
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
                      {story.content && (
                        <p className="story-excerpt">{story.content}</p>
                      )}
                    </div>
                    <button className="story-link" aria-label="Read story">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <p>No latest stories available at the moment.</p>
                </div>
              )}
            </div>
          </section>

          {/* Featured Story Section */}
          <section className="news-card featured-section">
            {featuredStory ? (
              <>
                <div className="featured-badge">Featured</div>
                <div className="featured-image-wrapper">
                  <img
                    src={featuredStory.image || "https://images.unsplash.com/photo-1581091870622-1e7e5f59b74f"}
                    alt={featuredStory.title}
                    className="featured-image"
                  />
                  <div className="image-overlay"></div>
                </div>
                <div className="featured-content">
                  <h2 className="featured-title">{featuredStory.title}</h2>
                  <p className="featured-description">
                    {featuredStory.content}
                  </p>
                  <button className="featured-btn">
                    Read Full Story
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>No featured story available at the moment.</p>
              </div>
            )}
          </section>

          {/* Press Releases Section */}
          <section className="news-card press-section">
            <div className="card-header">
              <h2 className="section-title">Press Releases</h2>
              <span className="item-count">{pressReleases.length}</span>
            </div>
            <div className="stories-list">
              {filteredPressReleases.length > 0 ? (
                filteredPressReleases.map((press, index) => (
                  <article key={press._id || index} className="story-item">
                    <div className="story-content">
                      <h3 className="story-title">{press.title}</h3>
                      <time className="story-date">
                        {new Date(press.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                      {press.content && (
                        <p className="story-excerpt">{press.content}</p>
                      )}
                    </div>
                    <button className="story-link" aria-label="Read press release">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <p>No press releases found.</p>
                </div>
              )}
            </div>

            <div className="media-kit">
              <h3 className="media-kit-title">Media Kit</h3>
              <div className="search-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search press releases..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default News;