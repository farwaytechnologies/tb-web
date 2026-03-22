import { useEffect, useState, useRef } from 'react';
import { Search, Mail, Phone, MessageCircle, ChevronDown, ChevronRight, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import SEO from '../Components/SEO';
import '../Styles/PagesStyle/Support.css';

const API = import.meta.env.VITE_API_URL;

const DEFAULT_CATEGORIES = [
  { _id: 'd1', icon: '🚀', title: 'Getting Started', description: 'New to TechBorg? Learn how to set up your account, enroll in courses, and navigate the platform.', subcategories: ['Account Setup', 'First Enrollment', 'Platform Tour', 'Profile Settings'] },
  { _id: 'd2', icon: '📚', title: 'Courses & Learning', description: 'Everything about accessing course content, tracking progress, and completing modules.', subcategories: ['Accessing Content', 'Progress Tracking', 'Module Completion', 'Course Materials'] },
  { _id: 'd3', icon: '🎓', title: 'Certificates', description: 'How to earn, download, and share your certificates after completing a course.', subcategories: ['Earning Certificates', 'Downloading', 'Sharing', 'Verification'] },
  { _id: 'd4', icon: '💳', title: 'Billing & Payments', description: 'Questions about invoices, payment methods, refunds, and subscription plans.', subcategories: ['Invoices', 'Payment Methods', 'Refunds', 'Pricing Plans'] },
  { _id: 'd5', icon: '🔐', title: 'Account & Security', description: 'Manage your login, password, two-factor authentication, and account privacy.', subcategories: ['Password Reset', 'Login Issues', 'Privacy Settings', 'Account Deletion'] },
  { _id: 'd6', icon: '🛠️', title: 'Technical Issues', description: 'Troubleshoot video playback, browser compatibility, and other technical problems.', subcategories: ['Video Playback', 'Browser Issues', 'Mobile App', 'Offline Access'] },
];

const CHAT_RESPONSES = {
  default: "Thanks for reaching out! Our support team will get back to you within 2 business hours. In the meantime, try browsing the help categories above.",
  hello: "Hi there! 👋 How can I help you today? You can ask about courses, billing, certificates, or any other topic.",
  course: "For course-related questions, check the 'Courses & Learning' section above. You can also email us at support@techborg.com.",
  certificate: "Certificates are issued automatically after completing all course modules. Visit your dashboard → Certificates to download them.",
  payment: "For billing questions, please email billing@techborg.com or check the 'Billing & Payments' section above.",
  password: "To reset your password, go to the login page and click 'Forgot Password'. A reset link will be sent to your email.",
  refund: "We offer a 30-day refund policy. Contact support@techborg.com with your invoice number to request a refund.",
};

function getChatResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.match(/\b(hi|hello|hey|hii)\b/)) return CHAT_RESPONSES.hello;
  if (lower.includes('course') || lower.includes('learn') || lower.includes('module')) return CHAT_RESPONSES.course;
  if (lower.includes('certificate') || lower.includes('cert')) return CHAT_RESPONSES.certificate;
  if (lower.includes('pay') || lower.includes('bill') || lower.includes('invoice') || lower.includes('price')) return CHAT_RESPONSES.payment;
  if (lower.includes('password') || lower.includes('login') || lower.includes('forgot')) return CHAT_RESPONSES.password;
  if (lower.includes('refund') || lower.includes('money back')) return CHAT_RESPONSES.refund;
  return CHAT_RESPONSES.default;
}

