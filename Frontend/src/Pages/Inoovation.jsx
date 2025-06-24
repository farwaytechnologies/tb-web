import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/PagesStyle/Innovation.css';

function Innovation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dummy data from public folder
  useEffect(() => {
    fetch('/innovation.json')
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
        <p style={{ textAlign: 'center', color: '#fff' }}>Loading innovations...</p>
      ) : (
        <div className="innovation-grid">
          {items.map((item) => (
            <div className="innovation-card" key={item.id}>
              <img
                src={item.image}
                alt={item.title}
                className="innovation-image"
              />
              <h2 className="innovation-card-title">{item.title}</h2>
              <div className="innovation-card-footer">
                <Link to={item.link} className="innovation-link">
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
