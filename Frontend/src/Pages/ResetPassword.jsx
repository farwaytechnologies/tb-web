import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../Styles/PagesStyle/Login.css';

const API = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState(''); // 'success' | 'error' | ''
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const t = new URLSearchParams(location.search).get('token');
    if (!t) { setStatus('error'); setMsg('Invalid or missing reset token.'); }
    else setToken(t);
  }, [location.search]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (password.length < 6) return (setStatus('error'), setMsg('Password must be at least 6 characters.'));
    if (password !== confirm) return (setStatus('error'), setMsg('Passwords do not match.'));
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed.');
      setStatus('success');
      setMsg(data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus('error');
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-page">
      <div className="lp-glow lp-glow--top" />
      <div className="lp-glow lp-glow--bottom" />
      <div className="lp-form-card">
        <div className="lp-form-header">
          <div className="lp-logo" style={{ marginBottom: '12px' }}>
            <span className="lp-logo-icon">⚡</span>
            <span className="lp-logo-text">TechBorg</span>
          </div>
          <h2 className="lp-form-title">Set new password</h2>
          <p className="lp-form-sub">Enter a new password for your account</p>
        </div>

        {msg && (
          <div className={`lp-alert ${status === 'success' ? 'lp-alert--success' : 'lp-alert--error'}`}>
            {status === 'success' ? '✓' : '⚠'} {msg}
            {status === 'success' && <span style={{ display: 'block', fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>Redirecting to login...</span>}
          </div>
        )}

        {status !== 'success' && token && (
          <form onSubmit={handleSubmit} className="lp-form">
            <div className="lp-field">
              <label>New Password</label>
              <div className="lp-pass-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="lp-pass-toggle" onClick={() => setShowPass(p => !p)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <div className="lp-field">
              <label>Confirm Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Repeat password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="lp-submit-btn" disabled={loading}>
              {loading ? <span className="lp-btn-spinner" /> : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="lp-toggle">
          <Link to="/login" className="lp-toggle-btn" style={{ color: '#6366f1' }}>← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
