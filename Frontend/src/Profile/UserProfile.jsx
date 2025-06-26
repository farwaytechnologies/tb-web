import React, { useState, useEffect } from 'react';
import '../Styles/ProfileStyle/UserProfile.css';

export default function UserProfile() {
  const stored = JSON.parse(localStorage.getItem('user')) || {};
  const [user, setUser] = useState(stored);
  const [form, setForm] = useState(stored);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(stored.profilePic || '/default-profile.png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(user);
    if (user.profilePic) setPreview(user.profilePic);
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm({ ...form, profilePic: reader.result });
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
    <div className="techborg-profile-page">
      <div className="techborg-profile-container">
        <div className="techborg-profile-header">
          <div>
            <img
              src={preview}
              alt="Profile"
              className="techborg-profile-avatar"
            />
            {editing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="techborg-profile-file"
              />
            )}
          </div>
          <div>
            <h2>{form.name}</h2>
            <p className="techborg-profile-role">{user.role?.toUpperCase()}</p>
          </div>
        </div>

        <div className="techborg-profile-body">
          {error && <p className="techborg-error">{error}</p>}

          {editing ? (
            <>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={form.email || ''} disabled />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input name="title" value={form.title || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" value={form.firstName || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Middle Name</label>
                <input name="middleName" value={form.middleName || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" value={form.lastName || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <input name="gender" value={form.gender || ''} onChange={handleChange} />
              </div>

              <button onClick={handleSave} disabled={loading} className="btn-save">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <div className="techborg-profile-display">
              <p><strong>Name:</strong> {form.name}</p>
              <p><strong>Email:</strong> {form.email}</p>
              <p><strong>Title:</strong> {form.title || '—'}</p>
              <p><strong>First Name:</strong> {form.firstName || '—'}</p>
              <p><strong>Middle Name:</strong> {form.middleName || '—'}</p>
              <p><strong>Last Name:</strong> {form.lastName || '—'}</p>
              <p><strong>Gender:</strong> {form.gender || '—'}</p>
            </div>
          )}

          <button onClick={() => setEditing(!editing)} className="btn-edit">
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
