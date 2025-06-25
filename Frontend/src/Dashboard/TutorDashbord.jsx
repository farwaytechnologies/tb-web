import React from 'react';
import '../Styles/DashbordStyle/TutorDashbord.css';

function TutorDashboard() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="techborg-tutor-dashboard">
      <h1>Hello, {user.name || 'Tutor'} 🧑‍🏫</h1>
      <p>Manage your course content and view enrolled students here.</p>
    </div>
  );
}

export default TutorDashboard;
