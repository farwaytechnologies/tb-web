import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Award, LifeBuoy, UserCircle, Clock, CheckCircle, TrendingUp, ChevronRight, XCircle, Copy, Users, Gift } from 'lucide-react';
import '../Styles/DashbordStyle/UserDashbord.css';

const API = import.meta.env.VITE_API_URL;

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [reward, setReward] = useState(null);
  const [referral, setReferral] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored) { navigate('/login'); return; }
    setUser(stored);
    const uid = stored._id || stored.id;

    Promise.all([
      fetch(`${API}/api/enrollments/user/${uid}`).then(r => r.json()),
      fetch(`${API}/api/enrollments/certificates/${uid}`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/progress/${uid}`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/student-rewards/${uid}`).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/referral/${uid}`).then(r => r.json()).catch(() => null),
    ]).then(([enrData, certData, progData, rewardData, referralData]) => {
      if (Array.isArray(enrData)) setEnrollments(enrData);
      if (Array.isArray(certData)) setCertificates(certData);
      if (Array.isArray(progData)) setProgressList(progData);
      if (rewardData) setReward(rewardData);
      if (referralData) setReferral(referralData);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [navigate]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getProgress = (enr) => {
    const cid = enr.courseId?._id || enr.courseId;
    return progressList.find(p => (p.courseId?._id || p.courseId) === cid);
  };

  const accepted  = enrollments.filter(e => e.status === 'Accepted');
  const pending   = enrollments.filter(e => e.status === 'Pending');

  const statsCards = [
    { icon: BookOpen,    val: enrollments.length,       label: 'Total Enrolled',  color: '#6366f1', glow: 'rgba(99,102,241,0.15)'  },
    { icon: CheckCircle, val: accepted.length,           label: 'Active Courses',  color: '#10b981', glow: 'rgba(16,185,129,0.15)'  },
    { icon: Clock,       val: pending.length,            label: 'Pending Review',  color: '#f59e0b', glow: 'rgba(245,158,11,0.15)'  },
    { icon: Award,       val: reward?.points || 0,       label: 'Reward Points',   color: '#ec4899', glow: 'rgba(236,72,153,0.15)'  },
  ];

  const quickActions = [
    { to: '/my-learning',    icon: TrendingUp, label: 'My Learning',    color: '#6366f1' },
    { to: '/user-profile',   icon: UserCircle, label: 'My Profile',     color: '#8b5cf6' },
    { to: '/courses',        icon: BookOpen,   label: 'Browse Courses', color: '#10b981' },
    { to: '/certificates',   icon: Award,      label: 'Certificates',   color: '#ec4899' },
    { to: '/user/referral',  icon: Gift,       label: 'Referral',       color: '#f59e0b' },
    { to: '/support',        icon: LifeBuoy,   label: 'Support',        color: '#06b6d4' },
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

      {/* Reward badge strip */}
      {!loading && reward?.points > 0 && (
        <div className="ud-reward-strip">
          <Award size={15} style={{ color: '#ec4899' }} />
          <span className="ud-reward-badge-name">{reward.badge?.name || '🌱 Beginner'}</span>
          <div className="ud-reward-bar-wrap">
            <div
              className="ud-reward-bar-fill"
              style={{
                width: reward.nextBadge
                  ? `${Math.min(100, Math.round((reward.points / reward.nextBadge.minPoints) * 100))}%`
                  : '100%'
              }}
            />
          </div>
          <span className="ud-reward-pts">{reward.points} pts</span>
          {reward.nextBadge && (
            <span className="ud-reward-next">{reward.nextBadge.minPoints - reward.points} to {reward.nextBadge.name}</span>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="ud-section">
        {/* Referral Card */}
        {referral?.referralCode && (
          <div className="ud-referral-card">
            <div className="ud-referral-left">
              <div className="ud-referral-icon"><Users size={18} style={{ color: '#6366f1' }} /></div>
              <div>
                <p className="ud-referral-title">Your Referral Code</p>
                <p className="ud-referral-sub">{referral.referralCount} referred · {referral.pointsFromReferrals} pts earned</p>
              </div>
            </div>
            <div className="ud-referral-right">
              <span className="ud-referral-code">{referral.referralCode}</span>
              <button
                className="ud-referral-copy"
                onClick={() => {
                  const link = `${window.location.origin}/login?ref=${referral.referralCode}`;
                  navigator.clipboard.writeText(link);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                <Copy size={13} /> {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}
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
            <Link to="/my-learning" className="ud-see-all">View all progress →</Link>
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
              const prog = getProgress(e);
              const pct = prog?.progressPercent || 0;
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
                    {status === 'Accepted' && (
                      <div className="ud-prog-wrap">
                        <div className="ud-prog-bar">
                          <div
                            className="ud-prog-fill"
                            style={{
                              width: `${pct}%`,
                              background: pct >= 100
                                ? 'linear-gradient(90deg,#10b981,#34d399)'
                                : 'linear-gradient(90deg,#6366f1,#8b5cf6)'
                            }}
                          />
                        </div>
                        <span className="ud-prog-pct" style={{ color: pct >= 100 ? '#10b981' : '#a5b4fc' }}>{pct}%</span>
                      </div>
                    )}
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
                        {pct > 0 ? 'Continue →' : 'Start →'}
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
