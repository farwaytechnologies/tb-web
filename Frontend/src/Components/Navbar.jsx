import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md'; // ✅ Import login icon
import '../Styles/ComponentsStyle/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar-wrapper">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">TechBorg</Link>

        {/* Left-side navigation */}
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/innovation">Innovation</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li>  <a
            href="https://github.com/techborg" // 🔁 Replace with your repo
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-github-icon"
            title="GitHub"
            
          >
            <FaGithub  size={16} />
          </a>
          </li>
        </ul>

        {/* Right-side buttons */}
        <div className="navbar-right">
       
        

            <Link to="/login" className="navbar-login-btn">
            <MdAccountCircle size={18} style={{ marginRight: '6px' }} />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;