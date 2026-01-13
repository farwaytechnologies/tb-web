import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageUser.css';

function AdminManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch('https://tb-back-fyvj.onrender.com/api/auth/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        // Display all users (not filtered by role)
        setUsers(data);
      })
      .catch(err => console.error('Error fetching users:', err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      const res = await fetch(`https://tb-back-fyvj.onrender.com/api/auth/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-user-container">
      <h2 className="admin-user-title">All Registered Users ({users.length})</h2>
      {loading ? (
        <div className="admin-loading">Fetching user data...</div>
      ) : users.length === 0 ? (
        <div className="admin-no-data">No users found.</div>
      ) : (
        <div className="admin-user-table-wrapper">
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
                      src={user.profilePic || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      className="admin-user-avatar"
                    />
                  </td>
                  <td className="admin-cell-text">{user.name}</td>
                  <td className="admin-cell-text">{user.email}</td>
                  <td className="admin-cell-text">{user.role}</td>
                  <td className="admin-cell-text">{user.gender || 'N/A'}</td>
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
        </div>
      )}
    </div>
  );
}

export default AdminManageUser;