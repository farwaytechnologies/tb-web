import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Home.css';
import { Link } from 'react-router-dom';
import HomeWhyUs from '../Home/HomeWhyUs';

function Home() {
  const [homeContent, setHomeContent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/home')
      .then(res => res.json())
      .then(data => setHomeContent(data))
      .catch(err => console.error("Error fetching home content:", err));
  }, []);

  if (!homeContent) return <div className="loading">Loading...</div>;

  return (
    <div className="techborg-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>{homeContent.heroTitle}</h1>
          <p>{homeContent.heroSubtitle}</p>
          <Link to="/courses" className="hero-btn">Browse Courses</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Learn with TechBorg?</h2>
        <div className="features">
          {homeContent.features?.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <HomeWhyUs />

      {/* Call to Action */}
      <section className="cta-section">
        <h2>{homeContent.ctaText}</h2>
        <Link to={homeContent.ctaLink} className="cta-btn">{homeContent.ctaButtonText}</Link>
      </section>
    </div>
  );
}

export default Home;
