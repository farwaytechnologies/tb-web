import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  ArrowRight, Play, Star, Users, BookOpen, Award, Zap,
  CheckCircle, ChevronRight, TrendingUp, Globe, Shield,
  Code2, Database, Cpu, Layers, Clock, BarChart2,
  UserCheck, Rocket, MessageSquare,
} from 'lucide-react';
import SEO from '../Components/SEO';
import HomeWhyUs from '../Home/HomeWhyUs';
import '../Styles/PagesStyle/Home.css';

const API = import.meta.env.VITE_API_URL;

const FALLBACK_CONTENT = {
  heroTitle: 'Master Technology, Transform Your Future',
  heroSubtitle: 'Learn from industry experts with AI-powered personalized learning paths designed for your success.',
  features: [
    { title: 'Expert-Led Courses', description: 'Industry professionals teaching real-world skills and best practices.' },
    { title: 'AI Powered Learning', description: 'Personalized learning paths based on your progress and goals.' },
    { title: 'Lifetime Access', description: 'Learn at your own pace with lifetime access to all course materials.' },
    { title: 'Job Assistance', description: 'Career guidance and job placement support from industry mentors.' },
    { title: 'Certifications', description: 'Industry-recognized certificates upon successful course completion.' },
    { title: 'Community Support', description: 'Active community of learners and experts ready to help.' },
  ],
  ctaText: 'Start Your Learning Journey Today',
  ctaLink: '/courses',
  ctaButtonText: 'Get Started Now',
};

const FEATURE_ICONS = [Zap, Globe, BookOpen, TrendingUp, Award, Shield];
const FEATURE_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f87171', '#a78bfa'];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Frontend Developer', text: 'TechBorg completely changed my career. The courses are practical and the mentors are incredibly supportive.', rating: 5, company: 'Google' },
  { name: 'Rahul Verma', role: 'Data Scientist', text: 'The AI-powered learning path helped me focus on exactly what I needed. Got placed within 3 months of completing the course.', rating: 5, company: 'Microsoft' },
  { name: 'Ananya Singh', role: 'Full Stack Engineer', text: 'Best investment I made in my career. The certificate is recognized by top companies and the content is always up to date.', rating: 5, company: 'Amazon' },
];

const TECH_LOGOS = ['React', 'Python', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'TypeScript', 'Kubernetes', 'GraphQL', 'Redis'];

const HOW_IT_WORKS = [
  { icon: UserCheck, color: '#8b5cf6', step: '01', title: 'Create Your Account', desc: 'Sign up in seconds and tell us your learning goals and current skill level.' },
  { icon: Layers, color: '#06b6d4', step: '02', title: 'Pick Your Path', desc: 'Browse curated courses or let our AI recommend the perfect learning path for you.' },
  { icon: Code2, color: '#10b981', step: '03', title: 'Learn & Practice', desc: 'Watch expert lessons, complete hands-on projects, and track your progress in real time.' },
  { icon: Rocket, color: '#f59e0b', step: '04', title: 'Get Certified', desc: 'Earn industry-recognized certificates and unlock career opportunities worldwide.' },
];

const LEVEL_COLORS = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#f87171' };

