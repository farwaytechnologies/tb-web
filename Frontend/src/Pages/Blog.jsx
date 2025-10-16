import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/PagesStyle/Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('https://tb-back-fyvj.onrender.com/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blog posts:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['all', ...new Set(posts.map(post => post.category).filter(Boolean))];

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <div className="blog-hero-content">
          <span className="blog-hero-badge">Our Blog</span>
          <h1 className="blog-hero-title">
            Insights & <span className="gradient-text">Innovation</span>
          </h1>
          <p className="blog-hero-subtitle">
            Explore the latest trends, tutorials, and insights from our tech experts
          </p>
        </div>
        <div className="blog-hero-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </div>

      <div className="blog-container">
        {posts.length > 0 && (
          <div className="blog-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${filter === category ? 'active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        <div className="blog-grid">
          {loading ? (
            <div className="blog-loading">
              <div className="loading-spinner"></div>
              <p>Loading amazing content...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <Link 
                to={`/blog/${post._id}`} 
                key={post._id} 
                className="blog-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="blog-card-image-wrapper">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="blog-card-image" 
                  />
                  {post.category && (
                    <span className="blog-card-category">{post.category}</span>
                  )}
                  <div className="blog-card-overlay">
                    <span className="read-more-btn">Read Article →</span>
                  </div>
                </div>
                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span className="blog-card-date">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {post.author && (
                      <>
                        <span className="meta-divider">•</span>
                        <span className="blog-card-author">{post.author}</span>
                      </>
                    )}
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-description">
                    {post.description.length > 120 
                      ? post.description.slice(0, 120) + '...' 
                      : post.description}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="blog-empty">
              <div className="empty-icon">📝</div>
              <h3>No articles found</h3>
              <p>Check back soon for new content!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blog;