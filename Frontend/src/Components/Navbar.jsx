import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import '../Styles/ComponentsStyle/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // ✅ Listen for custom login event
    const handleLogin = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('userLoggedIn', handleLogin);

    return () => {
      window.removeEventListener('userLoggedIn', handleLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">TechBorg</Link>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/innovation">Innovation</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li>
            <a
              href="https://github.com/techborg"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-github-icon"
              title="GitHub"
            >
              <FaGithub size={16} />
            </a>
          </li>
        </ul>

        {/* Right-side: login or user info */}
        <div className="navbar-right">
          {user ? (
            <div className="navbar-user-info">
              <div className="profile-pin">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="navbar-username">{user.name}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn">
              <MdAccountCircle size={18} style={{ marginRight: '6px' }} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
