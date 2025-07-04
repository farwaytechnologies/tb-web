import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/ProfileStyle/TutorProfile.css';

function TutorProfile() {
  const [tutor, setTutor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'tutor') return navigate('/login');
    setTutor(stored);
    setForm(stored);
    setPreview(stored.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(stored.name)}`);
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
      setForm((f) => ({ ...f, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/auth/update/${tutor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('user', JSON.stringify(data.user));
      setTutor(data.user);
      setEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="tutor-profile-full">
      <div className="tutor-profile-header">
        <img src={preview} alt="Profile" />
        <div>
          <h1>{tutor?.name}</h1>
          <p>Role: <strong>{tutor?.role.toUpperCase()}</strong></p>
          {editing && <input type="file" accept="image/*" onChange={handleFile} />}
        </div>
      </div>

      <div className="tutor-profile-form">
        {editing ? (
          <>
            <label>Name</label>
            <input name="name" value={form.name || ''} onChange={handleChange} />

            <label>Title</label>
            <input name="title" value={form.title || ''} onChange={handleChange} />

            <label>Gender</label>
            <input name="gender" value={form.gender || ''} onChange={handleChange} />

            <label>Email</label>
            <input name="email" value={form.email || ''} readOnly />

            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Title:</strong> {tutor?.title || '—'}</p>
            <p><strong>Gender:</strong> {tutor?.gender || '—'}</p>
            <p><strong>Email:</strong> {tutor?.email}</p>
          </>
        )}
        <button onClick={() => setEditing((e) => !e)}>
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
    </div>
  );
}

export default TutorProfile;
