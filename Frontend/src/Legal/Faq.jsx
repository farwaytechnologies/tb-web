import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle, Search, ChevronDown, User, BookOpen, CreditCard,
  Wrench, Shield, GraduationCap, MessageCircle, Mail, Phone, ThumbsUp, ThumbsDown, X,
} from 'lucide-react';
import '../Styles/LegalStyle/Faq.css';
import SEO from '../Components/SEO';

const CATEGORIES = [
  {
    id: 'account',
    label: 'Account & Registration',
    icon: User,
    color: '#8b5cf6',
    questions: [
      { q: 'How do I create an account?', a: 'Click "Sign Up" on the homepage, enter your email and name, create a password, then verify your email via the confirmation link. Your account is ready instantly after verification.' },
      { q: 'Can I change my email address?', a: 'Yes — go to your Profile page, update your email, and verify the new address via the confirmation link we send. Your old email is unlinked immediately.' },
      { q: 'What if I forgot my password?', a: 'Click "Forgot Password" on the login page, enter your registered email, and follow the reset link. Check your spam folder if the email doesn\'t arrive within a few minutes.' },
      { q: 'Is my account information secure?', a: 'Yes. Passwords are bcrypt-hashed, all traffic is TLS-encrypted, and we comply with GDPR and CCPA. We never sell your personal data to third parties.' },
      { q: 'Can I have multiple roles (student and tutor)?', a: 'Currently each account has a single role. If you want to switch roles, contact support and we\'ll help you set up the right account type.' },
    ],
  },
  {
    id: 'courses',
    label: 'Courses & Learning',
    icon: BookOpen,
    color: '#06b6d4',
    questions: [
      { q: 'How do I enroll in a course?', a: 'Browse the course catalog, open a course, and click "Enroll". Free courses are instant. Paid courses go through checkout. All materials are accessible immediately after enrollment.' },
      { q: 'Is there a time limit to complete a course?', a: 'Most courses have no expiration. You can learn at your own pace. Instructor-led cohort courses may have specific dates — check the course detail page.' },
      { q: 'Can I get a certificate after completing a course?', a: 'Yes. Once you complete all modules and requirements, a certificate is generated automatically. You can download or share it from your Certificates page.' },
      { q: 'What if I\'m not satisfied with a course?', a: 'We offer a 30-day refund guarantee on paid courses. Contact support with your course ID and reason within 30 days of purchase.' },
      { q: 'Can I download course materials for offline use?', a: 'Yes — most PDFs and resources have a download option. Video streaming requires an internet connection, but supplementary materials can be saved locally.' },
    ],
  },
  {
    id: 'payment',
    label: 'Payment & Billing',
    icon: CreditCard,
    color: '#10b981',
    questions: [
      { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, debit cards, UPI, and net banking. All payments are processed through PCI-DSS compliant gateways.' },
      { q: 'How do I view my invoices?', a: 'Go to your dashboard and open the Invoices section. All purchases are listed with downloadable PDF invoices. Invoices are also emailed automatically after each transaction.' },
      { q: 'Do you offer discounts or scholarships?', a: 'Yes — we run seasonal promotions and offer need-based scholarships. Contact support to inquire about scholarship eligibility or check the Offers section on the homepage.' },
      { q: 'Can I get a refund?', a: 'Full refunds are available within 30 days of purchase. After 30 days, refunds are handled case-by-case. Contact support with your order ID and reason.' },
      { q: 'Is there a free trial?', a: 'Many courses offer free preview lessons. For paid courses, the 30-day money-back guarantee effectively serves as a risk-free trial.' },
    ],
  },
  {
    id: 'technical',
    label: 'Technical Support',
    icon: Wrench,
    color: '#f59e0b',
    questions: [
      { q: 'What browsers and devices are supported?', a: 'The platform works on all modern browsers (Chrome, Firefox, Safari, Edge) and is fully responsive on desktop, tablet, and mobile. Keep your browser updated for the best experience.' },
      { q: 'I\'m having video playback issues. What should I do?', a: 'Try: 1) Clear browser cache and cookies, 2) Disable extensions, 3) Check your internet speed, 4) Switch browsers. If the issue persists, contact support with your browser and device details.' },
      { q: 'What are the minimum system requirements?', a: 'Minimum: 4 GB RAM, stable broadband connection, updated browser. Recommended: 8 GB RAM, 10 Mbps+ connection. No software installation required.' },
      { q: 'How do I contact customer support?', a: 'Visit the Support page, use the live chat widget, or email support@techborg.in. Average response time is under 24 hours on business days.' },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: Shield,
    color: '#f87171',
    questions: [
      { q: 'How is my personal data protected?', a: 'We use SSL/TLS encryption, secure servers, and strict access controls. We comply with GDPR and CCPA. Your data is never sold. See our Privacy Policy for full details.' },
      { q: 'Can I delete my account?', a: 'Yes — go to your Profile and request account deletion. Your data is permanently removed within 30 days. You can export your data before deletion.' },
      { q: 'Do you use cookies?', a: 'Yes, we use essential and analytics cookies. You can manage preferences in your browser settings. Read our Cookie Policy for details on what we collect and why.' },
      { q: 'Is my learning history private?', a: 'Yes — your progress and history are private by default. You can choose to make certificates public or share achievements. Other users cannot see your activity without your permission.' },
    ],
  },
  {
    id: 'tutors',
    label: 'Tutors & Instructors',
    icon: GraduationCap,
    color: '#a78bfa',
    questions: [
      { q: 'How do I become a tutor?', a: 'Apply through the Tutor Login page. You\'ll need to provide your expertise, a brief bio, and sample content. Our team reviews applications within 5–7 business days.' },
      { q: 'How do tutors earn rewards?', a: 'Tutors earn points for creating courses, publishing blogs, adding learning content, and enrolling students. Points convert to BorgCoins which can be redeemed for rewards.' },
      { q: 'Can I contact my instructor?', a: 'Use the "Contact Instructor" button on the course page or post in the course discussion forum. Most instructors respond within 24–48 hours.' },
      { q: 'Can I request a specific course topic?', a: 'Yes — use the "Request a Course" feature in your dashboard or email us. We review all suggestions and popular requests often become new courses.' },
    ],
  },
];

function AccordionItem({ faq, isOpen, onToggle, globalIdx }) {
  const [vote, setVote] = useState(null); // 'up' | 'down' | null

  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button className="faq-q-btn" onClick={onToggle} aria-expanded={isOpen}>
        <span className="faq-q-text">{faq.q}</span>
        <ChevronDown size={18} className="faq-chevron" />
      </button>
      <div className="faq-answer-wrap">
        <div className="faq-answer-inner">
          <p className="faq-answer-text">{faq.a}</p>
          <div className="faq-vote">
            <span className="faq-vote-label">Was this helpful?</span>
            <button
              className={`faq-vote-btn${vote === 'up' ? ' active-up' : ''}`}
              onClick={() => setVote(vote === 'up' ? null : 'up')}
              aria-label="Yes"
            ><ThumbsUp size={14} /></button>
            <button
              className={`faq-vote-btn${vote === 'down' ? ' active-down' : ''}`}
              onClick={() => setVote(vote === 'down' ? null : 'down')}
              aria-label="No"
            ><ThumbsDown size={14} /></button>
            {vote && <span className="faq-vote-thanks">{vote === 'up' ? 'Thanks!' : 'We\'ll improve this.'}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState('account');
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState(null);

  const isSearching = search.trim().length > 0;

  // Search across all categories
  const searchResults = isSearching
    ? CATEGORIES.flatMap(cat =>
        cat.questions
          .filter(q => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase()))
          .map(q => ({ ...q, category: cat.label, catColor: cat.color }))
      )
    : [];

  const activeData = CATEGORIES.find(c => c.id === activeCategory);

  const totalQ = CATEGORIES.reduce((s, c) => s + c.questions.length, 0);

  return (
    <div className="faq-page">
      <SEO
        title="FAQ — TechBorg E-Learning"
        description="Find answers to common questions about TechBorg courses, payments, accounts, and more."
        url="/faq"
        keywords="TechBorg FAQ, e-learning help, course questions, support"
      />

      {/* Hero */}
      <section className="faq-hero">
        <div className="faq-hero-inner">
          <div className="faq-hero-badge"><HelpCircle size={16} /> Help Center</div>
          <h1>Frequently Asked <span className="faq-accent">Questions</span></h1>
          <p>{totalQ} answers across {CATEGORIES.length} topics</p>

          <div className="faq-search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={e => { setSearch(e.target.value); setOpenIdx(null); }}
            />
            {search && (
              <button className="faq-search-clear" onClick={() => setSearch('')}><X size={14} /></button>
            )}
          </div>
          {isSearching && (
            <p className="faq-search-count">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{search}"
            </p>
          )}
        </div>
      </section>

      <div className="faq-body">
        {isSearching ? (
          /* Search results */
          <div className="faq-search-results">
            {searchResults.length ? searchResults.map((r, i) => (
              <div key={i} className="faq-search-result-item">
                <span className="faq-result-cat" style={{ color: r.catColor }}>{r.category}</span>
                <AccordionItem
                  faq={r} isOpen={openIdx === `s-${i}`}
                  onToggle={() => setOpenIdx(openIdx === `s-${i}` ? null : `s-${i}`)}
                  globalIdx={`s-${i}`}
                />
              </div>
            )) : (
              <div className="faq-no-results">
                <HelpCircle size={40} />
                <p>No results for "{search}"</p>
                <span>Try different keywords or browse categories below</span>
                <button className="faq-clear-search" onClick={() => setSearch('')}>Clear search</button>
              </div>
            )}
          </div>
        ) : (
          /* Category layout */
          <div className="faq-layout">
            {/* Sidebar */}
            <aside className="faq-sidebar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`faq-cat-btn${activeCategory === cat.id ? ' active' : ''}`}
                  onClick={() => { setActiveCategory(cat.id); setOpenIdx(null); }}
                  style={activeCategory === cat.id ? { '--cat-color': cat.color } : {}}
                >
                  <span className="faq-cat-icon" style={{ color: cat.color, background: `${cat.color}18` }}>
                    <cat.icon size={16} />
                  </span>
                  <span className="faq-cat-label">{cat.label}</span>
                  <span className="faq-cat-count">{cat.questions.length}</span>
                </button>
              ))}
            </aside>

            {/* Questions panel */}
            <div className="faq-panel">
              {activeData && (
                <>
                  <div className="faq-panel-header">
                    <div className="faq-panel-icon" style={{ background: `${activeData.color}18`, border: `1px solid ${activeData.color}30` }}>
                      <activeData.icon size={20} style={{ color: activeData.color }} />
                    </div>
                    <div>
                      <h2>{activeData.label}</h2>
                      <p>{activeData.questions.length} questions</p>
                    </div>
                  </div>

                  <div className="faq-list">
                    {activeData.questions.map((faq, i) => (
                      <AccordionItem
                        key={i} faq={faq}
                        isOpen={openIdx === `${activeCategory}-${i}`}
                        onToggle={() => setOpenIdx(openIdx === `${activeCategory}-${i}` ? null : `${activeCategory}-${i}`)}
                        globalIdx={`${activeCategory}-${i}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Still need help */}
        <div className="faq-help-section">
          <div className="faq-help-inner">
            <MessageCircle size={32} className="faq-help-icon" />
            <h3>Still need help?</h3>
            <p>Our support team is ready to assist you.</p>
            <div className="faq-contact-cards">
              <a href="mailto:support@techborg.in" className="faq-contact-card">
                <Mail size={20} />
                <div>
                  <strong>Email Support</strong>
                  <span>support@techborg.in</span>
                </div>
              </a>
              <Link to="/support" className="faq-contact-card">
                <MessageCircle size={20} />
                <div>
                  <strong>Live Chat</strong>
                  <span>Open Support Center</span>
                </div>
              </Link>
              <a href="tel:+911234567890" className="faq-contact-card">
                <Phone size={20} />
                <div>
                  <strong>Phone</strong>
                  <span>Mon–Fri, 9AM–6PM IST</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
