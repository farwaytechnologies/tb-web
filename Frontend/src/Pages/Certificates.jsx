import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Download, X, Calendar, User, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import SEO from '../Components/SEO';
import '../Styles/PagesStyle/Certificates.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Certificates() {
  const navigate = useNavigate();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .cert-print-wrap { width: 860px; padding: 40px; }
        .cert-print { position: relative; background: linear-gradient(135deg,#0d0d18,#12121a,#0d0d18); border: 2px solid rgba(139,92,246,0.5); padding: 60px 70px; text-align: center; border-radius: 12px; overflow: hidden; }
        .cert-print::before { content:''; position:absolute; inset:8px; border:1px solid rgba(139,92,246,0.15); border-radius:8px; pointer-events:none; }
        .cert-brand { font-size:12px; letter-spacing:4px; text-transform:uppercase; background:linear-gradient(135deg,#8b5cf6,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-weight:700; margin-bottom:20px; position:relative; z-index:1; }
        .cert-seal-center { font-size:52px; margin-bottom:12px; position:relative; z-index:1; }
        .cert-title { font-size:32px; color:#f1f5f9; margin-bottom:6px; font-weight:800; letter-spacing:-0.02em; position:relative; z-index:1; }
        .cert-sub { font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#64748b; margin-bottom:20px; position:relative; z-index:1; }
        .cert-divider { width:80px; height:2px; background:linear-gradient(90deg,#8b5cf6,#06b6d4); margin:0 auto 20px; border-radius:2px; position:relative; z-index:1; }
        .cert-name { font-size:36px; color:#f1f5f9; margin-bottom:24px; font-weight:700; position:relative; z-index:1; }
        .cert-body { font-size:14px; color:#64748b; margin-bottom:6px; position:relative; z-index:1; }
        .cert-course-name { font-size:20px; color:#c4b5fd; margin-bottom:28px; font-weight:700; position:relative; z-index:1; }
        .cert-footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top:48px; padding-top:24px; border-top:1px solid rgba(139,92,246,0.2); position:relative; z-index:1; }
        .cert-footer-item { text-align:center; }
        .cert-footer-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#475569; margin-bottom:4px; }
        .cert-footer-value { font-size:13px; color:#94a3b8; font-weight:600; }
        .cert-id-bottom { font-size:10px; color:#334155; margin-top:16px; font-family:monospace; letter-spacing:1px; position:relative; z-index:1; }
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

  const shareLink = (certId) => {
    const url = `${window.location.origin}/certificate/${certId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
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
      <SEO
        title="My Certificates"
        description="View and download your TechBorg course completion certificates. Share your achievements with employers and on LinkedIn."
        url="/certificates"
        keywords="TechBorg certificates, course completion, online certificate, tech certification India"
        noindex={true}
      />
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
                <button
                  className="cert-modal-copy"
                  onClick={() => shareLink(selected.certificateId)}
                  title="Copy shareable link"
                >
                  {copiedShare ? <Check size={14} /> : <Share2 size={14} />}
                  {copiedShare ? 'Copied!' : 'Share Link'}
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
