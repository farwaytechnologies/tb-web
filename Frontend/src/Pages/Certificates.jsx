import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Download, X, Calendar, BookOpen, User } from 'lucide-react';
import '../Styles/PagesStyle/Certificates.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Certificates() {
  const navigate = useNavigate();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
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
      <html><head><title>Certificate</title>
      <style>
        body { margin: 0; font-family: Georgia, serif; }
        .cert-print { width: 900px; margin: 40px auto; padding: 60px; border: 12px double #b8860b;
          text-align: center; background: #fffdf5; }
        .cert-print h1 { font-size: 42px; color: #b8860b; margin: 0 0 8px; }
        .cert-print .cert-sub { font-size: 16px; color: #666; letter-spacing: 2px; text-transform: uppercase; }
        .cert-print .cert-name { font-size: 36px; font-weight: bold; color: #1a1a1a; margin: 32px 0 8px; border-bottom: 2px solid #b8860b; display: inline-block; padding-bottom: 8px; }
        .cert-print .cert-course { font-size: 22px; color: #333; margin: 16px 0; }
        .cert-print .cert-meta { font-size: 14px; color: #888; margin-top: 32px; }
        .cert-print .cert-id { font-size: 12px; color: #aaa; margin-top: 8px; }
        .cert-print .cert-seal { font-size: 64px; margin: 24px 0; }
      </style></head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (loading) return <div className="cert-page"><p className="cert-loading">Loading certificates...</p></div>;

  return (
    <div className="cert-page">
      <div className="cert-header">
        <Award size={32} className="cert-header-icon" />
        <div>
          <h1>My Certificates</h1>
          <p>{certs.length} certificate{certs.length !== 1 ? 's' : ''} earned</p>
        </div>
      </div>

      {certs.length === 0 ? (
        <div className="cert-empty">
          <Award size={64} />
          <h3>No certificates yet</h3>
          <p>Complete a course to earn your certificate.</p>
        </div>
      ) : (
        <div className="cert-grid">
          {certs.map(c => (
            <div key={c._id} className="cert-card" onClick={() => setSelected(c)}>
              <div className="cert-card-seal">🏆</div>
              <h3 className="cert-card-title">{c.courseId?.title || 'Course'}</h3>
              <p className="cert-card-instructor"><User size={13} /> {c.courseId?.instructor || '—'}</p>
              <p className="cert-card-date"><Calendar size={13} /> Completed {fmt(c.completedAt)}</p>
              <p className="cert-card-id">{c.certificateId}</p>
              <button className="cert-card-btn" onClick={e => { e.stopPropagation(); setSelected(c); }}>
                <Download size={14} /> View & Download
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selected && (
        <div className="cert-modal-overlay" onClick={() => setSelected(null)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={() => setSelected(null)}><X size={18} /></button>
            <button className="cert-modal-print" onClick={handlePrint}><Download size={15} /> Download / Print</button>

            <div ref={printRef}>
              <div className="cert-print">
                <div className="cert-seal">🏆</div>
                <h1>Certificate of Completion</h1>
                <p className="cert-sub">This is to certify that</p>
                <div className="cert-name">{selected.fullName}</div>
                <p className="cert-course">
                  has successfully completed the course<br />
                  <strong>{selected.courseId?.title}</strong>
                </p>
                {selected.courseId?.instructor && (
                  <p className="cert-instructor">Instructed by {selected.courseId.instructor}</p>
                )}
                <div className="cert-meta">
                  <span><BookOpen size={13} /> {selected.courseId?.level || 'Course'}</span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span><Calendar size={13} /> {fmt(selected.completedAt)}</span>
                </div>
                <p className="cert-id">Certificate ID: {selected.certificateId}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
