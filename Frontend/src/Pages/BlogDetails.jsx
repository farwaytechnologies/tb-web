import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/PagesStyle/BlogDetails.css';

function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/api/blogs/${id}`)
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
      month: 'short',
      day: 'numeric',
    });

  if (loading) return <div className="blog-details-loading">Loading...</div>;
  if (!post) return <div className="blog-details-error">Blog not found.</div>;

  return (
    <div className="blog-details-wrapper">
      <div className="blog-details-container">
        <div className="blog-details-main-card">
          <img src={post.image} alt={post.title} className="blog-details-banner" />
          <div className="blog-details-meta">
            <span className="blog-details-category">{post.category || 'General'}</span>
            <span className="blog-details-time">{readingTime} min read</span>
          </div>
          <h1 className="blog-details-title">{post.title}</h1>
          <div className="blog-details-author-box">
            <div className="blog-details-author-circle">
              {post.author?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="blog-details-author-name">{post.author || 'Anonymous'}</p>
              <p className="blog-details-date">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <p className="blog-details-content">{post.content}</p>

          {/* Sections */}
          {Array.isArray(post.detailedSections) && post.detailedSections.length > 0 && (
            <div className="blog-details-sections">
              {post.detailedSections.map((section, index) => (
                <div key={index} className="blog-details-section">
                  {section.heading && <h2 className="blog-details-section-title">{section.heading}</h2>}
                  {section.text && <p className="blog-details-section-text">{section.text}</p>}
                  {Array.isArray(section.list) && section.list.length > 0 && (
                    <ul className="blog-details-list">
                      {section.list.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  )}
                  {Array.isArray(section.tips) && section.tips.length > 0 && (
                    <div className="blog-details-tips">
                      <strong>💡 Pro Tips</strong>
                      <ul>
                        {section.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gallery */}
        {Array.isArray(post.images) && post.images.length > 0 && (
          <div className="blog-details-gallery">
            {post.images.slice(0, 3).map((img, i) => (
              <div key={i} className="blog-details-gallery-card">
                <img src={img} alt={`Gallery ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogDetails;
