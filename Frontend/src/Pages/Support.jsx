import React from 'react';
import '../Styles/PagesStyle/Support.css';

function Support() {
  return (
    <div className="techborg-support-page">
      <div className="support-hero">
        <h1>How can we help you?</h1>
        <p>Welcome to TechBorg Support. Choose a category or contact us directly.</p>
      </div>

      <div className="support-categories">
        <div className="support-card">
          <h3>Account Issues</h3>
          <p>Having trouble accessing your account or resetting your password?</p>
        </div>
        <div className="support-card">
          <h3>Courses & Content</h3>
          <p>Find help with course enrollment, access, and content-related questions.</p>
        </div>
        <div className="support-card">
          <h3>Payments & Billing</h3>
          <p>Learn about payment methods, refunds, and billing support.</p>
        </div>
        <div className="support-card">
          <h3>Contact Us</h3>
          <p>Still need help? Reach out to our team for personalized assistance.</p>
        </div>
      </div>
    </div>
  );
}

export default Support;
