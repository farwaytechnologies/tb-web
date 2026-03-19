import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Book, Users, FileText, GraduationCap, CheckCircle, BookOpen, Trophy, Coins, ChevronRight } from 'lucide-react';
import '../Styles/DashbordStyle/TutorDashbord.css';

const API = import.meta.env.VITE_API_URL;

export default function TutorDashboard() {
  const [tutor, setTutor] = useState({});
  const [stats, setStats] = useState({ courses: 0, students: 0, blogs: 0, registeredStudents: 0, allEnrolledStudents: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'tutor') { navigate('/login'); return; }
    setTutor(stored);
    fetchStats(stored._id);
  }, [navigate]);

  const fetchStats = async (tutorId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('user'));
      const tutorName = stored?.name || '';

      const [coursesRes, blogsRes, usersRes, enrollmentsRes] = await Promise.all([
        fetch(`${API}/api/courses`),
        fetch(`${API}/api/blogs`),
        fetch(`${API}/api/auth/users`),
        fetch(`${API}/api/enrollments`)
      ]);
      const [allCourses, allBlogs, users, enrollments] = await Promise.all([
        coursesRes.json(), blogsRes.json(), usersRes.json(), enrollmentsRes.json()
      ]);

      // Course model uses `instructor` (string name), not instructorId
      const tutorCourses = allCourses.filter(c => c.instructor === tutorName);
      const tutorCourseIds = new Set(tutorCourses.map(c => String(c._id)));

      // Blog model uses `author` (string name)
      const tutorBlogs = allBlogs.filter(b => b.author === tutorName);

      // Normalize courseId — may be populated object or plain string
      const enrolledCount = enrollments.filter(e => {
        const cid = String(e.courseId?._id || e.courseId);
        return tutorCourseIds.has(cid);
      }).length;

      setStats({
        courses: tutorCourses.length,
        blogs: tutorBlogs.length,
        students: enrolledCount,
        registeredStudents: users.filter(u => u.role === 'student').length,
        allEnrolledStudents: enrollments.length
      });
    } catch (err) {
      console.error('Failed to fetch tutor stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statsCards = [
    { icon: Book,          count: stats.courses,             label: 'Your Courses',              color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
    { icon: Users,         count: stats.students,            label: 'Enrolled in Your Courses',  color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)' },
    { icon: FileText,      count: stats.blogs,               label: 'Your Blogs',                color: '#06b6d4', glow: 'rgba(6,182,212,0.15)'  },
    { icon: GraduationCap, count: stats.registeredStudents,  label: 'Registered Students',       color: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
    { icon: CheckCircle,   count: stats.allEnrolledStudents, label: 'Total Enrollments',         color: '#ec4899', glow: 'rgba(236,72,153,0.15)' },
  ];

  const quickActions = [
    { to: '/tutor/courses',    icon: Book,     label: 'Manage Courses',   color: '#10b981' },
    { to: '/tutor/blogs',      icon: FileText, label: 'Manage Blogs',     color: '#06b6d4' },
    { to: '/tutor/students',   icon: Users,    label: 'Manage Students',  color: '#8b5cf6' },
    { to: '/tutor/learn',      icon: BookOpen, label: 'Manage Learn',     color: '#f59e0b' },
    { to: '/tutor/rewards',    icon: Trophy,   label: 'My Rewards',       color: '#f59e0b' },
    { to: '/tutor/borgcoins',  icon: Coins,    label: 'BorgCoins Wallet', color: '#d97706' },
  ];

  return (
    <div className="td-page">
      {/* Header */}
      <div className="td-header">
        <div className="td-header-glow" />
        <div className="td-header-left">
          <p className="td-greeting">{greeting()}</p>
          <h1 className="td-name">{tutor?.name || 'Tutor'}</h1>
          <div className="td-role-badge">
            <span className="td-role-dot" />
            Tutor
          </div>
          <p className="td-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="td-header-right">
          <div className="td-avatar-wrap">
            <img
              src={tutor?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor?.name || 'Tutor')}&background=8b5cf6&color=fff&size=128`}
              alt="avatar"
              className="td-avatar"
            />
            <span className="td-online-dot" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="td-stats">
        {statsCards.map((s, i) => (
          <div key={i} className="td-stat-card" style={{ '--glow': s.glow }}>
            <div className="td-stat-icon" style={{ background: s.glow, border: `1px solid ${s.color}30` }}>
              <s.icon size={22} style={{ color: s.color }} strokeWidth={2} />
            </div>
            <div className="td-stat-body">
              <span className="td-stat-val" style={{ color: s.color }}>{loading ? '—' : s.count}</span>
              <span className="td-stat-lbl">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="td-section">
        <h2 className="td-section-title">Quick Actions</h2>
        <div className="td-actions">
          {quickActions.map((a, i) => (
            <Link key={i} to={a.to} className="td-action-card">
              <div className="td-action-icon" style={{ background: `${a.color}18`, border: `1px solid ${a.color}30` }}>
                <a.icon size={18} style={{ color: a.color }} strokeWidth={2} />
              </div>
              <span className="td-action-label">{a.label}</span>
              <ChevronRight size={16} className="td-action-chevron" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
