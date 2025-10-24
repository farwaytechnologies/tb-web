import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../Styles/PagesStyle/LearnDetails.css";
import { Helmet } from 'react-helmet';
<Helmet>
  <title>TechBorg E-Learning</title>
  <meta name="description" content="TechBorg E-Learning is an advanced online learning ecosystem powered by AI and smart content delivery.
It offers learners an interactive, personalized, and industry-relevant education experience across technology, science, and innovation domains." />
  <meta name="keywords" content="react, seo, tutorial, java, javascirpt, cpp, python" />
</Helmet>
const LearnDetails = () => {
  const { id } = useParams();
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    const fetchLanguageDetails = async () => {
      try {
        const response = await fetch(`https://tb-back-fyvj.onrender.com/api/learn/${id}`);
        if (!response.ok) throw new Error("Failed to fetch language details");
        const data = await response.json();
        setLanguage(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguageDetails();
  }, [id]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="details-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-container">
        <div className="error-state">
          <h2>⚠️ Error Loading Course</h2>
          <p>{error}</p>
          <Link to="/learn" className="back-link">
            ← Return to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!language) {
    return (
      <div className="details-container">
        <div className="error-state">
          <h2>Course Not Found</h2>
          <Link to="/learn" className="back-link">
            ← Return to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      {/* Header Section */}
      <header className="details-header">
        <Link to="/learn" className="back-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back to Courses</span>
        </Link>

        <div className="header-content">
          <h1 className="details-title">{language.language}</h1>
          <div className="header-meta">
            <span className="module-count">
              {language.modules.length} Module{language.modules.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((activeModule + 1) / language.modules.length) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          Module {activeModule + 1} of {language.modules.length}
        </p>
      </div>

      {/* Module Navigation */}
      <div className="module-nav">
        {language.modules.map((mod, index) => (
          <button
            key={index}
            className={`module-nav-btn ${activeModule === index ? 'active' : ''}`}
            onClick={() => setActiveModule(index)}
          >
            <span className="module-number">{index + 1}</span>
            <span className="module-nav-title">{mod.title}</span>
          </button>
        ))}
      </div>

      {/* Module Content */}
      <div className="modules-content">
        {language.modules.map((mod, index) => (
          <div
            key={index}
            className={`module-card ${activeModule === index ? 'active' : ''}`}
            style={{ display: activeModule === index ? 'block' : 'none' }}
          >
            <div className="module-header">
              <div className="module-badge">Module {index + 1}</div>
              <h2 className="module-title">{mod.title}</h2>
            </div>

            <div className="module-body">
              <p className="module-description">{mod.description}</p>

              {mod.image && (
                <div className="module-image-wrapper">
                  <img
                    src={mod.image}
                    alt={mod.title}
                    className="module-image"
                    loading="lazy"
                  />
                </div>
              )}

              {mod.codeExample && (
                <div className="code-block-wrapper">
                  <div className="code-header">
                    <span className="code-label">Code Example</span>
                    <button
                      className="copy-btn"
                      onClick={() => copyCode(mod.codeExample)}
                      title="Copy code"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                  <pre className="code-block"><code>{mod.codeExample}</code></pre>
                </div>
              )}

              {mod.content && (
                <div className="module-content">
                  <p>{mod.content}</p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="module-footer">
              {activeModule > 0 && (
                <button
                  className="nav-btn prev-btn"
                  onClick={() => setActiveModule(activeModule - 1)}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M12.5 15L7.5 10L12.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Previous
                </button>
              )}

              {activeModule < language.modules.length - 1 && (
                <button
                  className="nav-btn next-btn"
                  onClick={() => setActiveModule(activeModule + 1)}
                >
                  Next
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnDetails;
