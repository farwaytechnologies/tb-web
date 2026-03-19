import React, { useEffect, useState } from 'react';
import SEO from '../Components/SEO';
import '../Styles/PagesStyle/Notifications.css';

const API = import.meta.env.VITE_API_URL;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id || user.id || null;

  const isReadByMe = (n) => userId && n.readBy && n.readBy.includes(userId);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API}/api/notifications`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch notifications.');
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    if (!userId) return;
    try {
      await fetch(`${API}/api/notifications/mark-read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      setNotifications(prev => prev.map(n => ({
        ...n,
        readBy: n.readBy.includes(userId) ? n.readBy : [...n.readBy, userId]
      })));
      window.dispatchEvent(new Event('notificationsRead'));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const markOneRead = async (id) => {
    if (!userId) return;
    try {
      await fetch(`${API}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      setNotifications(prev => prev.map(n =>
        n._id === id
          ? { ...n, readBy: n.readBy.includes(userId) ? n.readBy : [...n.readBy, userId] }
          : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const unreadCount = notifications.filter(n => !isReadByMe(n)).length;

  return (
    <div className="notif-page">
      <SEO
        title="Notifications - TechBorg E-Learning"
        description="View and manage your notifications from TechBorg E-Learning platform."
      />

      <div className="notif-hero">
        <div className="notif-hero-glow" />
        <div className="notif-hero-content">
          <h1 className="notif-hero-title">Notifications</h1>
          <p className="notif-hero-sub">Stay updated with the latest alerts and announcements</p>
        </div>
      </div>

      <div className="notif-container">
        {loading ? (
          <div className="notif-state">
            <div className="notif-spinner" />
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="notif-state notif-error">
            <span className="notif-state-icon">⚠️</span>
            <p>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notif-state">
            <span className="notif-state-icon">🔔</span>
            <h3>All caught up!</h3>
            <p>No notifications at the moment.</p>
          </div>
        ) : (
          <>
            <div className="notif-toolbar">
              <span className="notif-count">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
              </span>
              {unreadCount > 0 && (
                <button className="notif-mark-all-btn" onClick={markAllRead}>
                  Mark all as read
                </button>
              )}
            </div>

            <div className="notif-list">
              {notifications.map((n, i) => {
                const read = isReadByMe(n);
                return (
                  <div
                    key={n._id}
                    className={`notif-card ${read ? 'notif-card--read' : 'notif-card--unread'}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onClick={() => !read && markOneRead(n._id)}
                  >
                    <div className="notif-card-dot" />
                    <div className="notif-card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                    </div>
                    <div className="notif-card-body">
                      <h4 className="notif-card-title">{n.title}</h4>
                      <p className="notif-card-message">{n.message}</p>
                      <span className="notif-card-date">
                        {new Date(n.date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                    {!read && <span className="notif-badge">New</span>}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
