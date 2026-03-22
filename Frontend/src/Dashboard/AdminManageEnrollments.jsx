import { useEffect, useState } from 'react';
import { Users, Search, X, Download, CheckCircle, XCircle, Clock, Trash2, Award, Copy, Check } from 'lucide-react';
import '../Styles/DashbordStyle/AdminManageEnrollments.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminManageEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/enrollments`);
      const data = await res.json();
      if (Array.isArray(data)) setEnrollments(data);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEnrollments(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/api/enrollments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchEnrollments();
    } catch (err) { console.error(err); }
  };

  const deleteEnrollment = async (id) => {
    if (!window.confirm('Delete this enrollment?')) return;
    try {
      await fetch(`${API_URL}/api/enrollments/${id}`, { method: 'DELETE' });
      setEnrollments(e => e.filter(x => x._id !== id));
    } catch (err) { console.error(err); }
  };

  const markComplete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/enrollments/${id}/complete`, { method: 'PATCH' });
      if (res.ok) fetchEnrollments();
    } catch (err) { console.error(err); }
  };

  const copyId = (certId) => {
    navigator.clipboard.writeText(certId).then(() => {
      setCopiedId(certId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const downloadCSV = () => {
    if (!enrollments.length) return;
    const header = ['Full Name', 'Email', 'Phone', 'Course', 'Status', 'Message', 'Enrolled At'];
    const rows = enrollments.map(e => [
      `"${e.fullName}"`, `"${e.email}"`, `"${e.phone}"`,
      `"${e.courseId?.title || ''}"`, `"${e.status}"`,
      `"${e.message || ''}"`, `"${new Date(e.enrolledAt).toLocaleString()}"`
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [header, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = encodeURI(csv); a.download = 'enrollments.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const filtered = enrollments.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.fullName?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) || e.courseId?.title?.toLowerCase().includes(q);
    const matchFilter = filter === 'All' || 
      (filter === 'Completed' ? e.completed : e.status === filter);
    return matchSearch && matchFilter;
  });

  const counts = {
    All: enrollments.length,
    Pending: enrollments.filter(e => e.status === 'Pending').length,
    Accepted: enrollments.filter(e => e.status === 'Accepted').length,
    Rejected: enrollments.filter(e => e.status === 'Rejected').length,
    Completed: enrollments.filter(e => e.completed).length,
  };

  return (
    <div className="ame-page">
      <div className="ame-header">
        <div className="ame-header-left">
          <Users size={26} className="ame-header-icon" />
          <div>
            <h1 className="ame-title">Manage Enrollments</h1>
            <p className="ame-sub">Review and manage student enrollment requests</p>
          </div>
        </div>
        <button className="ame-csv-btn" onClick={downloadCSV}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="ame-stats">
        {[
          { label: 'Total',     val: counts.All,       color: '#6366f1' },
          { label: 'Pending',   val: counts.Pending,   color: '#f59e0b' },
          { label: 'Accepted',  val: counts.Accepted,  color: '#10b981' },
          { label: 'Rejected',  val: counts.Rejected,  color: '#ef4444' },
          { label: 'Completed', val: counts.Completed, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="ame-stat">
            <span className="ame-stat-val" style={{ color: s.color }}>{s.val}</span>
            <span className="ame-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="ame-controls">
        <div className="ame-search-wrap">
          <Search size={15} className="ame-search-icon" />
          <input className="ame-search" placeholder="Search by name, email or course..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="ame-search-clear" onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
        <div className="ame-filters">
          {['All', 'Pending', 'Accepted', 'Rejected', 'Completed'].map(f => (
            <button key={f} className={`ame-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>{f} ({counts[f]})</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="ame-empty">Loading enrollments...</div>
      ) : filtered.length === 0 ? (
        <div className="ame-empty">No enrollments found.</div>
      ) : (
        <div className="ame-table-wrap">
          <table className="ame-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Certificate ID</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e._id}>
                  <td>
                    <div className="ame-student-cell">
                      <div>
                        <p className="ame-student-name">{e.fullName}</p>
                        <p className="ame-student-email">{e.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{e.courseId?.title || '—'}</td>
                  <td>{e.phone}</td>
                  <td>
                    <span className={`ame-badge ame-badge--${e.status.toLowerCase()}`}>
                      {e.status === 'Accepted' && <CheckCircle size={11} />}
                      {e.status === 'Pending'  && <Clock size={11} />}
                      {e.status === 'Rejected' && <XCircle size={11} />}
                      {e.status}
                    </span>
                    {e.completed && (
                      <span className="ame-badge ame-badge--completed" style={{ marginLeft: 4 }}>
                        <Award size={11} /> Done
                      </span>
                    )}
                  </td>
                  <td>
                    {e.certificateId ? (
                      <div className="ame-cert-id-cell">
                        <span className="ame-cert-id">{e.certificateId}</span>
                        <button
                          className="ame-copy-btn"
                          title="Copy Certificate ID"
                          onClick={() => copyId(e.certificateId)}
                        >
                          {copiedId === e.certificateId ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    ) : '—'}
                  </td>
                  <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                  <td>
                    <div className="ame-actions">
                      {e.status === 'Pending' && (
                        <>
                          <button className="ame-btn ame-btn--accept" onClick={() => updateStatus(e._id, 'Accepted')}>
                            <CheckCircle size={13} /> Accept
                          </button>
                          <button className="ame-btn ame-btn--reject" onClick={() => updateStatus(e._id, 'Rejected')}>
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}
                      {e.status === 'Accepted' && !e.completed && (
                        <button className="ame-btn ame-btn--complete" onClick={() => markComplete(e._id)}>
                          <Award size={13} /> Complete
                        </button>
                      )}
                      <button className="ame-btn ame-btn--delete" onClick={() => deleteEnrollment(e._id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
