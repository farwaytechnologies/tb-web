import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, Linkedin, Twitter, Facebook, Instagram, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import SEO from '../Components/SEO';
import '../Styles/PagesStyle/Contact.css';

const API = import.meta.env.VITE_API_URL;

const subjects = ['General Inquiry', 'Course Support', 'Partnership', 'Technical Issue', 'Billing', 'Other'];

const infoItems = [
  { icon: MapPin, color: '#6366f1', label: 'Address',       value: 'Kottayam, Kerala, India' },
  { icon: Phone,  color: '#10b981', label: 'Phone',         value: '+91 (XXX) XXX-XXXX' },
  { icon: Mail,   color: '#f59e0b', label: 'Email',         value: 'info@techborg.com' },
  { icon: Clock,  color: '#ec4899', label: 'Working Hours', value: 'Mon – Fri: 9:00 AM – 6:00 PM' },
];

const socials = [
  { icon: Linkedin,  label: 'LinkedIn',  href: '#' },
  { icon: Twitter,   label: 'Twitter',   href: '#' },
  { icon: Facebook,  label: 'Facebook',  href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Something went wrong.'); }
      else { setSuccess(data.message || 'Message sent successfully!'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="ct-page">
      <SEO
        title="Contact Us"
        description="Get in touch with TechBorg E-Learning. We're here to answer your questions about courses, partnerships, and support."
        url="/contact"
        keywords="contact TechBorg, e-learning support, get in touch, tech education help"
      />

      {/* Hero */}
      <div className="ct-hero">
        <div className="ct-hero-glow" />
        <h1 className="ct-hero-title">Get in <span className="ct-hero-accent">Touch</span></h1>
        <p className="ct-hero-sub">Have a question or want to work with us? We'd love to hear from you.</p>
      </div>

      <div className="ct-body">
        <div className="ct-grid">

          {/* Form */}
          <div className="ct-form-card">
            <h2 className="ct-card-title">Send a Message</h2>
            <p className="ct-card-sub">Fill out the form and we'll get back to you within 24 hours.</p>

            <form className="ct-form" onSubmit={submit}>
              <div className="ct-row">
                <div className="ct-field">
                  <label className="ct-label"><User size={14} /> Name</label>
                  <input className="ct-input" name="name" placeholder="Your full name" value={form.name} onChange={handle} required />
                </div>
                <div className="ct-field">
                  <label className="ct-label"><Mail size={14} /> Email</label>
                  <input className="ct-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
                </div>
              </div>

              <div className="ct-row">
                <div className="ct-field">
                  <label className="ct-label"><Phone size={14} /> Phone <span className="ct-optional">(optional)</span></label>
                  <input className="ct-input" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handle} />
                </div>
                <div className="ct-field">
                  <label className="ct-label"><ChevronDown size={14} /> Subject</label>
                  <select className="ct-input ct-select" name="subject" value={form.subject} onChange={handle}>
                    <option value="">Select a subject</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label"><MessageSquare size={14} /> Message</label>
                <textarea className="ct-input ct-textarea" name="message" placeholder="Tell us about your inquiry..." value={form.message} onChange={handle} required rows={5} />
              </div>

              <button className="ct-submit" type="submit" disabled={loading}>
                {loading
                  ? <><span className="ct-spinner" /> Sending...</>
                  : <><Send size={15} /> Send Message</>}
              </button>

              {success && (
                <div className="ct-alert ct-alert-success">
                  <CheckCircle size={16} /><span>{success}</span>
                </div>
              )}
              {error && (
                <div className="ct-alert ct-alert-error">
                  <AlertCircle size={16} /><span>{error}</span>
                </div>
              )}
            </form>
          </div>

          {/* Info sidebar */}
          <div className="ct-info-col">
            <div className="ct-info-card">
              <h2 className="ct-card-title">Contact Information</h2>
              <p className="ct-card-sub">We're here to help and answer any questions you might have.</p>

              <div className="ct-info-list">
                {infoItems.map(item => (
                  <div key={item.label} className="ct-info-item">
                    <div className="ct-info-icon" style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                      <item.icon size={18} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="ct-info-label">{item.label}</p>
                      <p className="ct-info-value">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ct-social-section">
                <p className="ct-social-title">Follow Us</p>
                <div className="ct-socials">
                  {socials.map(s => (
                    <a key={s.label} href={s.href} className="ct-social-btn" aria-label={s.label}>
                      <s.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Response time card */}
            <div className="ct-response-card">
              <div className="ct-response-dot" />
              <div>
                <p className="ct-response-title">Quick Response</p>
                <p className="ct-response-sub">We typically respond within 24 hours on business days.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
