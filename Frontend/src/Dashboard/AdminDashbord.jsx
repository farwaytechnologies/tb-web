import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/DashbordStyle/AdminDashbord.css';
import { FaUsers, FaBook, FaUserShield, FaChartBar, FaBlog } from 'react-icons/fa';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [tutorCount, setTutorCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'admin') {
      navigate('/login');
    } else {
      setAdmin(stored);
    }

    // Fetch all counts
    const fetchStats = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          fetch('http://localhost:8000/api/auth/users'),
          fetch('http://localhost:8000/api/courses')
        ]);

        const users = await usersRes.json();
        const courses = await coursesRes.json();

        setUserCount(users.length);
        setTutorCount(users.filter(u => u.role === 'tutor').length);
        setCourseCount(courses.length);
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

      {/* Stats */}
      <div className="techborg-admin-stats">
        <div className="techborg-admin-card">
          <FaUsers size={28} />
          <h3>{userCount}</h3>
          <p>Registered Users</p>
        </div>
        <div className="techborg-admin-card">
          <FaBook size={28} />
          <h3>{courseCount}</h3>
          <p>Courses Offered</p>
        </div>
        <div className="techborg-admin-card">
          <FaUserShield size={28} />
          <h3>{tutorCount}</h3>
          <p>Tutors</p>
        </div>
        <div className="techborg-admin-card">
          <FaChartBar size={28} />
          <h3>99.9%</h3>
          <p>Platform Uptime</p>
        </div>
      </div>

      {/* Actions */}
      <div className="techborg-admin-actions">
        <h3>Quick Actions</h3>
        <div className="techborg-admin-action-grid">
          <Link to="/admin/users" className="techborg-admin-action-btn">Manage Users</Link>
          <Link to="/admin/courses" className="techborg-admin-action-btn">Manage Courses</Link>
          <Link to="/admin/tutors" className="techborg-admin-action-btn">Manage Tutors</Link>
          <Link to="/admin/blogs" className="techborg-admin-action-btn">
            <FaBlog style={{ marginRight: '8px' }} />
            Manage Blogs
          </Link>
          <Link to="/admin/enrollments" className="techborg-admin-action-btn">Enrollment List</Link>
        </div>
      </div>
    </div>
  );
}
