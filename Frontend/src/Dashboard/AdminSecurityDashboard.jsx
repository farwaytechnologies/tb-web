import { useEffect, useState, useCallback } from 'react';
import {
  Shield, AlertTriangle, Ban, Activity, Globe, Cpu,
  RefreshCw, Trash2, ChevronDown, ChevronUp, Eye,
  Lock, Zap, Server, Clock,
} from 'lucide-react';
import '../Styles/DashbordStyle/AdminSecurityDashboard.css';

const API = import.meta.env.VITE_API_URL;

const SEV_COLOR = { low: '#10b981', medium: '#f59e0b', high: '#f87171', critical: '#ef4444' };
const SEV_BG    = { low: 'rgba(16,185,129,0.1)', medium: 'rgba(245,158,11,0.1)', high: 'rgba(248,113,113,0.1)', critical: 'rgba(239,68,68,0.15)' };

const EVENT_LABELS = {
  FAILED_LOGIN:        'Failed Login',
  RATE_LIMITED_AUTH:   'Auth Rate Limit',
  RATE_LIMITED_API:    'API Rate Limit',
  RATE_LIMITED_ADMIN:  'Admin Rate Limit',
  SUSPICIOUS_INPUT:    'Suspicious Input',
  BLOCKED:             'Blocked Request',
};

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminSecurityDashboard() {
  const [stats, setStats]       = useState(null);
  const [logs, setLogs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState('overview');
  const [filter, setFilter]     = useState({ event: '', severity: '', ip: '' });
  const [expanded, setExpanded] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [toast, setToast]       = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/security/stats`, { headers: authHeader() });
      if (res.ok) setStats(await res.json());
    } catch { /* silent */ }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: 200 });
      if (filter.event)    params.set('event',    filter.event);
      if (filter.severity) params.set('severity', filter.severity);
      if (filter.ip)       params.set('ip',       filter.ip);
      const res = await fetch(`${API}/api/security/logs?${params}`, { headers: authHeader() });
      if (res.ok) setLogs(await res.json());
    } catch { /* silent */ }
  }, [filter]);

  const load = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchLogs()]);
    setLoading(false);
  }, [fetchStats, fetchLogs]);

  useEffect(() => { load(); }, [load]);

  const handleClear = async () => {
    if (!window.confirm('Clear logs older than 30 days?')) return;
    setClearing(true);
    try {
      const res = await fetch(`${API}/api/security/logs`, { method: 'DELETE', headers: authHeader() });
      const d = await res.json();
      showToast('ok', d.message || 'Logs cleared.');
      load();
    } catch { showToast('err', 'Failed to clear logs.'); }
    finally { setClearing(false); }
  };

  const handleSeedTest = async () => {
    try {
      const res = await fetch(`${API}/api/security/test`, { method: 'POST', headers: authHeader() });
      const d = await res.json();
      showToast('ok', d.message || 'Test log created.');
      load();
    } catch { showToast('err', 'Failed to seed test log.'); }
  };

  const sevCount = (s) => stats?.bySeverity?.find(x => x._id === s)?.count || 0;

  return (
    <div className="asd-page">
      {toast && (
        <div className={`asd-toast asd-toast--${toast.type}`}>{toast.text}</div>
      )}

      {/* Header */}
      <div className="asd-header">
        <div className="asd-header-left">
          <div className="asd-header-icon"><Shield size={22} /></div>
          <div>
            <h1>Security Intelligence</h1>
            <p>Real-time threat monitoring & event analysis</p>
          </div>
        </div>
        <div className="asd-header-actions">
          <button className="asd-btn asd-btn--ghost" onClick={handleSeedTest} title="Create a test log entry">
            + Test Log
          </button>
          <button className="asd-btn asd-btn--ghost" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'asd-spin' : ''} /> Refresh
          </button>
          <button className="asd-btn asd-btn--danger" onClick={handleClear} disabled={clearing}>
            <Trash2 size={14} /> Clear Old Logs
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="asd-kpi-grid">
        {[
          { icon: Activity,      color: '#8b5cf6', label: 'Events (24h)',    val: stats?.summary?.total24h    ?? '—' },
          { icon: Ban,           color: '#ef4444', label: 'Blocked (24h)',   val: stats?.summary?.blocked24h  ?? '—' },
          { icon: AlertTriangle, color: '#f59e0b', label: 'Critical (24h)', val: stats?.summary?.critical24h ?? '—' },
          { icon: Lock,          color: '#10b981', label: 'Failed Logins',  val: stats?.byEvent?.find(e => e._id === 'FAILED_LOGIN')?.count ?? '—' },
          { icon: Zap,           color: '#f87171', label: 'Suspicious',     val: stats?.byEvent?.find(e => e._id === 'SUSPICIOUS_INPUT')?.count ?? '—' },
          { icon: Server,        color: '#06b6d4', label: 'Rate Limited',   val: (stats?.byEvent?.filter(e => e._id.startsWith('RATE_LIMITED'))?.reduce((a,b) => a + b.count, 0)) ?? '—' },
        ].map((k, i) => (
          <div key={i} className="asd-kpi" style={{ '--kc': k.color }}>
            <div className="asd-kpi-icon" style={{ background: `${k.color}15` }}>
              <k.icon size={18} style={{ color: k.color }} />
            </div>
            <div>
              <span className="asd-kpi-val" style={{ color: k.color }}>{k.val}</span>
              <span className="asd-kpi-lbl">{k.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="asd-tabs">
        {['overview', 'logs', 'threats'].map(t => (
          <button key={t} className={`asd-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="asd-overview">
          <div className="asd-row">
            {/* Event breakdown */}
            <div className="asd-card">
              <h3><Activity size={15} /> Event Types (7d)</h3>
              <div className="asd-bar-list">
                {(stats?.byEvent || []).map((e, i) => {
                  const max = stats.byEvent[0]?.count || 1;
                  return (
                    <div key={i} className="asd-bar-row">
                      <span className="asd-bar-label">{EVENT_LABELS[e._id] || e._id}</span>
                      <div className="asd-bar-track">
                        <div className="asd-bar-fill" style={{ width: `${(e.count / max) * 100}%` }} />
                      </div>
                      <span className="asd-bar-count">{e.count}</span>
                    </div>
                  );
                })}
                {!stats?.byEvent?.length && <p className="asd-empty-sm">No events in last 7 days.</p>}
              </div>
            </div>

            {/* Severity breakdown */}
            <div className="asd-card">
              <h3><AlertTriangle size={15} /> Severity Breakdown (7d)</h3>
              <div className="asd-sev-grid">
                {['critical','high','medium','low'].map(s => (
                  <div key={s} className="asd-sev-item" style={{ background: SEV_BG[s], border: `1px solid ${SEV_COLOR[s]}30` }}>
                    <span className="asd-sev-count" style={{ color: SEV_COLOR[s] }}>{sevCount(s)}</span>
                    <span className="asd-sev-label" style={{ color: SEV_COLOR[s] }}>{s.toUpperCase()}</span>
                  </div>
                ))}
              </div>

              <h3 style={{ marginTop: '1.5rem' }}><Globe size={15} /> Top Countries (7d)</h3>
              <div className="asd-country-list">
                {(stats?.byCountry || []).slice(0, 6).map((c, i) => (
                  <div key={i} className="asd-country-row">
                    <span>{c._id || 'Unknown'}</span>
                    <span className="asd-country-count">{c.count}</span>
                  </div>
                ))}
                {!stats?.byCountry?.length && <p className="asd-empty-sm">No geo data yet.</p>}
              </div>
            </div>
          </div>

          {/* Daily trend */}
          <div className="asd-card asd-card--full">
            <h3><Clock size={15} /> Daily Event Trend (7d)</h3>
            <div className="asd-trend">
              {(stats?.dailyTrend || []).map((d, i) => {
                const max = Math.max(...(stats.dailyTrend.map(x => x.count)), 1);
                return (
                  <div key={i} className="asd-trend-col">
                    <div className="asd-trend-bars">
                      <div className="asd-trend-bar asd-trend-bar--total" style={{ height: `${(d.count / max) * 100}%` }} title={`Total: ${d.count}`} />
                      <div className="asd-trend-bar asd-trend-bar--blocked" style={{ height: `${(d.blocked / max) * 100}%` }} title={`Blocked: ${d.blocked}`} />
                    </div>
                    <span className="asd-trend-date">{d._id?.slice(5)}</span>
                  </div>
                );
              })}
              {!stats?.dailyTrend?.length && <p className="asd-empty-sm">No trend data yet.</p>}
            </div>
            <div className="asd-trend-legend">
              <span><span className="asd-legend-dot" style={{ background: '#8b5cf6' }} /> Total Events</span>
              <span><span className="asd-legend-dot" style={{ background: '#ef4444' }} /> Blocked</span>
            </div>
          </div>

          {/* Top IPs */}
          <div className="asd-card asd-card--full">
            <h3><Cpu size={15} /> Top IPs (24h)</h3>
            <div className="asd-ip-table-wrap">
              <table className="asd-ip-table">
                <thead><tr><th>IP Address</th><th>Country</th><th>Requests</th></tr></thead>
                <tbody>
                  {(stats?.topIps || []).map((ip, i) => (
                    <tr key={i}>
                      <td className="asd-ip-addr">{ip._id}</td>
                      <td>{ip.country || '—'}</td>
                      <td><span className="asd-ip-count">{ip.count}</span></td>
                    </tr>
                  ))}
                  {!stats?.topIps?.length && (
                    <tr><td colSpan={3} className="asd-empty-sm">No IP data yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGS ── */}
      {tab === 'logs' && (
        <div className="asd-logs">
          <div className="asd-filters">
            <select value={filter.event} onChange={e => setFilter(f => ({ ...f, event: e.target.value }))}>
              <option value="">All Events</option>
              {Object.entries(EVENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={filter.severity} onChange={e => setFilter(f => ({ ...f, severity: e.target.value }))}>
              <option value="">All Severities</option>
              {['low','medium','high','critical'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input placeholder="Filter by IP..." value={filter.ip}
              onChange={e => setFilter(f => ({ ...f, ip: e.target.value }))} />
            <button className="asd-btn asd-btn--primary" onClick={fetchLogs}>Apply</button>
          </div>

          <div className="asd-log-list">
            {logs.length === 0 && <div className="asd-empty">No logs found.</div>}
            {logs.map((log, i) => (
              <div key={log._id || i} className="asd-log-item" style={{ borderLeftColor: SEV_COLOR[log.severity] }}>
                <div className="asd-log-row" onClick={() => setExpanded(expanded === i ? null : i)}>
                  <span className="asd-log-sev" style={{ background: SEV_BG[log.severity], color: SEV_COLOR[log.severity] }}>
                    {log.severity}
                  </span>
                  <span className="asd-log-event">{EVENT_LABELS[log.event] || log.event}</span>
                  <span className="asd-log-ip">{log.ip || '—'}</span>
                  <span className="asd-log-path">{log.method} {log.path}</span>
                  <span className="asd-log-time">{new Date(log.createdAt).toLocaleString()}</span>
                  {log.blocked && <span className="asd-log-blocked">BLOCKED</span>}
                  <span className="asd-log-expand">{expanded === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
                </div>
                {expanded === i && (
                  <div className="asd-log-detail">
                    {log.email    && <div><strong>Email:</strong> {log.email}</div>}
                    {log.country  && <div><strong>Country:</strong> {log.country}</div>}
                    {log.details  && <div><strong>Details:</strong> {log.details}</div>}
                    {log.userAgent && <div><strong>User Agent:</strong> {log.userAgent}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── THREATS ── */}
      {tab === 'threats' && (
        <div className="asd-threats">
          <h3>Recent Critical Events</h3>
          {(stats?.recentCritical || []).length === 0 && (
            <div className="asd-empty"><Shield size={40} /><p>No critical events. System looks clean.</p></div>
          )}
          {(stats?.recentCritical || []).map((log, i) => (
            <div key={i} className="asd-threat-card">
              <div className="asd-threat-icon"><AlertTriangle size={18} /></div>
              <div className="asd-threat-body">
                <strong>{EVENT_LABELS[log.event] || log.event}</strong>
                <span>IP: {log.ip || '—'} · {log.country || 'Unknown'} · {new Date(log.createdAt).toLocaleString()}</span>
                {log.details && <span className="asd-threat-detail">{log.details}</span>}
              </div>
              {log.blocked && <span className="asd-threat-badge">BLOCKED</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
