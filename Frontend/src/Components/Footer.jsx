import React from 'react';
import '../Styles/ComponentsStyle/Footer.css';

function Footer() {
  return (
    <footer className="techborg-footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} TechBorg. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
