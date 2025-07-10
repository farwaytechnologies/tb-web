import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminViewContact.css';

function AdminViewContact() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/contact', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch');
        }

        if (!Array.isArray(data)) {
          throw new Error('Invalid response from server');
        }

        setMessages(data);
      } catch (err) {
        console.error('❌ Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  return (
    <div className="admin-view-contact-container">
      <h2 className="admin-view-contact-title">Contact Messages</h2>

      {loading ? (
        <p className="admin-view-contact-loading">Loading...</p>
      ) : error ? (
        <p className="admin-view-contact-error">{error}</p>
      ) : messages.length === 0 ? (
        <p className="admin-view-contact-empty">No contact messages found.</p>
      ) : (
        <table className="admin-view-contact-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, index) => (
              <tr key={msg._id}>
                <td>{index + 1}</td>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.phone || 'N/A'}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminViewContact;
