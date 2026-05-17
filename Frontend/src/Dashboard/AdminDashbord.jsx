import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/DashbordStyle/AdminDashbord.css';
import {
  Users, BookOpen, Shield, FileText, CheckCircle, Lightbulb,
  GraduationCap, UserCog, Bell, Newspaper, Code, Briefcase,
  MessageSquare, BarChart3, Settings, TrendingUp, Trophy,
  Coins, ClipboardList, Receipt, ChevronRight, Gift, FileBarChart
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const ACTION_GROUPS = [
  {
    label: 'Users & Roles',
    items: [
      { to: '/admin/users',         icon: Users,       label: 'Manage Users',    color: '#6366f1' },
      { to: '/admin/tutors',        icon: Shield,      label: 'Manage Tutors',   color: '#ec4899' },
      { to: '/admin/manage-admins', icon: UserCog,     label: 'Manage Admins',   color: '#f59e0b' },
      { to: '/admin/sales-reps',    icon: Briefcase,   label: 'Sales Executives', color: '#06b6d4' },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/courses',       icon: BookOpen,    label: 'Courses',         color: '#10b981' },
      { to: '/admin/blogs',         icon: FileText,    label: 'Blogs',           color: '#06b6d4' },
      { to: '/admin/news',          icon: Newspaper,   label: 'News',            color: '#8b5cf6' },
      { to: '/admin/innovations',   icon: Lightbulb,   label: 'Innovations',     color: '#eab308' },
      { to: '/admin/manage-learn',  icon: Code,        label: 'Learn Section',   color: '#22c55e' },
    ],
  },
  {
    label: 'Learning',
    items: [
      { to: '/admin/enrollments',   icon: CheckCircle, label: 'Enrollments',     color: '#14b8a6' },
      { to: '/admin/exams',         icon: ClipboardList,label: 'Exams',          color: '#6366f1' },
      { to: '/admin/invoices',      icon: Receipt,     label: 'Invoices',        color: '#10b981' },
      { to: '/admin/rewards',       icon: Trophy,      label: 'Rewards',         color: '#f59e0b' },
      { to: '/admin/borgcoins',     icon: Coins,       label: 'BorgCoins',       color: '#f97316' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/admin/add-job',       icon: Briefcase,   label: 'Post Job',        color: '#f97316' },
      { to: '/admin/applications',  icon: FileText,    label: 'Applications',    color: '#0ea5e9' },
      { to: '/admin/view-contact',  icon: MessageSquare,label: 'Contact Msgs',   color: '#3b82f6' },
      { to: '/admin/manage-notifications', icon: Bell, label: 'Notifications',   color: '#ef4444' },
      { to: '/admin/visitors',      icon: BarChart3,   label: 'Analytics',       color: '#a855f7' },
      { to: '/admin/security',      icon: Shield,      label: 'Security',         color: '#ef4444' },
      { to: '/admin/referrals',       icon: Gift,        label: 'Referrals',        color: '#10b981' },
      { to: '/admin/se-withdrawals',      icon: Coins,         label: 'SE Withdrawals',    color: '#f59e0b' },
      { to: '/admin/se-report-tracking',  icon: FileBarChart,  label: 'SE Report Tracking', color: '#06b6d4' },
      { to: '/admin/manage-cms',    icon: Settings,    label: 'CMS',             color: '#64748b' },
    ],
  },
];

export default function AdminDashboard() {
  const [admin, setAdmin] = useState({});
  const [stats, setStats] = useState({ users: 0, students: 0, tutors: 0, admins: 0, courses: 0, blogs: 0, enrollments: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'admin') { navigate('/login'); return; }
    setAdmin(stored);

    Promise.all([
      fetch(`${API}/api/auth/users`).then(r => r.json()),
      fetch(`${API}/api/courses`).then(r => r.json()),
      fetch(`${API}/api/blogs`).then(r => r.json()),
      fetch(`${API}/api/enrollments`).then(r => r.json()),
    ]).then(([users, courses, blogs, enrollments]) => {
      setStats({
        users: users.length,
        students: users.filter(u => u.role === 'student').length,
        tutors: users.filter(u => u.role === 'tutor').length,
        admins: users.filter(u => u.role === 'admin').length,
        courses: courses.length,
        blogs: blogs.length,
        enrollments: enrollments.length,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, [navigate]);

  const STAT_CARDS = [
    { icon: Users,       value: stats.users,       label: 'Total Users',   color: '#6366f1', glow: 'rgba(99,102,241,0.2)'  },
    { icon: GraduationCap,value: stats.students,   label: 'Students',      color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)'  },
    { icon: Shield,      value: stats.tutors,       label: 'Tutors',        color: '#ec4899', glow: 'rgba(236,72,153,0.2)'  },
    { icon: BookOpen,    value: stats.courses,      label: 'Courses',       color: '#10b981', glow: 'rgba(16,185,129,0.2)'  },
    { icon: FileText,    value: stats.blogs,        label: 'Blog Posts',    color: '#06b6d4', glow: 'rgba(6,182,212,0.2)'   },
    { icon: CheckCircle, value: stats.enrollments,  label: 'Enrollments',   color: '#14b8a6', glow: 'rgba(20,184,166,0.2)'  },
    { icon: UserCog,     value: stats.admins,       label: 'Admins',        color: '#f59e0b', glow: 'rgba(245,158,11,0.2)'  },
    { icon: TrendingUp,  value: '98%',              label: 'Success Rate',  color: '#84cc16', glow: 'rgba(132,204,22,0.2)'  },
  ];

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="adm-page">
      {/* Header */}
      <div className="adm-header">
        <div className="adm-header-glow" />
        <div className="adm-header-left">
          <p className="adm-greeting">{greeting} 👋</p>
          <h1 className="adm-title">{admin.name || 'Admin'}</h1>
          <p className="adm-subtitle">Here's what's happening on your platform today.</p>
        </div>
        <div className="adm-header-right">
          <div className="adm-avatar-wrap">
            <img
              src={admin.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name || 'A')}&background=6366f1&color=fff&size=128`}
              alt={admin.name}
              className="adm-avatar"
            />
            <span className="adm-online-dot" />
          </div>
          <div className="adm-header-meta">
            <span className="adm-role-badge">Administrator</span>
            <p className="adm-date">{now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="adm-stats">
        {STAT_CARDS.map((s, i) => (
          <div key={i} className="adm-stat" style={{ '--glow': s.glow, '--color': s.color }}>
            <div className="adm-stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
              <s.icon size={22} strokeWidth={2} />
            </div>
            <div className="adm-stat-body">
              <p className="adm-stat-val">{loading ? '—' : s.value}</p>
              <p className="adm-stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions — grouped */}
      <div className="adm-actions-wrap">
        {ACTION_GROUPS.map((group) => (
          <div key={group.label} className="adm-group">
            <h3 className="adm-group-title">{group.label}</h3>
            <div className="adm-group-grid">
              {group.items.map((item) => (
                <Link key={item.to} to={item.to} className="adm-action" style={{ '--c': item.color }}>
                  <div className="adm-action-icon" style={{ background: `${item.color}18`, color: item.color }}>
                    <item.icon size={18} strokeWidth={2} />
                  </div>
                  <span className="adm-action-label">{item.label}</span>
                  <ChevronRight size={14} className="adm-action-arrow" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
