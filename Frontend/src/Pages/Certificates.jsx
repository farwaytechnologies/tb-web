import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Download, X, Calendar, BookOpen, User, Copy, Check, ExternalLink } from 'lucide-react';
import '../Styles/PagesStyle/Certificates.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Certificates() {
  const navigate = useNavigate();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { navigate('/login'); return; }
    const uid = user._id || user.id;
    fetch(`${API_URL}/api/enrollments/certificates/${uid}`)
      .then(r => r.json())
      .then(data => { setCerts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Certificate — ${selected?.courseId?.title || 'TechBorg'}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f0e8; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .cert-print-wrap { width: 900px; padding: 40px; }
        .cert-print { position: relative; background: linear-gradient(135deg, #fffdf5 0%, #fef9e7 100%);
          border: 3px solid #c9a227; padding: 60px 70px; text-align: center; border-radius: 4px; }
        .cert-print::before { content: ''; position: absolute; inset: 10px; border: 1px solid #e8c84a; border-radius: 2px; pointer-events: none; }
        .cert-brand { font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: #c9a227; font-weight: 600; margin-bottom: 24px; }
        .cert-title { font-family: 'Playfair Display', Georgia, serif; font-size: 38px; color: #1a1a1a; margin-bottom: 6px; }
        .cert-sub { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 32px; }
        .cert-divider { width: 80px; height: 2px; background: #c9a227; margin: 0 auto 28px; }
        .cert-presented { font-size: 13px; color: #888; margin-bottom: 8px; }
        .cert-name { font-family: 'Playfair Display', Georgia, serif; font-size: 40px; color: #1a1a1a; margin-bottom: 28px; }
        .cert-body { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 8px; }
        .cert-course-name { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #1a1a1a; margin: 4px 0 24px; }
        .cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 48px; padding-top: 24px; border-top: 1px solid #e8c84a; }
        .cert-footer-item { text-align: center; }
        .cert-footer-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #aaa; margin-bottom: 4px; }
        .cert-footer-value { font-size: 13px; color: #555; font-weight: 600; }
        .cert-seal-center { font-size: 52px; margin: 16px 0; }
        .cert-id-bottom { font-size: 10px; color: #bbb; margin-top: 16px; font-family: monospace; letter-spacing: 1px; }
      </style></head>
      <body><div class="cert-print-wrap">${content}</div></body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (loading) return (
    <div className="cert-page">
      <div className="cert-loading">
        <div className="cert-spinner" />
        <p>Loading certificates...</p>
      </div>
    </div>
  );

  return (
    <div className="cert-page">
      {/* Hero Header */}
      <div className="cert-hero">
        <div className="cert-hero-glow" />
        <div className="cert-hero-content">
          <div className="cert-hero-icon"><Award size={28} /></div>
          <div>
            <h1>My Certificates</h1>
            <p>{certs.length} certificate{certs.length !== 1 ? 's' : ''} earned</p>
          </div>
        </div>
        {certs.length > 0 && (
          <div className="cert-stat-badge">
            <span className="cert-stat-num">{certs.length}</span>
            <span className="cert-stat-label">Completed</span>
          </div>
        )}
      </div>

      {certs.length === 0 ? (
        <div className="cert-empty">
          <div className="cert-empty-icon"><Award size={48} /></div>
          <h3>No certificates yet</h3>
          <p>Complete a course to earn your first certificate.</p>
          <button className="cert-empty-btn" onClick={() => navigate('/courses')}>
            <ExternalLink size={15} /> Browse Courses
          </button>
        </div>
      ) : (
        <div className="cert-grid">
          {certs.map(c => (
            <div key={c._id} className="cert-card" onClick={() => setSelected(c)}>
              {c.courseId?.image && (
                <div className="cert-card-img">
                  <img src={c.courseId.image} alt={c.courseId.title} />
                  <div className="cert-card-img-overlay" />
                </div>
              )}
              <div className="cert-card-body">
                <div className="cert-card-top">
                  <span className="cert-card-level">{c.courseId?.level || 'Course'}</span>
                  <Award size={16} className="cert-card-award-icon" />
                </div>
                <h3 className="cert-card-title">{c.courseId?.title || 'Course'}</h3>
                <p className="cert-card-instructor"><User size={12} /> {c.courseId?.instructor || '—'}</p>
                <p className="cert-card-date"><Calendar size={12} /> {fmt(c.completedAt)}</p>
                <div className="cert-card-footer">
                  <span className="cert-card-id">{c.certificateId}</span>
                  <button className="cert-card-btn" onClick={e => { e.stopPropagation(); setSelected(c); }}>
                    <Download size={13} /> View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selected && (
        <div className="cert-modal-overlay" onClick={() => setSelected(null)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <div className="cert-modal-header">
              <span>Certificate Preview</span>
              <div className="cert-modal-actions">
                <button
                  className="cert-modal-copy"
                  onClick={() => copyId(selected.certificateId)}
                  title="Copy Certificate ID"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy ID'}
                </button>
                <button className="cert-modal-print-btn" onClick={handlePrint}>
                  <Download size={14} /> Download
                </button>
                <button className="cert-modal-close" onClick={() => setSelected(null)}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="cert-modal-body" ref={printRef}>
              <div className="cert-print">
                <div className="cert-brand">TechBorg Academy</div>
                <div className="cert-seal-center">🏆</div>
                <div className="cert-title">Certificate of Completion</div>
                <div className="cert-sub">This is to certify that</div>
                <div className="cert-divider" />
                <div className="cert-name">{selected.fullName}</div>
                <div className="cert-body">has successfully completed the course</div>
                <div className="cert-course-name">{selected.courseId?.title}</div>
                <div className="cert-footer">
                  <div className="cert-footer-item">
                    <div className="cert-footer-label">Instructor</div>
                    <div className="cert-footer-value">{selected.courseId?.instructor || '—'}</div>
                  </div>
                  <div className="cert-footer-item">
                    <div className="cert-footer-label">Level</div>
                    <div className="cert-footer-value">{selected.courseId?.level || '—'}</div>
                  </div>
                  <div className="cert-footer-item">
                    <div className="cert-footer-label">Completed</div>
                    <div className="cert-footer-value">{fmt(selected.completedAt)}</div>
                  </div>
                </div>
                <div className="cert-id-bottom">Certificate ID: {selected.certificateId}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
