import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Search, X, Calendar, Tag, ArrowRight, ChevronRight } from 'lucide-react';
import '../Styles/PagesStyle/News.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CATEGORY_COLORS = {
  technology: '#3b82f6', ai: '#8b5cf6', science: '#10b981', business: '#f59e0b',
  education: '#06b6d4', health: '#ef4444', innovation: '#f97316', default: '#6366f1',
};
const catColor = (c) => CATEGORY_COLORS[c?.toLowerCase()] || CATEGORY_COLORS.default;

export default function News() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch(`${API_URL}/api/news`)
      .then(r => r.json())
      .then(d => { setNews(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(news.map(n => n.category).filter(Boolean)))];

  const filtered = news.filter(n => {
    const q = search.toLowerCase();
    const matchSearch = !q || n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q);
    const matchCat = activeCategory === 'All' || n.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (loading) return (
    <div className="nws-page">
      <div className="nws-loading"><div className="nws-spinner" /><p>Loading newsroom...</p></div>
    </div>
  );

  return (
    <div className="nws-page">
      <SEO
        title="Tech Newsroom"
        description="Stay updated with the latest technology news, AI breakthroughs, industry trends, and innovation stories from TechBorg's newsroom."
        url="/news"
        keywords="tech news, AI news, technology trends, innovation, startup news India"
      />
      {/* Hero */}
      <div className="nws-hero">
        <div className="nws-hero-inner">
          <span className="nws-hero-badge"><Newspaper size={14} /> Newsroom</span>
          <h1>Stay Updated in <span className="nws-accent">Tech World</span></h1>
          <p>Latest news, trends, and stories from the tech industry.</p>

          <div className="nws-search-wrap">
            <Search size={16} className="nws-search-icon" />
            <input className="nws-search" placeholder="Search news..." value={search}
              onChange={e => setSearch(e.target.value)} />
            {search && <button className="nws-search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
          </div>

          <div className="nws-hero-stats">
            <div className="nws-stat"><span>{news.length}</span>Articles</div>
            <div className="nws-stat"><span>{categories.length - 1}</span>Categories</div>
            <div className="nws-stat"><span>Live</span>Updates</div>
          </div>
        </div>
      </div>

      <div className="nws-content">
        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="nws-cats">
            {categories.map(c => (
              <button key={c} className={`nws-cat-btn ${activeCategory === c ? 'active' : ''}`}
                style={activeCategory === c && c !== 'All' ? { background: catColor(c), borderColor: catColor(c) } : {}}
                onClick={() => setActiveCategory(c)}>{c}</button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="nws-empty">
            <Newspaper size={48} />
            <p>{search ? `No results for "${search}"` : 'No news available yet.'}</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <div className="nws-featured" onClick={() => navigate(`/news/${featured._id}`)}>
                <div className="nws-featured-img">
                  {featured.image
                    ? <img src={featured.image} alt={featured.title} onError={e => e.target.style.display='none'} />
                    : <div className="nws-featured-placeholder"><Newspaper size={64} /></div>
                  }
                  <div className="nws-featured-overlay" />
                  {featured.category && (
                    <span className="nws-featured-cat" style={{ background: catColor(featured.category) }}>{featured.category}</span>
                  )}
                  <span className="nws-featured-label">Featured</span>
                </div>
                <div className="nws-featured-body">
                  <div className="nws-featured-meta">
                    <span className="nws-meta-date"><Calendar size={13} />{new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h2 className="nws-featured-title">{featured.title}</h2>
                  {featured.content && <p className="nws-featured-excerpt">{featured.content}</p>}
                  <button className="nws-featured-btn">Read Article <ArrowRight size={15} /></button>
                </div>
              </div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <>
                <p className="nws-count">{rest.length} more article{rest.length !== 1 ? 's' : ''}</p>
                <div className="nws-grid">
                  {rest.map((item, i) => (
                    <article key={item._id} className="nws-card" style={{ animationDelay: `${i * 0.05}s` }}
                      onClick={() => navigate(`/news/${item._id}`)}>
                      <div className="nws-card-img">
                        {item.image
                          ? <img src={item.image} alt={item.title} onError={e => e.target.style.display='none'} />
                          : <div className="nws-card-placeholder"><Newspaper size={32} /></div>
                        }
                        {item.category && (
                          <span className="nws-card-cat" style={{ background: catColor(item.category) }}>{item.category}</span>
                        )}
                      </div>
                      <div className="nws-card-body">
                        <div className="nws-card-meta">
                          <span className="nws-meta-date"><Calendar size={12} />{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <h3 className="nws-card-title">{item.title}</h3>
                        {item.content && <p className="nws-card-excerpt">{item.content}</p>}
                        <span className="nws-card-link">Read more <ChevronRight size={13} /></span>
                      </div>
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
