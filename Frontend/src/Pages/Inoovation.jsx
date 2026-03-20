import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, ArrowRight, Lightbulb, Zap, TrendingUp } from 'lucide-react';
import SEO from '../Components/SEO';
import '../Styles/PagesStyle/Innovation.css';

const API = import.meta.env.VITE_API_URL;

export default function Innovation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    fetch(`${API}/api/innovations`)
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set();
    items.forEach(i => i.tags?.forEach(t => tags.add(t)));
    return ['All', ...tags];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter(i => {
      const matchTag = activeTag === 'All' || i.tags?.includes(activeTag);
      const q = search.toLowerCase();
      const matchSearch = !q || i.title?.toLowerCase().includes(q) || i.subtitle?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q);
      return matchTag && matchSearch;
    });
  }, [items, search, activeTag]);

  return (
    <div className="inn-page">
      <SEO
        title="Innovation Hub"
        description="Explore TechBorg's innovation hub — discover emerging technologies, breakthrough projects, and the future of tech education."
        url="/innovation"
        keywords="tech innovation, emerging technology, AI innovation, future tech, TechBorg projects"
      />

      {/* Hero */}
      <div className="inn-hero">
        <div className="inn-hero-glow" />
        <div className="inn-hero-badges">
          <span className="inn-badge"><Zap size={12} /> Innovation Hub</span>
        </div>
        <h1 className="inn-hero-title">Shaping the Future<br />of Technology</h1>
        <p className="inn-hero-sub">Explore breakthrough projects, emerging technologies, and ideas that are redefining what's possible in tech education.</p>

        <div className="inn-stats">
          <div className="inn-stat"><TrendingUp size={16} style={{ color: '#6366f1' }} /><span>{items.length} Projects</span></div>
          <div className="inn-stat-divider" />
          <div className="inn-stat"><Lightbulb size={16} style={{ color: '#f59e0b' }} /><span>{allTags.length - 1} Categories</span></div>
          <div className="inn-stat-divider" />
          <div className="inn-stat"><Tag size={16} style={{ color: '#10b981' }} /><span>Always Growing</span></div>
        </div>
      </div>

      {/* Controls */}
      <div className="inn-controls">
        <div className="inn-search-wrap">
          <Search size={16} className="inn-search-icon" />
          <input
            className="inn-search"
            placeholder="Search innovations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="inn-tags">
          {allTags.map(t => (
            <button
              key={t}
              className={`inn-tag-btn ${activeTag === t ? 'active' : ''}`}
              onClick={() => setActiveTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="inn-body">
        {loading ? (
          <div className="inn-state">
            <div className="inn-spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="inn-state">
            <Lightbulb size={44} style={{ color: '#334155' }} />
            <p>No innovations found.</p>
          </div>
        ) : (
          <div className="inn-grid">
            {filtered.map((item, idx) => (
              <div key={item._id} className={`inn-card ${idx === 0 ? 'inn-card-featured' : ''}`}>
                <div className="inn-card-img-wrap">
                  <img
                    src={item.image || 'https://placehold.co/600x300?text=Innovation'}
                    alt={item.title}
                    className="inn-card-img"
                    onError={e => { e.target.src = 'https://placehold.co/600x300?text=Innovation'; }}
                  />
                  <div className="inn-card-img-overlay" />
                  {item.tags?.length > 0 && (
                    <span className="inn-card-tag">{item.tags[0]}</span>
                  )}
                </div>
                <div className="inn-card-body">
                  {item.author && <p className="inn-card-author">{item.author}</p>}
                  <h2 className="inn-card-title">{item.title}</h2>
                  {item.subtitle && <p className="inn-card-subtitle">{item.subtitle}</p>}
                  {item.description && (
                    <p className="inn-card-desc">
                      {item.description.length > 120 ? item.description.slice(0, 120) + '…' : item.description}
                    </p>
                  )}
                  {item.tags?.length > 1 && (
                    <div className="inn-card-tags">
                      {item.tags.slice(1, 4).map(t => (
                        <span key={t} className="inn-card-tag-chip">{t}</span>
                      ))}
                    </div>
                  )}
                  <Link to={`/innovation/${item._id}`} className="inn-card-link">
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
