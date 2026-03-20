import React, { useEffect, useState } from 'react';
import { Loader, Target, Eye, Heart, Users, BookOpen, Award, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import '../Styles/PagesStyle/About.css';
import SEO from '../Components/SEO';

const API = import.meta.env.VITE_API_URL;

const STATS_FALLBACK = [
  { value: '—', label: 'Students Enrolled' },
  { value: '—', label: 'Courses Available' },
  { value: '—', label: 'Expert Tutors' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const VALUES = [
  { icon: Target,   color: '#8b5cf6', title: 'Excellence',   desc: 'We hold ourselves to the highest standards in every course, mentor, and learning experience we deliver.' },
  { icon: Heart,    color: '#ec4899', title: 'Accessibility', desc: 'Quality education should be available to everyone, regardless of background or location.' },
  { icon: Zap,      color: '#f59e0b', title: 'Innovation',    desc: 'We continuously evolve our platform and curriculum to stay ahead of the rapidly changing tech landscape.' },
  { icon: Users,    color: '#10b981', title: 'Community',     desc: 'Learning is better together. We foster a supportive community of students, tutors, and industry professionals.' },
  { icon: Globe,    color: '#06b6d4', title: 'Impact',        desc: 'Every skill learned here translates to real-world impact — in careers, businesses, and communities.' },
  { icon: Award,    color: '#f87171', title: 'Integrity',     desc: 'Honest, transparent, and ethical in everything we do — from content quality to student outcomes.' },
];

const TEAM = [
  { name: 'Shaun Sebastian',   role: 'Founder',        initial: 'S', color: '#8b5cf6' },
  { name: 'Sudheesh Sudhan',     role: 'Founder Associate',   initial: 'S', color: '#ec4899' },
  { name: 'Mahesh MB',    role: 'Founder Associate',         initial: 'M', color: '#10b981' },
  { name: 'Anil B',    role: 'Devloper',     initial: 'A', color: '#f59e0b' },
];

const WHY_ITEMS = [
  'Industry-aligned curriculum updated every quarter',
  'Live mentorship sessions with working professionals',
  'Project-based learning with real-world case studies',
  'Lifetime access to course materials and updates',
  'Certificate programs recognized by top companies',
  'Dedicated student support 7 days a week',
];

export default function About() {
  const [aboutData, setAboutData] = useState(null);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/about`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API}/api/about/stats`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([about, s]) => {
      setAboutData(about);
      setStats(s);
      setLoading(false);
    });
  }, []);

  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K+` : `${n}+`;

  const STATS = stats ? [
    { value: fmt(stats.totalStudents), label: 'Students Enrolled' },
    { value: `${stats.totalCourses}+`, label: 'Courses Available' },
    { value: `${stats.totalTutors}+`,  label: 'Expert Tutors' },
    { value: '95%',                    label: 'Satisfaction Rate' },
  ] : STATS_FALLBACK;

  if (loading) {
    return (
      <div className="ab-loading">
        <Loader size={36} className="ab-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="ab-page">
      <SEO
        title="About Us"
        description="Learn about TechBorg E-Learning — our mission, vision, values, and the team behind India's growing tech education platform."
        url="/about"
        keywords="about TechBorg, e-learning mission, tech education India, online learning platform"
      />

      {/* ── Hero ── */}
      <section className="ab-hero">
        <div className="ab-hero-glow ab-hero-glow--1" />
        <div className="ab-hero-glow ab-hero-glow--2" />
        <div className="ab-hero-inner">
          <span className="ab-badge">About TechBorg</span>
          <h1 className="ab-hero-title">
            Empowering the Next<br />
            <span className="ab-gradient-text">Generation of Builders</span>
          </h1>
          <p className="ab-hero-sub">
            {aboutData?.description ||
              'TechBorg is India\'s fastest-growing tech education platform, connecting ambitious learners with world-class mentors and industry-ready skills.'}
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="ab-stats">
        {STATS.map((s, i) => (
          <div key={i} className="ab-stat">
            <span className="ab-stat-val">{s.value}</span>
            <span className="ab-stat-lbl">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Mission & Vision ── */}
      <section className="ab-mv">
        <div className="ab-mv-card ab-mv-card--mission">
          <div className="ab-mv-icon" style={{ background: 'rgba(139,92,246,0.15)' }}>
            <Target size={24} color="#8b5cf6" />
          </div>
          <h2>Our Mission</h2>
          <p>To democratize world-class tech education by making it affordable, accessible, and deeply practical — so every learner can build a career they're proud of.</p>
        </div>
        <div className="ab-mv-card ab-mv-card--vision">
          <div className="ab-mv-icon" style={{ background: 'rgba(6,182,212,0.15)' }}>
            <Eye size={24} color="#06b6d4" />
          </div>
          <h2>Our Vision</h2>
          <p>A world where geography, background, or financial status never limits someone's ability to learn, grow, and contribute to the global tech ecosystem.</p>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="ab-story">
        <div className="ab-story-text">
          <span className="ab-section-badge">Our Story</span>
          <h2>Built by learners,<br />for learners</h2>
          <p>TechBorg started in 2021 when a group of engineers and educators noticed a gap — students were graduating without the practical skills companies actually needed. We built TechBorg to bridge that gap.</p>
          <p>Today we serve thousands of students across India with structured learning paths, live mentorship, and a community that genuinely cares about your growth.</p>
          <a href="/courses" className="ab-cta-link">Explore Courses <ArrowRight size={16} /></a>
        </div>
        <div className="ab-story-visual">
          <div className="ab-story-card">
            <BookOpen size={32} color="#8b5cf6" />
            <strong>Structured Learning</strong>
            <p>Curated paths from beginner to job-ready</p>
          </div>
          <div className="ab-story-card">
            <Users size={32} color="#10b981" />
            <strong>Live Mentorship</strong>
            <p>1-on-1 sessions with industry professionals</p>
          </div>
          <div className="ab-story-card">
            <Award size={32} color="#f59e0b" />
            <strong>Certifications</strong>
            <p>Recognized credentials that open doors</p>
          </div>
          <div className="ab-story-card">
            <Zap size={32} color="#ec4899" />
            <strong>Career Support</strong>
            <p>Resume reviews, mock interviews & job alerts</p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="ab-values">
        <div className="ab-section-head">
          <span className="ab-section-badge">What We Stand For</span>
          <h2>Our Core Values</h2>
        </div>
        <div className="ab-values-grid">
          {VALUES.map((v, i) => (
            <div key={i} className="ab-value-card">
              <div className="ab-value-icon" style={{ background: `${v.color}18` }}>
                <v.icon size={20} color={v.color} />
              </div>
              <h3 style={{ color: v.color }}>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why TechBorg ── */}
      <section className="ab-why">
        <div className="ab-section-head">
          <span className="ab-section-badge">Why Choose Us</span>
          <h2>What makes TechBorg different</h2>
        </div>
        <div className="ab-why-grid">
          {WHY_ITEMS.map((item, i) => (
            <div key={i} className="ab-why-item">
              <CheckCircle size={18} color="#8b5cf6" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="ab-team">
        <div className="ab-section-head">
          <span className="ab-section-badge">The People</span>
          <h2>Meet the Team</h2>
        </div>
        <div className="ab-team-grid">
          {TEAM.map((m, i) => (
            <div key={i} className="ab-team-card">
              <div className="ab-team-avatar" style={{ background: `${m.color}20`, border: `2px solid ${m.color}40` }}>
                <span style={{ color: m.color }}>{m.initial}</span>
              </div>
              <h3>{m.name}</h3>
              <p style={{ color: m.color }}>{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ab-cta">
        <div className="ab-cta-glow" />
        <h2>Ready to start learning?</h2>
        <p>Join thousands of students already building their future with TechBorg.</p>
        <div className="ab-cta-btns">
          <a href="/courses" className="ab-btn ab-btn--primary">Browse Courses</a>
          <a href="/contact" className="ab-btn ab-btn--ghost">Get in Touch</a>
        </div>
      </section>
    </div>
  );
}
