import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/DashbordStyle/AdminDashbord.css';
import { FaUsers, FaBook, FaUserShield, FaChartBar } from 'react-icons/fa';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'admin') {
      navigate('/login');
    } else {
      setAdmin(stored);
    }
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
          <h3>134</h3>
          <p>Registered Users</p>
        </div>
        <div className="techborg-admin-card">
          <FaBook size={28} />
          <h3>24</h3>
          <p>Courses Offered</p>
        </div>
        <div className="techborg-admin-card">
          <FaUserShield size={28} />
          <h3>5</h3>
          <p>Tutors</p>
        </div>
        <div className="techborg-admin-card">
          <FaChartBar size={28} />
          <h3>92%</h3>
          <p>Platform Uptime</p>
        </div>
      </div>

      {/* Actions */}
      <div className="techborg-admin-actions">
        <h3>Quick Actions</h3>
        <div className="techborg-admin-action-grid">
          <a href="/admin/users" className="techborg-admin-action-btn">Manage Users</a>
          <a href="/admin/courses" className="techborg-admin-action-btn">Manage Courses</a>
          <a href="/admin/tutors" className="techborg-admin-action-btn">Manage Tutors</a>
          <a href="/admin/settings" className="techborg-admin-action-btn">Platform Settings</a>
        </div>
      </div>
    </div>
  );
}
