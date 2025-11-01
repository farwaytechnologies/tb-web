import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../Styles/PagesStyle/JobAlert.css';

const JobAlert = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('https://tb-back-fyvj.onrender.com/api/jobs');
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job alerts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="jobalert-page">
        <Helmet>
          <title>Loading Jobs - TechBorg</title>
          <meta name="description" content="Browse available job opportunities at TechBorg E-Learning." />
          <meta name="keywords" content="jobs, careers, tech jobs, opportunities" />
        </Helmet>
        <div className="jobalert-container">
          <div className="jobalert-loading-wrapper">
            <div className="jobalert-spinner"></div>
            <p className="jobalert-loading-text">Loading job listings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobalert-page">
        <Helmet>
          <title>Error - TechBorg Jobs</title>
          <meta name="description" content="Browse available job opportunities at TechBorg E-Learning." />
        </Helmet>
        <div className="jobalert-container">
          <div className="jobalert-error-wrapper">
            <div className="jobalert-error-icon">⚠️</div>
            <p className="jobalert-error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jobalert-page">
      <Helmet>
        <title>Job Alerts - TechBorg E-Learning</title>
        <meta name="description" content="Browse and apply for available job opportunities at TechBorg E-Learning. Join our team of innovative educators and technologists." />
        <meta name="keywords" content="jobs, careers, tech jobs, opportunities, employment, hiring" />
      </Helmet>

      <div className="jobalert-container">
        <div className="jobalert-header">
          <h1 className="jobalert-heading">
            Available <span className="jobalert-highlight">Job Opportunities</span>
          </h1>
          <p className="jobalert-subheading">Join our team and shape the future of education</p>
        </div>

        {jobs.length === 0 ? (
          <div className="jobalert-empty-wrapper">
            <div className="jobalert-empty-icon">📭</div>
            <p className="jobalert-empty-text">No job alerts available at the moment.</p>
            <p className="jobalert-empty-subtext">Check back soon for new opportunities!</p>
          </div>
        ) : (
          <div className="jobalert-list">
            {jobs.map((job, index) => (
              <div 
                key={job._id} 
                className="jobalert-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="jobalert-card-header">
                  <h2 className="jobalert-title">{job.title}</h2>
                  <span className="jobalert-badge">{job.level}</span>
                </div>
                
                <p className="jobalert-description">{job.description}</p>
                
                <div className="jobalert-info">
                  <div className="jobalert-info-item">
                    <svg className="jobalert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{job.location}</span>
                  </div>
                  <div className="jobalert-info-item">
                    <svg className="jobalert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    <span>{job.level} Level</span>
                  </div>
                </div>
                
                <div className="jobalert-action">
                  <Link to={`/apply/${job._id}`} className="jobalert-apply-btn">
                    <span>Apply Now</span>
                    <svg className="jobalert-btn-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAlert;