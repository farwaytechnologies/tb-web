import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/DashbordStyle/TutorDashbord.css';
import {
  Book,
  Users,
  FileText,
  GraduationCap,
  CheckCircle
} from 'lucide-react';

export default function TutorDashboard() {
  const [tutor, setTutor] = useState({});
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    blogs: 0,
    registeredStudents: 0,
    allEnrolledStudents: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'tutor') {
      navigate('/login');
    } else {
      setTutor(stored);
      fetchTutorStats(stored._id);
    }
  }, [navigate]);

  const fetchTutorStats = async (tutorId) => {
    try {
      const [coursesRes, blogsRes, usersRes, enrollmentsRes] = await Promise.all([
        fetch('https://tb-back-fyvj.onrender.com/api/courses'),
        fetch(`https://tb-back-fyvj.onrender.com/api/blogs?tutorId=${tutorId}`),
        fetch('https://tb-back-fyvj.onrender.com/api/auth/users'),
        fetch('https://tb-back-fyvj.onrender.com/api/enrollments')
      ]);

      const allCourses = await coursesRes.json();
      const blogs = await blogsRes.json();
      const users = await usersRes.json();
      const enrollments = await enrollmentsRes.json();

      const tutorCourses = allCourses.filter(course => course.instructorId === tutorId);
      const tutorCourseIds = tutorCourses.map(course => course._id);

      const enrolledCount = enrollments.filter(enr =>
        tutorCourseIds.includes(enr.courseId)
      ).length;

      const registeredStudents = users.filter(u => u.role === 'student').length;

      setStats({
        courses: tutorCourses.length,
        blogs: blogs.length,
        students: enrolledCount,
        registeredStudents,
        allEnrolledStudents: enrollments.length
      });
    } catch (err) {
      console.error('Failed to fetch tutor stats:', err);
    }
  };

  const statsCards = [
    { icon: Book, count: stats.courses, label: 'Your Courses', color: '#10b981', bgColor: '#d1fae5' },
    { icon: Users, count: stats.students, label: 'Enrolled in Your Courses', color: '#8b5cf6', bgColor: '#f3e8ff' },
    { icon: FileText, count: stats.blogs, label: 'Your Blogs', color: '#06b6d4', bgColor: '#cffafe' },
    { icon: GraduationCap, count: stats.registeredStudents, label: 'Total Registered Students', color: '#f59e0b', bgColor: '#fef3c7' },
    { icon: CheckCircle, count: stats.allEnrolledStudents, label: 'Total Enrolled Students', color: '#ec4899', bgColor: '#fce7f3' }
  ];

  const quickActions = [
    { to: '/tutor/courses', icon: Book, label: 'Manage Courses', color: '#10b981' },
    { to: '/tutor/blogs', icon: FileText, label: 'Manage Blogs', color: '#06b6d4' },
    { to: '/tutor/students', icon: Users, label: 'Manage Students', color: '#8b5cf6' }
  ];

  return (
    <div className="tutor-dashboard">
      {/* Header Section */}
      <div className="tutor-dashboard__header">
        <div className="tutor-dashboard__header-content">
          <div className="tutor-dashboard__header-text">
            <h1 className="tutor-dashboard__title">Welcome back, {tutor.name}</h1>
            <p className="tutor-dashboard__subtitle">Here's your teaching dashboard</p>
          </div>
          <div className="tutor-dashboard__header-avatar">
            <img
              src={tutor.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=8b5cf6&color=fff&size=128`}
              alt="Tutor"
              className="tutor-dashboard__avatar"
            />
            <div className="tutor-dashboard__status"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="tutor-dashboard__stats">
        {statsCards.map((stat, index) => (
          <div key={index} className="tutor-dashboard__stat-card">
            <div className="tutor-dashboard__stat-icon" style={{ backgroundColor: stat.bgColor }}>
              <stat.icon size={24} style={{ color: stat.color }} strokeWidth={2} />
            </div>
            <div className="tutor-dashboard__stat-content">
              <h3 className="tutor-dashboard__stat-count">{stat.count}</h3>
              <p className="tutor-dashboard__stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="tutor-dashboard__actions-section">
        <h2 className="tutor-dashboard__section-title">Quick Actions</h2>
        <div className="tutor-dashboard__actions-grid">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className="tutor-dashboard__action-card"
            >
              <div className="tutor-dashboard__action-icon" style={{ color: action.color }}>
                <action.icon size={20} strokeWidth={2} />
              </div>
              <span className="tutor-dashboard__action-label">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}