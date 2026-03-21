import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Search, X, Calendar, ChevronRight } from 'lucide-react';
import '../Styles/PagesStyle/News.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CATEGORY_COLORS = {
  technology: '#3b82f6', ai: '#8b5cf6', science: '#10b981', business: '#f59e0b',
  education: '#06b6d4', health: '#ef4444', innovation: '#f97316', default: '#6366f1',
};
const catColor = (c) => CATEGORY_COLORS[c?.toLowerCase()] || CATEGORY_COLORS.default;
const fmt = (d, opts) => new Date(d).toLocaleDateString('en-US', opts);

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
        if (Array.isArray(d)) {
          // Latest first
          setNews([...d].sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(news.map(n => n.category).filter(Boolean)))];

  const filtered = news.filter(n => {
    const q = search.toLowerCase();
    const matchSearch = !q || n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q);
    const matchCat = activeCategory === 'All' || n.category === activeCategory;
    return matchSearch && matchCat;
  });

  // Split into lead, secondary (next 2), and the rest
  const [lead, ...others] = filtered;
  const secondary = others.slice(0, 2);
  const remaining = others.slice(2);

  if (loading) return (
    <div className="nws-page"><div className="nws-loading"><div className="nws-spinner" /><p>Loading newsroom...</p></div></div>
  );

  return (
    <div className="nws-page">
      <SEO
        title="Tech Newsroom"
        description="Stay updated with the latest technology news, AI breakthroughs, industry trends, and innovation stories from TechBorg's newsroom."
        url="/news"
        keywords="tech news, AI news, technology trends, innovation, startup news India"
      />

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
          {/* Category strip */}
          <div className="nws-cats">
            {categories.map(c => (
              <button key={c}
                className={`nws-cat-btn ${activeCategory === c ? 'active' : ''}`}
                style={activeCategory === c && c !== 'All' ? { color: catColor(c), borderBottomColor: catColor(c) } : {}}
                onClick={() => setActiveCategory(c)}>{c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="nws-body">
        {filtered.length === 0 ? (
          <div className="nws-empty"><Newspaper size={48} /><p>{search ? `No results for "${search}"` : 'No news available yet.'}</p></div>
        ) : (
          <>
            {/* Top section: lead + secondary */}
            {lead && (
              <div className="nws-top-section">
                {/* Lead story */}
                <article className="nws-lead" onClick={() => navigate(`/news/${lead._id}`)}>
                  {lead.image && (
                    <div className="nws-lead-img">
                      <img src={lead.image} alt={lead.title} onError={e => e.target.style.display='none'} />
                    </div>
                  )}
                  {lead.category && <span className="nws-label" style={{ color: catColor(lead.category) }}>{lead.category}</span>}
                  <h2 className="nws-lead-title">{lead.title}</h2>
                  {lead.content && <p className="nws-lead-excerpt">{lead.content}</p>}
                  <span className="nws-byline"><Calendar size={11} />{fmt(lead.date, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </article>

                {/* Divider */}
                <div className="nws-col-divider" />

                {/* Secondary stories */}
                <div className="nws-secondary-col">
                  {secondary.map(item => (
                    <article key={item._id} className="nws-secondary" onClick={() => navigate(`/news/${item._id}`)}>
                      {item.category && <span className="nws-label" style={{ color: catColor(item.category) }}>{item.category}</span>}
                      <h3 className="nws-secondary-title">{item.title}</h3>
                      {item.content && <p className="nws-secondary-excerpt">{item.content}</p>}
                      <span className="nws-byline"><Calendar size={11} />{fmt(item.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {item.image && (
                        <div className="nws-secondary-img">
                          <img src={item.image} alt={item.title} onError={e => e.target.style.display='none'} />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Remaining stories — compact list rows */}
            {remaining.length > 0 && (
              <>
                <div className="nws-section-rule"><span>More Stories</span></div>
                <div className="nws-list">
                  {remaining.map(item => (
                    <article key={item._id} className="nws-list-item" onClick={() => navigate(`/news/${item._id}`)}>
                      <div className="nws-list-body">
                        {item.category && <span className="nws-label" style={{ color: catColor(item.category) }}>{item.category}</span>}
                        <h4 className="nws-list-title">{item.title}</h4>
                        {item.content && <p className="nws-list-excerpt">{item.content}</p>}
                        <span className="nws-byline"><Calendar size={11} />{fmt(item.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      {item.image && (
                        <div className="nws-list-img">
                          <img src={item.image} alt={item.title} onError={e => e.target.style.display='none'} />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
