import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/PagesStyle/BlogDetails.css';

function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/BlogPosts.json')
      .then((res) => res.json())
      .then((data) => {
        const selected = data.find((item) => item.id === id);
        if (!selected) return navigate('/blog');
        setPost(selected);
      })
      .catch(() => navigate('/blog'));
  }, [id, navigate]);

  if (!post) {
    return <div className="techborg-blog-details-loading">Loading...</div>;
  }

  return (
    <div className="techborg-blog-details-page">
      <div className="techborg-blog-details-container">
        <img src={post.image} alt={post.title} className="techborg-blog-details-image" />
        <h1 className="techborg-blog-details-title">{post.title}</h1>
        <p className="techborg-blog-details-date">Published on {post.date}</p>
        <div className="techborg-blog-details-content">
          <p>{post.description}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu facilisis nunc. Suspendisse potenti. Aliquam erat volutpat. Integer sodales convallis orci, et sagittis lacus porta non. Nulla facilisi. Sed gravida bibendum mi, eget facilisis elit efficitur vel.</p>
          <p>Fusce fermentum purus at massa volutpat, at convallis libero elementum. Etiam nec turpis non urna fermentum bibendum ut sed augue. Integer quis orci metus. Suspendisse sed mauris iaculis, vehicula ipsum vel, feugiat velit.</p>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
