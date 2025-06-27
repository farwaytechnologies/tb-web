import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/SettingStyle.css';

export default function Settings() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState(storedUser || {});
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [preferences, setPreferences] = useState({ language: '', theme: '' });
  const [privacy, setPrivacy] = useState({ showProfile: true, emailNotifications: true });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (storedUser) {
      setPreferences({
        language: storedUser.language || '',
        theme: storedUser.theme || '',
      });
      setPrivacy({
        showProfile: storedUser.showProfile ?? true,
        emailNotifications: storedUser.emailNotifications ?? true,
      });
    }
  }, [storedUser]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });
  const handlePrefChange = (e) => setPreferences({ ...preferences, [e.target.name]: e.target.value });
  const handlePrivacyChange = (e) => setPrivacy({ ...privacy, [e.target.name]: e.target.checked });

  const updateProfile = async () => {
    const res = await fetch(`http://localhost:8000/api/auth/update/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Profile updated');
    }
  };

  const updatePassword = async () => {
    const res = await fetch('http://localhost:8000/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, ...passwords }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const savePreferences = async () => {
    const res = await fetch(`http://localhost:8000/api/auth/preferences/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const savePrivacy = async () => {
    const res = await fetch(`http://localhost:8000/api/auth/privacy/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(privacy),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      await fetch(`http://localhost:8000/api/auth/delete/${form.id}`, {
        method: 'DELETE',
      });
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="settings-page">
      <h2 className="settings-title">Account Settings</h2>
      {message && <p className="settings-success">{message}</p>}

      <div className="settings-card">
        <h3 className="settings-heading">Profile Info</h3>
        <input name="name" value={form.name || ''} onChange={handleFormChange} placeholder="Name" />
        <input name="title" value={form.title || ''} onChange={handleFormChange} placeholder="Title" />
        <input name="gender" value={form.gender || ''} onChange={handleFormChange} placeholder="Gender" />
        <button onClick={updateProfile} className="settings-btn">Save Profile</button>
      </div>

      <div className="settings-card">
        <h3 className="settings-heading">Password & Security</h3>
        <input type="password" name="currentPassword" placeholder="Current Password" onChange={handlePasswordChange} />
        <input type="password" name="newPassword" placeholder="New Password" onChange={handlePasswordChange} />
        <button onClick={updatePassword} className="settings-btn">Change Password</button>
      </div>

      <div className="settings-card">
        <h3 className="settings-heading">Preferences</h3>
        <select name="language" value={preferences.language} onChange={handlePrefChange}>
          <option value="">Select Language</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
        <select name="theme" value={preferences.theme} onChange={handlePrefChange}>
          <option value="">Select Theme</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <button onClick={savePreferences} className="settings-btn">Save Preferences</button>
      </div>

      <div className="settings-card">
        <h3 className="settings-heading">Privacy Settings</h3>
        <label>
          <input type="checkbox" name="showProfile" checked={privacy.showProfile} onChange={handlePrivacyChange} />
          Show Profile Publicly
        </label>
        <label>
          <input type="checkbox" name="emailNotifications" checked={privacy.emailNotifications} onChange={handlePrivacyChange} />
          Receive Email Notifications
        </label>
        <button onClick={savePrivacy} className="settings-btn">Save Privacy Settings</button>
      </div>

      <div className="settings-card danger-zone">
        <h3 className="settings-heading">Danger Zone</h3>
        <button onClick={deleteAccount} className="settings-delete-btn">Delete My Account</button>
      </div>
    </div>
  );
}
