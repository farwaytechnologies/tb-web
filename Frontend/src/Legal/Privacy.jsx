import { useState } from 'react';
import { Lock, Eye, Edit3, Trash2, BellOff, Download, Globe, ChevronDown, ShieldCheck, Database, Users, BarChart2 } from 'lucide-react';
import '../Styles/LegalStyle/Privacy.css';

const rights = [
  { icon: Eye,     color: '#6366f1', title: 'Right to Access',     desc: 'Request a copy of the personal data we hold about you at any time.' },
  { icon: Edit3,   color: '#10b981', title: 'Right to Correction',  desc: 'Update or correct inaccurate information in your account.' },
  { icon: Trash2,  color: '#ef4444', title: 'Right to Deletion',    desc: 'Request erasure of your data, subject to legal obligations.' },
  { icon: BellOff, color: '#f59e0b', title: 'Right to Opt-Out',     desc: 'Unsubscribe from marketing communications at any time.' },
  { icon: Download,color: '#06b6d4', title: 'Data Portability',     desc: 'Receive your data in a structured, machine-readable format.' },
  { icon: Globe,   color: '#8b5cf6', title: 'Lodge a Complaint',    desc: 'Contact your local data protection authority if you have concerns.' },
];

const dataTypes = [
  { icon: Users,    color: '#6366f1', title: 'Account Data',     items: ['Name', 'Email address', 'Phone number', 'Profile picture'] },
  { icon: BarChart2,color: '#10b981', title: 'Usage Data',       items: ['Pages visited', 'Course progress', 'Session duration', 'Device & browser info'] },
  { icon: Database, color: '#f59e0b', title: 'Transaction Data', items: ['Enrollment records', 'Payment history', 'Invoice details', 'Certificate records'] },
  { icon: ShieldCheck,color:'#ec4899',title: 'Security Data',    items: ['IP address', 'Login timestamps', 'Security logs', 'Authentication tokens'] },
];

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide directly — such as when you create an account, enroll in a course, or contact us — including your name, email, phone number, and educational background. We also automatically collect device and interaction data: IP address, browser type, pages visited, and course engagement metrics.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use collected data to deliver and improve our educational services, process enrollments, personalise your learning experience, send relevant updates, and analyse platform usage. We may also use your data to comply with legal obligations, enforce our terms, and protect the safety of our users and platform.',
  },
  {
    title: '3. Information Sharing & Disclosure',
    content: 'We do not sell, trade, or rent your personal information to third parties. We may share data with service providers who assist in operating our platform, subject to confidentiality agreements. We may also disclose information when required by law, to enforce our agreements, or to protect the rights and safety of our users.',
  },
  {
    title: '4. Data Security',
    content: 'We implement industry-standard security measures — including encryption, secure servers, and access controls — to protect your data from unauthorised access, alteration, and disclosure. No method of internet transmission is 100% secure; we encourage you to use strong passwords and keep your credentials confidential.',
  },
  {
    title: '5. Cookies & Tracking Technologies',
    content: 'We use cookies and similar technologies to enhance your experience, remember preferences, and analyse platform usage. You can control cookie settings through your browser, though this may affect some functionality. See our Cookie Policy for full details.',
  },
  {
    title: '6. Data Retention',
    content: 'We retain your personal data for as long as necessary to provide our services and fulfil the purposes in this policy. After account closure, we may retain certain data as required by law or for legitimate business purposes. You can request deletion subject to legal and operational requirements.',
  },
  {
    title: '7. International Data Transfers',
    content: 'Your data may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have different data protection laws. By using our platform, you consent to such transfers. We ensure appropriate safeguards are in place for all international transfers.',
  },
  {
    title: '8. Third-Party Links',
    content: 'Our platform may link to third-party websites not operated by us. This Privacy Policy applies only to data collected through our platform. We are not responsible for third-party privacy practices and encourage you to review their policies before providing any information.',
  },
  {
    title: '9. Children\'s Privacy',
    content: 'Our platform is not directed at children under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal data, we will take steps to delete that information promptly.',
  },
  {
    title: '10. Changes to This Policy',
    content: 'We may update this Privacy Policy periodically. Significant changes will be communicated via email or a prominent notice on the platform. Your continued use of the platform after changes are posted constitutes acceptance of the revised policy. We encourage you to review this policy regularly.',
  },
];

export default function Privacy() {
  const [expanded, setExpanded] = useState(null);
  const toggle = (i) => setExpanded(expanded === i ? null : i);

  return (
    <div className="pv-page">
      {/* Hero */}
      <div className="pv-hero">
        <div className="pv-hero-glow" />
        <div className="pv-hero-icon"><Lock size={36} /></div>
        <h1 className="pv-hero-title">Privacy Policy</h1>
        <p className="pv-hero-sub">How we collect, use, and protect your personal data</p>
        <span className="pv-updated">Last updated: November 2024</span>
      </div>

      <div className="pv-body">
        {/* Intro */}
        <div className="pv-card">
          <p className="pv-text">
            This Privacy Policy explains how TechBorg collects, uses, maintains, and discloses information obtained from users of our platform. We are committed to protecting your privacy and ensuring a positive, trustworthy experience.
          </p>
          <p className="pv-text" style={{ marginTop: 12 }}>
            By accessing and using our platform, you acknowledge that you have read and agree to this policy. If you do not agree, please do not use the platform.
          </p>
        </div>

        {/* Data we collect */}
        <h2 className="pv-section-heading">Data We Collect</h2>
        <div className="pv-data-grid">
          {dataTypes.map(d => (
            <div key={d.title} className="pv-data-card" style={{ '--accent': d.color }}>
              <div className="pv-data-icon" style={{ background: `${d.color}18`, border: `1px solid ${d.color}30` }}>
                <d.icon size={18} style={{ color: d.color }} />
              </div>
              <p className="pv-data-title">{d.title}</p>
              <ul className="pv-data-list">
                {d.items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Accordion */}
        <h2 className="pv-section-heading">Full Privacy Policy</h2>
        <div className="pv-accordion">
          {sections.map((s, i) => (
            <div key={i} className={`pv-acc-item ${expanded === i ? 'open' : ''}`}>
              <button className="pv-acc-header" onClick={() => toggle(i)}>
                <span>{s.title}</span>
                <ChevronDown size={18} className="pv-acc-chevron" />
              </button>
              <div className="pv-acc-body">
                <p className="pv-text">{s.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rights */}
        <h2 className="pv-section-heading">Your Data Protection Rights</h2>
        <div className="pv-rights-grid">
          {rights.map(r => (
            <div key={r.title} className="pv-right-card" style={{ '--accent': r.color }}>
              <div className="pv-right-icon" style={{ background: `${r.color}18`, border: `1px solid ${r.color}30` }}>
                <r.icon size={16} style={{ color: r.color }} />
              </div>
              <p className="pv-right-title">{r.title}</p>
              <p className="pv-right-desc">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="pv-contact-card">
          <h2 className="pv-contact-title">Questions or Concerns?</h2>
          <p className="pv-text" style={{ marginBottom: 20 }}>
            Reach out to our privacy team. We respond to all inquiries within 30 days.
          </p>
          <div className="pv-contact-grid">
            <div className="pv-contact-item"><span className="pv-contact-label">Privacy Team</span><span>support@techborg.in</span></div>
            <div className="pv-contact-item"><span className="pv-contact-label">Data Protection</span><span>mail@techborg.in</span></div>
            <div className="pv-contact-item"><span className="pv-contact-label">Response Time</span><span>Within 30 days</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
