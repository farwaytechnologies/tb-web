import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import "../Styles/PagesStyle/Learn.css";

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
      <div className="learnpage-container">
        <Helmet>
          <title>Loading - TechBorg E-Learning</title>
          <meta name="description" content="TechBorg E-Learning is an advanced online learning ecosystem powered by AI and smart content delivery. It offers learners an interactive, personalized, and industry-relevant education experience across technology, science, and innovation domains." />
          <meta name="keywords" content="react, seo, tutorial, java, javascript, cpp, python" />
        </Helmet>
        <div className="learnpage-loading-spinner">
          <div className="learnpage-spinner"></div>
          <p className="learnpage-loading-text">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learnpage-container">
        <Helmet>
          <title>Error - TechBorg E-Learning</title>
          <meta name="description" content="TechBorg E-Learning is an advanced online learning ecosystem powered by AI and smart content delivery." />
        </Helmet>
        <div className="learnpage-error-message">
          <h2 className="learnpage-error-title">⚠️ Oops!</h2>
          <p className="learnpage-error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="learnpage-container">
      <Helmet>
        <title>TechBorg E-Learning</title>
        <meta name="description" content="TechBorg E-Learning is an advanced online learning ecosystem powered by AI and smart content delivery. It offers learners an interactive, personalized, and industry-relevant education experience across technology, science, and innovation domains." />
        <meta name="keywords" content="react, seo, tutorial, java, javascript, cpp, python" />
      </Helmet>

      <div className="learnpage-header">
        <h1 className="learnpage-title">
          Start Your <span className="learnpage-highlight">Coding Journey</span>
        </h1>
        <p className="learnpage-subtitle">
          Master programming languages with interactive tutorials and real-world examples
        </p>
      </div>

      <div className="learnpage-grid">
        {languages.map((lang, index) => (
          <div
            key={lang._id}
            className="learnpage-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="learnpage-card-image-wrapper">
              <img
                src={lang.image}
                alt={lang.language}
                className="learnpage-card-img"
                loading="lazy"
              />
              <div className="learnpage-card-overlay"></div>
            </div>

            <div className="learnpage-card-content">
              <h2 className="learnpage-card-title">{lang.language}</h2>
              <p className="learnpage-card-description">{lang.shortDescription}</p>

              <Link to={`/learn/${lang._id}`} className="learnpage-btn">
                <span>Start Learning</span>
                <svg
                  className="learnpage-btn-arrow"
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

      {languages.length === 0 && !loading && (
        <div className="learnpage-empty-state">
          <p>No courses available at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default Learn;