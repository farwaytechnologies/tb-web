import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        title: 'New Course Released',
        message: 'React Advanced course is now live. Enroll today!',
        date: '2025-07-05',
      },
      {
        id: 2,
        title: 'Assignment Deadline',
        message: 'Submit your assignment before 10th July.',
        date: '2025-07-04',
      },
      {
        id: 3,
        title: 'Exam Notification',
        message: 'Your JavaScript exam is scheduled on 15th July.',
        date: '2025-07-03',
      },
    ];
    setNotifications(mockData);
  }, []);

  return (
    <div className="notifications-page-bg">
      <div className="notifications-wrapper">
        <h2 className="notifications-title">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="no-notifications">You have no new notifications.</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-card">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-date">{notification.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
