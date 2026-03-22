import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/PagesStyle/Login.css';

const API = import.meta.env.VITE_API_URL;
const ACCENT = '#06b6d4';
const ACCENT_RGB = '6,182,212';

export default function SalesExecutiveLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user && user.role === 'sales_executive') {
      navigate('/sales-executive/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.banned) throw new Error(`Account banned: ${data.banReason}`);
        throw new Error(data.message || 'Login failed');
      }
      if (data.user.role !== 'sales_executive') {
        throw new Error('Access denied. This portal is for Sales Executives only.');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('userLoggedIn'));
      navigate('/sales-executive/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async e => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotStatus('');
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotStatus('success');
      setForgotMsg(data.message);
    } catch {
      setForgotStatus('error');
      setForgotMsg('Failed to send reset email. Try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="lp-page">
      <div className="lp-glow lp-glow--top" style={{ '--accent': ACCENT }} />
      <div className="lp-glow lp-glow--bottom" />

      <div className="lp-form-card">
        <div className="lp-form-header">
          <div className="lp-logo" style={{ marginBottom: '16px' }}>
            <span className="lp-logo-icon">⚡</span>
            <span className="lp-logo-text">TechBorg</span>
          </div>
          <div
            className="lp-role-pill"
            style={{
              background: `rgba(${ACCENT_RGB},0.12)`,
              border: `1px solid rgba(${ACCENT_RGB},0.3)`,
              color: ACCENT,
            }}
          >
            💼 Sales Executive Portal
          </div>
          <h2 className="lp-form-title">Sign in</h2>
          <p className="lp-form-sub">Welcome back, Sales Executive</p>
        </div>

        {error && (
          <div className="lp-alert lp-alert--error">⚠ {error}</div>
        )}

        <form onSubmit={handleSubmit} className="lp-form">
          <div className="lp-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              style={{ '--focus-color': ACCENT }}
            />
          </div>
          <div className="lp-field">
            <label>Password</label>
            <div className="lp-pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                style={{ '--focus-color': ACCENT }}
              />
              <button type="button" className="lp-pass-toggle" onClick={() => setShowPass(p => !p)}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            <button
              type="button"
              className="lp-toggle-btn"
              style={{ color: ACCENT, fontSize: '12px', marginTop: '6px', display: 'block', textAlign: 'right', width: '100%' }}
              onClick={() => { setShowForgot(true); setError(''); setForgotStatus(''); setForgotMsg(''); setForgotEmail(''); }}
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="lp-submit-btn"
            disabled={loading}
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #0891b2)` }}
          >
            {loading ? <span className="lp-btn-spinner" /> : 'Sign In'}
          </button>
        </form>
      </div>

      {showForgot && (
        <div className="lp-forgot-overlay" onClick={() => setShowForgot(false)}>
          <div className="lp-forgot-modal" onClick={e => e.stopPropagation()}>
            <button className="lp-back-btn" onClick={() => setShowForgot(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
            <div className="lp-form-header">
              <h2 className="lp-form-title">Forgot password?</h2>
              <p className="lp-form-sub">Enter your email and we'll send a reset link</p>
            </div>
            {forgotMsg && (
              <div className={`lp-alert ${forgotStatus === 'success' ? 'lp-alert--success' : 'lp-alert--error'}`}>
                {forgotStatus === 'success' ? '✓' : '⚠'} {forgotMsg}
              </div>
            )}
            {forgotStatus !== 'success' && (
              <form onSubmit={handleForgot} className="lp-form">
                <div className="lp-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                    style={{ '--focus-color': ACCENT }}
                  />
                </div>
                <button
                  type="submit"
                  className="lp-submit-btn"
                  disabled={forgotLoading}
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #0891b2)` }}
                >
                  {forgotLoading ? <span className="lp-btn-spinner" /> : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
