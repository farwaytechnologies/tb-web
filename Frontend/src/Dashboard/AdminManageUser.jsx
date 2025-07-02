import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageUser.css';

export default function AdminManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/auth/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        const studentsOnly = data.filter(user => user.role === 'student');
        setUsers(studentsOnly);
      })
      .catch(err => console.error('Error fetching users:', err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:8000/api/auth/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchUsers(); // refresh list after delete
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-user-container">
      <h2>All Registered Students</h2>
      {loading ? (
        <p>Fetching user data...</p>
      ) : users.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="admin-user-table">
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
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.profilePic || '/default-profile.png'}
                    alt="Profile"
                    className="admin-user-avatar"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.gender || 'N/A'}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="admin-delete-btn"
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
