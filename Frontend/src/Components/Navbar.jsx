import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import '../Styles/ComponentsStyle/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleLogin = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('userLoggedIn', handleLogin);
    return () => {
      window.removeEventListener('userLoggedIn', handleLogin);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">TechBorg</Link>

        {/* Dashboard Link */}
        {user && (
          <Link
            to={
              user.role === 'admin'
                ? '/admin/dashboard'
                : user.role === 'tutor'
                ? '/tutor/dashboard'
                : '/user/dashboard'
            }
            className="navbar-dashboard-link"
          >
            Learning Platform
          </Link>
        )}

        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/innovation">Innovation</Link></li>
           <li><Link to="/blog">Blog</Link></li>
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

        <div className="navbar-right">
          {user ? (
            <div className="navbar-user-info" ref={dropdownRef}>
              <div className="nav-user-dropdown" onClick={toggleDropdown}>
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt="profile"
                  className="profile-img"
                />
                <span className="navbar-username">{user.name}</span>
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    to={
                      user.role === 'admin'
                        ? '/admin-profile'
                        : user.role === 'tutor'
                        ? '/tutor-profile'
                        : '/user-profile'
                    }
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link to="/certificates" onClick={() => setDropdownOpen(false)}>Certificates</Link>
                  <Link to="/exam" onClick={() => setDropdownOpen(false)}>Exam</Link>
                  <Link to="/invoices" onClick={() => setDropdownOpen(false)}>Invoices</Link>
                  <Link to="/settings" onClick={() => setDropdownOpen(false)}>Settings</Link>
                  <button onClick={handleLogout} className="logout-link">Logout</button>
                </div>
              )}
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
