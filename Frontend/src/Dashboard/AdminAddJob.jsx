import { useState, useEffect } from 'react';
import '../Styles/DashbordStyle/AdminAddJob.css';

const API = import.meta.env.VITE_API_URL;

const empty = { title: '', description: '', location: '', level: '' };

const AdminAddJob = () => {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API}/api/jobs`);
      const data = await res.json();
      setJobs(data);
    } catch { showToast('Failed to load jobs', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      showToast('Job posted successfully');
      setFormData(empty);
      setShowModal(false);
      fetchJobs();
    } catch { showToast('Failed to post job', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      const res = await fetch(`${API}/api/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Job deleted');
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch { showToast('Failed to delete', 'error'); }
  };

  return (
    <div className="aj-page">
      {toast && <div className={`aj-toast aj-toast-${toast.type}`}>{toast.msg}</div>}

      <div className="aj-header">
        <div>
          <h2>Job Listings</h2>
          <p>{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <button className="aj-btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Post Job
        </button>
      </div>

      {loading ? (
        <div className="aj-state"><div className="aj-spinner" /></div>
      ) : jobs.length === 0 ? (
        <div className="aj-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <p>No jobs posted yet</p>
        </div>
      ) : (
        <div className="aj-grid">
          {jobs.map(job => (
            <div key={job._id} className="aj-card">
              <div className="aj-card-top">
                <div className="aj-card-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </div>
                <button className="aj-delete-btn" onClick={() => handleDelete(job._id)} title="Delete">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
              <h3 className="aj-card-title">{job.title}</h3>
              <p className="aj-card-desc">{job.description}</p>
              <div className="aj-card-meta">
                {job.location && (
                  <span className="aj-meta">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {job.location}
                  </span>
                )}
                {job.level && <span className="aj-level-badge">{job.level}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="aj-overlay" onClick={() => setShowModal(false)}>
          <div className="aj-modal" onClick={e => e.stopPropagation()}>
            <div className="aj-modal-header">
              <h3>Post New Job</h3>
              <button className="aj-modal-close" onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="aj-form">
              <div className="aj-field">
                <label>Job Title</label>
                <input
                  type="text" placeholder="e.g. React Developer"
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>
              <div className="aj-field">
                <label>Description</label>
                <textarea
                  rows="4" placeholder="Brief about the role..."
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  required
                />
              </div>
              <div className="aj-row">
                <div className="aj-field">
                  <label>Location</label>
                  <input
                    type="text" placeholder="e.g. Remote, Bangalore"
                    value={formData.location}
                    onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                  />
                </div>
                <div className="aj-field">
                  <label>Level</label>
                  <select
                    value={formData.level}
                    onChange={e => setFormData(p => ({ ...p, level: e.target.value }))}
                  >
                    <option value="">Select level</option>
                    <option>Beginner</option>
                    <option>Mid</option>
                    <option>Senior</option>
                  </select>
                </div>
              </div>
              <div className="aj-modal-actions">
                <button type="button" className="aj-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="aj-btn-primary" disabled={saving}>
                  {saving ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddJob;
