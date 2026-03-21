import { useEffect, useState } from 'react';
import { UserCog, Trash2, Plus, X, CheckCircle, AlertCircle, Search, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import '../Styles/DashbordStyle/AdminManageAdmin.css';

const API = import.meta.env.VITE_API_URL;

export default function AdminManageAdmin() {
  const [admins, setAdmins]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [toast, setToast]         = useState(null);
  const [showAdd, setShowAdd]     = useState(false);
  const [form, setForm]           = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass]   = useState(false);
  const [adding, setAdding]       = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdmins = () => {
    setLoading(true);
    fetch(`${API}/api/auth/users`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setAdmins(data.filter(u => u.role === 'admin')))
      .catch(() => setAdmins([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    setCurrentAdmin(stored);
    fetchAdmins();
  }, []);

  const handleDelete = async (id, name) => {
    if (currentAdmin?._id === id || currentAdmin?.id === id) {
      showToast('err', "You can't delete your own account.");
      return;
    }
    if (!window.confirm(`Delete admin "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/api/auth/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('ok', `Admin "${name}" deleted.`);
      fetchAdmins();
    } catch {
      showToast('err', 'Failed to delete admin.');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'admin' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create admin');
      showToast('ok', `Admin "${form.name}" created.`);
      setShowAdd(false);
      setForm({ name: '', email: '', password: '' });
      fetchAdmins();
    } catch (err) {
      showToast('err', err.message);
    } finally {
      setAdding(false);
    }
  };

  const filtered = admins.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ama-page">
      {/* Toast */}
      {toast && (
        <div className={`ama-toast ama-toast--${toast.type}`}>
          {toast.type === 'ok' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="ama-header">
        <div className="ama-header-glow" />
        <div className="ama-header-left">
          <div className="ama-header-icon-wrap">
            <UserCog size={22} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h1 className="ama-title">Manage Admins</h1>
            <p className="ama-subtitle">{admins.length} admin{admins.length !== 1 ? 's' : ''} registered</p>
          </div>
        </div>
        <div className="ama-header-right">
          <div className="ama-search-wrap">
            <Search size={14} className="ama-search-icon" />
            <input
              className="ama-search"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="ama-add-btn" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> Add Admin
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="ama-stats">
        <div className="ama-stat">
          <Shield size={16} style={{ color: '#f59e0b' }} />
          <span className="ama-stat-val">{admins.length}</span>
          <span className="ama-stat-lbl">Total Admins</span>
        </div>
        <div className="ama-stat">
          <Mail size={16} style={{ color: '#6366f1' }} />
          <span className="ama-stat-val">{admins.filter(a => a.email).length}</span>
          <span className="ama-stat-lbl">With Email</span>
        </div>
        <div className="ama-stat">
          <UserCog size={16} style={{ color: '#10b981' }} />
          <span className="ama-stat-val">{filtered.length}</span>
          <span className="ama-stat-lbl">Showing</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="ama-state"><div className="ama-spinner" /><span>Loading admins…</span></div>
      ) : filtered.length === 0 ? (
        <div className="ama-state"><UserCog size={40} style={{ color: '#334155' }} /><p>No admins found.</p></div>
      ) : (
        <div className="ama-table-wrap">
          <table className="ama-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const isSelf = currentAdmin?._id === a._id || currentAdmin?.id === a._id;
                return (
                  <tr key={a._id} className={isSelf ? 'ama-row--self' : ''}>
                    <td>
                      <div className="ama-user-cell">
                        <img
                          src={a.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=f59e0b&color=000&size=40`}
                          alt={a.name}
                          className="ama-avatar"
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=f59e0b&color=000&size=40`; }}
                        />
                        <div>
                          <p className="ama-name">{a.name} {isSelf && <span className="ama-you-badge">You</span>}</p>
                          <p className="ama-role-chip">Administrator</p>
                        </div>
                      </div>
                    </td>
                    <td className="ama-email">{a.email}</td>
                    <td className="ama-cell">{a.gender || '—'}</td>
                    <td className="ama-cell">{a.phone || '—'}</td>
                    <td className="ama-cell">
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : '—'}
                    </td>
                    <td>
                      <button
                        className="ama-delete-btn"
                        onClick={() => handleDelete(a._id, a.name)}
                        disabled={isSelf}
                        title={isSelf ? "Can't delete yourself" : 'Delete admin'}
                      >
                        <Trash2 size={14} />
                        {isSelf ? 'Self' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAdd && (
        <div className="ama-overlay" onClick={() => setShowAdd(false)}>
          <div className="ama-modal" onClick={e => e.stopPropagation()}>
            <div className="ama-modal-header">
              <div className="ama-modal-title">
                <Plus size={18} style={{ color: '#f59e0b' }} />
                <h3>Add New Admin</h3>
              </div>
              <button className="ama-modal-close" onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <form className="ama-modal-body" onSubmit={handleAdd}>
              <div className="ama-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Admin name"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="ama-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
              <div className="ama-field">
                <label>Password</label>
                <div className="ama-pass-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    required
                    minLength={6}
                  />
                  <button type="button" className="ama-pass-toggle" onClick={() => setShowPass(p => !p)}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="ama-modal-footer">
                <button type="button" className="ama-btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="ama-btn-submit" disabled={adding}>
                  {adding ? 'Creating…' : '+ Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
