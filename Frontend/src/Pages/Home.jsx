import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Home.css';
import { Link } from 'react-router-dom';
import HomeWhyUs from '../Home/HomeWhyUs';
import { Helmet } from 'react-helmet';
<Helmet>
  <title>TechBorg E-Learning</title>
  <meta name="description" content="TechBorg E-Learning is an advanced online learning ecosystem powered by AI and smart content delivery.
It offers learners an interactive, personalized, and industry-relevant education experience across technology, science, and innovation domains." />
  <meta name="keywords" content="react, seo, tutorial, java, javascirpt, cpp, python" />
</Helmet>


function Home() {
  const [homeContent, setHomeContent] = useState(null);

  useEffect(() => {
    fetch('https://tb-back-fyvj.onrender.com/api/home')
      .then(res => res.json())
      .then(data => setHomeContent(data))
      .catch(err => console.error("Error fetching home content:", err));
  }, []);

  if (!homeContent) {
    return (
      <div className="loading">
        <div className="loader-spinner"></div>
        <p>Loading amazing content...</p>
      </div>
    );
  }

  return (
    <div className="techborg-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">🚀 Start Your Tech Journey</div>
          <h1 className="hero-title">
            {homeContent.heroTitle}
            <span className="title-accent">.</span>
          </h1>
          <p className="hero-subtitle">{homeContent.heroSubtitle}</p>
          <div className="hero-actions">
            <Link to="/courses" className="hero-btn primary">
              Browse Courses
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/about" className="hero-btn secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-badge">Why Choose Us</span>
          <h2 className="section-title">Why Learn with TechBorg?</h2>
          <p className="section-subtitle">Everything you need to accelerate your tech career</p>
        </div>
        <div className="features-grid">
          {homeContent.features?.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <div className="icon-bg"></div>
                <span className="feature-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-shine"></div>
            </div>
          ))}
        </div>
      </section>

      <HomeWhyUs />

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">{homeContent.ctaText}</h2>
            <p className="cta-subtitle">Join thousands of learners transforming their careers</p>
            <Link to={homeContent.ctaLink} className="cta-btn">
              {homeContent.ctaButtonText}
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="cta-visual">
            <div className="floating-card card-1"></div>
            <div className="floating-card card-2"></div>
            <div className="floating-card card-3"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
