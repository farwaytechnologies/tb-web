import React, { useState, useEffect } from 'react';
import '../Styles/DashbordStyle/AdminAddJob.css';

const AdminAddJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    level: '',
  });

  const [jobs, setJobs] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Error loading jobs:', err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add job');
      }

      await res.json();
      setSuccessMessage('✅ Job added successfully!');
      setFormData({ title: '', description: '', location: '', level: '' });
      fetchJobs();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/api/jobs/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete job');
      }

      setSuccessMessage('🗑️ Job deleted successfully!');
      fetchJobs();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="adminjob-container">
      <div className="adminjob-box">
        <h2 className="adminjob-title">Post a New Job Alert</h2>

        <form className="adminjob-form" onSubmit={handleSubmit}>
          <div className="adminjob-field">
            <label htmlFor="title">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. React Developer"
            />
          </div>

          <div className="adminjob-field">
            <label htmlFor="description">Job Description</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Brief about the role..."
            ></textarea>
          </div>

          <div className="adminjob-row">
            <div className="adminjob-field">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote, Bangalore"
              />
            </div>

            <div className="adminjob-field">
              <label htmlFor="level">Job Level</label>
              <input
                type="text"
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                placeholder="e.g. Beginner, Mid, Senior"
              />
            </div>
          </div>

          <button type="submit" className="adminjob-submit">Add Job</button>

          {successMessage && <p className="adminjob-success">{successMessage}</p>}
          {errorMessage && <p className="adminjob-error">{errorMessage}</p>}
        </form>
      </div>

      {/* Job List Section */}
      <div className="adminjob-list-section">
        <h3 className="adminjob-subtitle">All Posted Jobs</h3>
        {jobs.length === 0 ? (
          <p className="adminjob-empty">No jobs available.</p>
        ) : (
          <ul className="adminjob-list">
            {jobs.map(job => (
              <li key={job._id} className="adminjob-item">
                <div>
                  <strong>{job.title}</strong> - {job.location || 'N/A'} ({job.level || 'Any'})
                </div>
                <button className="adminjob-delete" onClick={() => handleDelete(job._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminAddJob;
