import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, TrendingUp, Clock, CheckCircle, XCircle, Send, X } from 'lucide-react';
import '../Styles/DashbordStyle/SalesExecutiveRewards.css';

const API = import.meta.env.VITE_API_URL;

const STATUS_STYLE = {
  pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  icon: Clock },
  approved: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', icon: CheckCircle },
  rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  icon: XCircle },
};

export default function SalesExecutiveRewards() {
  const [user, setUser]           = useState(null);
  const [reward, setReward]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ borgCoins: '', upiId: '', bankDetails: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const navigate = useNavigate();

  const fetchReward = (uid) => {
    fetch(`${API}/api/se-rewards/${uid}`)
      .then(r => r.json())
      .then(d => setReward(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored || stored.role !== 'sales_executive') { navigate('/login'); return; }
    setUser(stored);
    fetchReward(stored._id || stored.id);
  }, [navigate]);

  const handleWithdraw = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSubmitting(true);
    try {
      const uid = user._id || user.id;
      const res = await fetch(`${API}/api/se-rewards/${uid}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, borgCoins: Number(form.borgCoins) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess('Withdrawal request submitted successfully.');
      setForm({ borgCoins: '', upiId: '', bankDetails: '' });
      setShowModal(false);
      fetchReward(uid);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (!user) return null;

  const available = reward?.available ?? 0;
  const pendingCount = reward?.withdrawals?.filter(w => w.status === 'pending').length || 0;

  return (
    <div className="ser-page">

      <div className="ser-header">
        <div className="ser-header-glow" />
        <div className="ser-header-left">
          <div className="ser-header-icon"><Coins size={22} style={{ color: '#f59e0b' }} /></div>
          <div>
            <h1>BorgCoins & Withdrawals</h1>
            <p>Earn 25 BorgCoins per referral. Withdraw anytime.</p>
          </div>
        </div>
        <button className="ser-withdraw-btn" onClick={() => { setShowModal(true); setError(''); setSuccess(''); }}
          disabled={available < 1}>
          <Send size={14} /> Request Withdrawal
        </button>
      </div>

      {success && <div className="ser-alert ser-alert--ok"><CheckCircle size={14} /> {success}</div>}

      <div className="ser-stats">
        <div className="ser-stat">
          <div className="ser-stat-icon" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Coins size={18} style={{ color: '#f59e0b' }} />
          </div>
          <span className="ser-stat-val" style={{ color: '#f59e0b' }}>{loading ? '—' : reward?.borgCoins ?? 0}</span>
          <span className="ser-stat-lbl">Total Earned</span>
        </div>
        <div className="ser-stat">
          <div className="ser-stat-icon" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <TrendingUp size={18} style={{ color: '#10b981' }} />
          </div>
          <span className="ser-stat-val" style={{ color: '#10b981' }}>{loading ? '—' : available}</span>
          <span className="ser-stat-lbl">Available</span>
        </div>
        <div className="ser-stat">
          <div className="ser-stat-icon" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <CheckCircle size={18} style={{ color: '#8b5cf6' }} />
          </div>
          <span className="ser-stat-val" style={{ color: '#8b5cf6' }}>{loading ? '—' : reward?.borgCoinsWithdrawn ?? 0}</span>
          <span className="ser-stat-lbl">Withdrawn</span>
        </div>
        <div className="ser-stat">
          <div className="ser-stat-icon" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
            <Clock size={18} style={{ color: '#06b6d4' }} />
          </div>
          <span className="ser-stat-val" style={{ color: '#06b6d4' }}>{loading ? '—' : pendingCount}</span>
          <span className="ser-stat-lbl">Pending</span>
        </div>
      </div>

      <div className="ser-two-col">

        <div className="ser-card">
          <h2 className="ser-card-title">Earnings History</h2>
          {loading ? (
            <div className="ser-loading"><div className="ser-spinner" /></div>
          ) : !reward?.history?.length ? (
            <div className="ser-empty"><Coins size={28} /><p>No earnings yet.</p></div>
          ) : (
            <div className="ser-history-list">
              {[...reward.history].reverse().map((h, i) => (
                <div key={i} className="ser-history-item">
                  <div className="ser-history-dot" />
                  <div className="ser-history-body">
                    <p className="ser-history-reason">{h.reason}</p>
                    <p className="ser-history-date">{fmt(h.date)}</p>
                  </div>
                  <span className="ser-history-pts">+{h.borgCoins} BC</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ser-card">
          <h2 className="ser-card-title">Withdrawal Requests</h2>
          {loading ? (
            <div className="ser-loading"><div className="ser-spinner" /></div>
          ) : !reward?.withdrawals?.length ? (
            <div className="ser-empty"><Send size={28} /><p>No withdrawal requests yet.</p></div>
          ) : (
            <div className="ser-withdraw-list">
              {[...reward.withdrawals].reverse().map((w, i) => {
                const s = STATUS_STYLE[w.status];
                const Icon = s.icon;
                return (
                  <div key={i} className="ser-withdraw-item">
                    <div className="ser-withdraw-top">
                      <span className="ser-withdraw-amt">{w.borgCoins} BC</span>
                      <span className="ser-status-chip" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                        <Icon size={11} /> {w.status}
                      </span>
                    </div>
                    <p className="ser-withdraw-meta">
                      {w.upiId ? `UPI: ${w.upiId}` : w.bankDetails}
                    </p>
                    {w.adminNote && <p className="ser-withdraw-note">Note: {w.adminNote}</p>}
                    <p className="ser-withdraw-date">Requested {fmt(w.requestedAt)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {showModal && (
        <div className="ser-overlay" onClick={() => setShowModal(false)}>
          <div className="ser-modal" onClick={e => e.stopPropagation()}>
            <div className="ser-modal-header">
              <span>Request Withdrawal</span>
              <button className="ser-modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="ser-modal-body">
              <div className="ser-avail-banner">
                Available: <strong>{available} BC</strong>
              </div>
              {error && <div className="ser-alert ser-alert--err"><XCircle size={13} /> {error}</div>}
              <form onSubmit={handleWithdraw} className="ser-form">
                <div className="ser-field">
                  <label>BorgCoins to Withdraw</label>
                  <input
                    type="number" min="1" max={available} required
                    placeholder={`Max ${available}`}
                    value={form.borgCoins}
                    onChange={e => setForm(p => ({ ...p, borgCoins: e.target.value }))}
                  />
                </div>
                <div className="ser-field">
                  <label>UPI ID <span className="ser-optional">(or bank details below)</span></label>
                  <input
                    type="text" placeholder="yourname@upi"
                    value={form.upiId}
                    onChange={e => setForm(p => ({ ...p, upiId: e.target.value }))}
                  />
                </div>
                <div className="ser-field">
                  <label>Bank Details <span className="ser-optional">(if no UPI)</span></label>
                  <textarea
                    rows={3} placeholder="Account number, IFSC, bank name..."
                    value={form.bankDetails}
                    onChange={e => setForm(p => ({ ...p, bankDetails: e.target.value }))}
                  />
                </div>
                <button type="submit" className="ser-submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
