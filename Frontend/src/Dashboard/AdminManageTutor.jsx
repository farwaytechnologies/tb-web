import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageTutor.css';

function AdminManageTutor() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTutors = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/auth/users')
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
      const res = await fetch(`http://localhost:8000/api/auth/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchTutors(); // refresh list after delete
    } catch (err) {
      console.error('Error deleting tutor:', err);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div className="admin-tutor-container">
      <h2>All Registered Tutors</h2>
      {loading ? (
        <p>Fetching tutor data...</p>
      ) : tutors.length === 0 ? (
        <p>No tutors found.</p>
      ) : (
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
                    src={tutor.profilePic || '/default-profile.png'}
                    alt="Profile"
                    className="admin-tutor-avatar"
                  />
                </td>
                <td>{tutor.name}</td>
                <td>{tutor.email}</td>
                <td>{tutor.role}</td>
                <td>{tutor.gender || 'N/A'}</td>
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
      )}
    </div>
  );
}

export default AdminManageTutor;
