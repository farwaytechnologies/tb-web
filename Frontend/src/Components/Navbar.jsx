import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/ComponentsStyle/Navbar.css';

function Navbar() {
  return (
    <nav className="techborg-navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">TechBorg</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
