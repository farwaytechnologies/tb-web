import { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageInvoices.css';

const API = import.meta.env.VITE_API_URL;

const STATUS_COLORS = {
  Paid: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' },
  Free: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.25)' },
  Pending: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
};

const AdminManageInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/invoices`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setInvoices(data); setFiltered(data); })
      .catch(() => setError('Failed to load invoices.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = invoices;
    if (statusFilter !== 'All') result = result.filter(i => i.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.invoiceNumber?.toLowerCase().includes(q) ||
        i.studentName?.toLowerCase().includes(q) ||
        i.studentEmail?.toLowerCase().includes(q) ||
        i.courseTitle?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, invoices]);

  const totalRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="ami-page">
      {/* Header */}
      <div className="ami-header">
        <div>
          <h2>Manage Invoices</h2>
          <p>{invoices.length} total invoice{invoices.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="ami-kpis">
        <div className="ami-kpi">
          <div className="ami-kpi-icon ami-kpi-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div>
            <p className="ami-kpi-val">{invoices.length}</p>
            <p className="ami-kpi-label">Total Invoices</p>
          </div>
        </div>
        <div className="ami-kpi">
          <div className="ami-kpi-icon ami-kpi-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <p className="ami-kpi-val">{fmt(totalRevenue)}</p>
            <p className="ami-kpi-label">Total Revenue</p>
          </div>
        </div>
        <div className="ami-kpi">
          <div className="ami-kpi-icon ami-kpi-emerald">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <p className="ami-kpi-val">{invoices.filter(i => i.status === 'Paid').length}</p>
            <p className="ami-kpi-label">Paid</p>
          </div>
        </div>
        <div className="ami-kpi">
          <div className="ami-kpi-icon ami-kpi-yellow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <p className="ami-kpi-val">{invoices.filter(i => i.status === 'Pending').length}</p>
            <p className="ami-kpi-label">Pending</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="ami-filters">
        <div className="ami-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text" placeholder="Search by name, email, course, invoice #..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="ami-tabs">
          {['All', 'Paid', 'Free', 'Pending'].map(s => (
            <button
              key={s}
              className={`ami-tab${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="ami-state"><div className="ami-spinner" /></div>
      ) : error ? (
        <div className="ami-state ami-error"><span>⚠️</span><p>{error}</p></div>
      ) : filtered.length === 0 ? (
        <div className="ami-state"><span>🧾</span><p>No invoices found.</p></div>
      ) : (
        <div className="ami-table-wrap">
          <table className="ami-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const sc = STATUS_COLORS[inv.status] || STATUS_COLORS.Pending;
                return (
                  <tr key={inv._id}>
                    <td className="ami-inv-num">{inv.invoiceNumber}</td>
                    <td>
                      <div className="ami-student">
                        <div className="ami-avatar">{inv.studentName?.[0]?.toUpperCase() || '?'}</div>
                        <div>
                          <p className="ami-student-name">{inv.studentName}</p>
                          <p className="ami-student-email">{inv.studentEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="ami-course">{inv.courseTitle}</td>
                    <td className="ami-amount">{inv.amount > 0 ? fmt(inv.amount) : 'Free'}</td>
                    <td>
                      <span className="ami-status-badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="ami-date">{fmtDate(inv.issuedAt)}</td>
                    <td>
                      <button className="ami-view-btn" onClick={() => setSelected(inv)}>View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="ami-overlay" onClick={() => setSelected(null)}>
          <div className="ami-modal" onClick={e => e.stopPropagation()}>
            <div className="ami-modal-header">
              <div>
                <h3>{selected.invoiceNumber}</h3>
                <span
                  className="ami-status-badge"
                  style={{
                    background: STATUS_COLORS[selected.status]?.bg,
                    color: STATUS_COLORS[selected.status]?.color,
                    border: `1px solid ${STATUS_COLORS[selected.status]?.border}`
                  }}
                >{selected.status}</span>
              </div>
              <button className="ami-modal-close" onClick={() => setSelected(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="ami-modal-body">
              <div className="ami-modal-section">
                <p className="ami-modal-section-title">Student Details</p>
                <div className="ami-modal-row"><span>Name</span><span>{selected.studentName}</span></div>
                <div className="ami-modal-row"><span>Email</span><span>{selected.studentEmail}</span></div>
                {selected.studentPhone && <div className="ami-modal-row"><span>Phone</span><span>{selected.studentPhone}</span></div>}
              </div>
              <div className="ami-modal-section">
                <p className="ami-modal-section-title">Course Details</p>
                <div className="ami-modal-row"><span>Course</span><span>{selected.courseTitle}</span></div>
                {selected.courseInstructor && <div className="ami-modal-row"><span>Instructor</span><span>{selected.courseInstructor}</span></div>}
                {selected.courseLevel && <div className="ami-modal-row"><span>Level</span><span>{selected.courseLevel}</span></div>}
              </div>
              <div className="ami-modal-section">
                <p className="ami-modal-section-title">Payment Details</p>
                <div className="ami-modal-row"><span>Amount</span><span className="ami-modal-amount">{selected.amount > 0 ? fmt(selected.amount) : 'Free'}</span></div>
                {selected.paymentRef && <div className="ami-modal-row"><span>Payment Ref</span><span>{selected.paymentRef}</span></div>}
                <div className="ami-modal-row"><span>Issued On</span><span>{fmtDate(selected.issuedAt)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageInvoices;
