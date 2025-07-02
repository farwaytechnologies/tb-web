import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaBlog, FaUsers } from 'react-icons/fa';
import '../Styles/DashbordStyle/TutorDashbord.css';

export default function TutorDashboard() {
  const [tutor, setTutor] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'tutor') {
      navigate('/login');
    } else {
      setTutor(stored);
    }
  }, [navigate]);

  return (
    <div className="techborg-tutor-dashboard-container">
      {/* Header */}
      <div className="techborg-tutor-header">
        <div>
          <h2>Welcome, {tutor.name}</h2>
          <p className="techborg-tutor-role">Tutor Panel</p>
        </div>
        <img
          src={tutor.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}`}
          alt="Tutor"
          className="techborg-tutor-avatar"
        />
      </div>

      {/* Stats */}
      <div className="techborg-tutor-stats">
        <div className="techborg-tutor-card">
          <FaBook size={28} />
          <h3>12</h3>
          <p>Your Courses</p>
        </div>
        <div className="techborg-tutor-card">
          <FaUsers size={28} />
          <h3>340</h3>
          <p>Enrolled Students</p>
        </div>
        <div className="techborg-tutor-card">
          <FaBlog size={28} />
          <h3>5</h3>
          <p>Your Blogs</p>
        </div>
      </div>

      {/* Actions */}
      <div className="techborg-tutor-actions">
        <h3>Quick Actions</h3>
        <div className="techborg-tutor-action-grid">
          <a href="/tutor/courses" className="techborg-tutor-action-btn">
            Manage Courses
          </a>
          <a href="/tutor/blogs" className="techborg-tutor-action-btn">
            <FaBlog style={{ marginRight: '8px' }} />
            Manage Blogs
          </a>
          <a href="/admin/users" className="techborg-tutor-action-btn">
            Manage Students
          </a>
        </div>
      </div>
    </div>
  );
}
