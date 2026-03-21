import { useEffect, useState } from 'react';
import {
  Users, Trash2, X, CreditCard, Mail,
  User, Building2, Hash, Landmark, CheckCircle, AlertCircle,
  ShieldOff, ShieldCheck,
} from 'lucide-react';
import '../Styles/DashbordStyle/AdminManageTutor.css';

const API = import.meta.env.VITE_API_URL;

export default function AdminManageTutor() {
  const [tutors, setTutors]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [selected, setSelected]       = useState(null);
  const [bankData, setBankData]       = useState(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [toast, setToast]             = useState(null);
  // Ban modal state
  const [banTarget, setBanTarget]     = useState(null); // tutor to ban
  const [banReason, setBanReason]     = useState('');
  const [banLoading, setBanLoading]   = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTutors = () => {
    setLoading(true);
    fetch(`${API}/api/auth/users`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setTutors(data.filter(u => u.role === 'tutor')))
      .catch(() => setTutors([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTutors(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete tutor "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/api/auth/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('ok', 'Tutor deleted.');
      fetchTutors();
    } catch {
      showToast('err', 'Failed to delete tutor.');
    }
  };

  const openBankModal = async (tutor) => {
    setSelected(tutor);
    setBankData(null);
    setBankLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/bank/${tutor._id}`);
      setBankData(res.ok ? await res.json() : {});
    } catch {
      setBankData({});
    } finally {
      setBankLoading(false);
    }
  };

  const handleBan = async () => {
    if (!banTarget) return;
    setBanLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/ban/${banTarget._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: banReason.trim() || 'Banned by admin' }),
      });
      if (!res.ok) throw new Error();
      showToast('ok', `${banTarget.name} has been banned.`);
      setBanTarget(null);
      setBanReason('');
      fetchTutors();
    } catch {
      showToast('err', 'Failed to ban tutor.');
    } finally {
      setBanLoading(false);
    }
  };

  const handleUnban = async (tutor) => {
    try {
      const res = await fetch(`${API}/api/auth/unban/${tutor._id}`, { method: 'PUT' });
      if (!res.ok) throw new Error();
      showToast('ok', `${tutor.name} has been unbanned.`);
      fetchTutors();
    } catch {
      showToast('err', 'Failed to unban tutor.');
    }
  };

  const filtered = tutors.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  const hasBankDetails = (b) => b && (b.accountNumber || b.upiId);

  return (
    <div className="amt-page">
      {/* Toast */}
      {toast && (
        <div className={`amt-toast amt-toast--${toast.type}`}>
          {toast.type === 'ok' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="amt-header">
        <div>
          <h1><Users size={22} /> Manage Tutors</h1>
          <p>{tutors.length} tutor{tutors.length !== 1 ? 's' : ''} registered · {tutors.filter(t => t.isBanned).length} banned</p>
        </div>
        <input
          className="amt-search"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="amt-loading"><div className="amt-spinner" /><span>Loading tutors...</span></div>
      ) : filtered.length === 0 ? (
        <div className="amt-empty"><Users size={40} /><p>No tutors found.</p></div>
      ) : (
        <div className="amt-table-wrap">
          <table className="amt-table">
            <thead>
              <tr>
                <th>Tutor</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Bank Setup</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t._id} className={t.isBanned ? 'amt-row--banned' : ''}>
                  <td>
                    <div className="amt-tutor-cell">
                      {t.profilePic
                        ? <img src={t.profilePic} alt={t.name} className="amt-avatar" />
                        : <div className="amt-avatar-placeholder">{t.name?.charAt(0)}</div>
                      }
                      <div>
                        <span>{t.name}</span>
                        {t.isBanned && (
                          <span className="amt-ban-reason-inline" title={t.banReason}>
                            {t.banReason || 'Banned'}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{t.email}</td>
                  <td>{t.phone || '—'}</td>
                  <td>
                    <span className={`amt-status-badge ${t.isBanned ? 'banned' : 'active'}`}>
                      {t.isBanned ? '🚫 Banned' : '✓ Active'}
                    </span>
                  </td>
                  <td>
                    <span className={`amt-bank-badge ${hasBankDetails(t.bankDetails) ? 'set' : 'unset'}`}>
                      {hasBankDetails(t.bankDetails) ? '✓ Set' : '✗ Not set'}
                    </span>
                  </td>
                  <td>
                    <div className="amt-actions">
                      <button className="amt-btn amt-btn--bank" onClick={() => openBankModal(t)} title="View bank details">
                        <CreditCard size={14} /> Bank
                      </button>
                      {t.isBanned ? (
                        <button className="amt-btn amt-btn--unban" onClick={() => handleUnban(t)} title="Unban tutor">
                          <ShieldCheck size={14} /> Unban
                        </button>
                      ) : (
                        <button className="amt-btn amt-btn--ban" onClick={() => { setBanTarget(t); setBanReason(''); }} title="Ban tutor">
                          <ShieldOff size={14} /> Ban
                        </button>
                      )}
                      <button className="amt-btn amt-btn--delete" onClick={() => handleDelete(t._id, t.name)} title="Delete tutor">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ban Modal */}
      {banTarget && (
        <div className="amt-overlay" onClick={() => setBanTarget(null)}>
          <div className="amt-modal amt-modal--ban" onClick={e => e.stopPropagation()}>
            <div className="amt-modal-header">
              <div className="amt-modal-title">
                <ShieldOff size={18} style={{ color: '#ef4444' }} />
                <div>
                  <h3>Ban Tutor</h3>
                  <span>{banTarget.name}</span>
                </div>
              </div>
              <button className="amt-modal-close" onClick={() => setBanTarget(null)}><X size={18} /></button>
            </div>
            <div className="amt-modal-body">
              <div className="amt-ban-tutor-info">
                {banTarget.profilePic
                  ? <img src={banTarget.profilePic} alt={banTarget.name} />
                  : <div className="amt-modal-av">{banTarget.name?.charAt(0)}</div>
                }
                <div>
                  <strong>{banTarget.name}</strong>
                  <span>{banTarget.email}</span>
                </div>
              </div>
              <label className="amt-ban-label">Reason for ban</label>
              <textarea
                className="amt-ban-textarea"
                placeholder="Enter reason (e.g. violation of terms, inappropriate content...)"
                value={banReason}
                onChange={e => setBanReason(e.target.value)}
                rows={3}
              />
              <div className="amt-ban-warning">
                <AlertCircle size={14} />
                This tutor will be blocked from logging in immediately.
              </div>
            </div>
            <div className="amt-modal-footer">
              <button className="amt-btn amt-btn--cancel" onClick={() => setBanTarget(null)}>Cancel</button>
              <button className="amt-btn amt-btn--confirm-ban" onClick={handleBan} disabled={banLoading}>
                {banLoading ? 'Banning...' : '🚫 Confirm Ban'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Details Modal */}
      {selected && (
        <div className="amt-overlay" onClick={() => setSelected(null)}>
          <div className="amt-modal" onClick={e => e.stopPropagation()}>
            <div className="amt-modal-header">
              <div className="amt-modal-title">
                <CreditCard size={18} />
                <div>
                  <h3>Bank Details</h3>
                  <span>{selected.name}</span>
                </div>
              </div>
              <button className="amt-modal-close" onClick={() => setSelected(null)}><X size={18} /></button>
            </div>
            {bankLoading ? (
              <div className="amt-modal-loading"><div className="amt-spinner" /> Loading...</div>
            ) : !hasBankDetails(bankData) ? (
              <div className="amt-modal-empty">
                <CreditCard size={36} />
                <p>This tutor hasn't set up bank details yet.</p>
              </div>
            ) : (
              <div className="amt-modal-body">
                <div className="amt-tutor-info">
                  {selected.profilePic
                    ? <img src={selected.profilePic} alt={selected.name} />
                    : <div className="amt-modal-av">{selected.name?.charAt(0)}</div>
                  }
                  <div>
                    <strong>{selected.name}</strong>
                    <span>{selected.email}</span>
                  </div>
                </div>
                <div className="amt-bank-grid">
                  <BankRow icon={<User size={14} />}       label="Account Holder" value={bankData.accountHolderName} />
                  <BankRow icon={<Building2 size={14} />}  label="Bank Name"      value={bankData.bankName} />
                  <BankRow icon={<Hash size={14} />}       label="Account Number" value={bankData.accountNumber} masked />
                  <BankRow icon={<Landmark size={14} />}   label="IFSC Code"      value={bankData.ifscCode} />
                  <BankRow icon={<Building2 size={14} />}  label="Branch"         value={bankData.branchName} />
                  <BankRow icon={<CreditCard size={14} />} label="Account Type"   value={bankData.accountType} />
                  {bankData.upiId && (
                    <BankRow icon={<Mail size={14} />}     label="UPI ID"         value={bankData.upiId} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BankRow({ icon, label, value, masked }) {
  const [show, setShow] = useState(false);
  if (!value) return null;
  const display = masked && !show
    ? '•'.repeat(Math.max(0, value.length - 4)) + value.slice(-4)
    : value;
  return (
    <div className="amt-bank-row">
      <span className="amt-bank-icon">{icon}</span>
      <div className="amt-bank-info">
        <span className="amt-bank-label">{label}</span>
        <span className="amt-bank-value">
          {display}
          {masked && (
            <button className="amt-mask-toggle" onClick={() => setShow(s => !s)}>
              {show ? 'Hide' : 'Show'}
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
