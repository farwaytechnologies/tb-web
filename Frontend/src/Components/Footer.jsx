import React from 'react';
import '../Styles/ComponentsStyle/Footer.css';
import { FaInstagram, FaGithub, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="techborg-footer">
      <div className="footer-container">
        
        {/* Brand Info */}
        <div className="footer-brand">
          <h3>TechBorg</h3>
          <p>&copy; {new Date().getFullYear()} TechBorg. All rights reserved.</p>
        </div>

        {/* Navigation Grid */}
        <div className="footer-nav-columns">
          <div className="footer-link-group">
            <a href="/">Home</a>
            <a href="/courses">Courses</a>
            <a href="/blog">Blog</a>
            <a href="/innovation">Innovation</a>
          </div>
          <div className="footer-link-group">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/support">Support</a>
          </div>
        </div>

        {/* Social Icons */}
        <div className="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
