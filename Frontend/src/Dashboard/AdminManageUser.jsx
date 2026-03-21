import { useEffect, useState, useMemo } from 'react';
import { Users, Trash2, Search, CheckCircle, AlertCircle, Eye, X, ShieldOff, ShieldCheck, GraduationCap, UserCog } from 'lucide-react';
import '../Styles/DashbordStyle/AdminManageUser.css';

const API = import.meta.env.VITE_API_URL;

const ROLE_COLOR = {
  student: { bg: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: 'rgba(99,102,241,0.25)' },
  tutor:   { bg: 'rgba(139,92,246,0.12)', color: '#c4b5fd', border: 'rgba(139,92,246,0.25)' },
  admin:   { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
};

export default function AdminManageUser() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API}/api/auth/users`)
      .then(r => r.json())
      .then(setUsers)
      .catch(() => showToast('err', 'Failed to fetch users.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/api/auth/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('ok', `"${name}" deleted.`);
      setSelected(null);
      fetchUsers();
    } catch {
      showToast('err', 'Failed to delete user.');
    }
  };

  const handleBan = async (user) => {
    const endpoint = user.isBanned ? 'unban' : 'ban';
    const reason = !user.isBanned ? (window.prompt('Reason for ban (optional):') ?? '') : '';
    try {
      const res = await fetch(`${API}/api/auth/${endpoint}/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error();
      showToast('ok', user.isBanned ? `${user.name} unbanned.` : `${user.name} banned.`);
      setSelected(null);
      fetchUsers();
    } catch {
      showToast('err', 'Action failed.');
    }
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.referralCode?.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [users, search, roleFilter]);

  const counts = {
    all: users.length,
    student: users.filter(u => u.role === 'student').length,
    tutor:   users.filter(u => u.role === 'tutor').length,
    admin:   users.filter(u => u.role === 'admin').length,
    banned:  users.filter(u => u.isBanned).length,
  };

  return (
    <div className="amu-page">
      {/* Toast */}
      {toast && (
        <div className={`amu-toast amu-toast--${toast.type}`}>
          {toast.type === 'ok' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="amu-header">
        <div className="amu-header-glow" />
        <div className="amu-header-left">
          <div className="amu-header-icon"><Users size={22} style={{ color: '#6366f1' }} /></div>
          <div>
            <h1 className="amu-title">Manage Users</h1>
            <p className="amu-subtitle">{users.length} total · {counts.banned} banned</p>
          </div>
        </div>
        <div className="amu-search-wrap">
          <Search size={14} className="amu-search-icon" />
          <input
            className="amu-search"
            placeholder="Search name, email or code…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats + Role filter */}
      <div className="amu-toolbar">
        <div className="amu-stats">
          {[
            { label: 'Total',    val: counts.all,     icon: Users,         color: '#6366f1' },
            { label: 'Students', val: counts.student,  icon: GraduationCap, color: '#8b5cf6' },
            { label: 'Tutors',   val: counts.tutor,    icon: UserCog,       color: '#10b981' },
            { label: 'Banned',   val: counts.banned,   icon: ShieldOff,     color: '#ef4444' },
          ].map(s => (
            <div key={s.label} className="amu-stat">
              <s.icon size={15} style={{ color: s.color }} />
              <span className="amu-stat-val" style={{ color: s.color }}>{s.val}</span>
              <span className="amu-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="amu-role-tabs">
          {['all', 'student', 'tutor', 'admin'].map(r => (
            <button
              key={r}
              className={`amu-role-tab ${roleFilter === r ? 'active' : ''}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
              <span className="amu-tab-count">{r === 'all' ? counts.all : counts[r]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="amu-state"><div className="amu-spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="amu-state"><Users size={40} style={{ color: '#334155' }} /><p>No users found.</p></div>
      ) : (
        <div className="amu-table-wrap">
          <table className="amu-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Referral Code</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const rc = ROLE_COLOR[u.role] || ROLE_COLOR.student;
                return (
                  <tr key={u._id} className={u.isBanned ? 'amu-row--banned' : ''}>
                    <td>
                      <div className="amu-user-cell">
                        <img
                          src={u.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff&size=36`}
                          alt={u.name}
                          className="amu-avatar"
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff&size=36`; }}
                        />
                        <div>
                          <p className="amu-name">{u.name}</p>
                          <p className="amu-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="amu-role-chip" style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.referralCode
                        ? <span className="amu-ref-code">{u.referralCode}</span>
                        : <span className="amu-none">—</span>}
                    </td>
                    <td className="amu-cell">{u.gender || '—'}</td>
                    <td>
                      <span className={`amu-status ${u.isBanned ? 'banned' : 'active'}`}>
                        {u.isBanned ? '🚫 Banned' : '✓ Active'}
                      </span>
                    </td>
                    <td className="amu-cell">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : '—'}
                    </td>
                    <td>
                      <div className="amu-actions">
                        <button className="amu-btn amu-btn--view" onClick={() => setSelected(u)} title="View details">
                          <Eye size={13} />
                        </button>
                        {u.role !== 'admin' && (
                          <button
                            className={`amu-btn ${u.isBanned ? 'amu-btn--unban' : 'amu-btn--ban'}`}
                            onClick={() => handleBan(u)}
                            title={u.isBanned ? 'Unban' : 'Ban'}
                          >
                            {u.isBanned ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}
                          </button>
                        )}
                        <button className="amu-btn amu-btn--delete" onClick={() => handleDelete(u._id, u.name)} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="amu-overlay" onClick={() => setSelected(null)}>
          <div className="amu-modal" onClick={e => e.stopPropagation()}>
            <div className="amu-modal-header">
              <h3>User Details</h3>
              <button className="amu-modal-close" onClick={() => setSelected(null)}><X size={18} /></button>
            </div>
            <div className="amu-modal-body">
              <div className="amu-modal-profile">
                <img
                  src={selected.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.name)}&background=6366f1&color=fff&size=80`}
                  alt={selected.name}
                  className="amu-modal-avatar"
                />
                <div>
                  <p className="amu-modal-name">{selected.name}</p>
                  <p className="amu-modal-email">{selected.email}</p>
                  {(() => { const rc = ROLE_COLOR[selected.role] || ROLE_COLOR.student; return (
                    <span className="amu-role-chip" style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                      {selected.role}
                    </span>
                  ); })()}
                </div>
              </div>

              <div className="amu-modal-grid">
                {[
                  { label: 'Phone',         val: selected.phone || '—' },
                  { label: 'Gender',        val: selected.gender || '—' },
                  { label: 'Language',      val: selected.language || '—' },
                  { label: 'Referral Code', val: selected.referralCode || '—' },
                  { label: 'Status',        val: selected.isBanned ? `Banned — ${selected.banReason || 'No reason'}` : 'Active' },
                  { label: 'Joined',        val: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                ].map(row => (
                  <div key={row.label} className="amu-modal-row">
                    <span className="amu-modal-lbl">{row.label}</span>
                    <span className="amu-modal-val">{row.val}</span>
                  </div>
                ))}
              </div>

              {selected.bio && (
                <div className="amu-modal-bio">
                  <span className="amu-modal-lbl">Bio</span>
                  <p>{selected.bio}</p>
                </div>
              )}
            </div>
            <div className="amu-modal-footer">
              {selected.role !== 'admin' && (
                <button
                  className={`amu-modal-btn ${selected.isBanned ? 'unban' : 'ban'}`}
                  onClick={() => handleBan(selected)}
                >
                  {selected.isBanned ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                  {selected.isBanned ? 'Unban User' : 'Ban User'}
                </button>
              )}
              <button className="amu-modal-btn delete" onClick={() => handleDelete(selected._id, selected.name)}>
                <Trash2 size={14} /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
