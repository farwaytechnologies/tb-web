import React, { useState, useEffect } from 'react';
import '../Styles/DashbordStyle/UserDashbord.css';

function UserDashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [profilePic, setProfilePic] = useState(user.profilePic || '');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setFormData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/auth/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setEditing(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  useEffect(() => {
    setFormData(user);
  }, [user]);

  return (
    <div className="techborg-user-dashboard">
      <div className="techborg-profile-card">
        <div className="techborg-profile-img-wrapper">
          <img
            src={profilePic || '/default-profile.png'}
            alt="Profile"
            className="techborg-profile-img"
          />
          {editing && (
            <input type="file" accept="image/*" onChange={handleProfilePicChange} />
          )}
        </div>

        <div className="techborg-profile-info">
          <h2>{user.name}</h2>
          <p className="techborg-user-role">{user.role}</p>

          {editing ? (
            <div className="techborg-profile-form">
              <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Title" />
              <input name="firstName" value={formData.firstName || ''} onChange={handleChange} placeholder="First Name" />
              <input name="middleName" value={formData.middleName || ''} onChange={handleChange} placeholder="Middle Name" />
              <input name="lastName" value={formData.lastName || ''} onChange={handleChange} placeholder="Last Name" />
              <input name="gender" value={formData.gender || ''} onChange={handleChange} placeholder="Gender" />
              <button onClick={handleSave} className="techborg-save-btn">Save</button>
            </div>
          ) : (
            <div className="techborg-profile-fields">
              <p><strong>Title:</strong> {user.title || 'N/A'}</p>
              <p><strong>First Name:</strong> {user.firstName || 'N/A'}</p>
              <p><strong>Middle Name:</strong> {user.middleName || 'N/A'}</p>
              <p><strong>Last Name:</strong> {user.lastName || 'N/A'}</p>
              <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
            </div>
          )}

          <button className="techborg-edit-btn" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
