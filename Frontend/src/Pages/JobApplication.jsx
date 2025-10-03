import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/PagesStyle/JobApplication.css';

const JobApplication = () => {
  const { jobId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    course: '',
    resume: null,
  });

  const [courses, setCourses] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setCourses(['Web Development', 'Data Science', 'UI/UX Design', 'Cybersecurity']);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'resume' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const data = new FormData();
    data.append('jobId', jobId);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('experience', formData.experience);
    data.append('course', formData.course);
    data.append('resume', formData.resume);

    try {
      const res = await fetch('https://tb-back-fyvj.onrender.com/api/applications', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Failed to submit');

      setSuccessMessage('Application submitted successfully!');
      setFormData({ name: '', email: '', experience: '', course: '', resume: null });
    } catch (err) {
      setErrorMessage('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="jobapp-page">
      <div className="jobapp-container">
        <h1 className="jobapp-heading">Job Application Form</h1>
        <form className="jobapp-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <select name="course" value={formData.course} onChange={handleChange} required>
            <option value="">Select Course</option>
            {courses.map((course, idx) => (
              <option key={idx} value={course}>{course}</option>
            ))}
          </select>

          <input
            type="number"
            name="experience"
            placeholder="Years of Experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            required
          />

          <label className="jobapp-upload">
            Upload Resume:
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Submit Application</button>

          {successMessage && <p className="jobapp-success">{successMessage}</p>}
          {errorMessage && <p className="jobapp-error">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default JobApplication;
