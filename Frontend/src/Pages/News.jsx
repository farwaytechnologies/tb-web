import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, X, Clock } from 'lucide-react';
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

function timeAgo(dateStr) {
  try {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return ''; }
}

function NewsCard({ item, size = 'normal', onClick }) {
  const [imgOk, setImgOk] = useState(!!item.image);
  const color = catColor(item.category);

  return (
    <article className={`nc nc--${size}`} onClick={onClick}>
      {imgOk && item.image ? (
        <div className="nc__img">
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImgOk(false)}
            onLoad={e => { if (e.target.naturalWidth < 10) setImgOk(false); }}
          />
          {item.category && (
            <span className="nc__cat-badge" style={{ background: color }}>{item.category}</span>
          )}
        </div>
      ) : (
        item.category && (
          <div className="nc__no-img">
            <span className="nc__cat-badge nc__cat-badge--inline" style={{ background: color }}>{item.category}</span>
          </div>
        )
      )}
      <div className="nc__body">
        {item.source && <span className="nc__source">{item.source}</span>}
        <h3 className="nc__title">{item.title}</h3>
        {(size === 'hero' || size === 'featured') && item.content && (
          <p className="nc__excerpt">{item.content}</p>
        )}
        <span className="nc__time"><Clock size={11} />{timeAgo(item.date)}</span>
      </div>
    </article>
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

  const hero     = filtered[0];
  const featured = filtered.slice(1, 5);   // 4 featured cards beside/below hero
  const rest     = filtered.slice(5);

  if (loading) return (
    <div className="nws-page nws-page--dark">
      <div className="nws-loading"><div className="nws-spinner" /><p>Loading newsroom...</p></div>
    </div>
  );

  return (
    <div className="nws-page nws-page--dark">
      <SEO title="Tech Newsroom — TechBorg" description="Latest technology news from TechBorg." url="/news" />

      {/* ── Header ── */}
      <header className="nws-header">
        <div className="nws-header__inner">
          <div className="nws-header__brand">
            <Newspaper size={20} />
            <span>TechBorg <strong>Newsroom</strong></span>
          </div>
          <div className="nws-search-wrap">
            <input
              className="nws-search"
              placeholder="Search news..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="nws-search-clear" onClick={() => setSearch('')}><X size={13} /></button>}
          </div>
        </div>
        {/* Category tabs */}
        <div className="nws-cats-wrap">
          <div className="nws-cats">
            {categories.map(c => (
              <button
                key={c}
                className={`nws-cat-btn${activeCategory === c ? ' active' : ''}`}
                style={activeCategory === c && c !== 'All' ? { color: catColor(c), borderBottomColor: catColor(c) } : {}}
                onClick={() => setActiveCategory(c)}
              >{c}</button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="nws-body">
        {filtered.length === 0 ? (
          <div className="nws-empty">
            <Newspaper size={48} />
            <p>{search ? `No results for "${search}"` : 'No news available yet.'}</p>
          </div>
        ) : (
          <>
            {/* ── TOP SECTION: hero + 4 featured ── */}
            {hero && (
              <section className="nws-top">
                <NewsCard item={hero} size="hero" onClick={() => go(hero._id)} />
                <div className="nws-top__side">
                  {featured.map(item => (
                    <NewsCard key={item._id} item={item} size="featured" onClick={() => go(item._id)} />
                  ))}
                </div>
              </section>
            )}

            {/* ── GRID: rest of stories ── */}
            {rest.length > 0 && (
              <section className="nws-grid-section">
                <div className="nws-section-label">More Stories</div>
                <div className="nws-grid">
                  {rest.map(item => (
                    <NewsCard key={item._id} item={item} size="normal" onClick={() => go(item._id)} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
