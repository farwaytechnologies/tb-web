import React, { useEffect, useState } from 'react';
import { showToast } from '../Components/Toast';
import { useNavigate } from 'react-router-dom';
import { Coins, CheckCircle, XCircle, Settings, X, Search } from 'lucide-react';
import '../Styles/DashbordStyle/AdminBorgCoins.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const STATUS_COLORS = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444' };

export default function AdminBorgCoins() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [settings, setSettings] = useState({ pointsPerCoin: 10, usdPerCoin: 0.5, minWithdrawal: 10 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [settingsModal, setSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState({});
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'admin') { navigate('/login'); return; }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [wRes, sRes] = await Promise.all([
        fetch(`${API_URL}/api/borgcoins/admin/withdrawals`),
        fetch(`${API_URL}/api/borgcoins/admin/settings`)
      ]);
      const wData = await wRes.json();
      const sData = await sRes.json();
      setWithdrawals(Array.isArray(wData) ? wData : []);
      setSettings(sData);
      setSettingsForm(sData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let list = [...withdrawals];
    if (filter !== 'all') list = list.filter(w => w.status === filter);
    if (search) list = list.filter(w =>
      w.tutorId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      w.tutorId?.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [withdrawals, filter, search]);

  const handleResolve = async () => {
    try {
      const res = await fetch(`${API_URL}/api/borgcoins/admin/withdrawal/${modal.withdrawal._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: modal.action === 'approve' ? 'approved' : 'rejected', adminNote })
      });
      const data = await res.json();
      if (!res.ok) { setToast(data.message); return; }
      setToast(`Withdrawal ${modal.action}d for ${modal.withdrawal.tutorId?.name}`);
      setModal(null); setAdminNote('');
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleSaveSettings = async () => {
    try {
      await fetch(`${API_URL}/api/borgcoins/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      setToast('Settings saved.');
      setSettingsModal(false);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter(w => w.status === 'pending').length,
    approved: withdrawals.filter(w => w.status === 'approved').length,
    totalUSD: withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amountUSD, 0).toFixed(2)
  };

  return (
    <div className="abc-page">
      <div className="abc-header">
        <div className="abc-header-left">
          <Coins size={28} className="abc-header-icon" />
          <div>
            <h1 className="abc-title">BorgCoins Management</h1>
            <p className="abc-subtitle">Review and process tutor withdrawal requests</p>
          </div>
        </div>
        <div className="abc-header-actions">
          <button className="abc-settings-btn" onClick={() => setSettingsModal(true)}>
            <Settings size={15} /> Settings
          </button>
          <button className="abc-refresh-btn" onClick={fetchAll}>↻ Refresh</button>
        </div>
      </div>

      {toast && (
        <div className="abc-toast">{toast}
          <button onClick={() => setToast('')}><X size={13} /></button>
        </div>
      )}

      <div className="abc-rate-bar">
        <span>⚡ {settings.pointsPerCoin} pts = 1 BorgCoin</span>
        <span>💵 1 BorgCoin = ${settings.usdPerCoin}</span>
        <span>📉 Min withdrawal: {settings.minWithdrawal} BorgCoins</span>
      </div>

      <div className="abc-stats">
        {[
          { label: 'Total Requests', val: stats.total, color: '#6366f1' },
          { label: 'Pending', val: stats.pending, color: '#f59e0b' },
          { label: 'Approved', val: stats.approved, color: '#10b981' },
          { label: 'Total Paid Out', val: `$${stats.totalUSD}`, color: '#7c3aed' }
        ].map(s => (
          <div key={s.label} className="abc-stat">
            <span className="abc-stat-val" style={{ color: s.color }}>{s.val}</span>
            <span className="abc-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="abc-controls">
        <div className="abc-search-wrap">
          <Search size={15} className="abc-search-icon" />
          <input className="abc-search" placeholder="Search tutor name or email..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="abc-filter-tabs">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} className={`abc-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="abc-loading">Loading withdrawals...</div> : (
        <div className="abc-table-wrap">
          <table className="abc-table">
            <thead>
              <tr>
                <th>Tutor</th><th>BorgCoins</th><th>USD</th>
                <th>Method</th><th>Payment Details</th>
                <th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="abc-empty">No withdrawal requests found.</td></tr>
              )}
              {filtered.map(w => (
                <tr key={w._id}>
                  <td>
                    <div className="abc-tutor-cell">
                      <img
                        src={w.tutorId?.profilePic ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(w.tutorId?.name || 'T')}&background=f59e0b&color=fff&size=36`}
                        alt={w.tutorId?.name} className="abc-avatar" />
                      <div>
                        <span className="abc-name">{w.tutorId?.name || '—'}</span>
                        <span className="abc-email">{w.tutorId?.email || '—'}</span>
                      </div>
                    </div>
                  </td>
                  <td><strong>{w.borgCoins} ₿C</strong></td>
                  <td><strong>${w.amountUSD}</strong></td>
                  <td className="abc-method">{w.paymentMethod}</td>
                  <td className="abc-details">{w.paymentDetails}</td>
                  <td>
                    <span className="abc-status-badge"
                      style={{ background: STATUS_COLORS[w.status] + '22', color: STATUS_COLORS[w.status] }}>
                      {w.status}
                    </span>
                  </td>
                  <td className="abc-date">{new Date(w.requestedAt).toLocaleDateString()}</td>
                  <td>
                    {w.status === 'pending' ? (
                      <div className="abc-actions">
                        <button className="abc-btn abc-approve"
                          onClick={() => { setModal({ withdrawal: w, action: 'approve' }); setAdminNote(''); }}>
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button className="abc-btn abc-reject"
                          onClick={() => { setModal({ withdrawal: w, action: 'reject' }); setAdminNote(''); }}>
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="abc-resolved">
                        {w.status === 'approved' ? '✓ Paid' : '✗ Rejected'}
                        {w.adminNote && <span title={w.adminNote}> ℹ</span>}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="abc-overlay" onClick={() => setModal(null)}>
          <div className="abc-modal" onClick={e => e.stopPropagation()}>
            <button className="abc-modal-close" onClick={() => setModal(null)}><X size={17} /></button>
            <h3 className="abc-modal-title">
              {modal.action === 'approve' ? '✅ Approve Withdrawal' : '❌ Reject Withdrawal'}
            </h3>
            <div className="abc-modal-info">
              <p><strong>Tutor:</strong> {modal.withdrawal.tutorId?.name}</p>
              <p><strong>Amount:</strong> {modal.withdrawal.borgCoins} BorgCoins (${modal.withdrawal.amountUSD})</p>
              <p><strong>Method:</strong> {modal.withdrawal.paymentMethod} — {modal.withdrawal.paymentDetails}</p>
            </div>
            <label className="abc-modal-label">Admin Note (optional)</label>
            <input className="abc-modal-input" placeholder="e.g. Payment sent via PayPal"
              value={adminNote} onChange={e => setAdminNote(e.target.value)} />
            <div className="abc-modal-btns">
              <button className={`abc-modal-confirm ${modal.action}`} onClick={handleResolve}>
                Confirm {modal.action === 'approve' ? 'Approval' : 'Rejection'}
              </button>
              <button className="abc-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {settingsModal && (
        <div className="abc-overlay" onClick={() => setSettingsModal(false)}>
          <div className="abc-modal" onClick={e => e.stopPropagation()}>
            <button className="abc-modal-close" onClick={() => setSettingsModal(false)}><X size={17} /></button>
            <h3 className="abc-modal-title">⚙️ BorgCoin Settings</h3>
            {[
              { key: 'pointsPerCoin', label: 'Points per BorgCoin', hint: 'Reward points needed for 1 BorgCoin' },
              { key: 'usdPerCoin', label: 'USD per BorgCoin', hint: 'Cash value of 1 BorgCoin' },
              { key: 'minWithdrawal', label: 'Min Withdrawal (BorgCoins)', hint: 'Minimum coins to request payout' }
            ].map(({ key, label, hint }) => (
              <div key={key} className="abc-settings-row">
                <label className="abc-modal-label">{label}</label>
                <span className="abc-settings-hint">{hint}</span>
                <input className="abc-modal-input" type="number" min="0" step="0.01"
                  value={settingsForm[key] ?? ''}
                  onChange={e => setSettingsForm(f => ({ ...f, [key]: parseFloat(e.target.value) }))} />
              </div>
            ))}
            <div className="abc-modal-btns">
              <button className="abc-modal-confirm approve" onClick={handleSaveSettings}>Save Settings</button>
              <button className="abc-modal-cancel" onClick={() => setSettingsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
