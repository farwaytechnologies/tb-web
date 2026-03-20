import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Gift, TrendingUp, Search, Copy, Check } from 'lucide-react';
import '../Styles/DashbordStyle/AdminReferralTracking.css';

const API = import.meta.env.VITE_API_URL;

export default function AdminReferralTracking() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('user') || 'null');
    if (!admin || admin.role !== 'admin') { navigate('/admin-login'); return; }
    fetch(`${API}/api/referral/admin/all`)
      .then(r => r.json())
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const copy = (code, id) => {
    navigator.clipboard.writeText(`${window.location.origin}/login?ref=${code}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) || u.referralCode?.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [users, search, roleFilter]);

  const totalReferrals = users.reduce((s, u) => s + u.referralCount, 0);
  const topReferrer = [...users].sort((a, b) => b.referralCount - a.referralCount)[0];

  return (
    <div className="art-page">
      {/* Header */}
      <div className="art-header">
        <div className="art-header-glow" />
        <Gift size={26} className="art-header-icon" />
        <div>
          <h1 className="art-title">Referral Tracking</h1>
          <p className="art-subtitle">Monitor unique referral codes and conversions</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="art-stats">
        <div className="art-stat" style={{ '--c': '#6366f1' }}>
          <Users size={18} style={{ color: '#6366f1' }} />
          <span className="art-stat-val">{users.length}</span>
          <span className="art-stat-lbl">Total Users</span>
        </div>
        <div className="art-stat" style={{ '--c': '#10b981' }}>
          <TrendingUp size={18} style={{ color: '#10b981' }} />
          <span className="art-stat-val">{totalReferrals}</span>
          <span className="art-stat-lbl">Total Referrals</span>
        </div>
        <div className="art-stat" style={{ '--c': '#f59e0b' }}>
          <Gift size={18} style={{ color: '#f59e0b' }} />
          <span className="art-stat-val">{users.filter(u => u.referralCount > 0).length}</span>
          <span className="art-stat-lbl">Active Referrers</span>
        </div>
        {topReferrer && topReferrer.referralCount > 0 && (
          <div className="art-stat art-stat--top" style={{ '--c': '#ec4899' }}>
            <img
              src={topReferrer.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(topReferrer.name)}&background=ec4899&color=fff&size=32`}
              alt={topReferrer.name}
              className="art-top-avatar"
            />
            <div>
              <span className="art-stat-val" style={{ color: '#ec4899' }}>{topReferrer.name}</span>
              <span className="art-stat-lbl">Top Referrer · {topReferrer.referralCount} refs</span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="art-filters">
        <div className="art-search-wrap">
          <Search size={15} className="art-search-icon" />
          <input
            className="art-search"
            placeholder="Search name, email or code…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="art-role-tabs">
          {['all', 'student', 'tutor'].map(r => (
            <button
              key={r}
              className={`art-role-tab ${roleFilter === r ? 'active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="art-loading"><div className="art-spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="art-empty">No users found.</div>
      ) : (
        <div className="art-table-wrap">
          <table className="art-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Referral Code</th>
                <th>Referred By</th>
                <th>Referrals Made</th>
                <th>Joined</th>
                <th>Share Link</th>
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
                      {referrer
                        ? <span className="art-referrer">{referrer.name}</span>
                        : <span className="art-none">—</span>}
                    </td>
                    <td>
                      <span className={`art-count ${u.referralCount > 0 ? 'art-count--active' : ''}`}>
                        {u.referralCount}
                      </span>
                    </td>
                    <td className="art-date">
                      {new Date(u.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td>
                      {u.referralCode && (
                        <button className="art-copy-btn" onClick={() => copy(u.referralCode, u._id)}>
                          {copiedId === u._id ? <Check size={13} /> : <Copy size={13} />}
                          {copiedId === u._id ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
