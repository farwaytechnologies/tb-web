import React, { useState, useEffect } from 'react';
import '../Styles/DashbordStyle/UserDashbord.css';

export default function UserDashboard() {
  // Load user from localStorage on mount
  const stored = JSON.parse(localStorage.getItem('user')) || {};
  const [user, setUser] = useState(stored);
  const [form, setForm] = useState(stored);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(stored.profilePic || '/default-profile.png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Keep form in sync if user changes externally
  useEffect(() => {
    setForm(user);
    if (user.profilePic) setPreview(user.profilePic);
  }, [user]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm(f => ({ ...f, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError(''); 
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/auth/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="techborg-user-dashboard">
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
          <h2>{user.name}</h2>
          <p className="techborg-user-role">{user.role.toUpperCase()}</p>

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
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Title:</strong> {user.title || '—'}</p>
              <p><strong>First Name:</strong> {user.firstName || '—'}</p>
              <p><strong>Middle Name:</strong> {user.middleName || '—'}</p>
              <p><strong>Last Name:</strong> {user.lastName || '—'}</p>
              <p><strong>Gender:</strong> {user.gender || '—'}</p>
            </div>
          )}

          <button
            className="techborg-edit-btn"
            onClick={() => setEditing(e => !e)}
            disabled={loading}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