export default function Home() {
  const [homeContent, setHomeContent] = useState(null);
  const [stats, setStats] = useState({ totalStudents: 0, totalTutors: 0, totalCourses: 0, successRate: '98%' });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [homeRes, usersRes, coursesRes] = await Promise.all([
          fetch(`${API}/api/home`),
          fetch(`${API}/api/auth/users`),
          fetch(`${API}/api/courses`),
        ]);
        const [homeData, usersData, coursesData] = await Promise.all([
          homeRes.ok ? homeRes.json() : null,
          usersRes.ok ? usersRes.json() : [],
          coursesRes.ok ? coursesRes.json() : [],
        ]);
        if (homeData) setHomeContent(homeData);
        setStats({
          totalStudents: Array.isArray(usersData) ? usersData.filter(u => u.role === 'student').length : 0,
          totalTutors: Array.isArray(usersData) ? usersData.filter(u => u.role === 'tutor').length : 0,
          totalCourses: Array.isArray(coursesData) ? coursesData.length : 0,
          successRate: '98%',
        });
        setCourses(Array.isArray(coursesData) ? coursesData.slice(0, 3) : []);
      } catch (err) {
        console.error('Home fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const content = homeContent || FALLBACK_CONTENT;

  if (loading) return (
    <div className="hp-loading">
      <div className="hp-loader" />
      <p>Preparing your experience...</p>
    </div>
  );

  return (
    <>
      <SEO
        title="Master Technology Skills"
        description="TechBorg E-Learning — AI-powered online courses in programming, web development, data science and more."
        url="/"
        keywords="online learning, tech courses, programming, web development, AI courses, certifications India"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'TechBorg Featured Courses',
          url: 'https://techborg.in/courses',
        })}</script>
      </Helmet>

      <div className="hp-wrapper">
        <div className="hp-bg-grid" />

        {/* ── HERO ── */}
        <section className="hp-hero">
          <div className="hp-hero-glow hp-glow-1" />
          <div className="hp-hero-glow hp-glow-2" />
          <div className="hp-hero-glow hp-glow-3" />

          <div className="hp-hero-layout">
            {/* Left: text */}
            <div className="hp-hero-inner">
              <div className="hp-hero-badge">
                <span className="hp-badge-pulse" />
                <span>✨ Start Your Tech Journey</span>
              </div>

              <h1 className="hp-hero-title">
                {content.heroTitle}
                <span className="hp-title-accent">.</span>
              </h1>

              <p className="hp-hero-sub">{content.heroSubtitle}</p>

              <div className="hp-hero-actions">
                <Link to="/courses" className="hp-btn hp-btn-primary">
                  Browse Courses <ArrowRight size={18} />
                  <span className="hp-btn-shine" />
                </Link>
                <Link to="/about" className="hp-btn hp-btn-ghost">
                  <Play size={16} /> Watch Demo
                </Link>
              </div>

              <div className="hp-hero-trust">
                <div className="hp-trust-avatars">
                  {['P','R','A','S','M'].map((l,i) => (
                    <div key={i} className="hp-trust-av" style={{ zIndex: 5-i }}>{l}</div>
                  ))}
                </div>
                <span>Join <strong>{stats.totalStudents > 0 ? `${stats.totalStudents}+` : '...'}</strong> learners already enrolled</span>
              </div>
            </div>

            {/* Right: floating card visual */}
            <div className="hp-hero-visual">
              <div className="hp-visual-card hp-vc-main">
                <div className="hp-vc-header">
                  <div className="hp-vc-dots">
                    <span style={{background:'#f87171'}} />
                    <span style={{background:'#f59e0b'}} />
                    <span style={{background:'#10b981'}} />
                  </div>
                  <span className="hp-vc-title">Learning Dashboard</span>
                </div>
                <div className="hp-vc-body">
                  <div className="hp-vc-course-row">
                    <div className="hp-vc-course-icon" style={{background:'rgba(139,92,246,0.15)'}}>
                      <Code2 size={16} color="#8b5cf6" />
                    </div>
                    <div className="hp-vc-course-info">
                      <span>React Masterclass</span>
                      <div className="hp-vc-bar"><div style={{width:'72%', background:'#8b5cf6'}} /></div>
                    </div>
                    <span className="hp-vc-pct">72%</span>
                  </div>
                  <div className="hp-vc-course-row">
                    <div className="hp-vc-course-icon" style={{background:'rgba(6,182,212,0.15)'}}>
                      <Database size={16} color="#06b6d4" />
                    </div>
                    <div className="hp-vc-course-info">
                      <span>Node.js & MongoDB</span>
                      <div className="hp-vc-bar"><div style={{width:'45%', background:'#06b6d4'}} /></div>
                    </div>
                    <span className="hp-vc-pct">45%</span>
                  </div>
                  <div className="hp-vc-course-row">
                    <div className="hp-vc-course-icon" style={{background:'rgba(16,185,129,0.15)'}}>
                      <Cpu size={16} color="#10b981" />
                    </div>
                    <div className="hp-vc-course-info">
                      <span>Python for AI</span>
                      <div className="hp-vc-bar"><div style={{width:'88%', background:'#10b981'}} /></div>
                    </div>
                    <span className="hp-vc-pct">88%</span>
                  </div>
                </div>
              </div>

              {/* Floating badge: streak */}
              <div className="hp-visual-badge hp-vb-streak">
                <span className="hp-vb-icon">🔥</span>
                <div>
                  <strong>12 Day Streak</strong>
                  <span>Keep it up!</span>
                </div>
              </div>

              {/* Floating badge: certificate */}
              <div className="hp-visual-badge hp-vb-cert">
                <span className="hp-vb-icon">🏆</span>
                <div>
                  <strong>Certificate Earned</strong>
                  <span>React Masterclass</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row below hero layout */}
          <div className="hp-stats-row">
            {[
              { val: stats.totalStudents > 0 ? `${stats.totalStudents}+` : '0+', lbl: 'Active Learners' },
              { val: `${stats.totalCourses}+`, lbl: 'Expert Courses' },
              { val: stats.successRate, lbl: 'Success Rate' },
              { val: stats.totalTutors > 0 ? `${stats.totalTutors}+` : '0+', lbl: 'Expert Tutors' },
            ].map((s, i) => (
              <div key={i} className="hp-stat">
                <span className="hp-stat-val">{s.val}</span>
                <span className="hp-stat-lbl">{s.lbl}</span>
              </div>
            ))}
          </div>

          <div className="hp-scroll-hint">
            <div className="hp-scroll-wheel" />
          </div>
        </section>

        {/* ── TECH LOGOS MARQUEE ── */}
        <div className="hp-marquee-wrap">
          <div className="hp-marquee">
            {[...TECH_LOGOS, ...TECH_LOGOS].map((t, i) => (
              <span key={i} className="hp-marquee-item">{t}</span>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="hp-features">
          <div className="hp-section-head">
            <span className="hp-section-badge"><span className="hp-dot" /> Why Choose Us</span>
            <h2>Everything You Need to Succeed</h2>
            <p>Cutting-edge tools and expert guidance to accelerate your tech career</p>
          </div>

          <div className="hp-features-grid">
            {content.features?.map((f, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              const color = FEATURE_COLORS[i % FEATURE_COLORS.length];
              return (
                <div key={i} className="hp-feature-card" style={{ '--fc': color }}>
                  <div className="hp-feature-icon" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                  <div className="hp-feature-num">{String(i + 1).padStart(2, '0')}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="hp-how">
          <div className="hp-section-head">
            <span className="hp-section-badge"><span className="hp-dot" style={{ background: '#06b6d4' }} /> Process</span>
            <h2>How It Works</h2>
            <p>Four simple steps to launch your tech career</p>
          </div>

          <div className="hp-how-grid">
            {HOW_IT_WORKS.map((h, i) => (
              <div key={i} className="hp-how-card" style={{ '--hc': h.color }}>
                <div className="hp-how-step">{h.step}</div>
                <div className="hp-how-icon" style={{ background: `${h.color}15`, border: `1px solid ${h.color}30` }}>
                  <h.icon size={24} style={{ color: h.color }} />
                </div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && <div className="hp-how-arrow"><ChevronRight size={20} /></div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY US (image cards) ── */}
        <HomeWhyUs />

        {/* ── POPULAR COURSES ── */}
        {courses.length > 0 && (
          <section className="hp-courses">
            <div className="hp-section-head">
              <span className="hp-section-badge"><span className="hp-dot" style={{ background: '#06b6d4' }} /> Popular Courses</span>
              <h2>Start Learning Today</h2>
              <p>Hand-picked courses to get you job-ready fast</p>
            </div>

            <div className="hp-courses-grid">
              {courses.map((c, i) => {
                const lvlColor = LEVEL_COLORS[c.level] || '#8b5cf6';
                return (
                  <Link key={c._id || i} to={`/courses/${c._id}`} className="hp-course-card">
                    <div className="hp-course-thumb">
                      {c.image
                        ? <img src={c.image} alt={c.title} />
                        : <div className="hp-course-thumb-placeholder"><BookOpen size={32} /></div>
                      }
                      <span className="hp-course-level" style={{ background: `${lvlColor}cc` }}>{c.level || 'Beginner'}</span>
                      {c.price === 0 && <span className="hp-course-free-badge">FREE</span>}
                    </div>
                    <div className="hp-course-body">
                      <h3>{c.title}</h3>
                      <p>{c.description?.slice(0, 90)}{c.description?.length > 90 ? '…' : ''}</p>
                      <div className="hp-course-rating">
                        {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#f59e0b" color="#f59e0b" />)}
                        <span>5.0</span>
                      </div>
                      <div className="hp-course-meta">
                        <span><Users size={13} /> {c.instructor || 'Expert'}</span>
                        {c.price != null && (
                          <span className="hp-course-price">
                            {c.price === 0 ? 'Free' : `₹${c.price}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="hp-courses-cta">
              <Link to="/courses" className="hp-btn hp-btn-outline">
                View All Courses <ChevronRight size={16} />
              </Link>
            </div>
          </section>
        )}

        {/* ── STATS BANNER ── */}
        <div className="hp-stats-banner">
          <div className="hp-stats-banner-glow" />
          <div className="hp-stats-banner-inner">
            {[
              { icon: BarChart2, color: '#8b5cf6', val: '98%', lbl: 'Completion Rate' },
              { icon: Clock, color: '#06b6d4', val: '200+', lbl: 'Hours of Content' },
              { icon: MessageSquare, color: '#10b981', val: '24/7', lbl: 'Mentor Support' },
              { icon: Globe, color: '#f59e0b', val: '30+', lbl: 'Countries Reached' },
            ].map((s, i) => (
              <div key={i} className="hp-sb-item">
                <div className="hp-sb-icon" style={{ background: `${s.color}15` }}>
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
                <div>
                  <strong style={{ color: s.color }}>{s.val}</strong>
                  <span>{s.lbl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TESTIMONIALS ── */}
        <section className="hp-testimonials">
          <div className="hp-section-head">
            <span className="hp-section-badge"><span className="hp-dot" style={{ background: '#10b981' }} /> Student Stories</span>
            <h2>What Our Learners Say</h2>
            <p>Real results from real students across the globe</p>
          </div>

          <div className="hp-testimonial-track">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`hp-testimonial-card${i === activeTestimonial ? ' active' : ''}`}>
                <div className="hp-testimonial-top">
                  <div className="hp-testimonial-stars">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span className="hp-testimonial-company">{t.company}</span>
                </div>
                <p className="hp-testimonial-text">"{t.text}"</p>
                <div className="hp-testimonial-author">
                  <div className="hp-testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hp-testimonial-dots">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`hp-dot-btn${i === activeTestimonial ? ' active' : ''}`}
                onClick={() => setActiveTestimonial(i)} />
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="hp-cta">
          <div className="hp-cta-glow" />
          <div className="hp-cta-inner">
            <div className="hp-cta-badge">
              <span className="hp-badge-pulse" /> Ready to Start?
            </div>
            <h2>{content.ctaText}</h2>
            <p>Join thousands of learners transforming their careers with industry-leading courses and mentorship.</p>

            <div className="hp-cta-actions">
              <Link to={content.ctaLink} className="hp-btn hp-btn-primary hp-btn-lg">
                {content.ctaButtonText} <ArrowRight size={20} />
                <span className="hp-btn-shine" />
              </Link>
              <Link to="/courses" className="hp-btn hp-btn-ghost">
                Browse Courses
              </Link>
            </div>

            <div className="hp-cta-checks">
              {['No credit card required', 'Cancel anytime', '14-day free trial'].map((c, i) => (
                <span key={i}><CheckCircle size={15} /> {c}</span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
