import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminViewContact.css';

function AdminViewContact() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/contact');
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch messages.');
      if (!Array.isArray(data)) throw new Error('Invalid response from server.');

      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this message?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/api/contact/${id}`, {
        method: 'DELETE',
      });

      const contentType = res.headers.get('content-type');

      let responseMessage = '';
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        responseMessage = json.message;
      } else {
        responseMessage = await res.text();
      }

      if (!res.ok) throw new Error(responseMessage || 'Failed to delete message.');

      alert('Message deleted successfully!');
      setMessages(messages.filter(msg => msg._id !== id));
    } catch (err) {
      console.error('❌ Delete error:', err);
      alert('Error deleting message: ' + err.message);
    }
  };

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
              <th>Action</th>
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
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(msg._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminViewContact;
