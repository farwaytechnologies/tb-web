import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Award, LifeBuoy, UserCircle, Clock, CheckCircle, BookMarked } from 'lucide-react';
import '../Styles/DashbordStyle/UserDashbord.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored) { navigate('/login'); return; }
    setUser(stored);

    const uid = stored._id || stored.id;
    fetch(`${API_URL}/api/enrollments/user/${uid}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setEnrollments(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const accepted = enrollments.filter(e => e.status === 'Accepted');
  const pending  = enrollments.filter(e => e.status === 'Pending');

  return (
    <div className="ud-page">
      {/* Header */}
      <div className="ud-header">
        <img
          src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=6366f1&color=fff&size=128`}
          alt="avatar"
          className="ud-avatar"
        />
        <div>
          <h1 className="ud-name">Hello, {user?.name || 'Student'}</h1>
          <p className="ud-role">Student Dashboard</p>
        </div>
      </div>

      {/* Stats */}
      <div className="ud-stats">
        {[
          { icon: BookOpen,    val: enrollments.length, label: 'Total Enrolled',   color: '#6366f1' },
          { icon: CheckCircle, val: accepted.length,    label: 'Accepted',         color: '#10b981' },
          { icon: Clock,       val: pending.length,     label: 'Pending Review',   color: '#f59e0b' },
          { icon: BookMarked,  val: accepted.length,    label: 'Active Courses',   color: '#06b6d4' },
        ].map(s => (
          <div key={s.label} className="ud-stat">
            <s.icon size={22} style={{ color: s.color }} />
            <span className="ud-stat-val" style={{ color: s.color }}>{loading ? '—' : s.val}</span>
            <span className="ud-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="ud-section">
        <h2 className="ud-section-title">Quick Actions</h2>
        <div className="ud-actions">
          {[
            { to: '/user-profile', icon: UserCircle, label: 'My Profile',     color: '#6366f1' },
            { to: '/courses',      icon: BookOpen,   label: 'Browse Courses', color: '#10b981' },
            { to: '/certificates', icon: Award,      label: 'Certificates',   color: '#f59e0b' },
            { to: '/support',      icon: LifeBuoy,   label: 'Support',        color: '#06b6d4' },
          ].map(a => (
            <Link key={a.to} to={a.to} className="ud-action-card">
              <a.icon size={22} style={{ color: a.color }} />
              <span>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* My Enrollments */}
      <div className="ud-section">
        <h2 className="ud-section-title">My Enrollments</h2>
        {loading ? (
          <p className="ud-empty">Loading...</p>
        ) : enrollments.length === 0 ? (
          <div className="ud-empty">
            <p>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="ud-enroll-link">Browse Courses →</Link>
          </div>
        ) : (
          <div className="ud-enrollments">
            {enrollments.map(e => (
              <div key={e._id} className="ud-enroll-card">
                <img
                  src={e.courseId?.image || 'https://placehold.co/80x60?text=Course'}
                  alt={e.courseId?.title}
                  className="ud-enroll-img"
                  onError={ev => { ev.target.src = 'https://placehold.co/80x60?text=Course'; }}
                />
                <div className="ud-enroll-info">
                  <p className="ud-enroll-title">{e.courseId?.title || 'Course'}</p>
                  <p className="ud-enroll-meta">
                    {e.courseId?.instructor && <span>{e.courseId.instructor}</span>}
                    {e.courseId?.level && <span>{e.courseId.level}</span>}
                  </p>
                  <p className="ud-enroll-date">Enrolled {new Date(e.enrolledAt).toLocaleDateString()}</p>
                </div>
                <div className="ud-enroll-right">
                  <span className={`ud-badge ud-badge--${e.status.toLowerCase()}`}>{e.status}</span>
                  {e.status === 'Accepted' && (
                    <Link to={`/courses/${e.courseId?._id}/modules`} className="ud-continue-btn">
                      Continue →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
