import React, { useState } from 'react';
import '../Styles/PagesStyle/Contact.css';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponseMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
      } else {
        setResponseMessage(data.message);
        setForm({ name: '', email: '', message: '' });
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="techborg-contact-container">
      <div className="techborg-contact-box">
        <h1 className="techborg-contact-title">Contact Us</h1>
        <form className="techborg-contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="techborg-input"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="techborg-input"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="techborg-textarea"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" className="techborg-submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {responseMessage && <p className="techborg-success-message">{responseMessage}</p>}
        {error && <p className="techborg-error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Contact;
