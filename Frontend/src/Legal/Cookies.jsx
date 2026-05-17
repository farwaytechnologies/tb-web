import { useState } from 'react';
import { Cookie, Shield, BarChart2, Settings, Megaphone, ChevronDown, Check, X, Info } from 'lucide-react';
import '../Styles/LegalStyle/Cookies.css';

const cookieTypes = [
  {
    icon: Shield,
    color: '#10b981',
    name: 'Essential Cookies',
    required: true,
    description: 'Strictly necessary for the platform to function. Enables secure login, session management, and core features.',
    examples: ['Session ID', 'Auth tokens', 'CSRF protection'],
  },
  {
    icon: BarChart2,
    color: '#6366f1',
    name: 'Performance Cookies',
    required: false,
    description: 'Help us understand how visitors interact with the platform — page load times, error logs, and navigation patterns.',
    examples: ['Page load time', 'Error logs', 'Navigation paths'],
  },
  {
    icon: Settings,
    color: '#f59e0b',
    name: 'Functional Cookies',
    required: false,
    description: 'Remember your preferences and personalise your experience — language, display settings, and course bookmarks.',
    examples: ['Language preference', 'Display settings', 'Course bookmarks'],
  },
  {
    icon: Megaphone,
    color: '#ec4899',
    name: 'Marketing Cookies',
    required: false,
    description: 'Track behaviour across the platform to measure campaign effectiveness and deliver relevant content.',
    examples: ['Visit duration', 'Page interactions', 'Conversion tracking'],
  },
];

const sections = [
  {
    title: '1. What Are Cookies?',
    content: 'Cookies are small text files stored on your device when you visit a website. They hold information about your browsing session and preferences. Most browsers accept cookies automatically, but you can configure yours to refuse or warn you when cookies are sent.',
  },
  {
    title: '2. First-Party vs Third-Party Cookies',
    content: 'First-party cookies are set directly by TechBorg and store your preferences and login state. Third-party cookies are set by external providers — analytics platforms, payment processors, and support tools. We vet all third-party partners to ensure they meet our privacy standards.',
  },
  {
    title: '3. Session vs Persistent Cookies',
    content: 'Session cookies are temporary and deleted when you close your browser. Persistent cookies remain for a set period to remember your preferences on future visits. You can delete persistent cookies at any time through your browser settings.',
  },
  {
    title: '4. Analytics & Performance Tracking',
    content: 'We use analytics tools to understand how users interact with our platform — page views, session duration, and user flow. All analytics data is aggregated and anonymised; we cannot identify you personally through this data.',
  },
  {
    title: '5. Third-Party Service Providers',
    content: 'Our partners use cookies for analytics, payment processing, and customer support. Each partner maintains their own privacy policy. We ensure all partners comply with applicable privacy laws and data protection standards.',
  },
  {
    title: '6. Managing Your Preferences',
    content: 'You can manage cookies through your browser settings or the preference panel on this page. Blocking essential cookies may prevent core platform features from working. Non-essential cookies can be disabled without affecting basic functionality.',
  },
  {
    title: '7. Updates to This Policy',
    content: 'We may update this Cookie Policy to reflect changes in our practices or applicable law. Significant changes will be communicated via email or a notice on the platform. Continued use of the platform after updates constitutes acceptance of the revised policy.',
  },
];

