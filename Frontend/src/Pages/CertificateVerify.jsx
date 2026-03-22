import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Download, CheckCircle, XCircle, Calendar, User, BookOpen, Share2, Copy, Check } from 'lucide-react';
import SEO from '../Components/SEO';
import './CertificateVerify.css';

const API = import.meta.env.VITE_API_URL;

export default function CertificateVerify() {
  const { certId } = useParams();
  const [cert, setCert] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | found | notfound
  const [copied, setCopied] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    fetch(`${API}/api/enrollments/verify/${certId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setStatus('notfound'); return; }
        setCert(data);
        setStatus('found');
      })
      .catch(() => setStatus('notfound'));
  }, [certId]);

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Certificate — ${cert?.courseId?.title || 'TechBorg'}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .cv-print-wrap { width: 860px; padding: 40px; }
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
      <body><div class="cv-print-wrap">${content}</div></body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const shareUrl = window.location.href;
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (status === 'loading') return (
    <div className="cv-page">
      <div className="cv-center">
        <div className="cv-spinner" />
        <p>Verifying certificate...</p>
      </div>
    </div>
  );

  if (status === 'notfound') return (
    <div className="cv-page">
      <div className="cv-center">
        <div className="cv-invalid-icon"><XCircle size={48} /></div>
        <h2>Certificate Not Found</h2>
        <p>This certificate ID is invalid or does not exist.</p>
        <Link to="/" className="cv-home-btn">Go to TechBorg</Link>
      </div>
    </div>
  );

  return (
    <div className="cv-page">
      <SEO
        title={`Certificate — ${cert.fullName} | ${cert.courseId?.title || 'TechBorg'}`}
        description={`Verified TechBorg certificate issued to ${cert.fullName} for completing ${cert.courseId?.title}. Certificate ID: ${cert.certificateId}`}
        url={`/certificate/${certId}`}
        article={true}
        publishedTime={cert.completedAt}
        keywords={`TechBorg certificate, ${cert.courseId?.title}, verified certificate, online course completion`}
      />
      {/* Verified banner */}
      <div className="cv-verified-banner">
        <CheckCircle size={18} />
        <span>This certificate has been verified as authentic by TechBorg</span>
      </div>

      {/* Actions bar */}
      <div className="cv-actions-bar">
        <div className="cv-cert-id-label">
          <span>Certificate ID:</span>
          <code>{cert.certificateId}</code>
        </div>
        <div className="cv-actions">
          <button className="cv-btn cv-btn--share" onClick={copyLink}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button className="cv-btn cv-btn--download" onClick={handlePrint}>
            <Download size={14} /> Download
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div className="cv-cert-wrap" ref={printRef}>
        <div className="cert-print">
          <div className="cert-brand">TechBorg Academy</div>
          <div className="cert-seal-center">🏆</div>
          <div className="cert-title">Certificate of Completion</div>
          <div className="cert-sub">This is to certify that</div>
          <div className="cert-divider" />
          <div className="cert-name">{cert.fullName}</div>
          <div className="cert-body">has successfully completed the course</div>
          <div className="cert-course-name">{cert.courseId?.title}</div>
          <div className="cert-footer">
            <div className="cert-footer-item">
              <div className="cert-footer-label">Instructor</div>
              <div className="cert-footer-value">{cert.courseId?.instructor || '—'}</div>
            </div>
            <div className="cert-footer-item">
              <div className="cert-footer-label">Level</div>
              <div className="cert-footer-value">{cert.courseId?.level || '—'}</div>
            </div>
            <div className="cert-footer-item">
              <div className="cert-footer-label">Completed</div>
              <div className="cert-footer-value">{fmt(cert.completedAt)}</div>
            </div>
          </div>
          <div className="cert-id-bottom">Certificate ID: {cert.certificateId}</div>
        </div>
      </div>

      {/* Meta info */}
      <div className="cv-meta">
        <div className="cv-meta-item"><User size={14} /> <span>Issued to: <strong>{cert.fullName}</strong></span></div>
        <div className="cv-meta-item"><BookOpen size={14} /> <span>Course: <strong>{cert.courseId?.title}</strong></span></div>
        <div className="cv-meta-item"><Calendar size={14} /> <span>Completed: <strong>{fmt(cert.completedAt)}</strong></span></div>
      </div>

      <div className="cv-footer-brand">
        <Link to="/">⚡ TechBorg</Link> — Verified Certificate
      </div>
    </div>
  );
}
