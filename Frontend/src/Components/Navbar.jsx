import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Bell, 
  ArrowLeft, 
  ChevronDown, 
  User, 
  FileText, 
  Award, 
  Receipt, 
  Settings, 
  LogOut 
} from 'lucide-react';
import '../Styles/ComponentsStyle/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const userDropdownRef = useRef(null);
  // const examDropdownRef = useRef(null);
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
      // if (examDropdownRef.current && !examDropdownRef.current.contains(event.target)) setExamDropdownOpen(false);
      if (learningDropdownRef.current && !learningDropdownRef.current.contains(event.target)) setLearningDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    // setExamDropdownOpen(false);
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
  // const toggleExamDropdown = useCallback(() => setExamDropdownOpen(prev => !prev), []);
  const toggleLearningDropdown = useCallback(() => setLearningDropdownOpen(prev => !prev), []);
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), []);
  const closeMobileMenu = useCallback(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    // setExamDropdownOpen(false);
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
    <nav className={`tb-navbar ${scrolled ? 'tb-navbar--scrolled' : ''}`}>
      <div className="tb-navbar__container">
        {/* Logo Section */}
        <div className="tb-navbar__brand">
          <Link to="/" className="tb-navbar__logo" onClick={closeMobileMenu}>
            <span className="tb-navbar__logo-text">Tech</span>
            <span className="tb-navbar__logo-accent">Borg</span>
          </Link>

          {/* Back Navigation Button - Hidden on Home Page Only */}
          {!isActive('/') && (
            <button 
              className="tb-navbar__back-btn" 
              onClick={() => navigate(-1)} 
              title="Go Back"
              aria-label="Go back to previous page"
            >
              <ArrowLeft size={18} />
            </button>
          )}
        </div>

        {/* Dashboard Quick Link */}
        {user && (
          <Link 
            to={getDashboardLink()} 
            className="tb-navbar__dashboard-link" 
            onClick={closeMobileMenu}
          >
            {getDashboardText()}
          </Link>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          className="tb-navbar__hamburger" 
          onClick={toggleMenu} 
          aria-label="Toggle navigation menu" 
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <ul className={`tb-navbar__links ${menuOpen ? 'tb-navbar__links--active' : ''}`}>
          <li className="tb-navbar__item">
            <Link 
              to="/" 
              onClick={closeMobileMenu} 
              className={`tb-navbar__link ${isActive('/') ? 'tb-navbar__link--active' : ''}`}
            >
              Home
            </Link>
          </li>

          {/* Learning Dropdown */}
          <li className="tb-navbar__item tb-navbar__dropdown" ref={learningDropdownRef}>
            <button 
              className="tb-navbar__dropdown-toggle" 
              onClick={toggleLearningDropdown}
              aria-expanded={learningDropdownOpen}
            >
              Learning
              <ChevronDown 
                size={18} 
                className={`tb-navbar__dropdown-icon ${learningDropdownOpen ? 'tb-navbar__dropdown-icon--rotate' : ''}`} 
              />
            </button>
            {learningDropdownOpen && (
              <ul className="tb-navbar__submenu">
                <li>
                  <Link to="/courses" onClick={closeMobileMenu}>
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/learn" onClick={closeMobileMenu}>
                    Learn
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Exam Guide Dropdown */}
          {/* <li className="tb-navbar__item tb-navbar__dropdown" ref={examDropdownRef}>
            <button 
              className="tb-navbar__dropdown-toggle" 
              onClick={toggleExamDropdown}
              aria-expanded={examDropdownOpen}
            >
              Exam Guide
              <ChevronDown 
                size={18} 
                className={`tb-navbar__dropdown-icon ${examDropdownOpen ? 'tb-navbar__dropdown-icon--rotate' : ''}`} 
              />
            </button>
            {examDropdownOpen && (
              <ul className="tb-navbar__submenu">
                <li><Link to="/exam-guide/polytechnic" onClick={closeMobileMenu}>Polytechnic</Link></li>
                <li><Link to="/exam-guide/engineering" onClick={closeMobileMenu}>Engineering</Link></li>
                <li><Link to="/exam-guide/degree" onClick={closeMobileMenu}>UG</Link></li>
                <li><Link to="/exam-guide/pg" onClick={closeMobileMenu}>PG</Link></li>
              </ul>
            )}
          </li> */}

          <li className="tb-navbar__item">
            <Link 
              to="/blog" 
              onClick={closeMobileMenu} 
              className={`tb-navbar__link ${isActive('/blog') ? 'tb-navbar__link--active' : ''}`}
            >
              Blogs
            </Link>
          </li>

          <li className="tb-navbar__item">
            <Link 
              to="/news" 
              onClick={closeMobileMenu} 
              className={`tb-navbar__link ${isActive('/news') ? 'tb-navbar__link--active' : ''}`}
            >
              News
            </Link>
          </li>

          <li className="tb-navbar__item">
            <Link 
              to="/job-alerts" 
              onClick={closeMobileMenu} 
              className={`tb-navbar__link ${isActive('/job-alerts') ? 'tb-navbar__link--active' : ''}`}
            >
              Job Alert
            </Link>
          </li>

          {/* Mobile Notification Link */}
          <li className="tb-navbar__item tb-navbar__notification-mobile">
            <Link to="/notifications" onClick={closeMobileMenu} className="tb-navbar__link">
              <Bell size={18} />
              <span>Notifications</span>
              {notificationCount > 0 && (
                <span className="tb-navbar__badge">{notificationCount}</span>
              )}
            </Link>
          </li>
        </ul>

        {/* Right Section */}
        <div className="tb-navbar__actions">
          {/* Notification Bell (Desktop) */}
          <Link 
            to="/notifications" 
            className="tb-navbar__notification-btn" 
            aria-label={`Notifications (${notificationCount} unread)`}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="tb-navbar__notification-badge">{notificationCount}</span>
            )}
          </Link>

          {/* User Menu or Login */}
          {user ? (
            <div className="tb-navbar__user" ref={userDropdownRef}>
              <button 
                className="tb-navbar__user-toggle" 
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4a7abe&color=fff`}
                  alt={user.name}
                  className="tb-navbar__avatar"
                />
                <span className="tb-navbar__username">{user.name}</span>
                <ChevronDown 
                  size={16} 
                  className={`tb-navbar__dropdown-icon ${dropdownOpen ? 'tb-navbar__dropdown-icon--rotate' : ''}`} 
                />
              </button>
              
              {dropdownOpen && (
                <div className="tb-navbar__user-menu">
                  <Link to={getProfileLink()} onClick={closeMobileMenu} className="tb-navbar__user-menu-item">
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/certificates" onClick={closeMobileMenu} className="tb-navbar__user-menu-item">
                    <Award size={18} />
                    <span>Certificates</span>
                  </Link>
                  <Link to="/exam" onClick={closeMobileMenu} className="tb-navbar__user-menu-item">
                    <FileText size={18} />
                    <span>Exam</span>
                  </Link>
                  <Link to="/invoices" onClick={closeMobileMenu} className="tb-navbar__user-menu-item">
                    <Receipt size={18} />
                    <span>Invoices</span>
                  </Link>
                  <Link to="/settings" onClick={closeMobileMenu} className="tb-navbar__user-menu-item">
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  <button onClick={handleLogout} className="tb-navbar__user-menu-item tb-navbar__logout">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="tb-navbar__login-btn">
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;