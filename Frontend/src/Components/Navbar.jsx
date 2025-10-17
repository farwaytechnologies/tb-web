import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaBell, FaArrowLeft } from 'react-icons/fa';
import { MdAccountCircle, MdKeyboardArrowDown } from 'react-icons/md';
import '../Styles/ComponentsStyle/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const userDropdownRef = useRef(null);
  const examDropdownRef = useRef(null);
  const learningDropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load user data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }

    const handleLogin = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('userLoggedIn', handleLogin);
    return () => window.removeEventListener('userLoggedIn', handleLogin);
  }, []);

  // Fetch notifications count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('https://tb-back-fyvj.onrender.com/api/notifications');
        const data = await res.json();
        if (Array.isArray(data)) setNotificationCount(data.length);
        else setNotificationCount(0);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) setDropdownOpen(false);
      if (examDropdownRef.current && !examDropdownRef.current.contains(event.target)) setExamDropdownOpen(false);
      if (learningDropdownRef.current && !learningDropdownRef.current.contains(event.target)) setLearningDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setExamDropdownOpen(false);
    setLearningDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  }, [navigate]);

  const toggleDropdown = useCallback(() => setDropdownOpen(prev => !prev), []);
  const toggleExamDropdown = useCallback(() => setExamDropdownOpen(prev => !prev), []);
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  const closeMobileMenu = useCallback(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setExamDropdownOpen(false);
    setLearningDropdownOpen(false);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'tutor': return '/tutor/dashboard';
      default: return '/user/dashboard';
    }
  };

  const getDashboardText = () => {
    if (!user) return '';
    switch (user.role) {
      case 'admin': return 'Admin Dashboard';
      case 'tutor': return 'Tutor Dashboard';
      default: return 'Student Dashboard';
    }
  };

  const getProfileLink = () => {
    if (!user) return '/user-profile';
    switch (user.role) {
      case 'admin': return '/admin-profile';
      case 'tutor': return '/tutor-profile';
      default: return '/user-profile';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo + Navigation Arrows */}
        <div className="navbar-logo-wrapper">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <span className="navbar-logo-text">Tech</span>
            <span className="navbar-logo-accent">Borg</span>
          </Link>

          {/* Back Arrow */}
          <div className="navbar-nav-controls">
            <button className="nav-arrow" onClick={() => navigate(-1)} title="Go Back">
              <FaArrowLeft />
            </button>
          </div>
        </div>

        {/* Dashboard Link */}
        {user && (
          <Link to={getDashboardLink()} className="navbar-dashboard-link" onClick={closeMobileMenu}>
            <span className="navbar-dashboard-text">{getDashboardText()}</span>
          </Link>
        )}

        {/* Hamburger */}
        <button className="navbar-hamburger" onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={menuOpen}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-links ${menuOpen ? 'navbar-links-active' : ''}`}>
          <li>
            <Link to="/" onClick={closeMobileMenu} className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>

          {/* Learning Dropdown */}
          <li className="navbar-dropdown" ref={learningDropdownRef}>
            <button className="navbar-dropdown-toggle" onClick={() => setLearningDropdownOpen(prev => !prev)}>
              Learning
              <MdKeyboardArrowDown className={`navbar-dropdown-icon ${learningDropdownOpen ? 'rotate' : ''}`} />
            </button>
            {learningDropdownOpen && (
              <ul className="navbar-submenu">
                <li><Link to="/courses" onClick={closeMobileMenu}>Courses</Link></li>
                <li><Link to="/learn" onClick={closeMobileMenu}>Learn</Link></li>
              </ul>
            )}
          </li>

          {/* Exam Guide Dropdown */}
          <li className="navbar-dropdown" ref={examDropdownRef}>
            <button className="navbar-dropdown-toggle" onClick={toggleExamDropdown}>
              Exam Guide
              <MdKeyboardArrowDown className={`navbar-dropdown-icon ${examDropdownOpen ? 'rotate' : ''}`} />
            </button>
            {examDropdownOpen && (
              <ul className="navbar-submenu">
                <li><Link to="/exam-guide/polytechnic" onClick={closeMobileMenu}>Polytechnic</Link></li>
                <li><Link to="/exam-guide/engineering" onClick={closeMobileMenu}>Engineering</Link></li>
                <li><Link to="/exam-guide/degree" onClick={closeMobileMenu}>UG</Link></li>
                <li><Link to="/exam-guide/pg" onClick={closeMobileMenu}>PG</Link></li>
              </ul>
            )}
          </li>

          {/* Blog and News */}
          <li><Link to="/blog" onClick={closeMobileMenu} className={`navbar-link ${isActive('/blog') ? 'active' : ''}`}>Blogs</Link></li>
          <li><Link to="/news" onClick={closeMobileMenu} className={`navbar-link ${isActive('/news') ? 'active' : ''}`}>News</Link></li>
          <li><Link to="/job-alerts" onClick={closeMobileMenu} className={`navbar-link ${isActive('/job-alerts') ? 'active' : ''}`}>Job Alert</Link></li>

          {/* Notification Icon (Mobile) */}
          <li className="navbar-notification-mobile">
            <Link to="/notifications" onClick={closeMobileMenu} className="navbar-link">
              <FaBell /> Notifications ({notificationCount})
            </Link>
          </li>
        </ul>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Notifications */}
          <Link to="/notifications" className="navbar-notification-icon" aria-label="Notifications">
            <FaBell />
            {notificationCount > 0 && <span className="navbar-notification-badge">{notificationCount}</span>}
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="navbar-user-info" ref={userDropdownRef}>
              <button className="navbar-user-dropdown" onClick={toggleDropdown}>
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4a7abe&color=fff`}
                  alt={user.name}
                  className="navbar-profile-img"
                />
                <span className="navbar-username">{user.name}</span>
                <MdKeyboardArrowDown className={`navbar-dropdown-icon ${dropdownOpen ? 'rotate' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="navbar-dropdown-menu">
                  <Link to={getProfileLink()} onClick={closeMobileMenu}>My Profile</Link>
                  <Link to="/certificates" onClick={closeMobileMenu}>Certificates</Link>
                  <Link to="/exam" onClick={closeMobileMenu}>Exam</Link>
                  <Link to="/invoices" onClick={closeMobileMenu}>Invoices</Link>
                  <Link to="/settings" onClick={closeMobileMenu}>Settings</Link>
                  <button onClick={handleLogout} className="navbar-logout-btn">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn">
              <MdAccountCircle />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
