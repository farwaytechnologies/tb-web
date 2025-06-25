import React from 'react';
import '../Styles/DashbordStyle/AdminDashbord.css';

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="techborg-admin-dashboard">
      <h1>Admin Panel: {user.name || 'Admin'} 🛠</h1>
      <p>Monitor users, manage roles, and control platform settings.</p>
    </div>
  );
}

export default AdminDashboard;
