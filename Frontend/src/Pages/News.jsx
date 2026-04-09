import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, X, Clock, ChevronLeft, ChevronRight, RefreshCw, Search } from 'lucide-react';
import '../Styles/PagesStyle/News.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const PAGE_SIZE = 12;

const CAT_COLORS = {
  technology: '#3b82f6', ai: '#a855f7', science: '#10b981', business: '#f59e0b',
  education: '#06b6d4', health: '#ef4444', innovation: '#f97316',
  startups: '#ec4899', cybersecurity: '#f43f5e', gadgets: '#14b8a6',
  software: '#6366f1', automobile: '#e67e22', default: '#64748b',
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
          <img src={item.image} alt={item.title}
            onError={() => setImgOk(false)}
            onLoad={e => { if (e.target.naturalWidth < 10) setImgOk(false); }} />
          <div className="nc__img-overlay" />
          {item.category && (
            <span className="nc__cat-badge" style={{ '--cat': color }}>{item.category}</span>
          )}
        </div>
      ) : (
        <div className="nc__no-img" style={{ '--cat': color }}>
          {item.category && <span className="nc__cat-badge nc__cat-badge--inline" style={{ '--cat': color }}>{item.category}</span>}
        </div>
      )}
      <div className="nc__body">
        {item.source && <span className="nc__source">{item.source}</span>}
        <h3 className="nc__title">{item.title}</h3>
        {(size === 'hero' || size === 'featured') && item.content && (
          <p className="nc__excerpt">{item.content}</p>
        )}
        <span className="nc__time"><Clock size={11} />{timeAgo(item.date)}</span>
      </div>
      <div className="nc__glow" style={{ '--cat': color }} />
    </article>
  );
}

export default function News() {
  const navigate = useNavigate();
  const [news, setNews]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [search, setSearch]           = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage]               = useState(1);

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/news`);
      const d = await res.json();
      if (Array.isArray(d)) setNews([...d].sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch { /* silent */ }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const categories = ['All', ...Array.from(new Set(news.map(n => n.category).filter(Boolean))).sort()];

  const filtered = news.filter(n => {
    const q = search.toLowerCase();
    return (!q || n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q))
      && (activeCategory === 'All' || n.category === activeCategory);
  });

  // Reset page when filter changes
  const handleCategory = c => { setActiveCategory(c); setPage(1); };
  const handleSearch   = v => { setSearch(v); setPage(1); };

  const hero     = filtered[0];
  const featured = filtered.slice(1, 5);
  const rest     = filtered.slice(5);

  // Pagination on "rest" grid
  const totalPages = Math.ceil(rest.length / PAGE_SIZE);
  const pageItems  = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const go = id => navigate(`/news/${id}`);

  if (loading) return (
    <div className="nws-page">
      <div className="nws-loading">
        <div className="nws-spinner" />
        <p>Loading newsroom...</p>
      </div>
    </div>
  );

  return (
    <div className="nws-page">
      <SEO title="Tech Newsroom — TechBorg" description="Latest technology news from TechBorg." url="/news" />

      {/* ── Header ── */}
      <header className="nws-header">
        <div className="nws-header__inner">
          <div className="nws-header__brand">
            <div className="nws-header__icon"><Zap size={16} /></div>
            <span>TechBorg <strong>Newsroom</strong></span>
          </div>

          <div className="nws-header__right">
            <div className="nws-search-wrap">
              <Search size={14} className="nws-search-icon" />
              <input className="nws-search" placeholder="Search news..."
                value={search} onChange={e => handleSearch(e.target.value)} />
              {search && <button className="nws-search-clear" onClick={() => handleSearch('')}><X size={13} /></button>}
            </div>

            {/* Prev / Next / Refresh always visible in header */}
            <div className="nws-nav-btns">
              <button className="nws-nav-btn" onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === 1} title="Previous page">
                <ChevronLeft size={15} />
              </button>
              <span className="nws-nav-page">{page}</span>
              <button className="nws-nav-btn" onClick={() => { setPage(p => Math.min(totalPages || 1, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page >= (totalPages || 1)} title="Next page">
                <ChevronRight size={15} />
              </button>
            </div>

            <button className={`nws-refresh-btn ${refreshing ? 'spinning' : ''}`}
              onClick={() => load(true)} title="Refresh news">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="nws-cats-wrap">
          <div className="nws-cats">
            {categories.map(c => (
              <button key={c}
                className={`nws-cat-btn${activeCategory === c ? ' active' : ''}`}
                style={activeCategory === c && c !== 'All' ? { '--cat': catColor(c) } : {}}
                onClick={() => handleCategory(c)}>{c}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="nws-body">
        {filtered.length === 0 ? (
          <div className="nws-empty">
            <Zap size={48} />
            <p>{search ? `No results for "${search}"` : 'No news available yet.'}</p>
          </div>
        ) : (<>

          {/* Hero + featured */}
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

          {/* Grid + pagination */}
          {rest.length > 0 && (
            <section className="nws-grid-section">
              <div className="nws-section-header">
                <span className="nws-section-label">More Stories</span>
                {totalPages > 1 && (
                  <span className="nws-page-info">{page} / {totalPages}</span>
                )}
              </div>

              <div className="nws-grid">
                {pageItems.map(item => (
                  <NewsCard key={item._id} item={item} size="normal" onClick={() => go(item._id)} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="nws-pagination">
                  <button className="nws-pg-btn" onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={page === 1}>
                    <ChevronLeft size={16} /> Prev
                  </button>

                  <div className="nws-pg-dots">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p}
                        className={`nws-pg-dot ${p === page ? 'active' : ''}`}
                        onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                        {p}
                      </button>
                    ))}
                  </div>

                  <button className="nws-pg-btn" onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={page === totalPages}>
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </section>
          )}

        </>)}
      </div>
    </div>
  );
}