export default function Support() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState('browse'); // browse | contact
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMin, setChatMin] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: "Hi! 👋 I'm TechBorg Support Bot. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/support`)
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) && data.length > 0 ? data : DEFAULT_CATEGORIES))
      .catch(() => setCategories(DEFAULT_CATEGORIES))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const filtered = categories.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleContact = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, message: `[${form.subject}] ${form.message}` }),
      });
      if (!res.ok) throw new Error();
      setSubmitStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages(prev => [...prev, { from: 'user', text }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'bot', text: getChatResponse(text) }]);
    }, 700);
  };

  return (
    <div className="sp-page">
      <SEO
        title="Support Center"
        description="Get help with TechBorg E-Learning. Browse support categories, submit a ticket, or chat with our support bot. We reply within 2 business hours."
        url="/support"
        keywords="TechBorg support, help center, e-learning support, contact TechBorg, submit ticket, FAQ"
      />

      {/* Hero */}
      <div className="sp-hero">
        <div className="sp-hero-glow" />
        <div className="sp-hero-inner">
          <div className="sp-hero-badge">🛟 Support Center</div>
          <h1 className="sp-hero-title">How can we help you?</h1>
          <p className="sp-hero-sub">Browse help topics, submit a ticket, or chat with us — we're here for you.</p>
          <div className="sp-search-wrap">
            <Search size={18} className="sp-search-icon" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="sp-search-input"
            />
            {search && <button className="sp-search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sp-tabs-wrap">
        <div className="sp-tabs">
          <button className={`sp-tab ${activeTab === 'browse' ? 'sp-tab--active' : ''}`} onClick={() => setActiveTab('browse')}>
            <MessageCircle size={16} /> Browse Topics
          </button>
          <button className={`sp-tab ${activeTab === 'contact' ? 'sp-tab--active' : ''}`} onClick={() => setActiveTab('contact')}>
            <Mail size={16} /> Submit a Ticket
          </button>
        </div>
      </div>

      <div className="sp-container">

        {/* ── Browse Tab ── */}
        {activeTab === 'browse' && (
          <>
            {loading ? (
              <div className="sp-state"><div className="sp-spinner" /></div>
            ) : filtered.length === 0 ? (
              <div className="sp-state">
                <Search size={40} style={{ color: '#334155' }} />
                <p>No results for "{search}"</p>
              </div>
            ) : (
              <div className="sp-grid">
                {filtered.map((cat, i) => (
                  <div
                    key={cat._id}
                    className={`sp-card ${expanded === cat._id ? 'sp-card--open' : ''}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <button
                      className="sp-card-header"
                      onClick={() => setExpanded(expanded === cat._id ? null : cat._id)}
                    >
                      <span className="sp-card-icon">{cat.icon || '💬'}</span>
                      <div className="sp-card-meta">
                        <span className="sp-card-title">{cat.title}</span>
                        {cat.subcategories?.length > 0 && (
                          <span className="sp-card-count">{cat.subcategories.length} topics</span>
                        )}
                      </div>
                      <ChevronDown size={18} className="sp-card-chevron" />
                    </button>

                    {expanded === cat._id && (
                      <div className="sp-card-body">
                        {cat.description && (
                          <p className="sp-card-desc" dangerouslySetInnerHTML={{ __html: cat.description }} />
                        )}
                        {cat.subcategories?.length > 0 && (
                          <div className="sp-subcats">
                            {cat.subcategories.map((s, j) => (
                              <span key={j} className="sp-subcat">{s}</span>
                            ))}
                          </div>
                        )}
                        <button
                          className="sp-card-cta"
                          onClick={() => setActiveTab('contact')}
                        >
                          Still need help? Submit a ticket →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Contact channels */}
            <div className="sp-channels">
              <h2 className="sp-channels-title">Other ways to reach us</h2>
              <div className="sp-channels-grid">
                {[
                  { icon: <Mail size={22} />, label: 'Email Support', value: 'support@techborg.in', sub: 'Reply within 2 business hours', color: '#6366f1' },
                  { icon: <Phone size={22} />, label: 'Phone Support', value: '+91 (XXX) XXX-XXXX', sub: 'Mon–Fri, 9 AM – 6 PM IST', color: '#10b981' },
                  { icon: <MessageCircle size={22} />, label: 'Live Chat', value: 'Chat with us now', sub: 'Instant bot + human handoff', color: '#f59e0b', action: () => setChatOpen(true) },
                ].map(ch => (
                  <div
                    key={ch.label}
                    className="sp-channel-card"
                    onClick={ch.action}
                    style={{ cursor: ch.action ? 'pointer' : 'default', '--c': ch.color }}
                  >
                    <div className="sp-channel-icon" style={{ background: `${ch.color}18`, border: `1px solid ${ch.color}30`, color: ch.color }}>
                      {ch.icon}
                    </div>
                    <div>
                      <p className="sp-channel-label">{ch.label}</p>
                      <p className="sp-channel-value" style={{ color: ch.color }}>{ch.value}</p>
                      <p className="sp-channel-sub">{ch.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Contact Tab ── */}
        {activeTab === 'contact' && (
          <div className="sp-ticket">
            <div className="sp-ticket-header">
              <h2 className="sp-ticket-title">Submit a Support Ticket</h2>
              <p className="sp-ticket-sub">We'll get back to you within 2 business hours.</p>
            </div>

            {submitStatus === 'success' && (
              <div className="sp-alert sp-alert--success">✓ Ticket submitted! We'll be in touch soon.</div>
            )}
            {submitStatus === 'error' && (
              <div className="sp-alert sp-alert--error">⚠ Something went wrong. Please try again.</div>
            )}

            <form onSubmit={handleContact} className="sp-form">
              <div className="sp-form-row">
                <div className="sp-field">
                  <label>Full Name *</label>
                  <input type="text" placeholder="Your name" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="sp-field">
                  <label>Email Address *</label>
                  <input type="email" placeholder="you@example.com" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
              </div>
              <div className="sp-form-row">
                <div className="sp-field">
                  <label>Phone (optional)</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="sp-field">
                  <label>Subject *</label>
                  <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required>
                    <option value="">Select a topic</option>
                    <option>Getting Started</option>
                    <option>Courses & Learning</option>
                    <option>Certificates</option>
                    <option>Billing & Payments</option>
                    <option>Account & Security</option>
                    <option>Technical Issues</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="sp-field">
                <label>Message *</label>
                <textarea rows={5} placeholder="Describe your issue in detail..."
                  value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
              </div>
              <button type="submit" className="sp-submit-btn" disabled={submitting}>
                {submitting ? <span className="sp-btn-spinner" /> : <Send size={16} />}
                {submitting ? 'Sending...' : 'Send Ticket'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Chat Widget ── */}
      {chatOpen && (
        <div className={`sp-chat ${chatMin ? 'sp-chat--min' : ''}`}>
          <div className="sp-chat-header">
            <div className="sp-chat-header-left">
              <div className="sp-chat-avatar">🤖</div>
              <div>
                <p className="sp-chat-name">TechBorg Support</p>
                <p className="sp-chat-status">● Online</p>
              </div>
            </div>
            <div className="sp-chat-controls">
              <button onClick={() => setChatMin(p => !p)}>
                {chatMin ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button onClick={() => setChatOpen(false)}><X size={14} /></button>
            </div>
          </div>

          {!chatMin && (
            <>
              <div className="sp-chat-messages">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`sp-chat-msg sp-chat-msg--${m.from}`}>
                    {m.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="sp-chat-input-wrap">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  className="sp-chat-input"
                />
                <button className="sp-chat-send" onClick={sendChat}>
                  <Send size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Chat FAB */}
      {!chatOpen && (
        <button className="sp-chat-fab" onClick={() => setChatOpen(true)} aria-label="Open chat">
          <MessageCircle size={24} />
          <span className="sp-chat-fab-dot" />
        </button>
      )}
    </div>
  );
}
