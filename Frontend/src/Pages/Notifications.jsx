import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/notifications');
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
