import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import {
  Users, Globe, Clock, TrendingUp, Activity, MapPin,
  FileText, RefreshCw, ChevronLeft, ChevronRight, Search, X
} from 'lucide-react';
import '../Styles/DashbordStyle/AdminVisitorAnalytics.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const fmtDur = (s) => {
  if (!s) return '0s';
  if (s < 60) return `${Math.round(s)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
};
const fmtDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

// Mini bar chart using SVG
function BarChart({ data, labelKey, valueKey, color = '#6366f1', height = 120 }) {
  if (!data?.length) return <p className="va2-no-data">No data</p>;
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="va2-bar-chart">
      {data.map((d, i) => (
        <div key={i} className="va2-bar-col">
          <div className="va2-bar-wrap" style={{ height }}>
            <div className="va2-bar-fill" title={`${d[labelKey]}: ${d[valueKey]}`}
              style={{ height: `${max ? (d[valueKey] / max) * 100 : 0}%`, background: color }} />
          </div>
          <span className="va2-bar-label">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

// Sparkline using SVG
function Sparkline({ data, valueKey, color = '#6366f1' }) {
  if (!data?.length) return null;
  const vals = data.map(d => d[valueKey]);
  const max = Math.max(...vals) || 1;
  const w = 200, h = 50;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="va2-sparkline" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// Horizontal bar for top pages
function HBar({ label, value, max, color = '#6366f1' }) {
  return (
    <div className="va2-hbar-row">
      <span className="va2-hbar-label" title={label}>{label}</span>
      <div className="va2-hbar-track">
        <div className="va2-hbar-fill" style={{ width: `${max ? (value / max) * 100 : 0}%`, background: color }} />
      </div>
      <span className="va2-hbar-val">{value}</span>
    </div>
  );
}

export default function VisitorAnalytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(15);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    loadAll();
  }, [navigate]);

  const loadAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const [aRes, vRes, sRes] = await Promise.all([
        fetch(`${API_URL}/api/visitors/analytics`),
        fetch(`${API_URL}/api/visitors`),
        fetch(`${API_URL}/api/visitors/stats`),
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
    const matchQ = !q || [v.ip, v.country, v.city, v.region].some(f => f?.toLowerCase().includes(q));
    const matchC = !selectedCountry || v.country?.toLowerCase() === selectedCountry.toLowerCase();
    return matchQ && matchC;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  // Build hourly data (0–23)
  const hourlyFull = Array.from({ length: 24 }, (_, h) => {
    const found = analytics?.hourly?.find(x => x._id === h);
    return { label: `${h}h`, count: found?.count || 0 };
  });

  // Daily trend labels
  const dailyData = (analytics?.dailyTrend || []).map(d => ({
    label: d._id?.slice(5), // MM-DD
    count: d.count,
  }));

  if (loading) return (
    <div className="va2-loading">
      <div className="va2-spinner" />
      <p>Loading analytics...</p>
    </div>
  );

  const totalV = analytics?.totalVisitors || visitors.length;
  const uniqueC = analytics?.uniqueCountries || stats.length;
  const avgDur = analytics?.avgDuration?.avg || 0;
  const totalPages2 = analytics?.topPages?.length || 0;
  const maxPage = analytics?.topPages?.[0]?.count || 1;
  const maxCountry = stats[0]?.count || 1;

  return (
    <div className="va2-page">
      {/* Header */}
      <div className="va2-header">
        <div className="va2-header-left">
          <Activity size={28} className="va2-header-icon" />
          <div>
            <h1>Visitor Analytics</h1>
            <p>Real-time insights into your platform traffic</p>
          </div>
        </div>
        <button className="va2-refresh-btn" onClick={() => loadAll(true)} disabled={refreshing}>
          <RefreshCw size={15} className={refreshing ? 'va2-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="va2-kpi-grid">
        {[
          { icon: Users,     label: 'Total Visitors',    val: totalV,          color: '#6366f1', bg: '#eef2ff' },
          { icon: Globe,     label: 'Unique Countries',  val: uniqueC,         color: '#0891b2', bg: '#ecfeff' },
          { icon: Clock,     label: 'Avg Session',       val: fmtDur(avgDur),  color: '#059669', bg: '#ecfdf5' },
          { icon: FileText,  label: 'Unique Pages',      val: totalPages2,     color: '#d97706', bg: '#fffbeb' },
          { icon: TrendingUp,label: 'Today',             val: dailyData[dailyData.length - 1]?.count || 0, color: '#7c3aed', bg: '#f5f3ff' },
          { icon: MapPin,    label: 'Top Country',       val: stats[0]?._id || '—', color: '#dc2626', bg: '#fef2f2' },
        ].map((k, i) => (
          <div key={i} className="va2-kpi-card">
            <div className="va2-kpi-icon" style={{ background: k.bg, color: k.color }}>
              <k.icon size={20} />
            </div>
            <div>
              <p className="va2-kpi-label">{k.label}</p>
              <p className="va2-kpi-val">{k.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="va2-charts-row">
        {/* Daily trend */}
        <div className="va2-chart-card va2-chart-wide">
          <div className="va2-chart-header">
            <h3>Daily Visitors (Last 14 Days)</h3>
            <Sparkline data={dailyData} valueKey="count" />
          </div>
          <BarChart data={dailyData} labelKey="label" valueKey="count" color="#6366f1" height={100} />
        </div>

        {/* Hourly */}
        <div className="va2-chart-card">
          <div className="va2-chart-header"><h3>Hourly Activity</h3></div>
          <BarChart data={hourlyFull} labelKey="label" valueKey="count" color="#0891b2" height={100} />
        </div>
      </div>

      {/* Top pages + Top countries */}
      <div className="va2-mid-row">
        <div className="va2-panel">
          <h3 className="va2-panel-title"><FileText size={15} /> Top Pages</h3>
          {analytics?.topPages?.length ? analytics.topPages.map((p, i) => (
            <HBar key={i} label={p._id} value={p.count} max={maxPage} color="#6366f1" />
          )) : <p className="va2-no-data">No page data yet</p>}
        </div>

        <div className="va2-panel">
          <h3 className="va2-panel-title"><Globe size={15} /> Top Countries</h3>
          {stats.slice(0, 10).map((s, i) => (
            <HBar key={i} label={s._id || 'Unknown'} value={s.count} max={maxCountry}
              color={selectedCountry === s._id ? '#dc2626' : '#0891b2'} />
          ))}
        </div>

        {/* Recent visitors */}
        <div className="va2-panel">
          <h3 className="va2-panel-title"><Users size={15} /> Recent Visitors</h3>
          {(analytics?.recentVisitors || []).map((v, i) => (
            <div key={i} className="va2-recent-row">
              <div className="va2-recent-dot" />
              <div>
                <p className="va2-recent-loc">{v.city || '—'}, {v.country || '—'}</p>
                <p className="va2-recent-meta">{v.ip} · {fmtDate(v.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* World Map */}
      <div className="va2-map-card">
        <div className="va2-chart-header">
          <h3>Global Visitor Map</h3>
          {selectedCountry && (
            <button className="va2-clear-btn" onClick={() => { setSelectedCountry(null); setPage(1); }}>
              <X size={13} /> {selectedCountry}
            </button>
          )}
        </div>
        {hoveredCountry && <p className="va2-map-hover">{hoveredCountry}</p>}
        <div className="va2-map-wrap">
          <ComposableMap projection="geoMercator"
            projectionConfig={{ scale: 140, center: [0, 20] }}
            width={800} height={420} style={{ width: '100%', height: '100%' }}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) => geographies.map(geo => {
                const name = geo.properties?.name;
                const isSelected = selectedCountry?.toLowerCase() === name?.toLowerCase();
                const hasVisitors = visitors.some(v => v.country?.toLowerCase() === name?.toLowerCase());
                return (
                  <Geography key={geo.rsmKey} geography={geo}
                    onClick={() => { setSelectedCountry(name); setPage(1); }}
                    onMouseEnter={() => setHoveredCountry(name)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{
                      default: { fill: isSelected ? '#6366f1' : hasVisitors ? '#3b82f6' : '#1e293b', stroke: '#334155', strokeWidth: 0.5, outline: 'none', cursor: 'pointer' },
                      hover:   { fill: '#818cf8', stroke: '#6366f1', strokeWidth: 1, outline: 'none', cursor: 'pointer' },
                      pressed: { fill: '#6366f1', outline: 'none' },
                    }} />
                );
              })}
            </Geographies>
            {visitors.map((v, i) => {
              const lat = parseFloat(v.lat), lon = parseFloat(v.lon);
              if (!lat || !lon || isNaN(lat) || isNaN(lon)) return null;
              return (
                <Marker key={i} coordinates={[lon, lat]}>
                  <circle r={2.5} fill="#f59e0b" stroke="#fff" strokeWidth={0.5} opacity={0.8} />
                </Marker>
              );
            })}
          </ComposableMap>
        </div>
        <p className="va2-map-legend">
          <span className="va2-legend-dot" style={{ background: '#3b82f6' }} /> Has visitors &nbsp;
          <span className="va2-legend-dot" style={{ background: '#6366f1' }} /> Selected &nbsp;
          <span className="va2-legend-dot" style={{ background: '#f59e0b' }} /> Visitor pin
        </p>
      </div>

      {/* Visitors Table */}
      <div className="va2-table-card">
        <div className="va2-table-header">
          <h3>All Visitors <span className="va2-count-badge">{filtered.length}</span></h3>
          <div className="va2-table-controls">
            <div className="va2-search-wrap">
              <Search size={14} />
              <input placeholder="Search IP, country, city..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }} />
              {search && <button onClick={() => { setSearch(''); setPage(1); }}><X size={13} /></button>}
            </div>
            {selectedCountry && (
              <button className="va2-clear-btn" onClick={() => { setSelectedCountry(null); setPage(1); }}>
                <X size={13} /> {selectedCountry}
              </button>
            )}
          </div>
        </div>

        <div className="va2-table-wrap">
          <table className="va2-table">
            <thead>
              <tr>
                <th>#</th><th>IP</th><th>Country</th><th>Region</th>
                <th>City</th><th>Pages</th><th>Duration</th><th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length ? pageData.map((v, i) => (
                <tr key={i} onClick={() => { setSelectedCountry(v.country); setPage(1); }} style={{ cursor: 'pointer' }}>
                  <td>{(page - 1) * perPage + i + 1}</td>
                  <td className="va2-ip">{v.ip || '—'}</td>
                  <td>{v.country || '—'}</td>
                  <td>{v.region || '—'}</td>
                  <td>{v.city || '—'}</td>
                  <td className="va2-center">{v.pagesVisited?.length || 0}</td>
                  <td className="va2-center">{fmtDur(v.duration)}</td>
                  <td>{fmtDate(v.createdAt)}</td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="va2-empty">No visitors found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="va2-pagination">
            <span className="va2-page-info">Page {page} of {totalPages}</span>
            <button disabled={page === 1} onClick={() => setPage(1)}>«</button>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>;
            })}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></button>
            <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
          </div>
        )}
      </div>
    </div>
  );
}
