import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/DashbordStyle/AdminDashbord.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
import {
  Users,
  BookOpen,
  Shield,
  FileText,
  CheckCircle,
  Lightbulb,
  GraduationCap,
  UserCog,
  Bell,
  Newspaper,
  Code,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  TrendingUp,
  Trophy,
  Coins,
  ClipboardList
} from 'lucide-react';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [tutorCount, setTutorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'admin') {
      navigate('/login');
    } else {
      setAdmin(stored);
    }

    const fetchStats = async () => {
      try {
        const [usersRes, coursesRes, blogsRes, enrollmentsRes] = await Promise.all([
          fetch(`${API_URL}/api/auth/users`),
          fetch(`${API_URL}/api/courses`),
          fetch(`${API_URL}/api/blogs`),
          fetch(`${API_URL}/api/enrollments`)
        ]);

        const users = await usersRes.json();
        const courses = await coursesRes.json();
        const blogs = await blogsRes.json();
        const enrollments = await enrollmentsRes.json();

        setUserCount(users.length);
        setTutorCount(users.filter(u => u.role === 'tutor').length);
        setStudentCount(users.filter(u => u.role === 'student').length);
        setAdminCount(users.filter(u => u.role === 'admin').length);
        setCourseCount(courses.length);
        setBlogCount(blogs.length);
        setEnrollmentCount(enrollments.length);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, [navigate]);

  const statsCards = [
    { icon: Users, count: userCount, label: 'Total Users', color: '#6366f1', bgColor: '#eef2ff' },
    { icon: GraduationCap, count: studentCount, label: 'Students', color: '#8b5cf6', bgColor: '#f3e8ff' },
    { icon: Shield, count: tutorCount, label: 'Tutors', color: '#ec4899', bgColor: '#fce7f3' },
    { icon: UserCog, count: adminCount, label: 'Administrators', color: '#f59e0b', bgColor: '#fef3c7' },
    { icon: BookOpen, count: courseCount, label: 'Courses', color: '#10b981', bgColor: '#d1fae5' },
    { icon: FileText, count: blogCount, label: 'Blog Posts', color: '#06b6d4', bgColor: '#cffafe' },
    { icon: CheckCircle, count: enrollmentCount, label: 'Enrollments', color: '#14b8a6', bgColor: '#ccfbf1' },
    { icon: TrendingUp, count: '98%', label: 'Success Rate', color: '#84cc16', bgColor: '#ecfccb' }
  ];

  const quickActions = [
    { to: '/admin/users', icon: Users, label: 'Manage Users', color: '#6366f1' },
    { to: '/admin/courses', icon: BookOpen, label: 'Manage Courses', color: '#10b981' },
    { to: '/admin/tutors', icon: Shield, label: 'Manage Tutors', color: '#ec4899' },
    { to: '/admin/manage-admins', icon: UserCog, label: 'Manage Admins', color: '#f59e0b' },
    { to: '/admin/blogs', icon: FileText, label: 'Manage Blogs', color: '#06b6d4' },
    { to: '/admin/news', icon: Newspaper, label: 'Manage News', color: '#8b5cf6' },
    { to: '/admin/enrollments', icon: CheckCircle, label: 'Enrollment List', color: '#14b8a6' },
    { to: '/admin/innovations', icon: Lightbulb, label: 'Manage Innovations', color: '#eab308' },
    { to: '/admin/manage-cms', icon: Settings, label: 'Manage CMS', color: '#64748b' },
    { to: '/admin/view-contact', icon: MessageSquare, label: 'Contact Messages', color: '#3b82f6' },
    { to: '/admin/manage-notifications', icon: Bell, label: 'Notifications', color: '#ef4444' },
    { to: '/admin/add-job', icon: Briefcase, label: 'Post Job Alert', color: '#f97316' },
    { to: '/admin/applications', icon: FileText, label: 'View Applications', color: '#0ea5e9' },
    { to: '/admin/visitors', icon: BarChart3, label: 'Visitor Analytics', color: '#a855f7' },
    { to: '/admin/manage-learn', icon: Code, label: 'Manage Learn Section', color: '#22c55e' },
    { to: '/admin/rewards', icon: Trophy, label: 'Manage Rewards', color: '#f59e0b' },
    { to: '/admin/borgcoins', icon: Coins, label: 'BorgCoins', color: '#f59e0b' },
    { to: '/admin/exams', icon: ClipboardList, label: 'Manage Exams', color: '#6366f1' }
  ];

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <div className="admin-dashboard__header">
        <div className="admin-dashboard__header-content">
          <div className="admin-dashboard__header-text">
            <h1 className="admin-dashboard__title">Welcome back, {admin.name}</h1>
            <p className="admin-dashboard__subtitle">Here's what's happening with your platform today</p>
          </div>
          <div className="admin-dashboard__header-avatar">
            <img
              src={admin.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=6366f1&color=fff&size=128`}
              alt="Admin"
              className="admin-dashboard__avatar"
            />
            <div className="admin-dashboard__status"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-dashboard__stats">
        {statsCards.map((stat, index) => (
          <div key={index} className="admin-dashboard__stat-card">
            <div className="admin-dashboard__stat-icon" style={{ backgroundColor: stat.bgColor }}>
              <stat.icon size={24} style={{ color: stat.color }} strokeWidth={2} />
            </div>
            <div className="admin-dashboard__stat-content">
              <h3 className="admin-dashboard__stat-count">{stat.count}</h3>
              <p className="admin-dashboard__stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="admin-dashboard__actions-section">
        <h2 className="admin-dashboard__section-title">Quick Actions</h2>
        <div className="admin-dashboard__actions-grid">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className="admin-dashboard__action-card"
            >
              <div className="admin-dashboard__action-icon" style={{ color: action.color }}>
                <action.icon size={20} strokeWidth={2} />
              </div>
              <span className="admin-dashboard__action-label">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}