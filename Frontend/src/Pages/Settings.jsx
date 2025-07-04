import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/SettingStyle.css';

export default function Settings() {
  const [form, setForm] = useState({});
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  // Fetch user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setForm(storedUser);
    }
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/auth/update/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Profile updated successfully');
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Something went wrong while updating profile');
    }
  };

  const updatePassword = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, ...passwords }),
      });

      const data = await res.json();
      setMessage(data.message || 'Password change failed');
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Something went wrong while changing password');
    }
  };

  const deleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/api/auth/delete/${form.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        localStorage.clear();
        window.location.href = '/';
      } else {
        const data = await res.json();
        setMessage(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage('Something went wrong while deleting account');
    }
  };

  return (
    <div className="settings-page">
      <h2 className="settings-title">Account Settings</h2>
      {message && <p className="settings-success">{message}</p>}

      <div className="settings-card">
        <h3 className="settings-heading">Profile Info</h3>
        <input
          name="name"
          value={form.name || ''}
          onChange={handleFormChange}
          placeholder="Name"
        />
        <input
          name="title"
          value={form.title || ''}
          onChange={handleFormChange}
          placeholder="Title"
        />
        <input
          name="gender"
          value={form.gender || ''}
          onChange={handleFormChange}
          placeholder="Gender"
        />
        <button onClick={updateProfile} className="settings-btn">Save Profile</button>
      </div>

      <div className="settings-card">
        <h3 className="settings-heading">Password & Security</h3>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          onChange={handlePasswordChange}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          onChange={handlePasswordChange}
        />
        <button onClick={updatePassword} className="settings-btn">Change Password</button>
      </div>

      <div className="settings-card danger-zone">
        <h3 className="settings-heading">Danger Zone</h3>
        <button onClick={deleteAccount} className="settings-delete-btn">Delete My Account</button>
      </div>
    </div>
  );
}
