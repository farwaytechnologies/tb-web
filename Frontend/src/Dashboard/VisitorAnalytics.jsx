import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import {
  Users, Globe, Clock, TrendingUp, Activity, MapPin, FileText,
  RefreshCw, ChevronLeft, ChevronRight, Search, X, Smartphone,
  Monitor, Tablet, MousePointer, ArrowUpRight, RotateCcw,
} from 'lucide-react';
import '../Styles/DashbordStyle/AdminVisitorAnalytics.css';

const API = import.meta.env.VITE_API_URL;
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const fmtDur = s => {
  if (!s) return '0s';
  if (s < 60) return `${Math.round(s)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
};
const fmtDate = d => d
  ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  : '—';

// ── Mini SVG bar chart ────────────────────────────────────────────────────────
function BarChart({ data = [], labelKey, valueKey, color = '#8b5cf6', height = 100 }) {
  if (!data.length) return <p className="va-empty-msg">No data</p>;
  const max = Math.max(...data.map(d => d[valueKey])) || 1;
  return (
    <div className="va-bar-chart">
      {data.map((d, i) => (
        <div key={i} className="va-bar-col">
          <div className="va-bar-wrap" style={{ height }}>
            <div className="va-bar-fill"
              title={`${d[labelKey]}: ${d[valueKey]}`}
              style={{ height: `${(d[valueKey] / max) * 100}%`, background: color }} />
          </div>
          <span className="va-bar-lbl">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data = [], valueKey, color = '#8b5cf6' }) {
  if (data.length < 2) return null;
  const vals = data.map(d => d[valueKey]);
  const max = Math.max(...vals) || 1;
  const w = 200, h = 40;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="va-sparkline" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// ── Horizontal bar ────────────────────────────────────────────────────────────
function HBar({ label, value, max, color = '#8b5cf6', pct }) {
  return (
    <div className="va-hbar-row">
      <span className="va-hbar-lbl" title={label}>{label}</span>
      <div className="va-hbar-track">
        <div className="va-hbar-fill" style={{ width: `${max ? (value / max) * 100 : 0}%`, background: color }} />
      </div>
      <span className="va-hbar-val">{pct != null ? `${pct}%` : value}</span>
    </div>
  );
}

// ── Donut chart (SVG) ─────────────────────────────────────────────────────────
function Donut({ segments, size = 100 }) {
  const r = 36, cx = 50, cy = 50, circ = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth="14"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
        );
        offset += dash;
        return el;
      })}
      <circle cx={cx} cy={cy} r={29} fill="#13131a" />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function VisitorAnalytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview | traffic | geo | visitors

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    loadAll();
  }, [navigate]);

  const loadAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const [aRes, vRes, sRes] = await Promise.all([
        fetch(`${API}/api/visitors/analytics`),
        fetch(`${API}/api/visitors`),
        fetch(`${API}/api/visitors/stats`),
      ]);
      const [a, v, s] = await Promise.all([aRes.json(), vRes.json(), sRes.json()]);
      setAnalytics(a);
      setVisitors(v.visitors || []);
      setStats(s.stats || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  const filtered = visitors.filter(v => {
    const q = search.toLowerCase();
    const matchQ = !q || [v.ip, v.country, v.city, v.region, v.device, v.browser].some(f => f?.toLowerCase().includes(q));
    const matchC = !selectedCountry || v.country?.toLowerCase() === selectedCountry.toLowerCase();
    return matchQ && matchC;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hourlyFull = Array.from({ length: 24 }, (_, h) => {
    const found = analytics?.hourly?.find(x => x._id === h);
    return { label: `${h}h`, count: found?.count || 0 };
  });

  const dailyData = (analytics?.dailyTrend || []).map(d => ({
    label: d._id?.slice(5), count: d.count,
  }));

  if (loading) return (
    <div className="va-loading">
      <div className="va-spinner" />
      <p>Loading analytics...</p>
    </div>
  );

  const totalV = analytics?.totalVisitors || visitors.length;
  const avgDur = analytics?.avgDuration?.avg || 0;
  const maxPage = analytics?.topPages?.[0]?.count || 1;
  const maxCountry = stats[0]?.count || 1;
  const todayCount = dailyData[dailyData.length - 1]?.count || 0;

  // Device donut
  const deviceColors = { Desktop: '#8b5cf6', Mobile: '#06b6d4', Tablet: '#f59e0b', Other: '#64748b' };
  const deviceSegs = (analytics?.deviceBreakdown || []).map(d => ({
    label: d._id || 'Other', value: d.count, color: deviceColors[d._id] || '#64748b',
  }));
  const deviceTotal = deviceSegs.reduce((s, d) => s + d.value, 0) || 1;

  // New vs returning donut
  const newRet = [
    { label: 'New', value: analytics?.newVisitors || 0, color: '#10b981' },
    { label: 'Returning', value: analytics?.returningVisitors || 0, color: '#8b5cf6' },
  ];
  const nrTotal = (analytics?.newVisitors || 0) + (analytics?.returningVisitors || 0) || 1;

  return (
    <div className="va-page">
      {/* Header */}
      <div className="va-header">
        <div className="va-header-left">
          <div className="va-header-icon"><Activity size={22} /></div>
          <div>
            <h1>Visitor Analytics</h1>
            <p>Real-time platform traffic insights</p>
          </div>
        </div>
        <button className="va-refresh-btn" onClick={() => loadAll(true)} disabled={refreshing}>
          <RefreshCw size={14} className={refreshing ? 'va-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="va-kpi-grid">
        {[
          { icon: Users,        label: 'Total Visitors',   val: totalV,                          color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)' },
          { icon: Globe,        label: 'Countries',        val: analytics?.uniqueCountries || 0, color: '#06b6d4', glow: 'rgba(6,182,212,0.15)'  },
          { icon: Clock,        label: 'Avg Session',      val: fmtDur(avgDur),                  color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
          { icon: TrendingUp,   label: 'Today',            val: todayCount,                      color: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
          { icon: MousePointer, label: 'Bounce Rate',      val: `${analytics?.bounceRate ?? 0}%`,color: '#f87171', glow: 'rgba(248,113,113,0.15)'},
          { icon: ArrowUpRight, label: 'New Visitors',     val: analytics?.newVisitors || 0,     color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
          { icon: RotateCcw,    label: 'Returning',        val: analytics?.returningVisitors || 0,color:'#8b5cf6', glow: 'rgba(139,92,246,0.15)' },
          { icon: FileText,     label: 'Unique Pages',     val: analytics?.topPages?.length || 0,color: '#d97706', glow: 'rgba(217,119,6,0.15)'  },
        ].map((k, i) => (
          <div key={i} className="va-kpi-card" style={{ '--glow': k.glow }}>
            <div className="va-kpi-icon" style={{ background: k.glow, border: `1px solid ${k.color}30` }}>
              <k.icon size={18} style={{ color: k.color }} />
            </div>
            <div>
              <p className="va-kpi-lbl">{k.label}</p>
              <p className="va-kpi-val" style={{ color: k.color }}>{k.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="va-tabs">
        {['overview', 'traffic', 'geo', 'visitors'].map(t => (
          <button key={t} className={`va-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <>
          {/* Daily trend */}
          <div className="va-card va-card-full">
            <div className="va-card-header">
              <h3>Daily Visitors — Last 30 Days</h3>
              <Sparkline data={dailyData} valueKey="count" color="#8b5cf6" />
            </div>
            <BarChart data={dailyData} labelKey="label" valueKey="count" color="#8b5cf6" height={110} />
          </div>

          <div className="va-row-3">
            {/* Device breakdown */}
            <div className="va-card">
              <div className="va-card-header"><h3>Device Breakdown</h3></div>
              <div className="va-donut-wrap">
                <Donut segments={deviceSegs} size={110} />
                <div className="va-donut-legend">
                  {deviceSegs.map((d, i) => (
                    <div key={i} className="va-legend-row">
                      <span className="va-legend-dot" style={{ background: d.color }} />
                      <span className="va-legend-lbl">{d.label}</span>
                      <span className="va-legend-pct">{Math.round((d.value / deviceTotal) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* New vs Returning */}
            <div className="va-card">
              <div className="va-card-header"><h3>New vs Returning</h3></div>
              <div className="va-donut-wrap">
                <Donut segments={newRet} size={110} />
                <div className="va-donut-legend">
                  {newRet.map((d, i) => (
                    <div key={i} className="va-legend-row">
                      <span className="va-legend-dot" style={{ background: d.color }} />
                      <span className="va-legend-lbl">{d.label}</span>
                      <span className="va-legend-pct">{Math.round((d.value / nrTotal) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent visitors */}
            <div className="va-card">
              <div className="va-card-header"><h3>Recent Visitors</h3></div>
              <div className="va-recent-list">
                {(analytics?.recentVisitors || []).map((v, i) => (
                  <div key={i} className="va-recent-row">
                    <div className="va-recent-dot" />
                    <div>
                      <p className="va-recent-loc">{v.city || '—'}, {v.country || '—'}</p>
                      <p className="va-recent-meta">{v.ip} · {v.device || '—'} · {fmtDate(v.createdAt)}</p>
                    </div>
                  </div>
                ))}
                {!analytics?.recentVisitors?.length && <p className="va-empty-msg">No recent visitors</p>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── TRAFFIC TAB ── */}
      {activeTab === 'traffic' && (
        <>
          <div className="va-row-2">
            <div className="va-card">
              <div className="va-card-header"><h3>Hourly Activity</h3></div>
              <BarChart data={hourlyFull} labelKey="label" valueKey="count" color="#06b6d4" height={110} />
            </div>
            <div className="va-card">
              <div className="va-card-header"><h3>Top Pages</h3></div>
              <div className="va-hbar-list">
                {analytics?.topPages?.length
                  ? analytics.topPages.map((p, i) => <HBar key={i} label={p._id} value={p.count} max={maxPage} color="#8b5cf6" />)
                  : <p className="va-empty-msg">No page data</p>}
              </div>
            </div>
          </div>

          <div className="va-row-3">
            <div className="va-card">
              <div className="va-card-header"><h3>Traffic Sources</h3></div>
              <div className="va-hbar-list">
                {(analytics?.referrerBreakdown || []).map((r, i) => (
                  <HBar key={i} label={r._id || 'Direct'} value={r.count}
                    max={analytics.referrerBreakdown[0]?.count || 1} color="#f59e0b" />
                ))}
                {!analytics?.referrerBreakdown?.length && <p className="va-empty-msg">No referrer data</p>}
              </div>
            </div>
            <div className="va-card">
              <div className="va-card-header"><h3>Browser Breakdown</h3></div>
              <div className="va-hbar-list">
                {(analytics?.browserBreakdown || []).map((b, i) => (
                  <HBar key={i} label={b._id || 'Other'} value={b.count}
                    max={analytics.browserBreakdown[0]?.count || 1} color="#10b981" />
                ))}
              </div>
            </div>
            <div className="va-card">
              <div className="va-card-header"><h3>OS Breakdown</h3></div>
              <div className="va-hbar-list">
                {(analytics?.osBreakdown || []).map((o, i) => (
                  <HBar key={i} label={o._id || 'Other'} value={o.count}
                    max={analytics.osBreakdown[0]?.count || 1} color="#06b6d4" />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── GEO TAB ── */}
      {activeTab === 'geo' && (
        <>
          <div className="va-card va-card-full va-map-card">
            <div className="va-card-header">
              <h3>Global Visitor Map</h3>
              {selectedCountry && (
                <button className="va-chip-clear" onClick={() => { setSelectedCountry(null); setPage(1); }}>
                  <X size={12} /> {selectedCountry}
                </button>
              )}
            </div>
            {hoveredCountry && <p className="va-map-hover">{hoveredCountry}</p>}
            <div className="va-map-wrap">
              <ComposableMap projection="geoMercator"
                projectionConfig={{ scale: 140, center: [0, 20] }}
                width={800} height={400} style={{ width: '100%', height: '100%' }}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) => geographies.map(geo => {
                    const name = geo.properties?.name;
                    const isSelected = selectedCountry?.toLowerCase() === name?.toLowerCase();
                    const hasVisitors = visitors.some(v => v.country?.toLowerCase() === name?.toLowerCase());
                    return (
                      <Geography key={geo.rsmKey} geography={geo}
                        onClick={() => { setSelectedCountry(name); setPage(1); setActiveTab('visitors'); }}
                        onMouseEnter={() => setHoveredCountry(name)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        style={{
                          default: { fill: isSelected ? '#8b5cf6' : hasVisitors ? '#3b82f6' : '#1e1e2e', stroke: '#0d0d14', strokeWidth: 0.5, outline: 'none', cursor: 'pointer' },
                          hover:   { fill: '#a78bfa', stroke: '#8b5cf6', strokeWidth: 1, outline: 'none' },
                          pressed: { fill: '#8b5cf6', outline: 'none' },
                        }} />
                    );
                  })}
                </Geographies>
                {visitors.map((v, i) => {
                  const lat = parseFloat(v.lat), lon = parseFloat(v.lon);
                  if (!lat || !lon || isNaN(lat) || isNaN(lon)) return null;
                  return (
                    <Marker key={i} coordinates={[lon, lat]}>
                      <circle r={2.5} fill="#f59e0b" stroke="#0a0a0f" strokeWidth={0.5} opacity={0.85} />
                    </Marker>
                  );
                })}
              </ComposableMap>
            </div>
            <div className="va-map-legend">
              <span className="va-legend-dot" style={{ background: '#3b82f6' }} /> Has visitors &nbsp;
              <span className="va-legend-dot" style={{ background: '#8b5cf6' }} /> Selected &nbsp;
              <span className="va-legend-dot" style={{ background: '#f59e0b' }} /> Visitor pin
            </div>
          </div>

          <div className="va-card va-card-full">
            <div className="va-card-header"><h3>Top Countries</h3></div>
            <div className="va-hbar-list va-hbar-grid">
              {stats.slice(0, 20).map((s, i) => (
                <HBar key={i} label={s._id || 'Unknown'} value={s.count} max={maxCountry}
                  color={selectedCountry === s._id ? '#f59e0b' : '#06b6d4'} />
              ))}
              {!stats.length && <p className="va-empty-msg">No country data</p>}
            </div>
          </div>
        </>
      )}

      {/* ── VISITORS TAB ── */}
      {activeTab === 'visitors' && (
        <div className="va-card va-card-full">
          <div className="va-table-header">
            <h3>All Visitors <span className="va-badge">{filtered.length}</span></h3>
            <div className="va-table-controls">
              <div className="va-search">
                <Search size={13} />
                <input placeholder="Search IP, country, device..." value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }} />
                {search && <button onClick={() => { setSearch(''); setPage(1); }}><X size={12} /></button>}
              </div>
              {selectedCountry && (
                <button className="va-chip-clear" onClick={() => { setSelectedCountry(null); setPage(1); }}>
                  <X size={12} /> {selectedCountry}
                </button>
              )}
            </div>
          </div>

          <div className="va-table-wrap">
            <table className="va-table">
              <thead>
                <tr>
                  <th>#</th><th>IP</th><th>Country</th><th>City</th>
                  <th>Device</th><th>Browser</th><th>Pages</th><th>Duration</th><th>Visited</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length ? pageData.map((v, i) => (
                  <tr key={i} onClick={() => { setSelectedCountry(v.country); setPage(1); }} style={{ cursor: 'pointer' }}>
                    <td className="va-muted">{(page - 1) * PER_PAGE + i + 1}</td>
                    <td className="va-ip">{v.ip || '—'}</td>
                    <td>{v.country || '—'}</td>
                    <td>{v.city || '—'}</td>
                    <td>
                      <span className="va-device-chip">
                        {v.device === 'Mobile' ? <Smartphone size={11} /> : v.device === 'Tablet' ? <Tablet size={11} /> : <Monitor size={11} />}
                        {v.device || '—'}
                      </span>
                    </td>
                    <td>{v.browser || '—'}</td>
                    <td className="va-center">{v.pagesVisited?.length || 0}</td>
                    <td className="va-center">{fmtDur(v.duration)}</td>
                    <td className="va-muted">{fmtDate(v.createdAt)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="9" className="va-empty-cell">No visitors found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="va-pagination">
              <span className="va-page-info">Page {page} of {totalPages}</span>
              <button disabled={page === 1} onClick={() => setPage(1)}>«</button>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={13} /></button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>;
              })}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={13} /></button>
              <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
