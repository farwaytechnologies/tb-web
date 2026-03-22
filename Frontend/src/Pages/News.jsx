import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Search, X, Calendar } from 'lucide-react';
import '../Styles/PagesStyle/News.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CAT_COLORS = {
  technology: '#3b82f6', ai: '#8b5cf6', science: '#10b981', business: '#f59e0b',
  education: '#06b6d4', health: '#ef4444', innovation: '#f97316',
  startups: '#ec4899', cybersecurity: '#f43f5e', gadgets: '#14b8a6',
  software: '#6366f1', default: '#64748b',
};
const catColor = c => CAT_COLORS[c?.toLowerCase()] || CAT_COLORS.default;
const fmt = (d, opts) => { try { return new Date(d).toLocaleDateString('en-US', opts); } catch { return ''; } };

function NewsImg({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <div className={className}>
      <img src={src} alt={alt} onError={() => setFailed(true)} />
    </div>
  );
}

export default function News() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch(`${API_URL}/api/news`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setNews([...d].sort((a, b) => new Date(b.date) - new Date(a.date)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(news.map(n => n.category).filter(Boolean))).sort()];

  const filtered = news.filter(n => {
    const q = search.toLowerCase();
    return (!q || n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q))
      && (activeCategory === 'All' || n.category === activeCategory);
  });

  const go = id => navigate(`/news/${id}`);

  // Layout: [0]=hero, [1..3]=featured trio, [4..]=rest in repeating pattern
  const hero      = filtered[0];
  const trio      = filtered.slice(1, 4);
  const rest      = filtered.slice(4);

  if (loading) return (
    <div className="nws-page"><div className="nws-loading"><div className="nws-spinner" /><p>Loading newsroom...</p></div></div>
  );

  return (
    <div className="nws-page">
      <SEO title="Tech Newsroom" description="Latest technology news from TechBorg." url="/news" />

      {/* Masthead */}
      <div className="nws-masthead">
        <div className="nws-masthead-inner">
          <div className="nws-masthead-top">
            <span className="nws-masthead-date">{fmt(new Date(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <h1 className="nws-masthead-title">TechBorg <span>Newsroom</span></h1>
            <div className="nws-search-wrap">
              <Search size={14} className="nws-search-icon" />
              <input className="nws-search" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button className="nws-search-clear" onClick={() => setSearch('')}><X size={13} /></button>}
            </div>
          </div>
          <div className="nws-cats">
            {categories.map(c => (
              <button key={c}
                className={`nws-cat-btn${activeCategory === c ? ' active' : ''}`}
                style={activeCategory === c && c !== 'All' ? { color: catColor(c), borderBottomColor: catColor(c) } : {}}
                onClick={() => setActiveCategory(c)}>{c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="nws-body">
        {filtered.length === 0 ? (
          <div className="nws-empty"><Newspaper size={48} /><p>{search ? `No results for "${search}"` : 'No news available yet.'}</p></div>
        ) : (<>

          {/* ── HERO ── */}
          {hero && (
            <article className="nws-hero" onClick={() => go(hero._id)}>
              <NewsImg src={hero.image} alt={hero.title} className="nws-hero__img" />
              <div className="nws-hero__body">
                {hero.category && <span className="nws-label" style={{ color: catColor(hero.category) }}>{hero.category}</span>}
                <h2 className="nws-hero__title">{hero.title}</h2>
                {hero.content && <p className="nws-hero__excerpt">{hero.content}</p>}
                <span className="nws-byline"><Calendar size={11} />{fmt(hero.date, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </article>
          )}

          {/* ── FEATURED TRIO ── */}
          {trio.length > 0 && (
            <>
              <div className="nws-rule"><span>Latest</span></div>
              <div className="nws-trio">
                {trio.map((item, i) => (
                  <article key={item._id} className={`nws-trio__item${i === 0 ? ' nws-trio__item--wide' : ''}`} onClick={() => go(item._id)}>
                    <NewsImg src={item.image} alt={item.title} className="nws-trio__img" />
                    <div className="nws-trio__body">
                      {item.category && <span className="nws-label" style={{ color: catColor(item.category) }}>{item.category}</span>}
                      <h3 className="nws-trio__title">{item.title}</h3>
                      {item.content && <p className="nws-trio__excerpt">{item.content}</p>}
                      <span className="nws-byline"><Calendar size={11} />{fmt(item.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* ── REST: newspaper grid ── */}
          {rest.length > 0 && (
            <>
              <div className="nws-rule"><span>More Stories</span></div>
              <div className="nws-grid">
                {rest.map((item, i) => {
                  // Every 7th item (0-indexed) is a wide card, every 3rd is medium, rest are small
                  const size = i % 7 === 0 ? 'wide' : i % 3 === 0 ? 'medium' : 'small';
                  return (
                    <article key={item._id} className={`nws-card nws-card--${size}`} onClick={() => go(item._id)}>
                      <NewsImg src={item.image} alt={item.title} className="nws-card__img" />
                      <div className="nws-card__body">
                        {item.category && <span className="nws-label" style={{ color: catColor(item.category) }}>{item.category}</span>}
                        <h4 className="nws-card__title">{item.title}</h4>
                        {(size === 'wide' || size === 'medium') && item.content &&
                          <p className="nws-card__excerpt">{item.content}</p>}
                        <span className="nws-byline"><Calendar size={11} />{fmt(item.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

        </>)}
      </div>
    </div>
  );
}
