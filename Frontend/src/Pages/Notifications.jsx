import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('VITE_API_URL/api/notifications');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch notifications.');
        }

        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notifications as read on page load
  useEffect(() => {
    const markAllAsRead = async () => {
      try {
        await fetch('VITE_API_URL/api/notifications/mark-read', {
          method: 'PUT',
        });
        window.dispatchEvent(new Event('notificationsRead')); // Clear red dot in navbar
      } catch (err) {
        console.error('Error marking notifications as read:', err);
      }
    };

    markAllAsRead();
  }, []);

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <h2 className="notifications-heading">Notifications</h2>

        {loading ? (
          <p className="notifications-empty">Loading...</p>
        ) : error ? (
          <p className="notifications-empty">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="notifications-empty">You have no new notifications.</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification._id} className="notifications-card">
                <h4 className="notifications-card-title">{notification.title}</h4>
                <p className="notifications-card-message">{notification.message}</p>
                <span className="notifications-card-date">
                  {new Date(notification.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
