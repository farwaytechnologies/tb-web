import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/PagesStyle/BlogDetails.css';

function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`https://tb-back-fyvj.onrender.com/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        const wordCount = data.content ? data.content.split(' ').length : 0;
        setReadingTime(Math.ceil(wordCount / 200));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-error">
        <div className="error-icon">😕</div>
        <h2>Article Not Found</h2>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="back-to-blog-btn">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <Link to="/blog" className="back-button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Articles
      </Link>

      <article className="blog-detail-container">
        <header className="blog-detail-header">
          <div className="blog-detail-meta-top">
            {post.category && (
              <span className="blog-detail-category">{post.category}</span>
            )}
            <span className="blog-detail-reading-time">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {readingTime} min read
            </span>
          </div>

          <h1 className="blog-detail-title">{post.title}</h1>

          <div className="blog-detail-author-section">
            <div className="author-avatar">
              {post.author?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="author-info">
              <p className="author-name">{post.author || 'Anonymous'}</p>
              <div className="author-meta">
                <span className="publish-date">{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="blog-detail-featured-image">
          <img src={post.image} alt={post.title} />
        </div>

        <div className="blog-detail-content-wrapper">
          <div className="blog-detail-content">
            <div className="content-intro">
              {post.description && <p className="lead-text">{post.description}</p>}
              {post.content && <p className="main-content">{post.content}</p>}
            </div>

            {Array.isArray(post.detailedSections) && post.detailedSections.length > 0 && (
              <div className="detailed-sections">
                {post.detailedSections.map((section, index) => (
                  <section key={index} className="content-section">
                    {section.heading && (
                      <h2 className="section-heading">{section.heading}</h2>
                    )}
                    
                    {section.text && (
                      <p className="section-text">{section.text}</p>
                    )}

                    {Array.isArray(section.list) && section.list.length > 0 && (
                      <ul className="section-list">
                        {section.list.map((item, i) => (
                          <li key={i}>
                            <svg className="list-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.1"/>
                              <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {Array.isArray(section.tips) && section.tips.length > 0 && (
                      <div className="tips-container">
                        <div className="tips-header">
                          <span className="tips-icon">💡</span>
                          <strong>Pro Tips</strong>
                        </div>
                        <ul className="tips-list">
                          {section.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}

            {Array.isArray(post.images) && post.images.length > 0 && (
              <div className="content-gallery">
                <h3 className="gallery-title">Gallery</h3>
                <div className="gallery-grid">
                  {post.images.map((img, i) => (
                    <div key={i} className="gallery-item">
                      <img src={img} alt={`Gallery ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="blog-detail-sidebar">
            <div className="sidebar-card share-card">
              <h4>Share this article</h4>
              <div className="share-buttons">
                <button className="share-btn twitter" aria-label="Share on Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                </button>
                <button className="share-btn linkedin" aria-label="Share on LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </button>
                <button className="share-btn facebook" aria-label="Share on Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </button>
                <button className="share-btn link" aria-label="Copy link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                  </svg>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </article>

      <div className="blog-detail-footer">
        <Link to="/blog" className="footer-cta">
          <span>Explore More Articles</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default BlogDetails;