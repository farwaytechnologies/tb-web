import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/PagesStyle/Login.css';

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [role, setRole] = useState(null); // 'student' | 'tutor'
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      if (user.role === 'tutor') navigate('/tutor/dashboard');
      else if (user.role === 'student') navigate('/user/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isSignup ? `${API}/api/auth/register` : `${API}/api/auth/login`;
    const payload = isSignup
      ? { ...form, role }
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
        if (data.user.role !== role) throw new Error(`Access denied. This account is not a ${role}.`);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('userLoggedIn'));
        navigate(role === 'tutor' ? '/tutor/dashboard' : '/user/dashboard');
      } else {
        setError('');
        setIsSignup(false);
        setForm({ name: '', email: '', password: '' });
        // show success inline
        setError('__success__Account created! You can now log in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = error.startsWith('__success__');
  const errorMsg  = isSuccess ? error.replace('__success__', '') : error;

  // ── Role selector screen ──────────────────────────────────────────────────
  if (!role) {
    return (
      <div className="lp-page">
        <div className="lp-glow lp-glow--top" />
        <div className="lp-glow lp-glow--bottom" />

        <div className="lp-role-card">
          <div className="lp-logo">
            <span className="lp-logo-icon">⚡</span>
            <span className="lp-logo-text">TechBorg</span>
          </div>
          <h1 className="lp-role-title">Welcome back</h1>
          <p className="lp-role-sub">Choose how you want to continue</p>

          <div className="lp-role-options">
            <button className="lp-role-btn lp-role-btn--student" onClick={() => setRole('student')}>
              <div className="lp-role-btn-icon">🎓</div>
              <div className="lp-role-btn-body">
                <span className="lp-role-btn-label">Student</span>
                <span className="lp-role-btn-desc">Access courses, exams & certificates</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lp-role-btn-arrow">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <button className="lp-role-btn lp-role-btn--tutor" onClick={() => setRole('tutor')}>
              <div className="lp-role-btn-icon">📚</div>
              <div className="lp-role-btn-body">
                <span className="lp-role-btn-label">Tutor</span>
                <span className="lp-role-btn-desc">Manage courses, students & rewards</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lp-role-btn-arrow">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Login / Signup form ───────────────────────────────────────────────────
  const isStudent = role === 'student';
  const accent    = isStudent ? '#6366f1' : '#8b5cf6';
  const accentRgb = isStudent ? '99,102,241' : '139,92,246';

  return (
    <div className="lp-page">
      <div className="lp-glow lp-glow--top" style={{ '--accent': accent }} />
      <div className="lp-glow lp-glow--bottom" />

      <div className="lp-form-card">
        {/* Back */}
        <button className="lp-back-btn" onClick={() => { setRole(null); setError(''); setIsSignup(false); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="lp-form-header">
          <div className="lp-role-pill" style={{ background: `rgba(${accentRgb},0.12)`, border: `1px solid rgba(${accentRgb},0.3)`, color: accent }}>
            {isStudent ? '🎓 Student' : '📚 Tutor'}
          </div>
          <h2 className="lp-form-title">{isSignup ? 'Create account' : 'Sign in'}</h2>
          <p className="lp-form-sub">{isSignup ? `Join as a ${role}` : `Welcome back, ${role}`}</p>
        </div>

        {/* Alert */}
        {error && (
          <div className={`lp-alert ${isSuccess ? 'lp-alert--success' : 'lp-alert--error'}`}>
            {isSuccess ? '✓' : '⚠'} {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="lp-form">
          {isSignup && (
            <div className="lp-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
                style={{ '--focus-color': accent }}
              />
            </div>
          )}

          <div className="lp-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              style={{ '--focus-color': accent }}
            />
          </div>

          <div className="lp-field">
            <label>Password</label>
            <div className="lp-pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                style={{ '--focus-color': accent }}
              />
              <button type="button" className="lp-pass-toggle" onClick={() => setShowPass(p => !p)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="lp-submit-btn"
            disabled={loading}
            style={{ background: `linear-gradient(135deg, ${accent}, ${isStudent ? '#8b5cf6' : '#6366f1'})` }}
          >
            {loading ? <span className="lp-btn-spinner" /> : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="lp-toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button className="lp-toggle-btn" style={{ color: accent }} onClick={() => { setIsSignup(p => !p); setError(''); }}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}
