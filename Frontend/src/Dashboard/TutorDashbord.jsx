import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaBook,
  FaBlog,
  FaUsers,
  FaUserGraduate,
  FaCheckCircle
} from 'react-icons/fa';
import '../Styles/DashbordStyle/TutorDashbord.css';

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
        fetch(`http://localhost:8000/api/courses`),
        fetch(`http://localhost:8000/api/blogs?tutorId=${tutorId}`),
        fetch(`http://localhost:8000/api/auth/users`),
        fetch(`http://localhost:8000/api/enrollments`)
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
          alt={`Profile of ${tutor.name}`}
          className="techborg-tutor-avatar"
        />
      </div>

      {/* Stats Cards */}
      <div className="techborg-tutor-stats">
        <div className="techborg-tutor-card">
          <FaBook size={28} />
          <h3>{stats.courses}</h3>
          <p>Your Courses</p>
        </div>
        <div className="techborg-tutor-card">
          <FaUsers size={28} />
          <h3>{stats.students}</h3>
          <p>Enrolled in Your Courses</p>
        </div>
        <div className="techborg-tutor-card">
          <FaBlog size={28} />
          <h3>{stats.blogs}</h3>
          <p>Your Blogs</p>
        </div>
        <div className="techborg-tutor-card">
          <FaUserGraduate size={28} />
          <h3>{stats.registeredStudents}</h3>
          <p>Total Registered Students</p>
        </div>
        <div className="techborg-tutor-card">
          <FaCheckCircle size={28} />
          <h3>{stats.allEnrolledStudents}</h3>
          <p>Total Enrolled Students</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="techborg-tutor-actions">
        <h3>Quick Actions</h3>
        <div className="techborg-tutor-action-grid">
          <Link to="/tutor/courses" className="techborg-tutor-action-btn">
            <FaBook style={{ marginRight: '8px' }} />
            Manage Courses
          </Link>
          <Link to="/tutor/blogs" className="techborg-tutor-action-btn">
            <FaBlog style={{ marginRight: '8px' }} />
            Manage Blogs
          </Link>
          <Link to="/admin/users" className="techborg-tutor-action-btn">
            <FaUsers style={{ marginRight: '8px' }} />
            Manage Students
          </Link>
        </div>
      </div>
    </div>
  );
}
