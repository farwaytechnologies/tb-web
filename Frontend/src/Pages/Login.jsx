import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/PagesStyle/Login.css';

function Login() {
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
      ? { ...formData, role: 'student' }
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
        navigate('/user/dashboard');
      } else {
        alert('Signup successful! You can now log in.');
        setIsSignup(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-box">
        <h2 className="login-page-title">
          {isSignup ? 'Create Student Account' : 'Student Login'}
        </h2>

        {error && <p className="login-page-error">{error}</p>}

        <form className="login-page-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="login-page-field">
              <label className="login-page-label">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="login-page-input"
                required
              />
            </div>
          )}

          <div className="login-page-field">
            <label className="login-page-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="login-page-input"
              required
            />
          </div>

          <div className="login-page-field">
            <label className="login-page-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="login-page-input"
              required
            />
          </div>

          <button type="submit" className="login-page-button">
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="login-page-toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span className="login-page-toggle-link" onClick={toggleForm}>
            {isSignup ? 'Log In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;