import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageNotifications.css';

export default function AdminManageNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('https://tb-back-fyvj.onrender.com/api/notifications');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Submit new notification
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message || !formData.date) {
      return alert('All fields are required');
    }

    try {
      const res = await fetch('https://tb-back-fyvj.onrender.com/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send notification');

      setFormData({ title: '', message: '', date: '' });
      fetchNotifications();
    } catch (err) {
      alert('Error sending notification: ' + err.message);
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this notification?');
    if (!confirm) return;

    try {
      const res = await fetch(`https://tb-back-fyvj.onrender.com/api/notifications/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete');

      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  return (
    <div className="admin-notifications-page">
      <div className="admin-notifications-container">
        <h2 className="admin-notifications-title">Manage Notifications</h2>

        {/* Notification Form */}
        <form onSubmit={handleSubmit} className="admin-notifications-form">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            placeholder="Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <button type="submit">Send Notification</button>
        </form>

        {/* Notifications List */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          <div className="admin-notifications-list">
            {notifications.map((n) => (
              <div key={n._id} className="admin-notification-card">
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <span>{new Date(n.date).toLocaleDateString()}</span>
                <button className="delete-btn" onClick={() => handleDelete(n._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
