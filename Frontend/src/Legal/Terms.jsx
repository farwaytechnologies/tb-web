import { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, ChevronDown, Scale, Shield, BookOpen, CreditCard, UserCheck, Link as LinkIcon } from 'lucide-react';
import '../Styles/LegalStyle/Terms.css';

const highlights = [
  { icon: UserCheck, color: '#6366f1', title: 'Account Security',   desc: 'You are responsible for maintaining your account credentials and all activity under your account.' },
  { icon: BookOpen,  color: '#10b981', title: 'Content Rights',     desc: 'All course materials are protected intellectual property. Personal use only — no redistribution.' },
  { icon: Shield,    color: '#f59e0b', title: 'User Conduct',       desc: 'Harassment, disruptive behaviour, and fraudulent activity will result in account termination.' },
  { icon: CreditCard,color: '#ec4899', title: 'Payments & Refunds', desc: 'Fees are non-refundable unless stated otherwise. Refund eligibility is course-specific.' },
  { icon: Scale,     color: '#06b6d4', title: 'Liability Limits',   desc: 'Our liability for damages arising from platform use is limited to the fullest extent permitted by law.' },
  { icon: LinkIcon,  color: '#8b5cf6', title: 'Third-Party Links',  desc: 'We are not responsible for the content or practices of any external sites linked from the platform.' },
];

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing and using this platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws. If you do not agree, you are prohibited from using the platform. Continued use after modifications constitutes acceptance of the updated terms.',
  },
  {
    title: '2. Use License',
    content: 'You are granted a limited, non-exclusive, non-transferable licence to access course materials for personal, non-commercial use only. You may not modify, copy, distribute, or commercially exploit any materials. You may not reverse-engineer any software, remove proprietary notices, or mirror content on any other server.',
  },
  {
    title: '3. User Accounts & Responsibilities',
    content: 'To access certain features you must create an account with accurate, complete information. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately of any unauthorised use. You must not use another user\'s account or misrepresent your identity.',
  },
  {
    title: '4. User Conduct & Restrictions',
    content: 'You agree not to harass, threaten, or cause distress to any person; post obscene or defamatory content; disrupt the normal flow of the platform; violate any applicable local, national, or international law; or introduce malicious code. Violations may result in immediate account suspension or termination.',
  },
  {
    title: '5. Course Content & Materials',
    content: 'All course content — including video lectures, reading materials, and assessments — is protected by copyright. Materials are provided for your personal educational use only. Reproduction, distribution, or commercial use without express written permission is prohibited. Certificates of completion are non-transferable and do not constitute academic credit unless explicitly stated.',
  },
  {
    title: '6. Payment & Refunds',
    content: 'By purchasing a course or service, you agree to pay all applicable fees. All fees are non-refundable unless otherwise stated at the time of purchase. Payment is processed securely through third-party processors. We reserve the right to change pricing with 30 days\' notice. Refund eligibility for course withdrawals is governed by the policy communicated at purchase.',
  },
  {
    title: '7. Intellectual Property Rights',
    content: 'The platform and all its content, features, and functionality are owned by TechBorg or its licensors and are protected by international copyright, trademark, and intellectual property laws. You agree not to reproduce, distribute, modify, or create derivative works from any platform content without explicit written permission.',
  },
  {
    title: '8. Disclaimer of Warranties',
    content: 'Materials are provided on an "as is" basis. We make no warranties, expressed or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant the accuracy, completeness, or reliability of any materials on the platform.',
  },
  {
    title: '9. Limitations of Liability',
    content: 'In no event shall TechBorg or its suppliers be liable for any damages — including loss of data, profit, or business interruption — arising from the use or inability to use the platform, even if we have been notified of the possibility of such damage. Some jurisdictions do not allow these limitations, so they may not apply to you.',
  },
  {
    title: '10. Links to Third-Party Sites',
    content: 'The platform may contain links to third-party websites not operated by us. We are not responsible for their content, accuracy, or practices. Your use of third-party sites is at your own risk and subject to their own terms. We do not endorse any third-party sites or services.',
  },
  {
    title: '11. Termination & Suspension',
    content: 'We reserve the right to refuse service, suspend, or terminate accounts at our sole discretion, with or without notice. Grounds include violation of these terms, disruptive behaviour, fraudulent activity, or non-payment. Upon termination, your right to use the platform ceases immediately. Provisions relating to liability, indemnification, and intellectual property survive termination.',
  },
  {
    title: '12. Dispute Resolution',
    content: 'Any disputes arising from these Terms shall be governed by the laws of the jurisdiction in which TechBorg is registered. Before pursuing legal action, you agree to attempt resolution through good faith negotiation. If negotiation fails, disputes may be resolved through arbitration or small claims court as applicable.',
  },
  {
    title: '13. Modifications to Terms',
    content: 'We may modify these Terms at any time. Changes take effect immediately upon posting. Continued use of the platform after changes are posted constitutes your acceptance. Significant changes will be communicated via email or a prominent notice on the platform. We encourage you to review these terms periodically.',
  },
];

