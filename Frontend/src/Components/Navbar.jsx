import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaBell } from 'react-icons/fa';
import { MdAccountCircle, MdKeyboardArrowDown } from 'react-icons/md';
import '../Styles/ComponentsStyle/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // ✅ Dynamic count

  const navigate = useNavigate();
  const location = useLocation();
  const userDropdownRef = useRef(null);
  const examDropdownRef = useRef(null);
  const learningDropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);

  // ✅ Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Load user data
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

  // ✅ Fetch notifications count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('https://tb-back-fyvj.onrender.com/api/notifications');
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();

        // handle both array or object responses
        const count = Array.isArray(data) ? data.length : (data?.length || 0);
        setNotificationCount(count);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();

    // Optional: refresh every 60s
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) setDropdownOpen(false);
      if (examDropdownRef.current && !examDropdownRef.current.contains(event.target)) setExamDropdownOpen(false);
      if (learningDropdownRef.current && !learningDropdownRef.current.contains(event.target)) setLearningDropdownOpen(false);
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target)) setResourcesDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setExamDropdownOpen(false);
    setLearningDropdownOpen(false);
    setResourcesDropdownOpen(false);
  }, [location.pathname]);

  // ✅ Logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  }, [navigate]);

  // ✅ Toggle helpers
  const toggleDropdown = useCallback(() => setDropdownOpen(prev => !prev), []);
  const toggleExamDropdown = useCallback(() => setExamDropdownOpen(prev => !prev), []);
  const toggleLearningDropdown = useCallback(() => setLearningDropdownOpen(prev => !prev), []);
  const toggleResourcesDropdown = useCallback(() => setResourcesDropdownOpen(prev => !prev), []);
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);

  const closeMobileMenu = useCallback(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setExamDropdownOpen(false);
    setLearningDropdownOpen(false);
    setResourcesDropdownOpen(false);
  }, []);

  // ✅ Get correct dashboard and profile links
  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'tutor': return '/tutor/dashboard';
      default: return '/user/dashboard';
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

  // ✅ Render Navbar
  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="navbar-logo-text">Tech</span>
          <span className="navbar-logo-accent">Borg</span>
        </Link>

        {/* Dashboard Link */}
        {user && (
          <Link
            to={getDashboardLink()}
            className="navbar-dashboard-link"
            onClick={closeMobileMenu}
          >
            <span className="navbar-dashboard-text">Learning Platform</span>
          </Link>
        )}

        {/* Hamburger */}
        <button 
          className="navbar-hamburger" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-links ${menuOpen ? 'navbar-links-active' : ''}`}>
          <li>
            <Link 
              to="/" 
              onClick={closeMobileMenu} 
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>

          {/* Learning Dropdown */}
          <li className="navbar-dropdown" ref={learningDropdownRef}>
            <button 
              className="navbar-dropdown-toggle" 
              onClick={toggleLearningDropdown}
              aria-expanded={learningDropdownOpen}
            >
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
            <button 
              className="navbar-dropdown-toggle" 
              onClick={toggleExamDropdown}
              aria-expanded={examDropdownOpen}
            >
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

          {/* ✅ Resources Dropdown */}
          <li className="navbar-dropdown" ref={resourcesDropdownRef}>
            <button 
              className="navbar-dropdown-toggle" 
              onClick={toggleResourcesDropdown}
              aria-expanded={resourcesDropdownOpen}
            >
              Resources
              <MdKeyboardArrowDown className={`navbar-dropdown-icon ${resourcesDropdownOpen ? 'rotate' : ''}`} />
            </button>
            {resourcesDropdownOpen && (
              <ul className="navbar-submenu">
                <li><Link to="/innovation" onClick={closeMobileMenu}>Innovation</Link></li>
                <li><Link to="/blog" onClick={closeMobileMenu}>Blog</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link 
              to="/about" 
              onClick={closeMobileMenu} 
              className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              onClick={closeMobileMenu} 
              className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link 
              to="/job-alerts" 
              onClick={closeMobileMenu} 
              className={`navbar-link ${isActive('/job-alerts') ? 'active' : ''}`}
            >
              Job Alert
            </Link>
          </li>

          {/* Notification (Mobile only) */}
          <li className="navbar-notification-mobile">
            <Link to="/notifications" onClick={closeMobileMenu} className="navbar-link">
              <FaBell /> Notifications ({notificationCount})
            </Link>
          </li>
        </ul>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Notification Icon (Desktop) */}
          <Link to="/notifications" className="navbar-notification-icon" aria-label="Notifications">
            <FaBell />
            {notificationCount > 0 && (
              <span className="navbar-notification-badge">{notificationCount}</span>
            )}
          </Link>

          {/* User Menu / Login */}
          {user ? (
            <div className="navbar-user-info" ref={userDropdownRef}>
              <button 
                className="navbar-user-dropdown" 
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4a7abe&color=fff`}
                  alt={`${user.name}'s profile`}
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
