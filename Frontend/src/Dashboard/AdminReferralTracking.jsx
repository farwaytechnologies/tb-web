import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Gift, TrendingUp, Search, Copy, Check, X, Crown, Plus, Eye, EyeOff } from 'lucide-react';
import '../Styles/DashbordStyle/AdminReferralTracking.css';

const API = import.meta.env.VITE_API_URL;

export default function AdminReferralTracking() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  // Create referral account modal state
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', role: 'student' });
  const [createLoading, setCreateLoading] = useState(false);
  const [createResult, setCreateResult] = useState(null); // { referralCode, tempPassword, name, email }
  const [createError, setCreateError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [copiedResult, setCopiedResult] = useState('');

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('user') || 'null');
    if (!admin || admin.role !== 'admin') { navigate('/admin-login'); return; }
    fetch(`${API}/api/referral/admin/all`)
      .then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, [navigate]);

  const copy = (code, id) => {
    navigator.clipboard.writeText(`${window.location.origin}/login?ref=${code}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = async e => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    setCreateResult(null);
    try {
      const res = await fetch(`${API}/api/auth/create-referral-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create account.');
      setCreateResult({
        ...data.user,
        tempPassword: data.tempPassword,
        referralLink: `${window.location.origin}/login?ref=${data.user.referralCode}`,
      });
      // Refresh list
      fetch(`${API}/api/referral/admin/all`)
        .then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : []));
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const copyResult = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedResult(key);
    setTimeout(() => setCopiedResult(''), 2000);
  };

  const closeCreate = () => {
    setShowCreate(false);
    setCreateForm({ name: '', email: '', role: 'student' });
    setCreateResult(null);
    setCreateError('');
    setShowPass(false);
  };

  const filtered = useMemo(() => users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) || u.referralCode?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  }), [users, search, roleFilter]);

  const totalReferrals = users.reduce((s, u) => s + u.referralCount, 0);
  const activeReferrers = users.filter(u => u.referralCount > 0).length;
  const topReferrer = [...users].sort((a, b) => b.referralCount - a.referralCount)[0];

  const roleCounts = {
    all: users.length,
    student: users.filter(u => u.role === 'student').length,
    tutor: users.filter(u => u.role === 'tutor').length,
  };

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="art-page">
      {/* Header */}
      <div className="art-header">
        <div className="art-header-glow" />
        <div className="art-header-left">
          <div className="art-header-icon"><Gift size={22} /></div>
          <div>
            <h1>Referral Tracking</h1>
            <p>Monitor referral codes and conversions across all users</p>
          </div>
        </div>
        <button className="art-create-btn" onClick={() => setShowCreate(true)}>
          <Plus size={15} /> Create Referral Account
        </button>
      </div>

      {/* Stats */}
      <div className="art-stats">
        <div className="art-stat-card">
          <div className="art-stat-icon" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <Users size={18} style={{ color: '#6366f1' }} />
          </div>
          <span className="art-stat-val" style={{ color: '#6366f1' }}>{users.length}</span>
          <span className="art-stat-lbl">Total Users</span>
        </div>
        <div className="art-stat-card">
          <div className="art-stat-icon" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <TrendingUp size={18} style={{ color: '#10b981' }} />
          </div>
          <span className="art-stat-val" style={{ color: '#10b981' }}>{totalReferrals}</span>
          <span className="art-stat-lbl">Total Referrals</span>
        </div>
        <div className="art-stat-card">
          <div className="art-stat-icon" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Gift size={18} style={{ color: '#f59e0b' }} />
          </div>
          <span className="art-stat-val" style={{ color: '#f59e0b' }}>{activeReferrers}</span>
          <span className="art-stat-lbl">Active Referrers</span>
        </div>
        {topReferrer?.referralCount > 0 && (
          <div className="art-stat-card art-stat-top">
            <div className="art-stat-icon" style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)' }}>
              <Crown size={18} style={{ color: '#ec4899' }} />
            </div>
            <div className="art-top-info">
              <img
                src={topReferrer.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(topReferrer.name)}&background=ec4899&color=fff&size=32`}
                alt={topReferrer.name}
                className="art-top-avatar"
              />
              <div>
                <span className="art-stat-val" style={{ color: '#ec4899', fontSize: '15px' }}>{topReferrer.name}</span>
                <span className="art-stat-lbl">Top Referrer · {topReferrer.referralCount} refs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="art-filters">
        <div className="art-search-wrap">
          <Search size={14} className="art-search-icon" />
          <input
            className="art-search"
            placeholder="Search name, email or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="art-search-clear" onClick={() => setSearch('')}><X size={13} /></button>
          )}
        </div>
        <div className="art-role-tabs">
          {['all', 'student', 'tutor'].map(r => (
            <button
              key={r}
              className={`art-role-tab ${roleFilter === r ? 'active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              <span className="art-tab-count">{roleCounts[r]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="art-loading"><div className="art-spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="art-empty">
          <Users size={32} />
          <p>No users found{search ? ` for "${search}"` : ''}.</p>
        </div>
      ) : (
        <div className="art-table-wrap">
          <table className="art-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Referral Code</th>
                <th>Referred By</th>
                <th>Referrals</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const referrer = users.find(x => String(x._id) === String(u.referredBy));
                return (
                  <tr key={u._id}>
                    <td>
                      <div className="art-user-cell">
                        <img
                          src={u.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff&size=32`}
                          alt={u.name}
                          className="art-avatar"
                        />
                        <div>
                          <p className="art-name">{u.name}</p>
                          <p className="art-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`art-role-chip art-role-chip--${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className="art-code">{u.referralCode || '—'}</span>
                    </td>
                    <td>
                      {referrer ? (
                        <div className="art-referrer-cell">
                          <img
                            src={referrer.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(referrer.name)}&background=8b5cf6&color=fff&size=24`}
                            alt={referrer.name}
                            className="art-referrer-avatar"
                          />
                          <span className="art-referrer">{referrer.name}</span>
                        </div>
                      ) : <span className="art-none">—</span>}
                    </td>
                    <td>
                      <span className={`art-count ${u.referralCount > 0 ? 'art-count--active' : ''}`}>
                        {u.referralCount}
                      </span>
                    </td>
                    <td className="art-date">{fmt(u.joinedAt)}</td>
                    <td>
                      {u.referralCode ? (
                        <button className="art-copy-btn" onClick={() => copy(u.referralCode, u._id)}>
                          {copiedId === u._id ? <Check size={13} /> : <Copy size={13} />}
                          {copiedId === u._id ? 'Copied' : 'Copy Link'}
                        </button>
                      ) : <span className="art-none">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Referral Account Modal */}
      {showCreate && (
        <div className="art-modal-overlay" onClick={closeCreate}>
          <div className="art-modal" onClick={e => e.stopPropagation()}>
            <div className="art-modal-header">
              <span>{createResult ? '✅ Account Created' : 'Create Referral Account'}</span>
              <button className="art-modal-close" onClick={closeCreate}><X size={16} /></button>
            </div>

            {!createResult ? (
              <form onSubmit={handleCreate} className="art-modal-body">
                <p className="art-modal-desc">
                  Creates a new account with a unique referral code. The user can log in with the temporary password and reset it later.
                </p>
                {createError && <div className="art-modal-error">⚠ {createError}</div>}
                <div className="art-modal-field">
                  <label>Full Name</label>
                  <input
                    type="text" required placeholder="e.g. John Doe"
                    value={createForm.name}
                    onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="art-modal-field">
                  <label>Email</label>
                  <input
                    type="email" required placeholder="e.g. john@example.com"
                    value={createForm.email}
                    onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="art-modal-field">
                  <label>Role</label>
                  <select value={createForm.role} onChange={e => setCreateForm(p => ({ ...p, role: e.target.value }))}>
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                  </select>
                </div>
                <button type="submit" className="art-modal-submit" disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create Account'}
                </button>
              </form>
            ) : (
              <div className="art-modal-body">
                <div className="art-result-row">
                  <span className="art-result-label">Name</span>
                  <span className="art-result-val">{createResult.name}</span>
                </div>
                <div className="art-result-row">
                  <span className="art-result-label">Email</span>
                  <span className="art-result-val">{createResult.email}</span>
                </div>
                <div className="art-result-row">
                  <span className="art-result-label">Role</span>
                  <span className={`art-role-chip art-role-chip--${createResult.role}`}>{createResult.role}</span>
                </div>
                <div className="art-result-row">
                  <span className="art-result-label">Referral Code</span>
                  <code className="art-result-code">{createResult.referralCode}</code>
                </div>
                <div className="art-result-row">
                  <span className="art-result-label">Temp Password</span>
                  <div className="art-pass-wrap">
                    <code className="art-result-code">{showPass ? createResult.tempPassword : '••••••••••••••••'}</code>
                    <button className="art-pass-toggle" onClick={() => setShowPass(p => !p)}>
                      {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
                <div className="art-result-actions">
                  <button className="art-copy-btn" onClick={() => copyResult(createResult.tempPassword, 'pass')}>
                    {copiedResult === 'pass' ? <Check size={13} /> : <Copy size={13} />}
                    {copiedResult === 'pass' ? 'Copied' : 'Copy Password'}
                  </button>
                  <button className="art-copy-btn art-copy-btn--primary" onClick={() => copyResult(createResult.referralLink, 'link')}>
                    {copiedResult === 'link' ? <Check size={13} /> : <Copy size={13} />}
                    {copiedResult === 'link' ? 'Copied!' : 'Copy Referral Link'}
                  </button>
                </div>
                <p className="art-modal-note">Share the referral link with the user. They can reset their password via "Forgot Password" on the login page.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

