import React from 'react';
import '../Styles/PagesStyle/AdminDashbord.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-dashboard-section">
        <h2>Add New Course</h2>
        <p>Manage your LMS by adding new content and lessons.</p>
      </div>
      <div className="admin-dashboard-section">
        <h2>Manage Users</h2>
        <p>View and control user access, roles, and activity.</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
