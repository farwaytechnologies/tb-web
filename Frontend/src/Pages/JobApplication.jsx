import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/PagesStyle/JobApplication.css';
import SEO from '../Components/SEO';

const API = import.meta.env.VITE_API_URL;

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    setCourses(['Web Development', 'Data Science', 'UI/UX Design', 'Cybersecurity', 'Mobile Development', 'Cloud Computing']);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'resume' && files[0]) {
      setFormData((prev) => ({
        ...prev,
        resume: files[0],
      }));
      setFileName(files[0].name);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    const data = new FormData();
    data.append('jobId', jobId);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('experience', formData.experience);
    data.append('course', formData.course);
    data.append('resume', formData.resume);

    try {
      const res = await fetch(`${API}/api/applications`, {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Failed to submit');

      setSuccessMessage('Application submitted successfully! We will contact you soon.');
      setFormData({ name: '', email: '', experience: '', course: '', resume: null });
      setFileName('');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/jobs');
      }, 3000);
    } catch (err) {
      setErrorMessage('Failed to submit application. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="jobapp-page">
      <SEO
        title="Apply for a Job"
        description="Submit your job application to TechBorg E-Learning. Join our team of educators, developers, and innovators."
        url="/apply"
        noindex
      />

      <div className="jobapp-container">
        <div className="jobapp-header">
          <h1 className="jobapp-heading">
            Job <span className="jobapp-highlight">Application Form</span>
          </h1>
          <p className="jobapp-subheading">Fill in your details to apply for this position</p>
        </div>

        <div className="jobapp-form-wrapper">
          <form className="jobapp-form" onSubmit={handleSubmit}>
            <div className="jobapp-form-group">
              <label className="jobapp-label" htmlFor="name">
                <svg className="jobapp-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                className="jobapp-input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="jobapp-form-group">
              <label className="jobapp-label" htmlFor="email">
                <svg className="jobapp-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="jobapp-input"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="jobapp-form-group">
              <label className="jobapp-label" htmlFor="course">
                <svg className="jobapp-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                Select Course
              </label>
              <select 
                id="course"
                name="course" 
                className="jobapp-select" 
                value={formData.course} 
                onChange={handleChange} 
                required
              >
                <option value="">Choose your specialization</option>
                {courses.map((course, idx) => (
                  <option key={idx} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div className="jobapp-form-group">
              <label className="jobapp-label" htmlFor="experience">
                <svg className="jobapp-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                Years of Experience
              </label>
              <input
                id="experience"
                type="number"
                name="experience"
                className="jobapp-input"
                placeholder="Enter years of experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                max="50"
                required
              />
            </div>

            <div className="jobapp-form-group">
              <label className="jobapp-label">
                <svg className="jobapp-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                  <polyline points="13 2 13 9 20 9"/>
                </svg>
                Upload Resume
              </label>
              <div className="jobapp-file-wrapper">
                <input
                  type="file"
                  name="resume"
                  id="resume"
                  className="jobapp-file-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="resume" className="jobapp-file-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {fileName || 'Choose file (PDF, DOC, DOCX)'}
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="jobapp-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="jobapp-btn-spinner"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            {successMessage && (
              <div className="jobapp-alert jobapp-success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="jobapp-alert jobapp-error">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;