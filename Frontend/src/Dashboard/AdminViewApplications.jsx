import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminViewApplications.css';

const AdminViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/applications');
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError('Error loading applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/applications/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setApplications(applications.filter((app) => app._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete application');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="admin-applications-container">
      <h2 className="admin-applications-heading">Job Applications</h2>

      {loading ? (
        <p className="admin-applications-loading">Loading...</p>
      ) : error ? (
        <p className="admin-applications-error">{error}</p>
      ) : applications.length === 0 ? (
        <p className="admin-applications-empty">No applications found.</p>
      ) : (
        <div className="admin-applications-list">
          {applications.map((app) => (
            <div key={app._id} className="admin-application-card">
              <h3>{app.name}</h3>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Course:</strong> {app.course}</p>
              <p><strong>Experience:</strong> {app.experience} years</p>
              <p><strong>Job ID:</strong> {app.jobId}</p>

              <a
                href={`http://localhost:8000${app.resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-view-resume"
              >
                View Resume
              </a>

              <button className="admin-delete-button" onClick={() => handleDelete(app._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminViewApplications;
