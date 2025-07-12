import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaBell } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';
import '../Styles/ComponentsStyle/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const userDropdownRef = useRef();
  const examDropdownRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleLogin = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('userLoggedIn', handleLogin);
    return () => window.removeEventListener('userLoggedIn', handleLogin);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        examDropdownRef.current &&
        !examDropdownRef.current.contains(event.target)
      ) {
        setExamDropdownOpen(false);
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

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleExamDropdown = () => setExamDropdownOpen(!examDropdownOpen);
  const closeMobileMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setExamDropdownOpen(false);
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>TechBorg</Link>

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
            onClick={closeMobileMenu}
          >
            Learning Platform
          </Link>
        )}

        <div className="navbar-right-wrapper">
          <div className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>

          <ul className={`navbar-links ${menuOpen ? 'navbar-links-active' : ''}`}>
            <li><Link to="/" onClick={closeMobileMenu} className="navbar-link">Home</Link></li>
            <li><Link to="/courses" onClick={closeMobileMenu} className="navbar-link">Courses</Link></li>

            <li className="navbar-dropdown" ref={examDropdownRef}>
              <div className="navbar-dropdown-toggle" onClick={toggleExamDropdown}>
                Exam Guide
              </div>
              {examDropdownOpen && (
                <ul className="navbar-submenu">
                  <li><Link to="/exam-guide/polytechnic" className="navbar-link" onClick={closeMobileMenu}>Polytechnic</Link></li>
                  <li><Link to="/exam-guide/engineering" className="navbar-link" onClick={closeMobileMenu}>Engineering</Link></li>
                  <li><Link to="/exam-guide/degree" className="navbar-link" onClick={closeMobileMenu}>Degree</Link></li>
                  <li><Link to="/exam-guide/pg" className="navbar-link" onClick={closeMobileMenu}>PG</Link></li>
                </ul>
              )}
            </li>

            <li><Link to="/innovation" onClick={closeMobileMenu} className="navbar-link">Innovation</Link></li>
            <li><Link to="/blog" onClick={closeMobileMenu} className="navbar-link">Blog</Link></li>
            <li><Link to="/about" onClick={closeMobileMenu} className="navbar-link">About</Link></li>
            <li><Link to="/contact" onClick={closeMobileMenu} className="navbar-link">Contact</Link></li>

            <li className="navbar-notification-icon-wrapper">
              <Link to="/notifications" onClick={closeMobileMenu} className="navbar-notification-icon">
                <FaBell size={18} />
              </Link>
            </li>
          </ul>

          <div className="navbar-right">
            {user ? (
              <div className="navbar-user-info" ref={userDropdownRef}>
                <div className="navbar-user-dropdown" onClick={toggleDropdown}>
                  <img
                    src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                    alt="profile"
                    className="navbar-profile-img"
                  />
                  <span className="navbar-username">{user.name}</span>
                </div>
                {dropdownOpen && (
                  <div className="navbar-dropdown-menu">
                    <Link to={user.role === 'admin' ? '/admin-profile' : user.role === 'tutor' ? '/tutor-profile' : '/user-profile'} onClick={closeMobileMenu}>My Profile</Link>
                    <Link to="/certificates" onClick={closeMobileMenu}>Certificates</Link>
                    <Link to="/exam" onClick={closeMobileMenu}>Exam</Link>
                    <Link to="/invoices" onClick={closeMobileMenu}>Invoices</Link>
                    <Link to="/settings" onClick={closeMobileMenu}>Settings</Link>
                    <button onClick={handleLogout} className="navbar-logout-link">Logout</button>
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
      </div>
    </nav>
  );
}

export default Navbar;
