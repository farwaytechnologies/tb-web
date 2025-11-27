import React from 'react';
import { FaInstagram, FaGithub, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import '../Styles/ComponentsStyle/Footer.css';
function Footer() {
  return (
    <footer className="techborg-footer">
      <div className="techborg-footer__container">
        
        {/* Main Footer Content */}
        <div className="techborg-footer__content">
          
          {/* Brand Section */}
          <div className="techborg-footer__brand">
            <h3 className="techborg-footer__brand-title">TechBorg</h3>
            <p className="techborg-footer__brand-tagline">
              Empowering innovation through technology
            </p>
            <div className="techborg-footer__social">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="techborg-footer__social-link"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="techborg-footer__social-link"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="techborg-footer__social-link"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="techborg-footer__social-link"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="techborg-footer__nav">
            <div className="techborg-footer__nav-column">
              <h4 className="techborg-footer__nav-title">Platform</h4>
              <a href="/" className="techborg-footer__nav-link">Home</a>
              <a href="/courses" className="techborg-footer__nav-link">Courses</a>
              <a href="/blog" className="techborg-footer__nav-link">Blog</a>
              <a href="/innovation" className="techborg-footer__nav-link">Innovation</a>
            </div>
            
            <div className="techborg-footer__nav-column">
              <h4 className="techborg-footer__nav-title">Company</h4>
              <a href="/about" className="techborg-footer__nav-link">About Us</a>
              <a href="/contact" className="techborg-footer__nav-link">Contact</a>
              <a href="/support" className="techborg-footer__nav-link">Support</a>
              <a href="/job-alerts" className="techborg-footer__nav-link">Careers</a>
            </div>
            
            
            <div className="techborg-footer__nav-column">
              <h4 className="techborg-footer__nav-title">Legal</h4>
              <a href="/privacy" className="techborg-footer__nav-link">Privacy Policy</a>
              <a href="/terms" className="techborg-footer__nav-link">Terms of Service</a>
              <a href="/cookies" className="techborg-footer__nav-link">Cookie Policy</a>
              <a href="/faq" className="techborg-footer__nav-link">FAQ</a>
              
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="techborg-footer__bottom">
          <p className="techborg-footer__copyright">
            &copy; {new Date().getFullYear()} TechBorg. All rights reserved.
          </p>
          <div className="techborg-footer__bottom-links">
            <a href="/sitemap" className="techborg-footer__bottom-link">Sitemap</a>
            <span className="techborg-footer__separator">•</span>
            <a href="/accessibility" className="techborg-footer__bottom-link">Accessibility</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;