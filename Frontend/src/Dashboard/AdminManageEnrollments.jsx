import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageEnrollments.css';

function AdminManageEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/enrollments');
      const data = await res.json();
      setEnrollments(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:8000/api/enrollments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchEnrollments(); // Refresh data
    } catch (err) {
      console.error(`Failed to ${status.toLowerCase()} enrollment:`, err);
    }
  };

  const deleteEnrollment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enrollment?')) return;
    try {
      await fetch(`http://localhost:8000/api/enrollments/${id}`, {
        method: 'DELETE'
      });
      fetchEnrollments();
    } catch (err) {
      console.error('Failed to delete enrollment:', err);
    }
  };

  const downloadCSV = () => {
    if (enrollments.length === 0) return;

    const header = [
      "Full Name", "Email", "Phone", "Course", "Status", "Message", "Enrolled At"
    ];

    const rows = enrollments.map(e => [
      `"${e.fullName}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.courseId?.title || ''}"`,
      `"${e.status}"`,
      `"${e.message || ''}"`,
      `"${new Date(e.enrolledAt).toLocaleString()}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enrollments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="admin-enrollments-loading">Loading...</div>;
  }

  return (
    <div className="admin-enrollments-container">
      <h2>Manage Enrollments</h2>
      <button className="btn-download" onClick={downloadCSV}>Download CSV</button>
      {enrollments.length === 0 ? (
        <p>No enrollments found.</p>
      ) : (
        <table className="admin-enrollments-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Status</th>
              <th>Message</th>
              <th>Enrolled At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enroll) => (
              <tr key={enroll._id}>
                <td>{enroll.fullName}</td>
                <td>{enroll.email}</td>
                <td>{enroll.phone}</td>
                <td>{enroll.courseId?.title || '—'}</td>
                <td>
                  <span className={`status-badge ${enroll.status.toLowerCase()}`}>
                    {enroll.status}
                  </span>
                </td>
                <td>{enroll.message || '—'}</td>
                <td>{new Date(enroll.enrolledAt).toLocaleString()}</td>
                <td>
                  <div className="admin-enrollments-actions">
                    {enroll.status === 'Pending' && (
                      <>
                        <button
                          className="btn-accept"
                          onClick={() => updateStatus(enroll._id, 'Accepted')}
                        >
                          Accept
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => updateStatus(enroll._id, 'Rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => deleteEnrollment(enroll._id)}
                    >
                      Delete
                    </button>
                  </div>
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