export default function Cookies() {
  const [expanded, setExpanded] = useState(null);
  const [prefs, setPrefs] = useState({ performance: true, functional: true, marketing: false });
  const [saved, setSaved] = useState(false);

  const toggle = (i) => setExpanded(expanded === i ? null : i);

  const savePrefs = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="ck-page">
      {/* Hero */}
      <div className="ck-hero">
        <div className="ck-hero-glow" />
        <div className="ck-hero-icon"><Cookie size={36} /></div>
        <h1 className="ck-hero-title">Cookie Policy</h1>
        <p className="ck-hero-sub">How we use cookies to power your learning experience</p>
        <span className="ck-updated">Last updated: November 2024</span>
      </div>

      <div className="ck-body">
        {/* Intro */}
        <div className="ck-card">
          <div className="ck-card-icon-row"><Info size={18} style={{ color: '#6366f1' }} /><span>Overview</span></div>
          <p className="ck-text">
            This policy explains how TechBorg uses cookies and similar tracking technologies. Cookies help us keep you logged in, remember your preferences, and improve our platform. By using TechBorg, you consent to our use of cookies as described below.
          </p>
        </div>

        {/* Cookie type cards */}
        <h2 className="ck-section-heading">Types of Cookies We Use</h2>
        <div className="ck-types-grid">
          {cookieTypes.map((t) => (
            <div key={t.name} className="ck-type-card" style={{ '--accent': t.color }}>
              <div className="ck-type-icon-wrap" style={{ background: `${t.color}18`, border: `1px solid ${t.color}30` }}>
                <t.icon size={20} style={{ color: t.color }} />
              </div>
              <div className="ck-type-body">
                <div className="ck-type-name-row">
                  <h3 className="ck-type-name">{t.name}</h3>
                  {t.required && <span className="ck-required-badge">Required</span>}
                </div>
                <p className="ck-type-desc">{t.description}</p>
                <div className="ck-examples">
                  {t.examples.map(ex => <span key={ex} className="ck-example-chip">{ex}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preference panel */}
        <div className="ck-prefs-card">
          <h2 className="ck-prefs-title">Your Cookie Preferences</h2>
          <p className="ck-text" style={{ marginBottom: '20px' }}>
            Manage which cookies you allow. Essential cookies cannot be disabled as they are required for the platform to work.
          </p>
          <div className="ck-prefs-list">
            {/* Essential — always on */}
            <div className="ck-pref-row">
              <div className="ck-pref-info">
                <Shield size={16} style={{ color: '#10b981' }} />
                <div>
                  <p className="ck-pref-name">Essential Cookies</p>
                  <p className="ck-pref-desc">Always enabled — required for platform functionality</p>
                </div>
              </div>
              <div className="ck-toggle ck-toggle-on ck-toggle-disabled">
                <div className="ck-toggle-thumb" />
              </div>
            </div>

            {[
              { key: 'performance', label: 'Performance Cookies', desc: 'Help us understand how you use the platform', icon: BarChart2, color: '#6366f1' },
              { key: 'functional',  label: 'Functional Cookies',  desc: 'Remember your preferences for a better experience', icon: Settings, color: '#f59e0b' },
              { key: 'marketing',   label: 'Marketing Cookies',   desc: 'Track marketing effectiveness and user behaviour', icon: Megaphone, color: '#ec4899' },
            ].map(({ key, label, desc, icon: Icon, color }) => (
              <div key={key} className="ck-pref-row">
                <div className="ck-pref-info">
                  <Icon size={16} style={{ color }} />
                  <div>
                    <p className="ck-pref-name">{label}</p>
                    <p className="ck-pref-desc">{desc}</p>
                  </div>
                </div>
                <button
                  className={`ck-toggle ${prefs[key] ? 'ck-toggle-on' : ''}`}
                  onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                  aria-label={`Toggle ${label}`}
                >
                  <div className="ck-toggle-thumb" />
                </button>
              </div>
            ))}
          </div>

          <div className="ck-prefs-actions">
            <button className="ck-btn-outline" onClick={() => setPrefs({ performance: false, functional: false, marketing: false })}>
              <X size={14} /> Reject All
            </button>
            <button className="ck-btn-outline" onClick={() => setPrefs({ performance: true, functional: true, marketing: true })}>
              Accept All
            </button>
            <button className="ck-btn-primary" onClick={savePrefs}>
              {saved ? <><Check size={14} /> Saved!</> : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Accordion sections */}
        <h2 className="ck-section-heading">Detailed Information</h2>
        <div className="ck-accordion">
          {sections.map((s, i) => (
            <div key={i} className={`ck-acc-item ${expanded === i ? 'open' : ''}`}>
              <button className="ck-acc-header" onClick={() => toggle(i)}>
                <span>{s.title}</span>
                <ChevronDown size={18} className="ck-acc-chevron" />
              </button>
              <div className="ck-acc-body">
                <p className="ck-text">{s.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="ck-contact-card">
          <h2 className="ck-prefs-title">Questions About Cookies?</h2>
          <p className="ck-text">Reach out to our privacy team and we'll respond within 24–48 hours.</p>
          <div className="ck-contact-grid">
            <div className="ck-contact-item"><span className="ck-contact-label">Email</span><span>support@techborg.in</span></div>
            <div className="ck-contact-item"><span className="ck-contact-label">Response Time</span><span>24–48 hours</span></div>
            <div className="ck-contact-item"><span className="ck-contact-label">Data Protection</span><span>mail@techborg.in</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
