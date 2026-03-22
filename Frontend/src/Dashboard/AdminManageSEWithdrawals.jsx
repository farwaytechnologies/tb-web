import { useEffect, useState } from 'react';
import { Coins, CheckCircle, XCircle, Clock, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const STATUS_STYLE = {
  pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  approved: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)'  },
};

export default function AdminManageSEWithdrawals() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('pending');
  const [resolving, setResolving] = useState(null);
  const [note, setNote]       = useState('');
  const [toast, setToast]     = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = () => {
    setLoading(true);
    fetch(`${API}/api/se-rewards/admin/all`)
      .then(r => r.json())
      .then(d => setRewards(Array.isArray(d) ? d : []))
      .catch(() => setRewards([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleResolve = async (status) => {
    const { rewardId, withdrawId } = resolving;
    try {
      const res = await fetch(`${API}/api/se-rewards/admin/withdraw/${rewardId}/${withdrawId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote: note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('ok', `Withdrawal ${status}.`);
      setResolving(null);
      setNote('');
      fetchAll();
    } catch (err) {
      showToast('err', err.message);
    }
  };

  // Flatten all withdrawals with user info
  const allWithdrawals = rewards.flatMap(r =>
    (r.withdrawals || []).map(w => ({
      ...w,
      rewardId: r._id,
      user: r.userId,
      totalBorgCoins: r.borgCoins,
      available: r.available,
    }))
  ).filter(w => filter === 'all' || w.status === filter)
   .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

  const pendingCount = rewards.flatMap(r => r.withdrawals || []).filter(w => w.status === 'pending').length;

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '2rem 1.5rem 4rem', color: '#f1f5f9' }}>

      {toast && (
        <div style={{
          position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999,
          background: toast.type === 'ok' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toast.type === 'ok' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: toast.type === 'ok' ? '#10b981' : '#f87171',
          padding: '10px 16px', borderRadius: '10px', fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          {toast.type === 'ok' ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#12121a,#1a1a2e)', border: '1px solid #2a2a3e',
        borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>SE Withdrawal Requests</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Manage sales executive BorgCoin withdrawals</p>
          </div>
        </div>
        {pendingCount > 0 && (
          <span style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem' }}>
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? 'rgba(245,158,11,0.15)' : '#12121a',
            border: `1px solid ${filter === f ? 'rgba(245,158,11,0.3)' : '#1e1e2e'}`,
            color: filter === f ? '#f59e0b' : '#64748b',
            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            textTransform: 'capitalize',
          }}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ width: 28, height: 28, border: '3px solid #1e1e2e', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : allWithdrawals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#334155' }}>
          <Coins size={36} style={{ marginBottom: 12 }} />
          <p style={{ margin: 0 }}>No {filter} withdrawal requests.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {allWithdrawals.map((w, i) => {
            const s = STATUS_STYLE[w.status];
            return (
              <div key={i} style={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 12, padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(w.user?.name || 'U')}&background=f59e0b&color=000&size=32`}
                        alt={w.user?.name} style={{ width: 32, height: 32, borderRadius: '50%' }}
                      />
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{w.user?.name}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{w.user?.email}</p>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: 13, color: '#94a3b8' }}>
                      {w.upiId ? `UPI: ${w.upiId}` : w.bankDetails}
                    </p>
                    {w.adminNote && <p style={{ margin: '0 0 4px', fontSize: 12, color: '#f59e0b' }}>Note: {w.adminNote}</p>}
                    <p style={{ margin: 0, fontSize: 11, color: '#475569' }}>Requested {fmt(w.requestedAt)}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{w.borgCoins} BC</span>
                    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>
                      {w.status}
                    </span>
                    {w.status === 'pending' && (
                      <button
                        onClick={() => { setResolving({ rewardId: w.rewardId, withdrawId: w._id }); setNote(''); }}
                        style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resolve Modal */}
      {resolving && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}
          onClick={() => setResolving(null)}>
          <div style={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: 16, width: '100%', maxWidth: 400 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #1e1e2e', fontWeight: 600 }}>
              <span>Review Withdrawal</span>
              <button onClick={() => setResolving(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12, color: '#94a3b8' }}>Admin Note (optional)</label>
                <input
                  type="text" placeholder="e.g. Transferred via UPI"
                  value={note} onChange={e => setNote(e.target.value)}
                  style={{ background: '#0a0a0f', border: '1px solid #2a2a3e', borderRadius: 8, color: '#f1f5f9', padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleResolve('approved')} style={{ flex: 1, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <CheckCircle size={14} /> Approve
                </button>
                <button onClick={() => handleResolve('rejected')} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
