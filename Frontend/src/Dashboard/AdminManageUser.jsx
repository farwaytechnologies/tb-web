import { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageUser.css';

const API = import.meta.env.VITE_API_URL;

export default function AdminManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API}/api/auth/users`)
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error('Error fetching users:', err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`${API}/api/auth/delete/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

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
                <th>Referral Code</th>
                <th>Gender</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=40`}
                      alt="Profile"
                      className="admin-user-avatar"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=40`; }}
                    />
                  </td>
                  <td className="admin-cell-text">{user.name}</td>
                  <td className="admin-cell-text">{user.email}</td>
                  <td className="admin-cell-text">{user.role}</td>
                  <td>
                    {user.referralCode
                      ? <span className="admin-ref-code">{user.referralCode}</span>
                      : <span className="admin-ref-none">—</span>}
                  </td>
                  <td className="admin-cell-text">{user.gender || 'N/A'}</td>
                  <td>
                    <button onClick={() => handleDelete(user._id)} className="admin-delete-btn">
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
