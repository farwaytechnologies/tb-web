import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TrendingUp, Users, Gift, Copy, Check, Briefcase,
  Target, Award, Search, X, Calendar, ChevronUp, ChevronDown, Coins, FileBarChart
} from 'lucide-react';
import '../Styles/DashbordStyle/SalesRepDashboard.css';

const API = import.meta.env.VITE_API_URL;

export default function SalesRepDashboard() {
  const [user, setUser] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortDir, setSortDir] = useState('desc');
  const [wallet, setWallet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored || stored.role !== 'sales_executive') { navigate('/login'); return; }
    setUser(stored);
    const uid = stored._id || stored.id;
    Promise.all([
      fetch(`${API}/api/auth/users`).then(r => r.json()),
      fetch(`${API}/api/se-rewards/${uid}`).then(r => r.json()),
    ]).then(([users, rewardData]) => {
      const refs = users.filter(u => String(u.referredBy) === String(uid));
      setReferrals(refs);
      setWallet(rewardData); // { wallet, withdrawals, available }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [navigate]);

  const referralLink = user ? `${window.location.origin}/login?ref=${user.referralCode}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleString('default', { month: 'short' });
      const count = referrals.filter(r => {
        const rd = new Date(r.createdAt);
        return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth();
      }).length;
      return { label, count };
    });
  }, [referrals]);

  const maxMonthly = Math.max(...monthlyData.map(m => m.count), 1);

  const now = new Date();
  const thisMonth = referrals.filter(r => {
    const d = new Date(r.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const TARGET = 10;
  const progress = Math.min((thisMonth / TARGET) * 100, 100);

  const filtered = useMemo(() => {
    let list = referrals.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q);
      const matchRole = roleFilter === 'all' || r.role === roleFilter;
      return matchSearch && matchRole;
    });
    return [...list].sort((a, b) => {
      const diff = new Date(a.createdAt) - new Date(b.createdAt);
      return sortDir === 'desc' ? -diff : diff;
    });
  }, [referrals, search, roleFilter, sortDir]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (!user) return null;

  return (
    <div className="srd-page">

      <div className="srd-header">
        <div className="srd-header-glow" />
        <div className="srd-header-left">
          <div className="srd-avatar-wrap">
            <img
              src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=80`}
              alt={user.name}
              className="srd-avatar"
            />
            <span className="srd-online-dot" />
          </div>
          <div>
            <span className="srd-role-badge">Sales Executive</span>
            <h1 className="srd-name">{greeting}, {user.name.split(' ')[0]} 👋</h1>
            <p className="srd-email">{user.email}</p>
          </div>
        </div>
        <div className="srd-header-right">
          <div className="srd-code-pill">
            <Gift size={13} />
            <span>{user.referralCode || '—'}</span>
          </div>
          <button className="srd-copy-btn" onClick={copyLink}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="srd-stats">
        <div className="srd-stat">
          <div className="srd-stat-icon" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <Users size={18} style={{ color: '#8b5cf6' }} />
          </div>
          <span className="srd-stat-val" style={{ color: '#8b5cf6' }}>{loading ? '—' : referrals.length}</span>
          <span className="srd-stat-lbl">Total Referrals</span>
        </div>
        <div className="srd-stat">
          <div className="srd-stat-icon" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
            <TrendingUp size={18} style={{ color: '#06b6d4' }} />
          </div>
          <span className="srd-stat-val" style={{ color: '#06b6d4' }}>
            {loading ? '—' : referrals.filter(r => r.role === 'student').length}
          </span>
          <span className="srd-stat-lbl">Students</span>
        </div>
        <div className="srd-stat">
          <div className="srd-stat-icon" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <Briefcase size={18} style={{ color: '#10b981' }} />
          </div>
          <span className="srd-stat-val" style={{ color: '#10b981' }}>
            {loading ? '—' : referrals.filter(r => r.role === 'tutor').length}
          </span>
          <span className="srd-stat-lbl">Tutors</span>
        </div>
        <div className="srd-stat">
          <div className="srd-stat-icon" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Calendar size={18} style={{ color: '#f59e0b' }} />
          </div>
          <span className="srd-stat-val" style={{ color: '#f59e0b' }}>{loading ? '—' : thisMonth}</span>
          <span className="srd-stat-lbl">This Month</span>
        </div>
      </div>

      <div className="srd-mid-row">

        <div className="srd-card">
          <div className="srd-card-header">
            <TrendingUp size={15} style={{ color: '#8b5cf6' }} />
            <span>Monthly Referrals</span>
          </div>
          <div className="srd-chart">
            {monthlyData.map((m, i) => (
              <div key={i} className="srd-bar-col">
                <div className="srd-bar-track">
                  <div
                    className="srd-bar-fill"
                    style={{ height: `${(m.count / maxMonthly) * 100}%` }}
                    title={`${m.count} referral${m.count !== 1 ? 's' : ''}`}
                  />
                </div>
                <span className="srd-bar-val">{m.count}</span>
                <span className="srd-bar-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="srd-card">
          <div className="srd-card-header">
            <Target size={15} style={{ color: '#06b6d4' }} />
            <span>Monthly Target</span>
          </div>
          <div className="srd-target-body">
            <div className="srd-target-ring-wrap">
              <svg viewBox="0 0 80 80" className="srd-ring">
                <circle cx="40" cy="40" r="32" className="srd-ring-bg" />
                <circle
                  cx="40" cy="40" r="32"
                  className="srd-ring-fill"
                  strokeDasharray={`${progress * 2.01} 201`}
                />
              </svg>
              <div className="srd-ring-label">
                <span className="srd-ring-pct">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="srd-target-info">
              <p className="srd-target-nums">
                <span style={{ color: '#06b6d4', fontWeight: 700, fontSize: '1.5rem' }}>{thisMonth}</span>
                <span style={{ color: '#475569' }}> / {TARGET}</span>
              </p>
              <p className="srd-target-sub">referrals this month</p>
              {thisMonth >= TARGET ? (
                <div className="srd-target-badge srd-target-badge--done">
                  <Award size={12} /> Target reached!
                </div>
              ) : (
                <div className="srd-target-badge">
                  {TARGET - thisMonth} more to go
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="srd-card">
          <div className="srd-card-header">
            <Gift size={15} style={{ color: '#f59e0b' }} />
            <span>Your Referral Link</span>
          </div>
          <div className="srd-link-url-box">{referralLink}</div>
          <button className="srd-copy-btn srd-copy-btn--full" onClick={copyLink}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied to clipboard!' : 'Copy Referral Link'}
          </button>
          <p className="srd-link-hint">Anyone who signs up via this link is tracked under your account.</p>
        </div>

        <div className="srd-card srd-wallet-card">
          <div className="srd-card-header">
            <Coins size={15} style={{ color: '#f59e0b' }} />
            <span>BorgCoins Wallet</span>
          </div>
          <div className="srd-wallet-body">
            <div className="srd-wallet-balance">
              <span className="srd-wallet-bc-val">{loading ? '—' : wallet?.available ?? 0}</span>
              <span className="srd-wallet-bc-label">BC Available</span>
            </div>
            <div className="srd-wallet-row">
              <div className="srd-wallet-mini">
                <span className="srd-wallet-mini-val" style={{ color: '#f59e0b' }}>{loading ? '—' : wallet?.wallet?.totalEarned ?? 0}</span>
                <span className="srd-wallet-mini-lbl">Total Earned</span>
              </div>
              <div className="srd-wallet-divider" />
              <div className="srd-wallet-mini">
                <span className="srd-wallet-mini-val" style={{ color: '#8b5cf6' }}>{loading ? '—' : wallet?.wallet?.totalWithdrawn ?? 0}</span>
                <span className="srd-wallet-mini-lbl">Withdrawn</span>
              </div>
              <div className="srd-wallet-divider" />
              <div className="srd-wallet-mini">
                <span className="srd-wallet-mini-val" style={{ color: '#06b6d4' }}>
                  {loading ? '—' : wallet?.withdrawals?.filter(w => w.status === 'pending').length ?? 0}
                </span>
                <span className="srd-wallet-mini-lbl">Pending</span>
              </div>
            </div>
            <Link
              to="/sales-executive/rewards"
              className="srd-copy-btn srd-copy-btn--full"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: '0.75rem' }}
            >
              <Coins size={14} /> Manage Wallet
            </Link>
          </div>
        </div>

        <div className="srd-card">
          <div className="srd-card-header">
            <FileBarChart size={15} style={{ color: '#06b6d4' }} />
            <span>My Report</span>
          </div>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0.5rem 0 1rem' }}>
            Full performance report — monthly breakdown, referral history, and withdrawal log.
          </p>
          <Link
            to="/sales-executive/report"
            className="srd-copy-btn srd-copy-btn--full"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}
          >
            <FileBarChart size={14} /> View Report
          </Link>
        </div>

      </div>

      <div className="srd-section">
        <div className="srd-section-header">
          <h2 className="srd-section-title">
            Referred Users <span className="srd-count-badge">{referrals.length}</span>
          </h2>
          <div className="srd-table-controls">
            <div className="srd-search-wrap">
              <Search size={13} className="srd-search-icon" />
              <input
                className="srd-search"
                placeholder="Search name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="srd-search-clear" onClick={() => setSearch('')}>
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="srd-role-tabs">
              {['all', 'student', 'tutor'].map(r => (
                <button
                  key={r}
                  className={`srd-role-tab ${roleFilter === r ? 'active' : ''}`}
                  onClick={() => setRoleFilter(r)}
                >
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="srd-loading"><div className="srd-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="srd-empty">
            <Users size={32} />
            <p>{referrals.length === 0 ? 'No referrals yet. Share your link to get started.' : 'No results match your search.'}</p>
          </div>
        ) : (
          <div className="srd-table-wrap">
            <table className="srd-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>
                    <button className="srd-sort-btn" onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}>
                      Joined {sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r._id}>
                    <td>
                      <div className="srd-user-cell">
                        <img
                          src={r.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=6366f1&color=fff&size=32`}
                          alt={r.name}
                          className="srd-user-avatar"
                        />
                        <div>
                          <p className="srd-user-name">{r.name}</p>
                          <p className="srd-user-email">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`srd-role-chip srd-role-chip--${r.role}`}>{r.role}</span>
                    </td>
                    <td className="srd-date">{fmt(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
