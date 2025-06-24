import React from 'react';
import '../Styles/PagesStyle/UserDashbord.css';

function UserDashboard() {
  return (
    <div className="user-dashboard">
      <h1>Welcome to Your Learning Dashboard</h1>
      <div className="user-dashboard-section">
        <h2>Your Courses</h2>
        <p>You’re enrolled in 3 courses. Start learning today!</p>
      </div>
      <div className="user-dashboard-section">
        <h2>Certificates</h2>
        <p>You can download your certificates after completion.</p>
      </div>
    </div>
  );
}

export default UserDashboard;
