import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Mail, Briefcase, BookOpen, FileText, ArrowLeft, CheckCircle, Upload, MapPin, BarChart2, Send } from 'lucide-react';
import '../Styles/PagesStyle/JobApplication.css';
import SEO from '../Components/SEO';

const API = import.meta.env.VITE_API_URL;

const COURSES = [
  'Web Development', 'Data Science', 'UI/UX Design',
  'Cybersecurity', 'Mobile Development', 'Cloud Computing',
  'Machine Learning', 'DevOps', 'Blockchain', 'Other',
];

export default function JobApplication() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);

  const [form, setForm] = useState({
    name: '', email: '', experience: '', course: '', coverLetter: '', resume: null,
  });
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name || user.email) {
      setForm(f => ({ ...f, name: user.name || '', email: user.email || '' }));
    }
  }, []);

  // Fetch job details
  useEffect(() => {
    if (!jobId) return;
    fetch(`${API}/api/jobs/${jobId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setJob(data); })
      .catch(() => {})
      .finally(() => setJobLoading(false));
  }, [jobId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = file => {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { setError('Only PDF, DOC, DOCX files are accepted.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
    setError('');
    setForm(f => ({ ...f, resume: file }));
    setFileName(file.name);
  };

  const handleFileInput = e => handleFile(e.target.files[0]);
  const handleDrop = e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.resume) { setError('Please upload your resume.'); return; }
    setError('');
    setSubmitting(true);

    const data = new FormData();
    data.append('jobId', jobId);
    data.append('name', form.name);
    data.append('email', form.email);
    data.append('experience', form.experience);
    data.append('course', form.course);
    data.append('coverLetter', form.coverLetter);
    data.append('resume', form.resume);

    try {
      const res = await fetch(`${API}/api/applications`, { method: 'POST', body: data });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="jap-page">
        <div className="jap-success-screen">
          <div className="jap-success-icon"><CheckCircle size={56} /></div>
          <h2>Application Submitted!</h2>
          <p>Thanks <strong>{form.name}</strong>, we've received your application{job ? ` for <strong>${job.title}</strong>` : ''}. We'll be in touch soon.</p>
          <div className="jap-success-actions">
            <Link to="/jobs" className="jap-btn-outline"><ArrowLeft size={16} /> Browse More Jobs</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jap-page">
      <SEO
        title={job ? `Apply – ${job.title}` : 'Job Application'}
        description="Submit your application to join the TechBorg team."
        url={`/apply/${jobId}`}
        noindex
      />

      <div className="jap-container">
        {/* Back */}
        <Link to="/jobs" className="jap-back"><ArrowLeft size={16} /> Back to Jobs</Link>

        <div className="jap-layout">
          {/* Left: Job Info Panel */}
          <aside className="jap-sidebar">
            <div className="jap-job-card">
              <div className="jap-job-icon"><Briefcase size={28} /></div>
              {jobLoading ? (
                <div className="jap-skeleton-wrap">
                  <div className="jap-skeleton jap-sk-title" />
                  <div className="jap-skeleton jap-sk-line" />
                  <div className="jap-skeleton jap-sk-line short" />
                </div>
              ) : job ? (
                <>
                  <h2 className="jap-job-title">{job.title}</h2>
                  <div className="jap-job-meta">
                    {job.location && <span><MapPin size={13} />{job.location}</span>}
                    {job.level && <span><BarChart2 size={13} />{job.level}</span>}
                  </div>
                  {job.description && <p className="jap-job-desc">{job.description}</p>}
                </>
              ) : (
                <p className="jap-job-desc">Job details unavailable.</p>
              )}
            </div>

            <div className="jap-tips">
              <h3>Application Tips</h3>
              <ul>
                <li>Keep your resume under 5 MB (PDF preferred)</li>
                <li>Tailor your cover letter to the role</li>
                <li>Double-check your email address</li>
                <li>Mention relevant projects or experience</li>
              </ul>
            </div>
          </aside>

          {/* Right: Form */}
          <div className="jap-form-wrap">
            <div className="jap-form-header">
              <h1>Apply for this Position</h1>
              <p>Fill in the details below and attach your resume.</p>
            </div>

            <form className="jap-form" onSubmit={handleSubmit} noValidate>
              <div className="jap-row">
                <div className="jap-field">
                  <label htmlFor="name"><User size={15} /> Full Name</label>
                  <input id="name" name="name" type="text" placeholder="Your full name"
                    value={form.name} onChange={handleChange} required />
                </div>
                <div className="jap-field">
                  <label htmlFor="email"><Mail size={15} /> Email Address</label>
                  <input id="email" name="email" type="email" placeholder="you@example.com"
                    value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="jap-row">
                <div className="jap-field">
                  <label htmlFor="experience"><Briefcase size={15} /> Years of Experience</label>
                  <input id="experience" name="experience" type="number" placeholder="e.g. 3"
                    value={form.experience} onChange={handleChange} min="0" max="50" required />
                </div>
                <div className="jap-field">
                  <label htmlFor="course"><BookOpen size={15} /> Specialization</label>
                  <select id="course" name="course" value={form.course} onChange={handleChange} required>
                    <option value="">Select your field</option>
                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="jap-field full">
                <label htmlFor="coverLetter"><FileText size={15} /> Cover Letter <span className="jap-optional">(optional)</span></label>
                <textarea id="coverLetter" name="coverLetter" rows={5}
                  placeholder="Tell us why you're a great fit for this role..."
                  value={form.coverLetter} onChange={handleChange} />
              </div>

              {/* File Upload */}
              <div className="jap-field full">
                <label><Upload size={15} /> Resume <span className="jap-req">*</span></label>
                <div
                  className={`jap-dropzone${dragOver ? ' drag' : ''}${fileName ? ' has-file' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('resume-input').click()}
                >
                  <input id="resume-input" type="file" accept=".pdf,.doc,.docx"
                    onChange={handleFileInput} style={{ display: 'none' }} />
                  {fileName ? (
                    <div className="jap-file-chosen">
                      <FileText size={20} />
                      <span>{fileName}</span>
                      <button type="button" className="jap-file-clear"
                        onClick={e => { e.stopPropagation(); setFileName(''); setForm(f => ({ ...f, resume: null })); }}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="jap-drop-hint">
                      <Upload size={28} />
                      <p>Drag & drop or <span>browse</span></p>
                      <small>PDF, DOC, DOCX — max 5 MB</small>
                    </div>
                  )}
                </div>
              </div>

              {error && <div className="jap-error-msg">⚠ {error}</div>}

              <button type="submit" className="jap-submit" disabled={submitting}>
                {submitting ? <><span className="jap-spinner" /> Submitting...</> : <><Send size={16} /> Submit Application</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
