import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/PagesStyle/Learn.css";
import { Helmet } from 'react-helmet';
<Helmet>
  <title>TechBorg E-Learning</title>
  <meta name="description" content="TechBorg E-Learning is an advanced online learning ecosystem powered by AI and smart content delivery.
It offers learners an interactive, personalized, and industry-relevant education experience across technology, science, and innovation domains." />
  <meta name="keywords" content="react, seo, tutorial, java, javascirpt, cpp, python" />
</Helmet>
const Learn = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("https://tb-back-fyvj.onrender.com/api/learn");
        if (!response.ok) throw new Error("Failed to fetch languages");
        const data = await response.json();
        setLanguages(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  if (loading) {
    return (
      <div className="learn-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learn-container">
        <div className="error-message">
          <h2>⚠️ Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="learn-container">
      <div className="learn-header">
        <h1 className="learn-title">
          Start Your <span className="highlight">Coding Journey</span>
        </h1>
        <p className="learn-subtitle">
          Master programming languages with interactive tutorials and real-world examples
        </p>
      </div>

      <div className="learn-grid">
        {languages.map((lang, index) => (
          <div
            key={lang._id}
            className="learn-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-image-wrapper">
              <img
                src={lang.image}
                alt={lang.language}
                className="learn-card-img"
                loading="lazy"
              />
              <div className="card-overlay"></div>
            </div>

            <div className="card-content">
              <h2 className="card-title">{lang.language}</h2>
              <p className="card-description">{lang.shortDescription}</p>

              <Link to={`/learn/${lang._id}`} className="learn-btn">
                <span>Start Learning</span>
                <svg
                  className="btn-arrow"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {languages.length === 0 && (
        <div className="empty-state">
          <p>No courses available at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default Learn;
