import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/PagesStyle/Login.css';

function AdminAuth() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '', // 🔹 new field
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ redirect already logged-in admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setError('');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 🔹 Secret admin code validation (change this to your private code)
    const SECRET_CODE = 'ADMIN@TB2025'; 

    if (formData.adminCode !== SECRET_CODE) {
      setError('Invalid Admin Access Code.');
      return;
    }

    const url = isSignup
      ? 'https://tb-back-fyvj.onrender.com/api/auth/register'
      : 'https://tb-back-fyvj.onrender.com/api/auth/login';

    const payload = isSignup
      ? { ...formData, role: 'admin' }
      : { email: formData.email, password: formData.password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (!isSignup) {
        if (data.user.role !== 'admin') throw new Error('Access denied. Admins only.');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('userLoggedIn'));
        navigate('/admin/dashboard');
      } else {
        alert('Admin signup successful! You can now log in.');
        setIsSignup(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? 'Create Admin Account' : 'Admin Login'}</h2>

        {error && <p style={{ color: 'salmon', marginBottom: '10px' }}>{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Admin Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* 🔹 New Secret Code field */}
          <div className="auth-field">
            <label>Admin Access Code</label>
            <input
              type="password"
              name="adminCode"
              placeholder="Enter Secret Code"
              value={formData.adminCode}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="auth-toggle">
          {isSignup ? 'Already have an account?' : 'Don’t have an account?'}{' '}
          <span onClick={toggleForm}>
            {isSignup ? 'Log In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AdminAuth;
