import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import '../Styles/PagesStyle/Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('https://tb-back-fyvj.onrender.com/api/notifications');
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
        await fetch('https://tb-back-fyvj.onrender.com/api/notifications/mark-read', {
          method: 'PUT',
        });
        window.dispatchEvent(new Event('notificationsRead')); // Clear red dot in navbar
      } catch (err) {
        console.error('Error marking notifications as read:', err);
      }
    };

    markAllAsRead();
  }, []);

  if (loading) {
    return (
      <div className="notifpage-page">
        <Helmet>
          <title>Loading Notifications - TechBorg</title>
          <meta name="description" content="View your notifications from TechBorg E-Learning." />
        </Helmet>
        <div className="notifpage-container">
          <div className="notifpage-loading-wrapper">
            <div className="notifpage-spinner"></div>
            <p className="notifpage-loading-text">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifpage-page">
        <Helmet>
          <title>Error - TechBorg Notifications</title>
          <meta name="description" content="View your notifications from TechBorg E-Learning." />
        </Helmet>
        <div className="notifpage-container">
          <div className="notifpage-error-wrapper">
            <div className="notifpage-error-icon">⚠️</div>
            <h3 className="notifpage-error-title">Oops!</h3>
            <p className="notifpage-error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifpage-page">
      <Helmet>
        <title>Notifications - TechBorg E-Learning</title>
        <meta name="description" content="View and manage your notifications from TechBorg E-Learning platform." />
        <meta name="keywords" content="notifications, updates, alerts, messages" />
      </Helmet>

      <div className="notifpage-container">
        <div className="notifpage-header">
          <h2 className="notifpage-heading">
            Your <span className="notifpage-highlight">Notifications</span>
          </h2>
          <p className="notifpage-subheading">
            {notifications.length > 0 
              ? `You have ${notifications.length} notification${notifications.length > 1 ? 's' : ''}`
              : 'Stay updated with the latest news'}
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="notifpage-empty-wrapper">
            <div className="notifpage-empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </div>
            <h3 className="notifpage-empty-title">All Caught Up! 🎉</h3>
            <p className="notifpage-empty-text">You have no new notifications at the moment.</p>
          </div>
        ) : (
          <div className="notifpage-list">
            {notifications.map((notification, index) => (
              <div 
                key={notification._id} 
                className="notifpage-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="notifpage-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                </div>
                <div className="notifpage-card-content">
                  <h4 className="notifpage-card-title">{notification.title}</h4>
                  <p className="notifpage-card-message">{notification.message}</p>
                  <div className="notifpage-card-footer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span className="notifpage-card-date">
                      {new Date(notification.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="notifpage-card-badge">New</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}