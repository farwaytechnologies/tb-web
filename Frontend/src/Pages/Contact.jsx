// Contact.jsx
import React from 'react';
import '../Styles/PagesStyle/Contact.css';

function Contact() {
  return (
    <div className="techborg-contact-page">
      <h1 className="techborg-contact-title">Contact Us</h1>
      <form className="techborg-contact-form">
        <input type="text" placeholder="Your Name" className="techborg-input" required />
        <input type="email" placeholder="Your Email" className="techborg-input" required />
        <textarea placeholder="Your Message" className="techborg-textarea" required></textarea>
        <button type="submit" className="techborg-submit-btn">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;