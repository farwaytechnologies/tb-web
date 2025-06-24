import React from 'react';
import '../Styles/HomeStyle/HomeWhyUs.css';

import im1 from '../assets/images/diversity.png';
import im2 from '../assets/images/flexibility.png';
import im3 from '../assets/images/pricing.png';


function HomeWhyUs() {
  return (
    <section className="homewhyus-wrapper">
      <div className="homewhyus-container">
        <div className="homewhyus-header">
          <div className="homewhyus-heading">
            <h1>Why Choose Techborg?</h1>
            <div className="homewhyus-underline"></div>
          </div>
          <p className="homewhyus-subtext">
            Whether you're looking to advance your career or explore a new hobby, find the course that's right for you.
          </p>
        </div>

        <div className="homewhyus-cards">
          <div className="homewhyus-card">
            <img src={im1} alt="Diverse Courses" className="homewhyus-image" />
            <h3 className="homewhyus-tag">VARIETY OF COURSES</h3>
            <h2 className="homewhyus-title">Explore Diverse Topics</h2>
            <p className="homewhyus-desc">
              From technology to arts, learn from experts in various fields.
            </p>
          </div>

          <div className="homewhyus-card">
            <img src={im2} alt="Flexible Schedule" className="homewhyus-image" />
            <h3 className="homewhyus-tag">FLEXIBLE SCHEDULE</h3>
            <h2 className="homewhyus-title">Learn at Your Own Pace</h2>
            <p className="homewhyus-desc">
              Fit learning into your busy schedule. Access courses anytime, anywhere.
            </p>
          </div>

          <div className="homewhyus-card">
            <img src={im3} alt="Affordable Pricing" className="homewhyus-image" />
            <h3 className="homewhyus-tag">AFFORDABLE LEARNING</h3>
            <h2 className="homewhyus-title">Competitive Pricing</h2>
            <p className="homewhyus-desc">
              Gain access to high-quality education without the high costs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeWhyUs;