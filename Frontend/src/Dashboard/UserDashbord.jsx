import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Award, LifeBuoy, UserCircle, Clock, CheckCircle, BookMarked, ChevronRight, XCircle } from 'lucide-react';
import '../Styles/DashbordStyle/UserDashbord.css';

const API = import.meta.env.VITE_API_URL;

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored) { navigate('/login'); return; }
    setUser(stored);
    const uid = stored._id || stored.id;

    Promise.all([
      fetch(`${API}/api/enrollments/user/${uid}`).then(r => r.json()),
      fetch(`${API}/api/enrollments/certificates/${uid}`).then(r => r.json()).catch(() => [])
    ]).then(([enrData, certData]) => {
      if (Array.isArray(enrData)) setEnrollments(enrData);
      if (Array.isArray(certData)) setCertificates(certData);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [navigate]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const accepted  = enrollments.filter(e => e.status === 'Accepted');
  const pending   = enrollments.filter(e => e.status === 'Pending');
  const completed = enrollments.filter(e => e.completed);

  const statsCards = [
    { icon: BookOpen,    val: enrollments.length, label: 'Total Enrolled',   color: '#6366f1', glow: 'rgba(99,102,241,0.15)'  },
    { icon: CheckCircle, val: accepted.length,    label: 'Active Courses',   color: '#10b981', glow: 'rgba(16,185,129,0.15)'  },
    { icon: Clock,       val: pending.length,     label: 'Pending Review',   color: '#f59e0b', glow: 'rgba(245,158,11,0.15)'  },
    { icon: Award,       val: certificates.length,label: 'Certificates',     color: '#ec4899', glow: 'rgba(236,72,153,0.15)'  },
  ];

  const quickActions = [
    { to: '/user-profile', icon: UserCircle, label: 'My Profile',     color: '#6366f1' },
    { to: '/courses',      icon: BookOpen,   label: 'Browse Courses', color: '#10b981' },
    { to: '/certificates', icon: Award,      label: 'Certificates',   color: '#ec4899' },
    { to: '/support',      icon: LifeBuoy,   label: 'Support',        color: '#06b6d4' },
  ];

  const statusColor = { Accepted: '#10b981', Pending: '#f59e0b', Rejected: '#ef4444' };
  const statusGlow  = { Accepted: 'rgba(16,185,129,0.12)', Pending: 'rgba(245,158,11,0.12)', Rejected: 'rgba(239,68,68,0.12)' };

  return (
    <div className="ud-page">
      {/* Header */}
      <div className="ud-header">
        <div className="ud-header-glow" />
        <div className="ud-header-left">
          <p className="ud-greeting">{greeting()}</p>
          <h1 className="ud-name">{user?.name || 'Student'}</h1>
          <div className="ud-role-badge">
            <span className="ud-role-dot" />
            Student
          </div>
          <p className="ud-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="ud-header-right">
          <div className="ud-avatar-wrap">
            <img
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=6366f1&color=fff&size=128`}
              alt="avatar"
              className="ud-avatar"
            />
            <span className="ud-online-dot" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="ud-stats">
        {statsCards.map(s => (
          <div key={s.label} className="ud-stat-card" style={{ '--glow': s.glow }}>
            <div className="ud-stat-icon" style={{ background: s.glow, border: `1px solid ${s.color}30` }}>
              <s.icon size={20} style={{ color: s.color }} strokeWidth={2} />
            </div>
            <span className="ud-stat-val" style={{ color: s.color }}>{loading ? '—' : s.val}</span>
            <span className="ud-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="ud-section">
        <h2 className="ud-section-title">Quick Actions</h2>
        <div className="ud-actions">
          {quickActions.map(a => (
            <Link key={a.to} to={a.to} className="ud-action-card">
              <div className="ud-action-icon" style={{ background: `${a.color}18`, border: `1px solid ${a.color}30` }}>
                <a.icon size={18} style={{ color: a.color }} strokeWidth={2} />
              </div>
              <span className="ud-action-label">{a.label}</span>
              <ChevronRight size={15} className="ud-action-chevron" />
            </Link>
          ))}
        </div>
      </div>

      {/* Enrollments */}
      <div className="ud-section">
        <div className="ud-section-header">
          <h2 className="ud-section-title">My Enrollments</h2>
          {enrollments.length > 0 && (
            <Link to="/courses" className="ud-see-all">Browse more →</Link>
          )}
        </div>

        {loading ? (
          <div className="ud-state"><div className="ud-spinner" /></div>
        ) : enrollments.length === 0 ? (
          <div className="ud-state">
            <BookOpen size={40} style={{ color: '#334155' }} />
            <p>No enrollments yet.</p>
            <Link to="/courses" className="ud-browse-btn">Browse Courses</Link>
          </div>
        ) : (
          <div className="ud-enrollments">
            {enrollments.map(e => {
              const status = e.status || 'Pending';
              return (
                <div key={e._id} className="ud-enroll-card">
                  <img
                    src={e.courseId?.image || 'https://placehold.co/80x60?text=Course'}
                    alt={e.courseId?.title}
                    className="ud-enroll-img"
                    onError={ev => { ev.target.src = 'https://placehold.co/80x60?text=Course'; }}
                  />
                  <div className="ud-enroll-info">
                    <p className="ud-enroll-title">{e.courseId?.title || 'Course'}</p>
                    <div className="ud-enroll-meta">
                      {e.courseId?.instructor && <span>{e.courseId.instructor}</span>}
                      {e.courseId?.level && <span className="ud-level-chip">{e.courseId.level}</span>}
                    </div>
                    <p className="ud-enroll-date">Enrolled {new Date(e.enrolledAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="ud-enroll-right">
                    <span
                      className="ud-badge"
                      style={{ background: statusGlow[status], color: statusColor[status], border: `1px solid ${statusColor[status]}30` }}
                    >
                      {status === 'Accepted' && <CheckCircle size={11} />}
                      {status === 'Pending'  && <Clock size={11} />}
                      {status === 'Rejected' && <XCircle size={11} />}
                      {status}
                    </span>
                    {status === 'Accepted' && (
                      <Link to={`/courses/${e.courseId?._id}/modules`} className="ud-continue-btn">
                        Continue →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
