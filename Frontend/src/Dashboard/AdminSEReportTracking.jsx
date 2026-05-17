import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Coins, TrendingUp, Search, ChevronDown, ChevronUp,
  FileBarChart, Briefcase, GraduationCap, CheckCircle, Clock, X
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export default function AdminSEReportTracking() {
  const [seList, setSeList]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [sortKey, setSortKey] = useState('totalReferrals');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(null); // full report for modal
  const [reportLoading, setReportLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored || stored.role !== 'admin') { navigate('/admin-login'); return; }

    // Load all SE users + their wallet data
    Promise.all([
      fetch(`${API}/api/auth/users`).then(r => r.json()),
      fetch(`${API}/api/se-rewards/admin/all`).then(r => r.json()),
    ]).then(([users, rewards]) => {
      const seUsers = users.filter(u => u.role === 'sales_executive');
      const rewardMap = Object.fromEntries(
        (Array.isArray(rewards) ? rewards : []).map(r => [String(r.userId?._id || r.userId), r])
      );
      const allReferrals = users.filter(u => u.referredBy);

      const list = seUsers.map(se => {
        const refs = allReferrals.filter(u => String(u.referredBy) === String(se._id));
        const reward = rewardMap[String(se._id)] || {};
        const wallet = reward.wallet || {};
        const now = new Date();
        const thisMonth = refs.filter(r => {
          const d = new Date(r.createdAt);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }).length;
        return {
          ...se,
          totalReferrals: refs.length,
          students: refs.filter(r => r.role === 'student').length,
          tutors: refs.filter(r => r.role === 'tutor').length,
          thisMonth,
          borgCoinsEarned: wallet.totalEarned ?? 0,
          borgCoinsAvailable: wallet.borgCoins ?? 0,
          borgCoinsWithdrawn: wallet.totalWithdrawn ?? 0,
          pendingWithdrawals: (reward.withdrawals || []).filter(w => w.status === 'pending').length,
        };
      });
      setSeList(list);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [navigate]);

  const openReport = async (se) => {
    setReportLoading(true);
    setSelected({ se, report: null });
    try {
      const res = await fetch(`${API}/api/se-report/${se._id}`);
      const data = await res.json();
      setSelected({ se, report: data });
    } catch {
      setSelected(null);
    } finally {
      setReportLoading(false);
    }
  };

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...seList]
      .filter(s => !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q))
      .sort((a, b) => {
        const diff = (a[sortKey] ?? 0) - (b[sortKey] ?? 0);
        return sortDir === 'desc' ? -diff : diff;
      });
  }, [seList, search, sortKey, sortDir]);

  const totals = useMemo(() => ({
    referrals: seList.reduce((s, r) => s + r.totalReferrals, 0),
    earned: seList.reduce((s, r) => s + r.borgCoinsEarned, 0),
    pending: seList.reduce((s, r) => s + r.pendingWithdrawals, 0),
  }), [seList]);

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const SortBtn = ({ k, label }) => (
    <button onClick={() => toggleSort(k)} style={{ background: 'none', border: 'none', color: sortKey === k ? '#f59e0b' : '#475569', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, padding: 0 }}>
      {label} {sortKey === k ? (sortDir === 'desc' ? <ChevronDown size={11} /> : <ChevronUp size={11} />) : null}
    </button>
  );

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '2rem 1.5rem 4rem', color: '#f1f5f9' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#12121a,#1a1a2e)', border: '1px solid #2a2a3e', borderRadius: 16, padding: '1.75rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 220, height: 220, background: 'radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileBarChart size={22} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>SE Report Tracking</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Performance overview for all sales executives</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
            <input
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 9, padding: '8px 12px 8px 30px', fontSize: 13, color: '#f1f5f9', outline: 'none', width: 220 }}
            />
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: Briefcase,    val: seList.length,      label: 'Sales Executives', color: '#06b6d4' },
          { icon: Users,        val: totals.referrals,   label: 'Total Referrals',  color: '#8b5cf6' },
          { icon: Coins,        val: totals.earned,      label: 'BC Earned (Total)',color: '#f59e0b' },
          { icon: Clock,        val: totals.pending,     label: 'Pending Withdrawals', color: '#f97316' },
        ].map((k, i) => (
          <div key={i} style={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 12, padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `${k.color}18`, border: `1px solid ${k.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <k.icon size={17} style={{ color: k.color }} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: k.color }}>{loading ? '—' : k.val}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{k.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ width: 28, height: 28, border: '3px solid #1e1e2e', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#334155' }}>
          <Briefcase size={36} style={{ marginBottom: 12 }} />
          <p style={{ margin: 0 }}>No sales executives found.</p>
        </div>
      ) : (
        <div style={{ background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#0f0f17', borderBottom: '1px solid #1e1e2e' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Executive</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}><SortBtn k="totalReferrals" label="Total Refs" /></th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}><SortBtn k="students" label="Students" /></th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}><SortBtn k="tutors" label="Tutors" /></th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}><SortBtn k="thisMonth" label="This Month" /></th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}><SortBtn k="borgCoinsEarned" label="BC Earned" /></th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}><SortBtn k="borgCoinsAvailable" label="BC Available" /></th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}><SortBtn k="pendingWithdrawals" label="Pending W." /></th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Report</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((se, i) => (
                  <tr key={se._id} style={{ borderBottom: '1px solid #1a1a2a', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={se.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(se.name)}&background=f59e0b&color=000&size=36`}
                          alt={se.name} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(245,158,11,0.3)' }}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: 600 }}>{se.name}</p>
                          <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{se.email}</p>
                          <p style={{ margin: 0, fontSize: 10, color: '#f59e0b', fontFamily: 'monospace' }}>{se.referralCode}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 700, color: '#8b5cf6', fontSize: 15 }}>{se.totalReferrals}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <GraduationCap size={13} style={{ color: '#6366f1' }} />
                        <span style={{ color: '#6366f1', fontWeight: 600 }}>{se.students}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Briefcase size={13} style={{ color: '#ec4899' }} />
                        <span style={{ color: '#ec4899', fontWeight: 600 }}>{se.tutors}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: se.thisMonth > 0 ? 'rgba(16,185,129,0.12)' : '#0a0a0f', border: `1px solid ${se.thisMonth > 0 ? 'rgba(16,185,129,0.3)' : '#1e1e2e'}`, color: se.thisMonth > 0 ? '#10b981' : '#334155', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        {se.thisMonth}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#f59e0b', fontWeight: 700 }}>{se.borgCoinsEarned} BC</td>
                    <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 600 }}>{se.borgCoinsAvailable} BC</td>
                    <td style={{ padding: '12px 16px' }}>
                      {se.pendingWithdrawals > 0 ? (
                        <span style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                          {se.pendingWithdrawals}
                        </span>
                      ) : <span style={{ color: '#334155' }}>—</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => openReport(se)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        <FileBarChart size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}
          onClick={() => setSelected(null)}>
          <div style={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: 18, width: '100%', maxWidth: 680, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e1e2e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={selected.se.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.se.name)}&background=f59e0b&color=000&size=40`}
                  alt={selected.se.name} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(245,158,11,0.3)' }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: 700 }}>{selected.se.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{selected.se.email}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {/* Modal Body */}
            <div style={{ overflowY: 'auto', padding: '1.5rem', flex: 1 }}>
              {reportLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <div style={{ width: 28, height: 28, border: '3px solid #1e1e2e', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                </div>
              ) : selected.report ? (() => {
                const { monthly, roleBreakdown, wallet, withdrawalSummary, referrals, withdrawals } = selected.report;
                const last6 = monthly.slice(-6);
                const maxBar = Math.max(...last6.map(m => m.total), 1);
                return (
                  <>
                    {/* KPIs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: '1.25rem' }}>
                      {[
                        { label: 'Total Refs',  val: referrals.length,         color: '#8b5cf6' },
                        { label: 'BC Earned',   val: `${wallet.totalEarned} BC`, color: '#f59e0b' },
                        { label: 'BC Available',val: `${wallet.borgCoins} BC`,  color: '#10b981' },
                        { label: 'Withdrawn',   val: `${wallet.totalWithdrawn} BC`, color: '#6366f1' },
                      ].map((k, i) => (
                        <div key={i} style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 10, padding: '0.9rem', textAlign: 'center' }}>
                          <p style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800, color: k.color }}>{k.val}</p>
                          <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{k.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Mini bar chart */}
                    <div style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem' }}>
                      <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>Last 6 Months</p>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                        {last6.map((m, i) => (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <span style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 600 }}>{m.total || ''}</span>
                            <div style={{ width: '100%', height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 1 }}>
                              <div style={{ width: '100%', height: `${(m.tutors / maxBar) * 100}%`, background: '#ec4899', borderRadius: '2px 2px 0 0', minHeight: m.tutors ? 2 : 0 }} />
                              <div style={{ width: '100%', height: `${(m.students / maxBar) * 100}%`, background: '#6366f1', borderRadius: '2px 2px 0 0', minHeight: m.students ? 2 : 0 }} />
                            </div>
                            <span style={{ fontSize: 9, color: '#475569' }}>{m.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Role breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1.25rem' }}>
                      {[
                        { label: 'Students', val: roleBreakdown.student, color: '#6366f1', pct: referrals.length ? Math.round((roleBreakdown.student / referrals.length) * 100) : 0 },
                        { label: 'Tutors',   val: roleBreakdown.tutor,   color: '#ec4899', pct: referrals.length ? Math.round((roleBreakdown.tutor   / referrals.length) * 100) : 0 },
                      ].map(r => (
                        <div key={r.label} style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 10, padding: '0.9rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                            <span style={{ color: '#94a3b8' }}>{r.label}</span>
                            <span style={{ color: r.color, fontWeight: 700 }}>{r.val} ({r.pct}%)</span>
                          </div>
                          <div style={{ height: 5, background: '#1e1e2e', borderRadius: 3 }}>
                            <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 3 }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recent referrals */}
                    {referrals.length > 0 && (
                      <div style={{ background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem' }}>
                        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>Recent Referrals (last 5)</p>
                        {referrals.slice(0, 5).map((r, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 4 ? '1px solid #1e1e2e' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=6366f1&color=fff&size=26`} alt={r.name} style={{ width: 26, height: 26, borderRadius: '50%' }} />
                              <div>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{r.name}</p>
                                <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{r.email}</p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ background: r.role === 'student' ? 'rgba(99,102,241,0.12)' : 'rgba(236,72,153,0.12)', color: r.role === 'student' ? '#6366f1' : '#ec4899', border: `1px solid ${r.role === 'student' ? 'rgba(99,102,241,0.3)' : 'rgba(236,72,153,0.3)'}`, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, textTransform: 'capitalize' }}>{r.role}</span>
                              <span style={{ fontSize: 11, color: '#475569' }}>{fmt(r.createdAt)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Withdrawal summary */}
                    <div style={{ background: 'linear-gradient(135deg,#12121a,#1a1508)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '1rem' }}>
                      <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>Withdrawal Summary</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                        {[
                          { label: 'Approved', val: `${withdrawalSummary.approved} BC`, color: '#10b981' },
                          { label: 'Pending',  val: `${withdrawalSummary.pending} BC`,  color: '#f97316' },
                          { label: 'Rejected', val: `${withdrawalSummary.rejected} BC`, color: '#ef4444' },
                        ].map(w => (
                          <div key={w.label} style={{ textAlign: 'center', padding: '8px', background: '#0a0a0f', borderRadius: 8, border: '1px solid #1e1e2e' }}>
                            <p style={{ margin: '0 0 3px', fontWeight: 700, color: w.color, fontSize: 14 }}>{w.val}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>{w.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })() : null}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
