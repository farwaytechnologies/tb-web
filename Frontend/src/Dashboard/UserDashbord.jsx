import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/UserDashbord.css';
import { FaUserEdit, FaCertificate, FaBookOpen, FaLifeRing } from 'react-icons/fa';

function UserDashboard() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (stored) setUser(stored);
  }, []);

  return (
    <div className="user-dashboard-container">
      {/* Header */}
      <div className="user-dashboard-header">
        <div className="user-dashboard-user-info">
          <img
            src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
            alt="User"
            className="user-dashboard-avatar"
          />
          <div>
            <h2>Hello, {user.name}</h2>
            <p className="user-dashboard-role">Student Dashboard</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="user-dashboard-stats-grid">
        <div className="user-dashboard-stat-card">
          <h3>4</h3>
          <p>Courses Enrolled</p>
        </div>
        <div className="user-dashboard-stat-card">
          <h3>12</h3>
          <p>Lessons Completed</p>
        </div>
        <div className="user-dashboard-stat-card">
          <h3>2</h3>
          <p>Certificates Earned</p>
        </div>
        <div className="user-dashboard-stat-card">
          <h3>1</h3>
          <p>Upcoming Exams</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="user-dashboard-quick-actions">
        <h3>Quick Actions</h3>
        <div className="user-dashboard-action-grid">
          <a href="/user-profile" className="user-dashboard-action-card">
            <FaUserEdit size={24} />
            <span>My Profile</span>
          </a>
          <a href="/courses" className="user-dashboard-action-card">
            <FaBookOpen size={24} />
            <span>Start Learning</span>
          </a>
          <a href="/certificates" className="user-dashboard-action-card">
            <FaCertificate size={24} />
            <span>Certificates</span>
          </a>
          <a href="/support" className="user-dashboard-action-card">
            <FaLifeRing size={24} />
            <span>Support</span>
          </a>
        </div>
      </div>

      {/* Announcement */}
      <div className="user-dashboard-announcement">
        <h3>Announcements</h3>
        <div className="user-dashboard-announcement-box">
          <p>🚀 New course on AI Tools has been launched. Enroll now!</p>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
