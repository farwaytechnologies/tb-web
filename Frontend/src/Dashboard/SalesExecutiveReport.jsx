import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Users, Coins, CheckCircle, Clock,
  XCircle, Printer, Briefcase, GraduationCap, Calendar
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const BAR_COLORS = { students: '#6366f1', tutors: '#ec4899' };

export default function SalesExecutiveReport() {
  const [user, setUser]       = useState(null);
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod]   = useState(6); // months to show in chart
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored || stored.role !== 'sales_executive') { navigate('/login'); return; }
    setUser(stored);
    fetch(`${API}/api/se-report/${stored._id || stored.id}`)
      .then(r => r.json())
      .then(d => setReport(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const handlePrint = () => window.print();

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #1e1e2e', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!report) return null;

  const { se, referrals, monthly, roleBreakdown, wallet, withdrawalSummary, withdrawals } = report;
  const chartData = monthly.slice(-period);
  const maxBar = Math.max(...chartData.map(m => m.total), 1);

  const thisMonth = monthly[monthly.length - 1];
  const lastMonth = monthly[monthly.length - 2];
  const growth = lastMonth?.total > 0
    ? (((thisMonth.total - lastMonth.total) / lastMonth.total) * 100).toFixed(0)
    : thisMonth.total > 0 ? '+100' : '0';

  return (
    <div ref={printRef} style={{ background: '#0a0a0f', minHeight: '100vh', padding: '2rem 1.5rem 4rem', color: '#f1f5f9' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .no-print { display: none !important; }
          .print-card { background: #f8f8f8 !important; border: 1px solid #ddd !important; color: #000 !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#12121a,#1a1a2e)', border: '1px solid #2a2a3e', borderRadius: 16, padding: '1.75rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 220, height: 220, background: 'radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          <img
            src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(se?.name || 'SE')}&background=f59e0b&color=000&size=64`}
            alt={se?.name} style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(245,158,11,0.4)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Sales Executive
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{se?.referralCode}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>{se?.name} — Performance Report</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Generated {fmt(new Date())} · Member since {fmt(se?.createdAt)}</p>
          </div>
        </div>
        <button className="no-print" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', padding: '9px 18px', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          <Printer size={15} /> Print / Export
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: Users,        val: referrals.length,              label: 'Total Referrals',  color: '#8b5cf6' },
          { icon: GraduationCap,val: roleBreakdown.student,         label: 'Students',         color: '#6366f1' },
          { icon: Briefcase,    val: roleBreakdown.tutor,           label: 'Tutors',           color: '#ec4899' },
          { icon: Coins,        val: wallet.totalEarned,            label: 'BC Earned',        color: '#f59e0b' },
          { icon: CheckCircle,  val: wallet.borgCoins,              label: 'BC Available',     color: '#10b981' },
          { icon: TrendingUp,   val: `${growth > 0 ? '+' : ''}${growth}%`, label: 'MoM Growth', color: '#06b6d4' },
          { icon: Clock,        val: withdrawalSummary.pending,     label: 'BC Pending',       color: '#f97316' },
          { icon: CheckCircle,  val: withdrawalSummary.approved,    label: 'BC Withdrawn',     color: '#14b8a6' },
        ].map((k, i) => (
          <div key={i} className="print-card" style={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 12, padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `${k.color}18`, border: `1px solid ${k.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <k.icon size={17} style={{ color: k.color }} />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: k.color }}>{k.val}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{k.label}</span>
          </div>
        ))}
      </div>

      {/* Chart + Role Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

        {/* Bar Chart */}
        <div className="print-card" style={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 14, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
              <TrendingUp size={14} style={{ color: '#8b5cf6' }} /> Monthly Referrals
            </div>
            <div className="no-print" style={{ display: 'flex', gap: 4 }}>
              {[3, 6, 12].map(p => (
                <button key={p} onClick={() => setPeriod(p)} style={{ background: period === p ? 'rgba(139,92,246,0.15)' : '#0a0a0f', border: `1px solid ${period === p ? 'rgba(139,92,246,0.3)' : '#1e1e2e'}`, color: period === p ? '#8b5cf6' : '#475569', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  {p}M
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
            {chartData.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#8b5cf6' }}>{m.total || ''}</span>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 90, gap: 1 }}>
                  <div style={{ width: '100%', height: `${(m.tutors / maxBar) * 100}%`, background: BAR_COLORS.tutors, borderRadius: '3px 3px 0 0', minHeight: m.tutors ? 3 : 0 }} title={`${m.tutors} tutors`} />
                  <div style={{ width: '100%', height: `${(m.students / maxBar) * 100}%`, background: BAR_COLORS.students, borderRadius: '3px 3px 0 0', minHeight: m.students ? 3 : 0 }} title={`${m.students} students`} />
                </div>
                <span style={{ fontSize: 9, color: '#475569', textAlign: 'center' }}>{m.month}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            {[['Students', BAR_COLORS.students], ['Tutors', BAR_COLORS.tutors]].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748b' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} /> {l}
              </div>
            ))}
          </div>
        </div>

        {/* Role + BorgCoin Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="print-card" style={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 14, padding: '1.25rem', flex: 1 }}>
            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Referral Breakdown</p>
            {[
              { label: 'Students', val: roleBreakdown.student, color: '#6366f1', pct: referrals.length ? Math.round((roleBreakdown.student / referrals.length) * 100) : 0 },
              { label: 'Tutors',   val: roleBreakdown.tutor,   color: '#ec4899', pct: referrals.length ? Math.round((roleBreakdown.tutor   / referrals.length) * 100) : 0 },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: '#94a3b8' }}>{r.label}</span>
                  <span style={{ color: r.color, fontWeight: 700 }}>{r.val} ({r.pct}%)</span>
                </div>
                <div style={{ height: 6, background: '#1e1e2e', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="print-card" style={{ background: 'linear-gradient(135deg,#12121a,#1a1508)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '1.25rem' }}>
            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>BorgCoin Summary</p>
            {[
              { label: 'Total Earned',  val: wallet.totalEarned,           color: '#f59e0b' },
              { label: 'Available',     val: wallet.borgCoins,             color: '#10b981' },
              { label: 'Withdrawn',     val: wallet.totalWithdrawn,        color: '#8b5cf6' },
              { label: 'Pending',       val: withdrawalSummary.pending,    color: '#f97316' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #1e1e2e' }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: r.color, fontSize: 14 }}>{r.val} BC</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Table */}
      <div className="print-card" style={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <p style={{ margin: '0 0 1rem', fontSize: 13, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 7 }}>
          <Calendar size={14} style={{ color: '#06b6d4' }} /> Monthly Breakdown
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e1e2e' }}>
              {['Month', 'Total', 'Students', 'Tutors', 'BC Earned'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...monthly].reverse().map((m, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1a1a2a' }}>
                <td style={{ padding: '9px 12px', color: '#94a3b8' }}>{m.month}</td>
                <td style={{ padding: '9px 12px', fontWeight: 700, color: '#f1f5f9' }}>{m.total}</td>
                <td style={{ padding: '9px 12px', color: '#6366f1' }}>{m.students}</td>
                <td style={{ padding: '9px 12px', color: '#ec4899' }}>{m.tutors}</td>
                <td style={{ padding: '9px 12px', color: '#f59e0b', fontWeight: 600 }}>{m.borgCoinsEarned} BC</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Referrals */}
      <div className="print-card" style={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <p style={{ margin: '0 0 1rem', fontSize: 13, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 7 }}>
          <Users size={14} style={{ color: '#8b5cf6' }} /> Recent Referrals
          <span style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#8b5cf6', fontSize: 11, padding: '1px 8px', borderRadius: 20 }}>{referrals.length}</span>
        </p>
        {referrals.length === 0 ? (
          <p style={{ color: '#334155', fontSize: 13, textAlign: 'center', padding: '1.5rem 0' }}>No referrals yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e1e2e' }}>
                {['Name', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrals.slice(0, 20).map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1a1a2a' }}>
                  <td style={{ padding: '9px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=6366f1&color=fff&size=28`} alt={r.name} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                      <span style={{ fontWeight: 500 }}>{r.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '9px 12px', color: '#64748b' }}>{r.email}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{ background: r.role === 'student' ? 'rgba(99,102,241,0.12)' : 'rgba(236,72,153,0.12)', color: r.role === 'student' ? '#6366f1' : '#ec4899', border: `1px solid ${r.role === 'student' ? 'rgba(99,102,241,0.3)' : 'rgba(236,72,153,0.3)'}`, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>
                      {r.role}
                    </span>
                  </td>
                  <td style={{ padding: '9px 12px', color: '#64748b' }}>{fmt(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Withdrawal History */}
      {withdrawals.length > 0 && (
        <div className="print-card" style={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 14, padding: '1.25rem', overflowX: 'auto' }}>
          <p style={{ margin: '0 0 1rem', fontSize: 13, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Coins size={14} style={{ color: '#f59e0b' }} /> Withdrawal History
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e1e2e' }}>
                {['Amount', 'Payment', 'Status', 'Requested', 'Note'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w, i) => {
                const sc = w.status === 'approved' ? '#10b981' : w.status === 'rejected' ? '#ef4444' : '#f59e0b';
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #1a1a2a' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 700, color: '#f59e0b' }}>{w.borgCoins} BC</td>
                    <td style={{ padding: '9px 12px', color: '#94a3b8', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.paymentDetails}</td>
                    <td style={{ padding: '9px 12px' }}>
                      <span style={{ background: `${sc}18`, color: sc, border: `1px solid ${sc}40`, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{w.status}</span>
                    </td>
                    <td style={{ padding: '9px 12px', color: '#64748b' }}>{fmt(w.requestedAt)}</td>
                    <td style={{ padding: '9px 12px', color: '#475569', fontSize: 12 }}>{w.adminNote || '—'}</td>
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
