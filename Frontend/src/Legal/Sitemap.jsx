import { Link } from 'react-router-dom';
import SEO from '../Components/SEO';
import '../Styles/LegalStyle/Sitemap.css';

const sections = [
  {
    title: 'Main Pages',
    icon: '🌐',
    color: '#6366f1',
    links: [
      { label: 'Home',        path: '/' },
      { label: 'About Us',    path: '/about' },
      { label: 'Contact',     path: '/contact' },
      { label: 'Support',     path: '/support' },
      { label: 'Notifications', path: '/notifications' },
    ],
  },
  {
    title: 'Learning',
    icon: '📚',
    color: '#10b981',
    links: [
      { label: 'Courses',         path: '/courses' },
      { label: 'Learn',           path: '/learn' },
      { label: 'Blog',            path: '/blog' },
      { label: 'News',            path: '/news' },
      { label: 'Innovation',      path: '/innovation' },
    ],
  },
  {
    title: 'Exam Guides',
    icon: '🎓',
    color: '#f59e0b',
    links: [
      { label: 'Polytechnic',  path: '/exam-guide/polytechnic' },
      { label: 'Engineering',  path: '/exam-guide/engineering' },
      { label: 'Degree',       path: '/exam-guide/degree' },
      { label: 'PG',           path: '/exam-guide/pg' },
    ],
  },
  {
    title: 'Careers',
    icon: '💼',
    color: '#06b6d4',
    links: [
      { label: 'Job Alerts',   path: '/job-alerts' },
    ],
  },
  {
    title: 'Student Area',
    icon: '🧑‍🎓',
    color: '#8b5cf6',
    links: [
      { label: 'Student Dashboard', path: '/user/dashboard' },
      { label: 'My Profile',        path: '/user-profile' },
      { label: 'Certificates',      path: '/certificates' },
      { label: 'Invoices',          path: '/invoices' },
      { label: 'Exam',              path: '/exam' },
      { label: 'Enroll in Course',  path: '/enroll' },
    ],
  },
  {
    title: 'Tutor Area',
    icon: '👨‍🏫',
    color: '#ec4899',
    links: [
      { label: 'Tutor Dashboard',  path: '/tutor/dashboard' },
      { label: 'Tutor Profile',    path: '/tutor-profile' },
      { label: 'Manage Courses',   path: '/tutor/courses' },
      { label: 'Manage Blogs',     path: '/tutor/blogs' },
      { label: 'Manage Students',  path: '/tutor/students' },
      { label: 'Manage Learn',     path: '/tutor/learn' },
      { label: 'My Rewards',       path: '/tutor/rewards' },
      { label: 'BorgCoins Wallet', path: '/tutor/borgcoins' },
    ],
  },
  {
    title: 'Admin Area',
    icon: '⚙️',
    color: '#ef4444',
    links: [
      { label: 'Admin Dashboard',    path: '/admin/dashboard' },
      { label: 'Manage Courses',     path: '/admin/courses' },
      { label: 'Manage Users',       path: '/admin/users' },
      { label: 'Manage Tutors',      path: '/admin/tutors' },
      { label: 'Manage Blogs',       path: '/admin/blogs' },
      { label: 'Manage Enrollments', path: '/admin/enrollments' },
      { label: 'Manage News',        path: '/admin/news' },
      { label: 'Manage Learn',       path: '/admin/manage-learn' },
      { label: 'Manage Exams',       path: '/admin/exams' },
      { label: 'Manage Invoices',    path: '/admin/invoices' },
      { label: 'Manage Innovations', path: '/admin/innovations' },
      { label: 'Manage Rewards',     path: '/admin/rewards' },
      { label: 'BorgCoins',          path: '/admin/borgcoins' },
      { label: 'Notifications',      path: '/admin/manage-notifications' },
      { label: 'Job Listings',       path: '/admin/add-job' },
      { label: 'Applications',       path: '/admin/applications' },
      { label: 'Contact Messages',   path: '/admin/view-contact' },
      { label: 'Visitor Analytics',  path: '/admin/visitors' },
    ],
  },
  {
    title: 'Legal & Info',
    icon: '📜',
    color: '#94a3b8',
    links: [
      { label: 'Privacy Policy',   path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy',    path: '/cookies' },
      { label: 'FAQ',              path: '/faq' },
      { label: 'Accessibility',    path: '/accessibility' },
    ],
  },
  {
    title: 'Authentication',
    icon: '🔐',
    color: '#64748b',
    links: [
      { label: 'Login (Student / Tutor)', path: '/login' },
      
    ],
  },
];

export default function Sitemap() {
  return (
    <div className="sm-page">
      <SEO
        title="Sitemap - TechBorg E-Learning"
        description="Complete sitemap of TechBorg — find every page on the platform organised by section."
      />

      {/* Hero */}
      <div className="sm-hero">
        <div className="sm-hero-glow" />
        <div className="sm-hero-inner">
          <div className="sm-hero-badge">🗺️ Sitemap</div>
          <h1 className="sm-hero-title">Every Page, One Place</h1>
          <p className="sm-hero-sub">A complete map of all pages and sections on TechBorg.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="sm-container">
        <div className="sm-grid">
          {sections.map(sec => (
            <div key={sec.title} className="sm-card">
              <div className="sm-card-header" style={{ '--c': sec.color }}>
                <span className="sm-card-icon">{sec.icon}</span>
                <h2 className="sm-card-title">{sec.title}</h2>
                <span className="sm-card-count">{sec.links.length}</span>
              </div>
              <ul className="sm-links">
                {sec.links.map(l => (
                  <li key={l.path}>
                    <Link to={l.path} className="sm-link" style={{ '--c': sec.color }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="sm-link-arrow">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="sm-footer-note">
          Looking for something specific? Try the <Link to="/support">Support page</Link> or use the search in the navigation.
        </p>
      </div>
    </div>
  );
}
