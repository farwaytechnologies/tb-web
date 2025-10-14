import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/PagesStyle/Login.css';

function TutorLogin() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setError('');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = isSignup
      ? 'https://tb-back-fyvj.onrender.com/api/auth/register'
      : 'https://tb-back-fyvj.onrender.com/api/auth/login';

    const payload = isSignup
      ? { ...formData, role: 'tutor' }
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('userLoggedIn'));
        navigate('/tutor/dashboard');
      } else {
        alert('Tutor signup successful! You can now log in.');
        setIsSignup(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? 'Create Tutor Account' : 'Tutor Login'}</h2>

        {error && <p style={{ color: 'salmon' }}>{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Jane Smith"
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
              placeholder="tutor@example.com"
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

export default TutorLogin;
