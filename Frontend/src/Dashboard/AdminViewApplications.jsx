import { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminViewApplications.css';

const API = import.meta.env.VITE_API_URL;

const AdminViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API}/api/applications`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setApplications(data);
    } catch {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      const res = await fetch(`${API}/api/applications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setApplications(prev => prev.filter(a => a._id !== id));
      showToast('Application deleted');
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const filtered = applications.filter(a =>
    !search.trim() ||
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.course?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ava-page">
      {toast && <div className={`ava-toast ava-toast-${toast.type}`}>{toast.msg}</div>}

      <div className="ava-header">
        <div>
          <h2>Job Applications</h2>
          <p>{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="ava-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text" placeholder="Search applicants..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="ava-state"><div className="ava-spinner" /></div>
      ) : error ? (
        <div className="ava-state ava-error"><span>⚠️</span><p>{error}</p></div>
      ) : filtered.length === 0 ? (
        <div className="ava-state"><span>📭</span><p>No applications found.</p></div>
      ) : (
        <div className="ava-grid">
          {filtered.map(app => (
            <div key={app._id} className="ava-card">
              <div className="ava-card-top">
                <div className="ava-avatar">{app.name?.[0]?.toUpperCase() || '?'}</div>
                <button className="ava-delete-btn" onClick={() => handleDelete(app._id)} title="Delete">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
              <h3 className="ava-name">{app.name}</h3>
              <p className="ava-email">{app.email}</p>
              <div className="ava-details">
                <div className="ava-detail-item">
                  <span className="ava-detail-label">Course</span>
                  <span className="ava-detail-value">{app.course || '—'}</span>
                </div>
                <div className="ava-detail-item">
                  <span className="ava-detail-label">Experience</span>
                  <span className="ava-detail-value">{app.experience ? `${app.experience} yrs` : '—'}</span>
                </div>
              </div>
              {app.resumeUrl && (
                <a
                  href={`${API}${app.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ava-resume-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                    <polyline points="13 2 13 9 20 9"/>
                  </svg>
                  View Resume
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminViewApplications;
