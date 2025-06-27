import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/BlogPosts.json')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error('Failed to load blog posts:', err));
  }, []);

  return (
    <div className="techborg-blog-page">
      <h1 className="techborg-blog-title">Latest Blog Posts</h1>
      <div className="techborg-blog-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="techborg-blog-card" key={post.id}>
              <img src={post.image} alt={post.title} className="techborg-blog-image" />
              <div className="techborg-blog-content">
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <p className="techborg-blog-date">{post.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="techborg-blog-loading">Loading blog posts...</p>
        )}
      </div>
    </div>
  );
}

export default Blog;
