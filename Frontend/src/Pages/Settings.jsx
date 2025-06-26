import React, { useEffect, useState } from 'react';
import SettingsLayout from '../Layout/SettingsLayout';
import '../Styles/PagesStyle/SettingStyle.css';

export default function Settings() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState('');
  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (stored) {
      setUser(stored);
      setForm(stored);
      setPreview(stored.profilePic || '');
    }
  }, []);

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

  const saveProfile = () => {
    // PUT request to /api/auth/update/:id
  };

  const updatePassword = () => {
    // POST request to /api/auth/change-password
  };

  const deactivateAccount = () => {
    // PATCH to /api/auth/deactivate/:id
  };

  const deleteAccount = () => {
    // DELETE /api/auth/delete/:id
  };

  return (
    <SettingsLayout user={user}>
      {/* Profile Settings */}
      <div className="techborg-settings-section">
        <h3>Profile Info</h3>
        <div className="techborg-settings-profile">
          <img
            src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
            alt="Preview"
            className="techborg-settings-avatar"
          />
          <input type="file" onChange={handleFile} />
        </div>
        <input
          name="name"
          type="text"
          value={form.name || ''}
          onChange={handleChange}
          placeholder="Full Name"
        />
        <input
          name="email"
          type="email"
          value={form.email || ''}
          disabled
        />
        <button onClick={saveProfile} className="techborg-settings-btn">Save Changes</button>
      </div>

      {/* Role-specific fields */}
      {user.role === 'tutor' && (
        <div className="techborg-settings-section">
          <h3>Tutor Details</h3>
          <input
            name="specialization"
            placeholder="Specialization"
            value={form.specialization || ''}
            onChange={handleChange}
          />
        </div>
      )}

      {/* Change Password */}
      <div className="techborg-settings-section">
        <h3>Change Password</h3>
        <input type="password" placeholder="Current Password" />
        <input type="password" placeholder="New Password" />
        <input type="password" placeholder="Confirm Password" />
        <button onClick={updatePassword} className="techborg-settings-btn">Update Password</button>
      </div>

      {/* Danger Zone */}
      <div className="techborg-settings-section danger-zone">
        <h3>Danger Zone</h3>
        <button onClick={deactivateAccount} className="techborg-deactivate-btn">Deactivate Account</button>
        <button onClick={deleteAccount} className="techborg-delete-btn">Delete Account</button>
      </div>
    </SettingsLayout>
  );
}
