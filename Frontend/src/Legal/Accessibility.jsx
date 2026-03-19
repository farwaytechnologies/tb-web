import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../Components/SEO';
import '../Styles/LegalStyle/Accessibility.css';

const sections = [
  {
    id: 'commitment',
    icon: '♿',
    title: 'Our Commitment',
    content: `TechBorg is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards to achieve this goal.`
  },
  {
    id: 'standards',
    icon: '📋',
    title: 'Conformance Status',
    content: `We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with disabilities. Conformance with these guidelines helps make the web more user-friendly for everyone.`
  },
  {
    id: 'features',
    icon: '✅',
    title: 'Accessibility Features',
    items: [
      { label: 'Keyboard Navigation', desc: 'All interactive elements are reachable and operable via keyboard alone.' },
      { label: 'Screen Reader Support', desc: 'Semantic HTML, ARIA labels, and live regions are used throughout the platform.' },
      { label: 'Colour Contrast', desc: 'Text and UI components meet minimum contrast ratios for readability.' },
      { label: 'Resizable Text', desc: 'Content reflows correctly when text is scaled up to 200% without loss of functionality.' },
      { label: 'Focus Indicators', desc: 'Visible focus outlines are present on all interactive elements.' },
      { label: 'Alt Text', desc: 'All meaningful images include descriptive alternative text.' },
      { label: 'Captions & Transcripts', desc: 'Video content includes captions; transcripts are available where applicable.' },
      { label: 'Skip Navigation', desc: 'A skip-to-main-content link is available at the top of every page.' },
    ]
  },
  {
    id: 'assistive',
    icon: '🛠️',
    title: 'Assistive Technologies',
    content: `TechBorg has been tested with the following assistive technologies:`,
    items: [
      { label: 'NVDA + Chrome', desc: 'Windows screen reader with Google Chrome browser.' },
      { label: 'JAWS + Edge', desc: 'Windows screen reader with Microsoft Edge browser.' },
      { label: 'VoiceOver + Safari', desc: 'macOS/iOS built-in screen reader with Safari browser.' },
      { label: 'TalkBack + Chrome', desc: 'Android built-in screen reader with Chrome browser.' },
    ]
  },
  {
    id: 'limitations',
    icon: '⚠️',
    title: 'Known Limitations',
    content: `Despite our best efforts, some areas of the platform may not yet fully meet accessibility standards. We are actively working to address the following:`,
    items: [
      { label: 'Third-party embeds', desc: 'Some embedded content from external providers may not be fully accessible.' },
      { label: 'Legacy PDF documents', desc: 'Older PDF resources may lack proper tagging. We are updating these progressively.' },
      { label: 'Complex data tables', desc: 'Some analytics tables are being updated with improved header associations.' },
    ]
  },
  {
    id: 'feedback',
    icon: '💬',
    title: 'Feedback & Contact',
    content: `We welcome your feedback on the accessibility of TechBorg. If you experience any barriers or have suggestions for improvement, please let us know.`
  },
  {
    id: 'enforcement',
    icon: '⚖️',
    title: 'Formal Complaints',
    content: `If you are not satisfied with our response to your accessibility concern, you may contact the relevant national enforcement body in your country. In the EU, this is typically the national authority responsible for monitoring the accessibility of public sector websites.`
  },
];

export default function Accessibility() {
  const [active, setActive] = useState('commitment');

  const current = sections.find(s => s.id === active);

  return (
    <div className="acc-page">
      <SEO
        title="Accessibility - TechBorg E-Learning"
        description="TechBorg's accessibility statement — our commitment to WCAG 2.1 AA, supported assistive technologies, and how to report accessibility issues."
      />

      {/* Hero */}
      <div className="acc-hero">
        <div className="acc-hero-glow" />
        <div className="acc-hero-inner">
          <div className="acc-hero-badge">♿ Accessibility Statement</div>
          <h1 className="acc-hero-title">Accessible for Everyone</h1>
          <p className="acc-hero-sub">
            We believe technology should be usable by all people, regardless of ability or circumstance.
          </p>
          <p className="acc-hero-date">Last updated: March 2026</p>
        </div>
      </div>

      <div className="acc-layout">
        {/* Sidebar nav */}
        <nav className="acc-nav" aria-label="Accessibility sections">
          {sections.map(s => (
            <button
              key={s.id}
              className={`acc-nav-item ${active === s.id ? 'acc-nav-item--active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className="acc-nav-icon">{s.icon}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="acc-content" id="main-content">
          <div className="acc-section" key={current.id}>
            <div className="acc-section-header">
              <span className="acc-section-icon">{current.icon}</span>
              <h2 className="acc-section-title">{current.title}</h2>
            </div>

            {current.content && <p className="acc-section-text">{current.content}</p>}

            {current.items && (
              <ul className="acc-items">
                {current.items.map((item, i) => (
                  <li key={i} className="acc-item">
                    <div className="acc-item-dot" />
                    <div>
                      <span className="acc-item-label">{item.label}</span>
                      <span className="acc-item-desc"> — {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Feedback section extras */}
            {current.id === 'feedback' && (
              <div className="acc-contact-cards">
                <div className="acc-contact-card">
                  <span className="acc-contact-icon">📧</span>
                  <div>
                    <p className="acc-contact-label">Email</p>
                    <a href="mailto:accessibility@techborg.com" className="acc-contact-value">
                      accessibility@techborg.com
                    </a>
                  </div>
                </div>
                <div className="acc-contact-card">
                  <span className="acc-contact-icon">💬</span>
                  <div>
                    <p className="acc-contact-label">Support Portal</p>
                    <Link to="/support" className="acc-contact-value">Visit Support</Link>
                  </div>
                </div>
                <div className="acc-contact-card">
                  <span className="acc-contact-icon">⏱️</span>
                  <div>
                    <p className="acc-contact-label">Response Time</p>
                    <p className="acc-contact-value">Within 2 business days</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation between sections */}
          <div className="acc-pagination">
            {sections.findIndex(s => s.id === active) > 0 && (
              <button
                className="acc-page-btn acc-page-btn--prev"
                onClick={() => setActive(sections[sections.findIndex(s => s.id === active) - 1].id)}
              >
                ← Previous
              </button>
            )}
            {sections.findIndex(s => s.id === active) < sections.length - 1 && (
              <button
                className="acc-page-btn acc-page-btn--next"
                onClick={() => setActive(sections[sections.findIndex(s => s.id === active) + 1].id)}
              >
                Next →
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
