import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/DashbordStyle/AdminDashbord.css';
import {
  FaUsers,
  FaBook,
  FaUserShield,
  FaBlog,
  FaCheckCircle,
  FaLightbulb,
  FaUserGraduate,
  FaUserTie,
  FaBell
} from 'react-icons/fa';

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
          fetch('VITE_API_URL/api/auth/users'),
          fetch('VITE_API_URL/api/courses'),
          fetch('VITE_API_URL/api/blogs'),
          fetch('VITE_API_URL/api/enrollments')
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

  return (
    <div className="techborg-admin-dashboard-container">
      {/* Header */}
      <div className="techborg-admin-header">
        <div>
          <h2>Welcome, {admin.name}</h2>
          <p className="techborg-admin-role">Administrator Panel</p>
        </div>
        <img
          src={admin.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}`}
          alt="Admin"
          className="techborg-admin-avatar"
        />
      </div>

      {/* Stats Cards */}
      <div className="techborg-admin-stats">
        <div className="techborg-admin-card">
          <FaUsers size={28} />
          <h3>{userCount}</h3>
          <p>Registered Users</p>
        </div>
        <div className="techborg-admin-card">
          <FaUserGraduate size={28} />
          <h3>{studentCount}</h3>
          <p>Registered Students</p>
        </div>
        <div className="techborg-admin-card">
          <FaUserTie size={28} />
          <h3>{adminCount}</h3>
          <p>Admins</p>
        </div>
        <div className="techborg-admin-card">
          <FaUserShield size={28} />
          <h3>{tutorCount}</h3>
          <p>Tutors</p>
        </div>
        <div className="techborg-admin-card">
          <FaBook size={28} />
          <h3>{courseCount}</h3>
          <p>Courses Offered</p>
        </div>
        <div className="techborg-admin-card">
          <FaBlog size={28} />
          <h3>{blogCount}</h3>
          <p>Total Blogs</p>
        </div>
        <div className="techborg-admin-card">
          <FaCheckCircle size={28} />
          <h3>{enrollmentCount}</h3>
          <p>Enrolled Students</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="techborg-admin-action-grid">
        <Link to="/admin/users" className="techborg-admin-action-btn">Manage Users</Link>
        <Link to="/admin/courses" className="techborg-admin-action-btn">Manage Courses</Link>
        <Link to="/admin/tutors" className="techborg-admin-action-btn">Manage Tutors</Link>
        <Link to="/admin/manage-admins" className="techborg-admin-action-btn">
          <FaUserShield style={{ marginRight: '8px' }} />
          Manage Admins
        </Link>
        <Link to="/admin/blogs" className="techborg-admin-action-btn">
          <FaBlog style={{ marginRight: '8px' }} />
          Manage Blogs
        </Link>
        <Link to="/admin/enrollments" className="techborg-admin-action-btn">Enrollment List</Link>
        <Link to="/admin/innovations" className="techborg-admin-action-btn">
          <FaLightbulb style={{ marginRight: '8px' }} />
          Manage Innovations
        </Link>
        <Link to="/admin/manage-cms" className="techborg-admin-action-btn">
          <FaCheckCircle style={{ marginRight: '8px' }} />
          Manage CMS
        </Link>
        <Link to="/admin/view-contact" className="techborg-admin-action-btn">
          <FaUsers style={{ marginRight: '8px' }} />
          View Contact Messages
        </Link>
        {/* ✅ Manage Notifications Link */}
        <Link to="/admin/manage-notifications" className="techborg-admin-action-btn">
          <FaBell style={{ marginRight: '8px' }} />
          Manage Notifications
        </Link>
        <Link to="/admin/add-job" className="techborg-admin-action-btn">
          <FaBell style={{ marginRight: '8px' }} />
          Add Job Alert
        </Link>
         <Link to="/admin/applications" className="techborg-admin-action-btn">
          <FaBell style={{ marginRight: '8px' }} />
          Admin View Applications
        </Link>
      </div>
    </div>
  );
}
