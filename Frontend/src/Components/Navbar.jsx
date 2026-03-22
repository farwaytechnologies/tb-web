import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Bell, ArrowLeft, ChevronDown,
  User, FileText, Award, Receipt, LogOut,
  BookOpen, GraduationCap, Newspaper, Briefcase,
  LayoutDashboard, Zap,
} from 'lucide-react';
import '../Styles/ComponentsStyle/Navbar.css';

const API = import.meta.env.VITE_API_URL;

const ROLE_COLORS = {
  admin:   '#ef4444',
  tutor:   '#06b6d4',
  student: '#10b981',
};

export default function Navbar() {
  const [user, setUser]                       = useState(null);
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [menuOpen, setMenuOpen]               = useState(false);
  const [learningOpen, setLearningOpen]       = useState(false);
  const [scrolled, setScrolled]               = useState(false);
  const [notifCount, setNotifCount]           = useState(0);

  const navigate  = useNavigate();
  const location  = useLocation();
  const userRef   = useRef(null);
  const learnRef  = useRef(null);

  /* scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* user */
  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem('user');
      setUser(raw ? JSON.parse(raw) : null);
    };
    load();
    window.addEventListener('userLoggedIn', load);
    return () => window.removeEventListener('userLoggedIn', load);
  }, []);

  /* notifications */
  useEffect(() => {
    fetch(`${API}/api/notifications`)
      .then(r => r.ok ? r.json() : [])
      .then(d => {
        if (!Array.isArray(d)) { setNotifCount(0); return; }
        const uid = user?._id || user?.id;
        if (uid) {
          const unread = d.filter(n => !n.readBy?.includes(uid));
          setNotifCount(unread.length);
        } else {
          setNotifCount(d.length);
        }
      })
      .catch(() => setNotifCount(0));
  }, [user]);

  /* click outside */
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current  && !userRef.current.contains(e.target))  setDropdownOpen(false);
      if (learnRef.current && !learnRef.current.contains(e.target)) setLearningOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* close on route change */
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setLearningOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  }, [navigate]);

  const close = useCallback(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setLearningOpen(false);
  }, []);

  const dashLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'tutor') return '/tutor/dashboard';
    if (user.role === 'sales_executive') return '/sales-executive/dashboard';
    return '/user/dashboard';
  };

  const profileLink = () => {
    if (!user) return '/user-profile';
    if (user.role === 'admin') return '/admin-profile';
    if (user.role === 'tutor') return '/tutor-profile';
    if (user.role === 'sales_executive') return '/sales-executive-profile';
    return '/user-profile';
  };

  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');
  const roleColor = ROLE_COLORS[user?.role] || '#8b5cf6';

  return (
    <nav className={`nb ${scrolled ? 'nb--scrolled' : ''}`}>
      <div className="nb__inner">

        {/* ── Brand ── */}
        <div className="nb__brand">
          {location.pathname !== '/' && (
            <button className="nb__back" onClick={() => navigate(-1)} aria-label="Go back">
              <ArrowLeft size={16} />
            </button>
          )}
          <Link to="/" className="nb__logo" onClick={close}>
            <span className="nb__logo-t">Tech</span><span className="nb__logo-b">Borg</span>
            <span className="nb__logo-dot" />
          </Link>
        </div>

        {/* ── Nav links (desktop) ── */}
        <ul className={`nb__links ${menuOpen ? 'nb__links--open' : ''}`}>
          <li><Link to="/" className={`nb__link ${isActive('/') && location.pathname === '/' ? 'nb__link--active' : ''}`} onClick={close}>Home</Link></li>

          {/* Learning dropdown */}
          <li className="nb__drop" ref={learnRef}>
            <button className={`nb__link nb__drop-toggle ${isActive('/courses') || isActive('/learn') ? 'nb__link--active' : ''}`}
              onClick={() => setLearningOpen(p => !p)}>
              Learning <ChevronDown size={14} className={learningOpen ? 'nb__chevron--open' : ''} />
            </button>
            {learningOpen && (
              <div className="nb__submenu">
                <Link to="/courses" className="nb__sub-item" onClick={close}>
                  <GraduationCap size={15} /> Courses
                </Link>
                <Link to="/learn" className="nb__sub-item" onClick={close}>
                  <BookOpen size={15} /> Learn
                </Link>
              </div>
            )}
          </li>

          <li><Link to="/blog"      className={`nb__link ${isActive('/blog')       ? 'nb__link--active' : ''}`} onClick={close}>Blog</Link></li>
          <li><Link to="/news"      className={`nb__link ${isActive('/news')       ? 'nb__link--active' : ''}`} onClick={close}>News</Link></li>
          <li><Link to="/job-alerts" className={`nb__link ${isActive('/job-alerts') ? 'nb__link--active' : ''}`} onClick={close}>Jobs</Link></li>
          <li><Link to="/community" className={`nb__link ${isActive('/community')  ? 'nb__link--active' : ''}`} onClick={close}>Community</Link></li>

          {/* Mobile-only extras */}
          <li className="nb__mobile-only">
            <Link to="/notifications" className="nb__link" onClick={close}>
              <Bell size={15} /> Notifications
              {notifCount > 0 && <span className="nb__badge">{notifCount > 99 ? '99+' : notifCount}</span>}
            </Link>
          </li>
          {user && (
            <li className="nb__mobile-only">
              <Link to={dashLink()} className="nb__link" onClick={close}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* ── Right actions ── */}
        <div className="nb__actions">
          {/* Dashboard pill (desktop) */}
          {user && (
            <Link to={dashLink()} className="nb__dash-pill" onClick={close}>
              <LayoutDashboard size={14} />
              <span>{user.role === 'admin' ? 'Admin' : user.role === 'tutor' ? 'Tutor' : user.role === 'sales_executive' ? 'Sales' : 'Student'}</span>
            </Link>
          )}

          {/* Bell */}
          <Link to="/notifications" className="nb__bell" aria-label="Notifications">
            <Bell size={18} />
            {notifCount > 0 && <span className="nb__bell-badge">{notifCount > 99 ? '99+' : notifCount}</span>}
          </Link>

          {/* User menu */}
          {user ? (
            <div className="nb__user" ref={userRef}>
              <button className="nb__user-btn" onClick={() => setDropdownOpen(p => !p)}>
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=80`}
                  alt={user.name}
                  className="nb__avatar"
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=80`; }}
                />
                <span className="nb__uname">{user.name}</span>
                <ChevronDown size={13} className={dropdownOpen ? 'nb__chevron--open' : ''} />
              </button>

              {dropdownOpen && (
                <div className="nb__user-menu">
                  {/* User info header */}
                  <div className="nb__menu-head">
                    <img
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=80`}
                      alt={user.name}
                      className="nb__menu-av"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=80`; }}
                    />
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <span className="nb__role-badge" style={{ background: `${roleColor}20`, color: roleColor, border: `1px solid ${roleColor}40` }}>
                        <Zap size={10} /> {user.role?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="nb__menu-divider" />

                  <Link to={profileLink()} className="nb__menu-item" onClick={close}>
                    <User size={15} /> My Profile
                  </Link>

                  {user.role !== 'admin' && (
                    <>
                      <Link to="/certificates" className="nb__menu-item" onClick={close}>
                        <Award size={15} /> Certificates
                      </Link>
                      <Link to="/exam" className="nb__menu-item" onClick={close}>
                        <FileText size={15} /> Exam
                      </Link>
                      <Link to="/invoices" className="nb__menu-item" onClick={close}>
                        <Receipt size={15} /> Invoices
                      </Link>
                    </>
                  )}

                  <div className="nb__menu-divider" />

                  <button className="nb__menu-item nb__menu-logout" onClick={handleLogout}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nb__login-btn" onClick={close}>
              <User size={15} /> Login
            </Link>
          )}

          {/* Hamburger */}
          <button className="nb__burger" onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
