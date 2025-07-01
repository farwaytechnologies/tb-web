import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageEnrollments.css';

function AdminManageEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all enrollments
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

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:8000/api/enrollments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update status');
      }

      const updated = await res.json();
      setEnrollments((prev) =>
        prev.map((enroll) => (enroll._id === id ? updated : enroll))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

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
              <th>Status</th>
              <th>Enrolled At</th>
              <th>Action</th>
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
                <td>{enroll.status}</td>
                <td>{new Date(enroll.enrolledAt).toLocaleString()}</td>
                <td>
                  {enroll.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(enroll._id, 'Accepted')}
                        className="enroll-btn accept"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(enroll._id, 'Rejected')}
                        className="enroll-btn reject"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {enroll.status === 'Accepted' && (
                    <span className="enroll-status accepted">✓ Accepted</span>
                  )}
                  {enroll.status === 'Rejected' && (
                    <span className="enroll-status rejected">✗ Rejected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminManageEnrollments;
