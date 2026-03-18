import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Home.css';
import { Link } from 'react-router-dom';
import HomeWhyUs from '../Home/HomeWhyUs';
import { Helmet } from 'react-helmet';
import SEO from '../Components/SEO';

function Home() {
  const [homeContent, setHomeContent] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    successRate: '98%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch home content from API
        const homeRes = await fetch('https://tb-back-fyvj.onrender.com/api/home');
        if (!homeRes.ok) throw new Error('Failed to fetch home content');
        const homeData = await homeRes.json();
        setHomeContent(homeData);

        // Fetch total students
        const usersRes = await fetch('https://tb-back-fyvj.onrender.com/api/auth/users');
        if (!usersRes.ok) throw new Error('Failed to fetch users');
        const usersData = await usersRes.json();
        const studentCount = usersData.filter(user => user.role === 'student').length;

        // Fetch total courses
        const coursesRes = await fetch('https://tb-back-fyvj.onrender.com/api/courses');
        if (!coursesRes.ok) throw new Error('Failed to fetch courses');
        const coursesData = await coursesRes.json();
        const courseCount = coursesData.length;

        setStats({
          totalStudents: studentCount,
          totalCourses: courseCount,
          successRate: '98%'
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        // Set default values if fetch fails
        setStats({
          totalStudents: 50,
          totalCourses: 200,
          successRate: '98%'
        });
        setHomeContent({
          heroTitle: 'Master Technology, Transform Your Future',
          heroSubtitle: 'Learn from industry experts with AI-powered personalized learning paths designed for your success',
          features: [
            { title: 'Expert-Led Courses', description: 'Industry professionals teaching real-world skills and best practices' },
            { title: 'AI Powered Learning', description: 'Personalized learning paths based on your progress and goals' },
            { title: 'Lifetime Access', description: 'Learn at your own pace with lifetime access to all course materials' },
            { title: 'Job Assistance', description: 'Career guidance and job placement support from industry mentors' },
            { title: 'Certifications', description: 'Industry-recognized certificates upon successful course completion' },
            { title: 'Community Support', description: 'Active community of learners and experts ready to help' }
          ],
          ctaText: 'Start Your Learning Journey Today',
          ctaLink: '/courses',
          ctaButtonText: 'Get Started Now'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="homepage-loading">
        <div className="homepage-loader-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className="homepage-loading-text">Preparing your experience...</p>
      </div>
    );
  }

  if (!homeContent) {
    return (
      <div className="homepage-loading">
        <p className="homepage-loading-text">Unable to load content. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Master Technology Skills"
        description="TechBorg E-Learning — AI-powered online courses in programming, web development, data science and more. Join thousands of learners transforming their careers."
        url="/"
        keywords="online learning, tech courses, programming, python, javascript, web development, AI courses, certifications India"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "TechBorg Featured Courses",
          "url": "https://techborg.in/courses"
        })}</script>
      </Helmet>

      <div className="homepage-wrapper">
        {/* Animated Background Grid */}
        <div className="homepage-bg-grid"></div>
        
        {/* Hero Section */}
        <section className="homepage-hero">
          <div className="homepage-hero-bg">
            <div className="homepage-gradient-sphere homepage-sphere-1"></div>
            <div className="homepage-gradient-sphere homepage-sphere-2"></div>
            <div className="homepage-gradient-sphere homepage-sphere-3"></div>
            <div className="homepage-floating-particles">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="homepage-particle" 
                  style={{
                    '--x': `${Math.random() * 100}%`,
                    '--y': `${Math.random() * 100}%`,
                    '--delay': `${Math.random() * 5}s`,
                    '--duration': `${15 + Math.random() * 10}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className="homepage-hero-container">
            <div className="homepage-hero-badge">
              <span className="homepage-badge-icon">✨</span>
              <span>Start Your Tech Journey</span>
              <div className="homepage-badge-glow"></div>
            </div>

            <h1 className="homepage-hero-title">
              {homeContent.heroTitle}
              <span className="homepage-title-gradient">.</span>
            </h1>

            <p className="homepage-hero-subtitle">{homeContent.heroSubtitle}</p>

            <div className="homepage-hero-actions">
              <Link to="/courses" className="homepage-btn homepage-btn-primary">
                <span className="homepage-btn-text">Browse Courses</span>
                <span className="homepage-btn-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="homepage-btn-shine"></div>
              </Link>

              <Link to="/about" className="homepage-btn homepage-btn-secondary">
                <span className="homepage-btn-text">Learn More</span>
                <span className="homepage-btn-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </span>
              </Link>
            </div>

            <div className="homepage-hero-stats">
              <div className="homepage-stat">
                <div className="homepage-stat-number">{stats.totalStudents}+</div>
                <div className="homepage-stat-label">Active Learners</div>
              </div>
              <div className="homepage-stat-divider"></div>
              <div className="homepage-stat">
                <div className="homepage-stat-number">{stats.totalCourses}+</div>
                <div className="homepage-stat-label">Expert Courses</div>
              </div>
              <div className="homepage-stat-divider"></div>
              <div className="homepage-stat">
                <div className="homepage-stat-number">{stats.successRate}</div>
                <div className="homepage-stat-label">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="homepage-scroll-indicator">
            <div className="homepage-scroll-wheel"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="homepage-features">
          <div className="homepage-features-container">
            <div className="homepage-section-header">
              <span className="homepage-section-badge">
                <span className="homepage-badge-dot"></span>
                Why Choose Us
              </span>
              <h2 className="homepage-section-title">Why Learn with TechBorg?</h2>
              <p className="homepage-section-description">
                Everything you need to accelerate your tech career with cutting-edge tools and expert guidance
              </p>
            </div>

            <div className="homepage-features-grid">
              {homeContent.features?.map((feature, index) => (
                <div className="homepage-feature-card" key={index}>
                  <div className="homepage-feature-border"></div>
                  <div className="homepage-feature-glow"></div>
                  
                  <div className="homepage-feature-icon-wrapper">
                    <div className="homepage-feature-icon-bg"></div>
                    <span className="homepage-feature-number">{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  <h3 className="homepage-feature-title">{feature.title}</h3>
                  <p className="homepage-feature-description">{feature.description}</p>

                  <div className="homepage-feature-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HomeWhyUs />

        {/* Call to Action */}
        <section className="homepage-cta">
          <div className="homepage-cta-bg">
            <div className="homepage-cta-gradient"></div>
            <div className="homepage-cta-pattern"></div>
          </div>

          <div className="homepage-cta-container">
            <div className="homepage-cta-content">
              <div className="homepage-cta-badge">
                <span className="homepage-cta-badge-pulse"></span>
                Ready to Start?
              </div>
              
              <h2 className="homepage-cta-title">{homeContent.ctaText}</h2>
              <p className="homepage-cta-subtitle">
                Join thousands of learners transforming their careers with industry-leading courses and mentorship
              </p>

              <Link to={homeContent.ctaLink} className="homepage-cta-btn">
                <span className="homepage-cta-btn-text">{homeContent.ctaButtonText}</span>
                <span className="homepage-cta-btn-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="homepage-cta-btn-glow"></div>
              </Link>

              <div className="homepage-cta-features">
                <div className="homepage-cta-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  No credit card required
                </div>
                <div className="homepage-cta-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Cancel anytime
                </div>
                <div className="homepage-cta-feature">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  14-day free trial
                </div>
              </div>
            </div>

            <div className="homepage-cta-visual">
              <div className="homepage-cta-card homepage-cta-card-1">
                <div className="homepage-cta-card-icon">🎓</div>
                <div className="homepage-cta-card-title">Expert Courses</div>
              </div>
              <div className="homepage-cta-card homepage-cta-card-2">
                <div className="homepage-cta-card-icon">⚡</div>
                <div className="homepage-cta-card-title">Fast Learning</div>
              </div>
              <div className="homepage-cta-card homepage-cta-card-3">
                <div className="homepage-cta-card-icon">🏆</div>
                <div className="homepage-cta-card-title">Certificates</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;