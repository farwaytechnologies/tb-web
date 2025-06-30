import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/PagesStyle/Blog.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/blogs')
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

  return (
    <div className="techborg-blog-container">
      <h1 className="techborg-blog-title">Our Latest Articles</h1>
      <div className="techborg-blog-grid">
        {loading ? (
          <p className="techborg-blog-loading">Loading blogs...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Link to={`/blog/${post._id}`} key={post._id} className="techborg-blog-card">
              <img src={post.image} alt={post.title} className="techborg-blog-card-img" />
              <div className="techborg-blog-card-body">
                <h2 className="techborg-blog-card-title">{post.title}</h2>
                <p className="techborg-blog-card-description">
                  {post.description.length > 100 ? post.description.slice(0, 100) + '...' : post.description}
                </p>
                <span className="techborg-blog-card-date">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))
        ) : (
          <p className="techborg-blog-loading">No blog posts found.</p>
        )}
      </div>
    </div>
  );
}

export default Blog;
