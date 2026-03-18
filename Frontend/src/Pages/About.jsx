import React, { useEffect, useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import '../Styles/PagesStyle/About.css';
import SEO from '../Components/SEO';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://tb-back-fyvj.onrender.com/api/about');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setAboutData(data);
        setError('');
      } catch (err) {
        console.error('Error fetching About content:', err);
        setError('Failed to load About content. Please try again later.');
        setAboutData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="about-loading-container">
        <div className="about-loading-spinner">
          <Loader className="about-spinner-icon" />
        </div>
        <p className="about-loading-text">Loading...</p>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="about-error-container">
        <AlertCircle className="about-error-icon" />
        <p className="about-error-text">{error || 'Failed to load About content'}</p>
      </div>
    );
  }

  return (
    <div className="about-page">
      <SEO
        title="About Us"
        description="Learn about TechBorg E-Learning — our mission, vision, values, and the team behind India's growing tech education platform."
        url="/about"
        keywords="about TechBorg, e-learning mission, tech education India, online learning platform"
      />
      <div className="about-container">
        {/* Hero Section */}
        <div className="about-hero">
          <h1 className="about-title">
            About <span className="about-highlight">TechBorg</span>
          </h1>
          <div className="about-divider"></div>
        </div>

        {/* Main Content */}
        <div className="about-content">
          <section className="about-section">
            <p className="about-description">{aboutData.description}</p>
          </section>

          {/* Additional Info Sections */}
          {aboutData.mission && (
            <section className="about-section">
              <h2 className="about-section-title">Our Mission</h2>
              <p className="about-section-text">{aboutData.mission}</p>
            </section>
          )}

          {aboutData.vision && (
            <section className="about-section">
              <h2 className="about-section-title">Our Vision</h2>
              <p className="about-section-text">{aboutData.vision}</p>
            </section>
          )}

          {aboutData.values && Array.isArray(aboutData.values) && (
            <section className="about-section">
              <h2 className="about-section-title">Our Values</h2>
              <div className="about-values-grid">
                {aboutData.values.map((value, index) => (
                  <div key={index} className="about-value-card">
                    <h3 className="about-value-title">{value.name}</h3>
                    <p className="about-value-text">{value.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {aboutData.team && Array.isArray(aboutData.team) && (
            <section className="about-section">
              <h2 className="about-section-title">Our Team</h2>
              <div className="about-team-grid">
                {aboutData.team.map((member, index) => (
                  <div key={index} className="about-team-card">
                    <div className="about-team-avatar">{member.name.charAt(0)}</div>
                    <h3 className="about-team-name">{member.name}</h3>
                    <p className="about-team-role">{member.role}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default About;