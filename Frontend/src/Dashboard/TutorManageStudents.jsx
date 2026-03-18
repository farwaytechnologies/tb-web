import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, X, CheckCircle, Clock, XCircle, Award } from 'lucide-react';
import '../Styles/DashbordStyle/TutorManageStudents.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function TutorManageStudents() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored || stored.role !== 'tutor') { navigate('/login'); return; }

    fetch(`${API_URL}/api/enrollments/tutor/${encodeURIComponent(stored.name)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setEnrollments(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this enrollment as completed and issue a certificate?')) return;
    try {
      const res = await fetch(`${API_URL}/api/enrollments/${id}/complete`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setEnrollments(prev => prev.map(e => e._id === id ? { ...e, completed: true, completedAt: data.enrollment.completedAt, certificateId: data.enrollment.certificateId } : e));
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = enrollments.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      e.userId?.name?.toLowerCase().includes(q) ||
      e.userId?.email?.toLowerCase().includes(q) ||
      e.courseId?.title?.toLowerCase().includes(q);
    const matchFilter = filter === 'All' || e.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    All: enrollments.length,
    Pending: enrollments.filter(e => e.status === 'Pending').length,
    Accepted: enrollments.filter(e => e.status === 'Accepted').length,
    Rejected: enrollments.filter(e => e.status === 'Rejected').length,
  };

  return (
    <div className="tms-page">
      <div className="tms-header">
        <Users size={26} className="tms-header-icon" />
        <div>
          <h1 className="tms-title">My Students</h1>
          <p className="tms-sub">Students enrolled in your courses</p>
        </div>
      </div>

      {/* Stats */}
      <div className="tms-stats">
        {[
          { label: 'Total', val: counts.All,      color: '#6366f1' },
          { label: 'Pending',  val: counts.Pending,  color: '#f59e0b' },
          { label: 'Accepted', val: counts.Accepted, color: '#10b981' },
          { label: 'Rejected', val: counts.Rejected, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="tms-stat">
            <span className="tms-stat-val" style={{ color: s.color }}>{s.val}</span>
            <span className="tms-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="tms-controls">
        <div className="tms-search-wrap">
          <Search size={15} className="tms-search-icon" />
          <input className="tms-search" placeholder="Search by name, email or course..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="tms-search-clear" onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
        <div className="tms-filters">
          {['All', 'Pending', 'Accepted', 'Rejected'].map(f => (
            <button key={f} className={`tms-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="tms-empty">Loading students...</div>
      ) : filtered.length === 0 ? (
        <div className="tms-empty">No students found.</div>
      ) : (
        <div className="tms-table-wrap">
          <table className="tms-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Course</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Enrolled</th>
                <th>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e._id}>
                  <td>
                    <div className="tms-student-cell">
                      <img
                        src={e.userId?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(e.fullName || e.userId?.name || 'S')}&size=36&background=6366f1&color=fff`}
                        alt="" className="tms-avatar"
                        onError={ev => { ev.target.src = `https://ui-avatars.com/api/?name=S&size=36&background=6366f1&color=fff`; }}
                      />
                      <span>{e.fullName || e.userId?.name || '—'}</span>
                    </div>
                  </td>
                  <td>{e.email || e.userId?.email || '—'}</td>
                  <td>{e.courseId?.title || '—'}</td>
                  <td>{e.phone || '—'}</td>
                  <td>
                    <span className={`tms-badge tms-badge--${e.status.toLowerCase()}`}>
                      {e.status === 'Accepted' && <CheckCircle size={11} />}
                      {e.status === 'Pending'  && <Clock size={11} />}
                      {e.status === 'Rejected' && <XCircle size={11} />}
                      {e.status}
                    </span>
                  </td>
                  <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                  <td>
                    {e.completed ? (
                      <span className="tms-badge tms-badge--accepted" title={e.certificateId}>
                        <Award size={11} /> Issued
                      </span>
                    ) : e.status === 'Accepted' ? (
                      <button className="tms-complete-btn" onClick={() => handleComplete(e._id)}>
                        <Award size={12} /> Mark Complete
                      </button>
                    ) : (
                      <span className="tms-na">—</span>
                    )}
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
