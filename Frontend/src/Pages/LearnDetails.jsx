import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, Copy, Check, ChevronLeft, ChevronRight, BookOpen, Code2 } from 'lucide-react';
import '../Styles/PagesStyle/LearnDetails.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const LANG_COLORS = {
  python:'#3b82f6', javascript:'#f59e0b', java:'#ef4444', 'c++':'#8b5cf6',
  'c#':'#6366f1', typescript:'#0891b2', rust:'#f97316', go:'#06b6d4',
  php:'#7c3aed', ruby:'#dc2626', swift:'#f97316', kotlin:'#a855f7',
  html:'#ea580c', css:'#2563eb', sql:'#059669',
};
const langColor = (name) => LANG_COLORS[name?.toLowerCase()] || '#6366f1';

export default function LearnDetails() {
  const { id } = useParams();
  const [language, setLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`learn-${id}`) || '[]'); } catch { return []; }
  });
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/learn/${id}`)
      .then(r => r.json())
      .then(d => { setLanguage(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [id]);

  const markComplete = useCallback((i) => {
    setCompleted(prev => {
      const next = prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i];
      localStorage.setItem(`learn-${id}`, JSON.stringify(next));
      return next;
    });
  }, [id]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return (
    <div className="ld-page"><div className="ld-loading"><div className="ld-spinner" /><p>Loading course...</p></div></div>
  );
  if (error || !language) return (
    <div className="ld-page"><div className="ld-error"><h2>⚠️ {error || 'Course not found'}</h2><Link to="/learn" className="ld-back-link">← Back to Courses</Link></div></div>
  );

  const mods = language.modules || [];
  const color = langColor(language.language);
  const progress = mods.length ? Math.round((completed.length / mods.length) * 100) : 0;
  const mod = mods[active];

  return (
    <div className="ld-page">
      {/* Top bar */}
      <div className="ld-topbar" style={{ borderBottomColor: color }}>
        <Link to="/learn" className="ld-back"><ArrowLeft size={16} /> Courses</Link>
        <div className="ld-topbar-center">
          <span className="ld-topbar-title" style={{ color }}>{language.language}</span>
          <span className="ld-topbar-meta">{mods.length} modules · {progress}% complete</span>
        </div>
        <button className="ld-sidebar-toggle" onClick={() => setSidebarOpen(s => !s)}>
          {sidebarOpen ? '✕ Hide' : '☰ Modules'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="ld-progress-track">
        <div className="ld-progress-fill" style={{ width: `${progress}%`, background: color }} />
      </div>

      <div className="ld-layout">
        {/* Sidebar */}
        <aside className={`ld-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="ld-sidebar-header">
            <BookOpen size={15} style={{ color }} />
            <span>Modules</span>
            <span className="ld-sidebar-count">{completed.length}/{mods.length}</span>
          </div>
          <nav className="ld-sidebar-nav">
            {mods.map((m, i) => (
              <button key={i}
                className={`ld-nav-item ${active === i ? 'active' : ''} ${completed.includes(i) ? 'done' : ''}`}
                style={active === i ? { borderLeftColor: color, background: `${color}10` } : {}}
                onClick={() => setActive(i)}>
                <span className="ld-nav-num" style={active === i ? { background: color, color: '#fff' } : {}}>{i + 1}</span>
                <span className="ld-nav-title">{m.title}</span>
                {completed.includes(i) && <CheckCircle size={14} className="ld-nav-check" style={{ color }} />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="ld-main">
          {mod ? (
            <div className="ld-module">
              {/* Module header */}
              <div className="ld-module-header">
                <div className="ld-module-badge" style={{ background: `${color}18`, color }}>Module {active + 1}</div>
                <h1 className="ld-module-title">{mod.title}</h1>
                <button className="ld-complete-btn"
                  style={completed.includes(active) ? { background: color, color: '#fff', borderColor: color } : { borderColor: color, color }}
                  onClick={() => markComplete(active)}>
                  {completed.includes(active) ? <><CheckCircle size={15} /> Completed</> : <><Circle size={15} /> Mark Complete</>}
                </button>
              </div>

              {/* Description */}
              {mod.description && (
                <div className="ld-section">
                  <p className="ld-description">{mod.description}</p>
                </div>
              )}

              {/* Module image */}
              {mod.image && (
                <div className="ld-section">
                  <img src={mod.image} alt={mod.title} className="ld-module-img" onError={e => e.target.style.display='none'} />
                </div>
              )}

              {/* Content */}
              {mod.content && (
                <div className="ld-section ld-content-block">
                  <h3 className="ld-section-title"><BookOpen size={15} style={{ color }} /> Explanation</h3>
                  <div className="ld-content-text">
                    {mod.content
                      .split('\n')
                      .filter(line => !/^\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(line.trim()))
                      .map((line, i) => {
                        const trimmed = line.trim();
                        if (!trimmed) return <br key={i} />;
                        // Bullet point
                        if (/^[-•*]\s+/.test(trimmed))
                          return <li key={i} className="ld-content-li">{trimmed.replace(/^[-•*]\s+/, '')}</li>;
                        // Numbered list
                        if (/^\d+\.\s+/.test(trimmed))
                          return <li key={i} className="ld-content-li ld-content-li--num">{trimmed}</li>;
                        // Sub-heading (short line ending with colon)
                        if (trimmed.endsWith(':') && trimmed.length < 80)
                          return <p key={i} className="ld-content-subheading">{trimmed}</p>;
                        return <p key={i} className="ld-content-para">{trimmed}</p>;
                      })
                    }
                  </div>
                </div>
              )}

              {/* Code example */}
              {mod.codeExample && (
                <div className="ld-section">
                  <h3 className="ld-section-title"><Code2 size={15} style={{ color }} /> Code Example</h3>
                  <div className="ld-code-wrap">
                    <div className="ld-code-header">
                      <div className="ld-code-dots">
                        <span style={{ background: '#ef4444' }} />
                        <span style={{ background: '#f59e0b' }} />
                        <span style={{ background: '#10b981' }} />
                      </div>
                      <span className="ld-code-lang">{language.language}</span>
                      <button className="ld-copy-btn" onClick={() => copyCode(mod.codeExample)}>
                        {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                      </button>
                    </div>
                    <pre className="ld-code"><code>{mod.codeExample}</code></pre>
                  </div>
                </div>
              )}

              {/* Prev / Next */}
              <div className="ld-nav-footer">
                <button className="ld-nav-btn" disabled={active === 0} onClick={() => setActive(a => a - 1)}>
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="ld-nav-pos">{active + 1} / {mods.length}</span>
                {active < mods.length - 1 ? (
                  <button className="ld-nav-btn primary" style={{ background: color }} onClick={() => { markComplete(active); setActive(a => a + 1); }}>
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <Link to="/learn" className="ld-nav-btn primary" style={{ background: color }}>
                    Finish <CheckCircle size={16} />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="ld-empty">No modules available.</div>
          )}
        </main>
      </div>
    </div>
  );
}
