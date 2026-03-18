import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/PagesStyle/JobAlert.css';
import SEO from '../Components/SEO';

const API = import.meta.env.VITE_API_URL;

const JobAlert = () => {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeLevel, setActiveLevel] = useState('All');

  useEffect(() => {
    fetch(`${API}/api/jobs`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setJobs(data); setFiltered(data); })
      .catch(() => setError('Failed to load job listings.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = jobs;
    if (activeLevel !== 'All') result = result.filter(j => j.level === activeLevel);
    if (search.trim()) result = result.filter(j =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, activeLevel, jobs]);

  const levels = ['All', ...new Set(jobs.map(j => j.level).filter(Boolean))];

  return (
    <div className="ja-page">
      <SEO
        title="Job Alerts - Careers at TechBorg"
        description="Browse open positions at TechBorg E-Learning. We're hiring educators, developers, and innovators. Apply today."
        url="/job-alerts"
        keywords="TechBorg jobs, tech careers, e-learning jobs, hiring, job openings India"
      />

      {/* Hero */}
      <section className="ja-hero">
        <div className="ja-hero-inner">
          <span className="ja-hero-badge">We're Hiring</span>
          <h1>Find Your Next <span className="ja-accent">Opportunity</span></h1>
          <p>Join our team of educators and technologists shaping the future of learning.</p>
          <div className="ja-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by title, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="ja-body">
        {/* Filter tabs */}
        <div className="ja-tabs">
          {levels.map(l => (
            <button
              key={l}
              className={`ja-tab${activeLevel === l ? ' active' : ''}`}
              onClick={() => setActiveLevel(l)}
            >{l}</button>
          ))}
        </div>

        {loading ? (
          <div className="ja-state"><div className="ja-spinner" /><p>Loading jobs...</p></div>
        ) : error ? (
          <div className="ja-state ja-error"><span>⚠️</span><p>{error}</p></div>
        ) : filtered.length === 0 ? (
          <div className="ja-state"><span>📭</span><p>No jobs found.</p></div>
        ) : (
          <div className="ja-grid">
            {filtered.map((job, i) => (
              <div key={job._id} className="ja-card" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="ja-card-top">
                  <div className="ja-card-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <div className="ja-badges">
                    {job.level && <span className="ja-badge-level">{job.level}</span>}
                  </div>
                </div>
                <h2 className="ja-card-title">{job.title}</h2>
                <p className="ja-card-desc">{job.description}</p>
                <div className="ja-card-meta">
                  {job.location && (
                    <span className="ja-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {job.location}
                    </span>
                  )}
                </div>
                <Link to={`/apply/${job._id}`} className="ja-apply-btn">
                  Apply Now
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAlert;