export default function Terms() {
  const [expanded, setExpanded] = useState(null);
  const toggle = (i) => setExpanded(expanded === i ? null : i);

  return (
    <div className="tm-page">
      {/* Hero */}
      <div className="tm-hero">
        <div className="tm-hero-glow" />
        <div className="tm-hero-icon"><FileText size={36} /></div>
        <h1 className="tm-hero-title">Terms of Service</h1>
        <p className="tm-hero-sub">Please read these terms carefully before using TechBorg</p>
        <span className="tm-updated">Effective Date: November 2024</span>
      </div>

      <div className="tm-body">
        {/* Alert notice */}
        <div className="tm-notice">
          <AlertTriangle size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="tm-notice-title">Important Notice</p>
            <p className="tm-notice-text">By accessing this platform you agree to be bound by all terms below. If you disagree with any part, please do not use the platform. Contact us if you have questions before proceeding.</p>
          </div>
        </div>

        {/* Intro */}
        <div className="tm-card">
          <p className="tm-text">
            Welcome to TechBorg. These Terms of Service govern your access to and use of our website, applications, and all services provided through the platform. Our mission is to deliver accessible, high-quality educational content to learners worldwide.
          </p>
          <p className="tm-text" style={{ marginTop: 12 }}>
            These terms form a legally binding agreement between you and TechBorg. We encourage you to read them thoroughly and reach out with any questions before proceeding.
          </p>
        </div>

        {/* Highlights grid */}
        <h2 className="tm-section-heading">Key Points at a Glance</h2>
        <div className="tm-highlights">
          {highlights.map(h => (
            <div key={h.title} className="tm-highlight-card" style={{ '--accent': h.color }}>
              <div className="tm-hl-icon" style={{ background: `${h.color}18`, border: `1px solid ${h.color}30` }}>
                <h.icon size={18} style={{ color: h.color }} />
              </div>
              <div>
                <p className="tm-hl-title">{h.title}</p>
                <p className="tm-hl-desc">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Accordion */}
        <h2 className="tm-section-heading">Full Terms</h2>
        <div className="tm-accordion">
          {sections.map((s, i) => (
            <div key={i} className={`tm-acc-item ${expanded === i ? 'open' : ''}`}>
              <button className="tm-acc-header" onClick={() => toggle(i)}>
                <span>{s.title}</span>
                <ChevronDown size={18} className="tm-acc-chevron" />
              </button>
              <div className="tm-acc-body">
                <p className="tm-text">{s.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick reference */}
        <div className="tm-quick-ref">
          <h2 className="tm-qr-title">Quick Reference</h2>
          <div className="tm-qr-grid">
            {[
              'You must be 13+ to use this platform.',
              'Do not share your account credentials.',
              'Course materials are for personal use only.',
              'Certificates do not constitute academic credit.',
              'Fees are non-refundable unless stated otherwise.',
              'We may update these terms at any time.',
            ].map(item => (
              <div key={item} className="tm-qr-item">
                <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="tm-contact-card">
          <h2 className="tm-qr-title">Questions About These Terms?</h2>
          <p className="tm-text" style={{ marginBottom: 20 }}>Reach out to our legal team and we'll respond within 5 business days.</p>
          <div className="tm-contact-grid">
            <div className="tm-contact-item"><span className="tm-contact-label">Legal</span><span>mail@techborg.in</span></div>
            <div className="tm-contact-item"><span className="tm-contact-label">Support Hours</span><span>Mon–Fri, 9am–5pm</span></div>
            <div className="tm-contact-item"><span className="tm-contact-label">Response Time</span><span>Within 5 business days</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
