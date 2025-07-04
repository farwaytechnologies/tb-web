import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/PagesStyle/Innovation.css';

function Innovation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch backend API instead of public JSON
  useEffect(() => {
    fetch('http://localhost:8000/api/innovations')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch innovation data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="innovation-wrapper">
      <div className="innovation-header">
        <h1 className="innovation-title">Our Innovation</h1>
        <p className="innovation-subtext">
          Discover the future with emerging technologies.
        </p>
      </div>

      {loading ? (
        <p className="innovation-loading">Loading innovations...</p>
      ) : items.length === 0 ? (
        <p className="innovation-loading">No innovations found.</p>
      ) : (
        <div className="innovation-grid">
          {items.map((item) => (
            <div className="innovation-card" key={item._id}>
              <img
                src={item.image}
                alt={item.title}
                className="innovation-image"
              />
              <h2 className="innovation-card-title">{item.title}</h2>
              <div className="innovation-card-footer">
                <Link to={`/innovation/${item._id}`} className="innovation-link">
                  Learn More
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="innovation-icon"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Innovation;
