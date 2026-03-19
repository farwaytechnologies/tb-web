import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageNotifications.css';

const API = import.meta.env.VITE_API_URL;

export default function AdminManageNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [readersModal, setReadersModal] = useState(null); // notification object
  const [form, setForm] = useState({ title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API}/api/notifications/stats`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNotifications(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      return showToast('Title and message are required.', 'error');
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('Notification sent successfully.');
      setForm({ title: '', message: '' });
      setShowModal(false);
      fetchNotifications();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      const res = await fetch(`${API}/api/notifications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNotifications(prev => prev.filter(n => n._id !== id));
      showToast('Notification deleted.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const totalReads = notifications.reduce((sum, n) => sum + (n.readBy?.length || 0), 0);

  return (
    <div className="anm-page">
      {toast && <div className={`anm-toast anm-toast--${toast.type}`}>{toast.msg}</div>}

      <div className="anm-header">
        <div>
          <h2 className="anm-title">Manage Notifications</h2>
          <p className="anm-sub">{notifications.length} notification{notifications.length !== 1 ? 's' : ''} · {totalReads} total reads</p>
        </div>
        <button className="anm-add-btn" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Notification
        </button>
      </div>

      {loading ? (
        <div className="anm-state"><div className="anm-spinner" /></div>
      ) : notifications.length === 0 ? (
        <div className="anm-state">
          <span className="anm-state-icon">🔔</span>
          <p>No notifications yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="anm-grid">
          {notifications.map((n, i) => {
            const readCount = n.readBy?.length || 0;
            return (
              <div key={n._id} className="anm-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="anm-card-top">
                  <div className="anm-card-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <span className="anm-card-date">
                    {new Date(n.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <h4 className="anm-card-title">{n.title}</h4>
                <p className="anm-card-message">{n.message}</p>

                <div className="anm-read-bar">
                  <button
                    className="anm-read-count"
                    onClick={() => readCount > 0 && setReadersModal(n)}
                    title={readCount > 0 ? 'Click to see who read this' : 'No reads yet'}
                    style={{ cursor: readCount > 0 ? 'pointer' : 'default' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {readCount} {readCount === 1 ? 'user' : 'users'} read
                  </button>
                  <button className="anm-delete-btn" onClick={() => handleDelete(n._id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="anm-overlay" onClick={() => setShowModal(false)}>
          <div className="anm-modal" onClick={e => e.stopPropagation()}>
            <div className="anm-modal-header">
              <h3>New Notification</h3>
              <button className="anm-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="anm-form">
              <div className="anm-field">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Notification title"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="anm-field">
                <label>Message</label>
                <textarea
                  rows={4}
                  placeholder="Write your notification message..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <div className="anm-form-actions">
                <button type="button" className="anm-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="anm-submit-btn" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Readers Modal */}
      {readersModal && (
        <div className="anm-overlay" onClick={() => setReadersModal(null)}>
          <div className="anm-modal anm-modal--readers" onClick={e => e.stopPropagation()}>
            <div className="anm-modal-header">
              <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                Read by {readersModal.readBy.length} {readersModal.readBy.length === 1 ? 'user' : 'users'}
              </h3>
              <button className="anm-modal-close" onClick={() => setReadersModal(null)}>✕</button>
            </div>
            <p className="anm-readers-notif-title">"{readersModal.title}"</p>
            <div className="anm-readers-list">
              {readersModal.readBy.map((u) => (
                <div key={u._id} className="anm-reader-row">
                  <div className="anm-reader-avatar">
                    {(u.name || '?')[0].toUpperCase()}
                  </div>
                  <div className="anm-reader-info">
                    <span className="anm-reader-name">{u.name}</span>
                    <span className="anm-reader-email">{u.email}</span>
                  </div>
                  <span className={`anm-reader-role anm-reader-role--${u.role}`}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
