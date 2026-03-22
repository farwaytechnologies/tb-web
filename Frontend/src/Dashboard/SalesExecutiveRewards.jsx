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
  const [data, setData]           = useState(null);   // { wallet, withdrawals, available }
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ borgCoins: '', upiId: '', bankDetails: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const navigate = useNavigate();

  const fetchData = (uid) => {
    setLoading(true);
    fetch(`${API}/api/se-rewards/${uid}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored || stored.role !== 'sales_executive') { navigate('/login'); return; }
    setUser(stored);
    fetchData(stored._id || stored.id);
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
      const d = await res.json();
      if (!res.ok) throw new Error(d.message);
      setSuccess('Withdrawal request submitted.');
      setForm({ borgCoins: '', upiId: '', bankDetails: '' });
      setShowModal(false);
      fetchData(uid);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (!user) return null;

  const wallet = data?.wallet;
  const withdrawals = data?.withdrawals ?? [];
  const available = data?.available ?? 0;
  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

  return (
    <div className="ser-page">

      <div className="ser-header">
        <div className="ser-header-glow" />
        <div className="ser-header-left">
          <div className="ser-header-icon"><Coins size={22} style={{ color: '#f59e0b' }} /></div>
          <div>
            <h1>BorgCoins Wallet</h1>
            <p>Earn 25 BC per referral. Withdraw anytime.</p>
          </div>
        </div>
        <button className="ser-withdraw-btn"
          onClick={() => { setShowModal(true); setError(''); setSuccess(''); }}
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
          <span className="ser-stat-val" style={{ color: '#f59e0b' }}>{loading ? '—' : wallet?.totalEarned ?? 0}</span>
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
          <span className="ser-stat-val" style={{ color: '#8b5cf6' }}>{loading ? '—' : wallet?.totalWithdrawn ?? 0}</span>
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

        {/* Wallet Summary */}
        <div className="ser-card">
          <h2 className="ser-card-title">Wallet Summary</h2>
          {loading ? (
            <div className="ser-loading"><div className="ser-spinner" /></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Total Earned', val: wallet?.totalEarned ?? 0, color: '#f59e0b' },
                { label: 'Available Balance', val: available, color: '#10b981' },
                { label: 'Total Withdrawn', val: wallet?.totalWithdrawn ?? 0, color: '#8b5cf6' },
                { label: 'Pending Requests', val: pendingCount, color: '#06b6d4' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#0a0a0f', borderRadius: 10, border: '1px solid #1e1e2e' }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: row.color }}>{row.val} BC</span>
                </div>
              ))}
              <p style={{ fontSize: 12, color: '#475569', margin: 0, textAlign: 'center' }}>
                1 BC = $0.50 USD · Earn 25 BC per referral
              </p>
            </div>
          )}
        </div>

        {/* Withdrawal Requests */}
        <div className="ser-card">
          <h2 className="ser-card-title">Withdrawal Requests</h2>
          {loading ? (
            <div className="ser-loading"><div className="ser-spinner" /></div>
          ) : !withdrawals.length ? (
            <div className="ser-empty"><Send size={28} /><p>No withdrawal requests yet.</p></div>
          ) : (
            <div className="ser-withdraw-list">
              {withdrawals.map((w, i) => {
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
                    <p className="ser-withdraw-meta">{w.paymentDetails}</p>
                    {w.adminNote && <p className="ser-withdraw-note">Note: {w.adminNote}</p>}
                    <p className="ser-withdraw-date">Requested {fmt(w.requestedAt)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Withdraw Modal */}
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
