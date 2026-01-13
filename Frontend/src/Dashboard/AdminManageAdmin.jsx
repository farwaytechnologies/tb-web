import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageAdmin.css';

function AdminManageAdmin() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = () => {
    setLoading(true);
    fetch('https://tb-back-fyvj.onrender.com/api/auth/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(data => {
        const adminUsers = data.filter(user => user.role === 'admin');
        setAdmins(adminUsers);
      })
      .catch(err => console.error('Error fetching admins:', err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this admin?');
    if (!confirm) return;

    try {
      const res = await fetch(`https://tb-back-fyvj.onrender.com/api/auth/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchAdmins(); // refresh list after delete
    } catch (err) {
      console.error('Error deleting admin:', err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="admin-admin-container">
      <h2 className="admin-admin-title">All Registered Admins</h2>
      {loading ? (
        <div className="admin-admin-loading">Fetching admin data...</div>
      ) : admins.length === 0 ? (
        <div className="admin-admin-no-data">No admins found.</div>
      ) : (
        <div className="admin-admin-table-wrapper">
          <table className="admin-admin-table">
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
              {admins.map(admin => (
                <tr key={admin._id}>
                  <td>
                    <img
                      src={admin.profilePic || '/default-profile.png'}
                      alt="Profile"
                      className="admin-admin-avatar"
                    />
                  </td>
                  <td className="admin-admin-cell-text">{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.role}</td>
                  <td>{admin.gender || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className="admin-admin-delete-btn"
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

export default AdminManageAdmin;