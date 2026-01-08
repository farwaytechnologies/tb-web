import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageTutor.css';

function AdminManageTutor() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTutors = () => {
    setLoading(true);
    fetch('https://tb-back-fyvj.onrender.com/api/auth/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        const tutorUsers = data.filter(user => user.role === 'tutor');
        setTutors(tutorUsers);
      })
      .catch(err => console.error('Error fetching tutors:', err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this tutor?');
    if (!confirm) return;

    try {
      const res = await fetch(`https://tb-back-fyvj.onrender.com/api/auth/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchTutors();
    } catch (err) {
      console.error('Error deleting tutor:', err);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div className="admin-tutor-container">
      <h2 className="admin-tutor-title">All Registered Tutors</h2>
      {loading ? (
        <div className="admin-tutor-loading">Fetching tutor data...</div>
      ) : tutors.length === 0 ? (
        <div className="admin-tutor-no-data">No tutors found.</div>
      ) : (
        <div className="admin-tutor-table-wrapper">
          <table className="admin-tutor-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Gender</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map(tutor => (
                <tr key={tutor._id}>
                  <td>
                    <img
                      src={tutor.profilePic || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      className="admin-tutor-avatar"
                    />
                  </td>
                  <td className="admin-tutor-cell">{tutor.name}</td>
                  <td className="admin-tutor-cell">{tutor.email}</td>
                  <td className="admin-tutor-cell">{tutor.role}</td>
                  <td className="admin-tutor-cell">{tutor.gender || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(tutor._id)}
                      className="admin-tutor-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminManageTutor;