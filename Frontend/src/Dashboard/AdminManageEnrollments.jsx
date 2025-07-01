import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageEnrollments.css'; // ✅ Updated path

function AdminManageEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/enrollments')
      .then((res) => res.json())
      .then((data) => {
        setEnrollments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching enrollments:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="admin-manage-enrollments-loading">Loading...</div>;
  }

  return (
    <div className="admin-manage-enrollments-container">
      <h2>Manage Enrollments</h2>
      {enrollments.length === 0 ? (
        <p>No enrollments found.</p>
      ) : (
        <table className="admin-manage-enrollments-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Message</th>
              <th>Enrolled At</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enroll) => (
              <tr key={enroll._id}>
                <td>{enroll.fullName}</td>
                <td>{enroll.email}</td>
                <td>{enroll.phone}</td>
                <td>{enroll.courseId?.title || '—'}</td>
                <td>{enroll.message || '—'}</td>
                <td>{new Date(enroll.enrolledAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminManageEnrollments;
