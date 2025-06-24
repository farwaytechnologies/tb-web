import React from 'react';
import '../Styles/PagesStyle/Home.css';
import { Link } from 'react-router-dom';
import HomeWhyUs from '../Home/HomeWhyUs';

function Home() {
  return (
    <div className="techborg-home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to TechBorg</h1>
          <p>Learn tech skills online with top instructors and real-world projects.</p>
          <Link to="/courses" className="hero-btn">Browse Courses</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Learn with TechBorg?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Expert Instructors</h3>
            <p>Learn from industry professionals with hands-on experience.</p>
          </div>
          <div className="feature-card">
            <h3>Real Projects</h3>
            <p>Build real-world projects to boost your portfolio and confidence.</p>
          </div>
          <div className="feature-card">
            <h3>Flexible Learning</h3>
            <p>Learn at your own pace, anytime, anywhere.</p>
          </div>
        </div>
      </section>
      <HomeWhyUs/>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to start your tech journey?</h2>
        <Link to="/login" className="cta-btn">Get Started</Link>
      </section>
    </div>
  );
}

export default Home;
