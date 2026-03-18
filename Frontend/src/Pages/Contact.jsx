import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, Linkedin, Twitter, Facebook, Instagram, CheckCircle, AlertCircle } from 'lucide-react';
import '../Styles/PagesStyle/Contact.css';
import SEO from '../Components/SEO';

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
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponseMessage('');

    try {
      const res = await fetch('https://tb-back-fyvj.onrender.com/api/contact', {
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
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-page">
      <SEO
        title="Contact Us"
        description="Get in touch with TechBorg E-Learning. We're here to answer your questions about courses, partnerships, and support."
        url="/contact"
        keywords="contact TechBorg, e-learning support, get in touch, tech education help"
      />
      <div className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <h1 className="contact-heading">
            Get in <span className="contact-highlight">Touch</span>
          </h1>
          <p className="contact-subheading">
            Have a question or want to work with us? Fill out the form below and we'll get back to you soon.
          </p>
        </div>

        {/* Main Content */}
        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <div className="contact-form">
              {/* Name Input */}
              <div className="contact-form-group">
                <label className="contact-label">
                  <User className="contact-label-icon" />
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="contact-input"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Input */}
              <div className="contact-form-group">
                <label className="contact-label">
                  <Mail className="contact-label-icon" />
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  className="contact-input"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Message Input */}
              <div className="contact-form-group">
                <label className="contact-label">
                  <MessageSquare className="contact-label-icon" />
                  Your Message
                </label>
                <textarea
                  name="message"
                  placeholder="Tell us about your project or inquiry..."
                  className="contact-textarea"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="contact-submit-btn"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <span className="contact-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="contact-btn-icon" />
                  </>
                )}
              </button>

              {/* Success Message */}
              {responseMessage && (
                <div className="contact-alert contact-alert-success">
                  <CheckCircle className="contact-alert-icon" />
                  <span>{responseMessage}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="contact-alert contact-alert-error">
                  <AlertCircle className="contact-alert-icon" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="contact-info-wrapper">
            <div className="contact-info-card">
              <h3 className="contact-info-title">Contact Information</h3>
              <p className="contact-info-description">
                We're here to help and answer any questions you might have.
              </p>

              <div className="contact-info-items">
                {/* Address */}
                <div className="contact-info-item">
                  <div className="contact-info-icon-box">
                    <MapPin className="contact-info-icon" />
                  </div>
                  <div className="contact-info-content">
                    <h4 className="contact-info-label">Address</h4>
                    <p className="contact-info-text">Kottayam, Kerala, India</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="contact-info-item">
                  <div className="contact-info-icon-box">
                    <Phone className="contact-info-icon" />
                  </div>
                  <div className="contact-info-content">
                    <h4 className="contact-info-label">Phone</h4>
                    <p className="contact-info-text">+91 (XXX) XXX-XXXX</p>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-info-item">
                  <div className="contact-info-icon-box">
                    <Mail className="contact-info-icon" />
                  </div>
                  <div className="contact-info-content">
                    <h4 className="contact-info-label">Email</h4>
                    <p className="contact-info-text">info@techborg.com</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="contact-info-item">
                  <div className="contact-info-icon-box">
                    <Clock className="contact-info-icon" />
                  </div>
                  <div className="contact-info-content">
                    <h4 className="contact-info-label">Working Hours</h4>
                    <p className="contact-info-text">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="contact-social">
                <h4 className="contact-social-title">Follow Us</h4>
                <div className="contact-social-links">
                  <a href="#linkedin" className="contact-social-link" aria-label="LinkedIn">
                    <Linkedin size={20} />
                  </a>
                  <a href="#twitter" className="contact-social-link" aria-label="Twitter">
                    <Twitter size={20} />
                  </a>
                  <a href="#facebook" className="contact-social-link" aria-label="Facebook">
                    <Facebook size={20} />
                  </a>
                  <a href="#instagram" className="contact-social-link" aria-label="Instagram">
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;