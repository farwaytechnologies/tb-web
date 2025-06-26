import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/DashbordStyle/AdminDashbord.css';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState('/default-profile.png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'admin') {
      navigate('/login');
    } else {
      setAdmin(stored);
      setForm(stored);
      if (stored.profilePic) setPreview(stored.profilePic);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/auth/update/${admin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      localStorage.setItem('user', JSON.stringify(data.user));
      setAdmin(data.user);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="techborg-admin-dashboard">
      <div className="techborg-profile-card">
        <div className="techborg-profile-img-wrapper">
          <img src={preview} alt="Profile" className="techborg-profile-img" />
          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="techborg-profile-file"
            />
          )}
        </div>

        <div className="techborg-profile-info">
          <h2>{form.name}</h2>
          <p className="techborg-user-role">ADMIN</p>

          {error && <p className="techborg-error">{error}</p>}

          {editing ? (
            <div className="techborg-profile-form">
              <input
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                placeholder="Full Name"
              />
              <input
                name="title"
                value={form.title || ''}
                onChange={handleChange}
                placeholder="Title"
              />
              <input
                name="firstName"
                value={form.firstName || ''}
                onChange={handleChange}
                placeholder="First Name"
              />
              <input
                name="middleName"
                value={form.middleName || ''}
                onChange={handleChange}
                placeholder="Middle Name"
              />
              <input
                name="lastName"
                value={form.lastName || ''}
                onChange={handleChange}
                placeholder="Last Name"
              />
              <input
                name="gender"
                value={form.gender || ''}
                onChange={handleChange}
                placeholder="Gender"
              />
              <button
                onClick={handleSave}
                className="techborg-save-btn"
                disabled={loading}
              >
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div className="techborg-profile-fields">
              <p><strong>Name:</strong> {form.name}</p>
              <p><strong>Title:</strong> {form.title || '—'}</p>
              <p><strong>First Name:</strong> {form.firstName || '—'}</p>
              <p><strong>Middle Name:</strong> {form.middleName || '—'}</p>
              <p><strong>Last Name:</strong> {form.lastName || '—'}</p>
              <p><strong>Gender:</strong> {form.gender || '—'}</p>
              <p><strong>Email:</strong> {form.email}</p>
            </div>
          )}

          <button
            className="techborg-edit-btn"
            onClick={() => setEditing(e => !e)}
            disabled={loading}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
          <button onClick={handleLogout} className="techborg-logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
