import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/PagesStyle/AdminLogin.css';

const API = import.meta.env.VITE_API_URL;
const SECRET_CODE = 'ADMIN@TB2025';

export default function AdminLogin() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', adminCode: '' });
  const [showPass, setShowPass] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user?.role === 'admin') navigate('/admin/dashboard');
  }, [navigate]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (form.adminCode !== SECRET_CODE) {
      setError('Invalid Admin Access Code.');
      return;
    }

    setLoading(true);
    const url = isSignup ? `${API}/api/auth/register` : `${API}/api/auth/login`;
    const payload = isSignup
      ? { name: form.name, email: form.email, password: form.password, role: 'admin' }
      : { email: form.email, password: form.password };

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
        setIsSignup(false);
        setForm({ name: '', email: '', password: '', adminCode: '' });
        setError('__success__Admin account created. You can now sign in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = error.startsWith('__success__');
  const errorMsg  = isSuccess ? error.replace('__success__', '') : error;

  return (
    <div className="al-page">
      <div className="al-glow al-glow--top" />
      <div className="al-glow al-glow--bottom" />

      <div className="al-card">
        {/* Logo */}
        <div className="al-logo">
          <span className="al-logo-icon">🛡️</span>
          <span className="al-logo-text">TechBorg Admin</span>
        </div>

        {/* Header */}
        <div className="al-header">
          <div className="al-role-pill">⚙️ Administrator</div>
          <h2 className="al-title">{isSignup ? 'Create account' : 'Sign in'}</h2>
          <p className="al-sub">Restricted access — authorised personnel only</p>
        </div>

        {/* Alert */}
        {error && (
          <div className={`al-alert ${isSuccess ? 'al-alert--success' : 'al-alert--error'}`}>
            {isSuccess ? '✓' : '⚠'} {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="al-form">
          {isSignup && (
            <div className="al-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Admin name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="al-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="al-field">
            <label>Password</label>
            <div className="al-pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="al-eye-btn" onClick={() => setShowPass(p => !p)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div className="al-field">
            <label>Admin Access Code</label>
            <div className="al-pass-wrap">
              <input
                type={showCode ? 'text' : 'password'}
                name="adminCode"
                placeholder="Enter secret code"
                value={form.adminCode}
                onChange={handleChange}
                required
              />
              <button type="button" className="al-eye-btn" onClick={() => setShowCode(p => !p)}>
                {showCode ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="al-submit-btn" disabled={loading}>
            {loading ? <span className="al-spinner" /> : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="al-toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            className="al-toggle-btn"
            onClick={() => { setIsSignup(p => !p); setError(''); }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <p className="al-back-link">
          <Link to="/login">← Back to main login</Link>
        </p>
      </div>
    </div>
  );
}
