import { useEffect, useState } from 'react';
import { Briefcase, Trash2, Plus, X, CheckCircle, AlertCircle, Search, Eye, EyeOff } from 'lucide-react';
import '../Styles/DashbordStyle/AdminManageAdmin.css'; // reuse same styles

const API = import.meta.env.VITE_API_URL;

export default function AdminManageSalesReps() {
  const [reps, setReps]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [toast, setToast]       = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [adding, setAdding]     = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchReps = () => {
    setLoading(true);
    fetch(`${API}/api/auth/users`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setReps(data.filter(u => u.role === 'sales_executive')))
      .catch(() => setReps([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReps(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete sales rep "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/api/auth/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('ok', `"${name}" deleted.`);
      fetchReps();
    } catch {
      showToast('err', 'Failed to delete.');
    }
  };

  const handleAdd = async e => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'sales_executive' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create');
      showToast('ok', `Sales rep "${form.name}" created.`);
      setShowAdd(false);
      setForm({ name: '', email: '', password: '' });
      fetchReps();
    } catch (err) {
      showToast('err', err.message);
    } finally {
      setAdding(false);
    }
  };

  const filtered = reps.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ama-page">
      {toast && (
        <div className={`ama-toast ama-toast--${toast.type}`}>
          {toast.type === 'ok' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.text}
        </div>
      )}

      <div className="ama-header">
        <div className="ama-header-glow" />
        <div className="ama-header-left">
          <div className="ama-header-icon-wrap">
            <Briefcase size={22} style={{ color: '#06b6d4' }} />
          </div>
          <div>
            <h1 className="ama-title">Manage Sales Executives</h1>
            <p className="ama-subtitle">{reps.length} sales executive{reps.length !== 1 ? 's' : ''} registered</p>
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
            <Plus size={15} /> Add Sales Executive
          </button>
        </div>
      </div>

      {loading ? (
        <div className="ama-state"><div className="ama-spinner" /><span>Loading…</span></div>
      ) : filtered.length === 0 ? (
        <div className="ama-state"><Briefcase size={40} style={{ color: '#334155' }} /><p>No sales reps found.</p></div>
      ) : (
        <div className="ama-table-wrap">
          <table className="ama-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Referral Code</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id}>
                  <td>
                    <div className="ama-user-cell">
                      <img
                        src={r.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=06b6d4&color=000&size=40`}
                        alt={r.name}
                        className="ama-avatar"
                      />
                      <div>
                        <p className="ama-name">{r.name}</p>
                        <p className="ama-role-chip">Sales Executive</p>
                      </div>
                    </div>
                  </td>
                  <td className="ama-email">{r.email}</td>
                  <td className="ama-cell" style={{ fontFamily: 'monospace', color: '#06b6d4' }}>{r.referralCode || '—'}</td>
                  <td className="ama-cell">{r.phone || '—'}</td>
                  <td className="ama-cell">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td>
                    <button className="ama-delete-btn" onClick={() => handleDelete(r._id, r.name)}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <div className="ama-overlay" onClick={() => setShowAdd(false)}>
          <div className="ama-modal" onClick={e => e.stopPropagation()}>
            <div className="ama-modal-header">
              <div className="ama-modal-title">
                <Plus size={18} style={{ color: '#06b6d4' }} />
                <h3>Add Sales Executive</h3>
              </div>
              <button className="ama-modal-close" onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <form className="ama-modal-body" onSubmit={handleAdd}>
              <div className="ama-field">
                <label>Full Name</label>
                <input type="text" placeholder="Rep name" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="ama-field">
                <label>Email</label>
                <input type="email" placeholder="rep@example.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="ama-field">
                <label>Password</label>
                <div className="ama-pass-wrap">
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
                  <button type="button" className="ama-pass-toggle" onClick={() => setShowPass(p => !p)}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="ama-modal-footer">
                <button type="button" className="ama-btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="ama-btn-submit" disabled={adding}>
                  {adding ? 'Creating…' : '+ Create Sales Executive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
