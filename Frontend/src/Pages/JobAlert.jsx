import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/PagesStyle/JobAlert.css';

const JobAlert = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/jobs');
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

  return (
    <div className="jobalert-page">
      <div className="jobalert-container">
        <h1 className="jobalert-heading">Available Job Alerts</h1>

        {loading ? (
          <p className="jobalert-loading">Loading job listings...</p>
        ) : error ? (
          <p className="jobalert-error">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="jobalert-empty">No job alerts available at the moment.</p>
        ) : (
          <div className="jobalert-list">
            {jobs.map((job) => (
              <div key={job._id} className="jobalert-card">
                <h2 className="jobalert-title">{job.title}</h2>
                <p className="jobalert-description">{job.description}</p>
                <div className="jobalert-info">
                  <span><strong>Location:</strong> {job.location}</span>
                  <span><strong>Level:</strong> {job.level}</span>
                </div>
                <div className="jobalert-action">
                  <Link to={`/apply/${job._id}`} className="jobalert-apply-btn">Apply Now</Link>
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
