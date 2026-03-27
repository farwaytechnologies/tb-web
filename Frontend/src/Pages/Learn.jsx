import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, BookOpen, Code2, ChevronRight, Layers } from 'lucide-react';
import '../Styles/PagesStyle/Learn.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Language → accent color map
const LANG_COLORS = {
  python:     '#3b82f6', javascript: '#f59e0b', java:       '#ef4444',
  'c++':      '#8b5cf6', 'c#':       '#6366f1', typescript: '#0891b2',
  rust:       '#f97316', go:         '#06b6d4',  php:        '#7c3aed',
  ruby:       '#dc2626', swift:      '#f97316',  kotlin:     '#a855f7',
  html:       '#ea580c', css:        '#2563eb',  sql:        '#059669',
};
const langColor = (name) => LANG_COLORS[name?.toLowerCase()] || '#6366f1';

export default function Learn() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/learn`)
      .then(r => r.json())
      .then(d => { setLanguages(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = languages.filter(l => {
    const q = search.toLowerCase();
    return !q || l.language?.toLowerCase().includes(q) || l.shortDescription?.toLowerCase().includes(q);
  });

  if (loading) return (
    <div className="learn-page">
      <div className="learn-loading"><div className="learn-spinner" /><p>Loading courses...</p></div>
    </div>
  );

  return (
    <div className="learn-page">
      <SEO
        title="Learn to Code - Free Programming Tutorials"
        description="Learn Python, JavaScript, Java, C++, and more with free interactive tutorials and hands-on modules. Start your coding journey with TechBorg."
        url="/learn"
        keywords="learn programming, coding tutorials, python tutorial, javascript tutorial, free coding courses"
      />
      {/* Hero */}
      <div className="learn-hero">
        <div className="learn-hero-inner">
          <span className="learn-hero-badge"><Code2 size={14} /> Learn to Code</span>
          <h1>Start Your <span className="learn-hero-accent">Coding Journey</span></h1>
          <p>Master programming languages with interactive tutorials, real-world examples and hands-on code.</p>

          <div className="learn-search-wrap">
            <Search size={16} className="learn-search-icon" />
            <input className="learn-search" placeholder="Search languages..." value={search}
              onChange={e => setSearch(e.target.value)} />
            {search && <button className="learn-search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
          </div>

          <div className="learn-hero-stats">
            <div className="learn-hero-stat"><span>{languages.length}</span> Languages</div>
            <div className="learn-hero-stat"><span>{languages.reduce((s, l) => s + (l.modules?.length || 0), 0)}</span> Modules</div>
            <div className="learn-hero-stat"><span>Free</span> Access</div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="learn-content">
        {filtered.length === 0 ? (
          <div className="learn-empty">
            <BookOpen size={48} />
            <p>{search ? `No results for "${search}"` : 'No courses available yet.'}</p>
          </div>
        ) : (
          <>
            <p className="learn-count">{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</p>
            <div className="learn-grid">
              {filtered.map((lang, i) => {
                const color = langColor(lang.language);
                const mods = lang.modules?.length || 0;
                return (
                  <div key={lang._id} className="learn-card" style={{ '--accent': color, animationDelay: `${i * 0.05}s` }}>
                    <div className="learn-card-top" style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)` }}>
                      {lang.image
                        ? <img src={lang.image} alt={lang.language} className="learn-card-img" onError={e => { e.target.style.display='none'; }} />
                        : <div className="learn-card-icon" style={{ color }}><Code2 size={40} /></div>
                      }
                      <div className="learn-card-badge" style={{ background: color }}>{mods} module{mods !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="learn-card-body">
                      <h3 className="learn-card-title" style={{ color }}>{lang.language}</h3>
                      <p className="learn-card-desc">{lang.shortDescription || 'Learn the fundamentals and beyond.'}</p>
                      {mods > 0 && (
                        <div className="learn-card-modules">
                          <Layers size={12} />
                          {lang.modules.slice(0, 3).map((m, j) => (
                            <span key={j} className="learn-module-chip">{m.title}</span>
                          ))}
                          {mods > 3 && <span className="learn-module-more">+{mods - 3} more</span>}
                        </div>
                      )}
                      <Link to={`/learn/${lang._id}`} className="learn-card-btn" style={{ background: color }}>
                        Start Learning <ChevronRight size={15} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
