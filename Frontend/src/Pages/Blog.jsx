import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, X, Calendar, User, ChevronRight, Tag } from 'lucide-react';
import '../Styles/PagesStyle/Blog.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CAT_COLORS = {
  technology: '#3b82f6', tutorial: '#8b5cf6', ai: '#6366f1', science: '#10b981',
  business: '#f59e0b', education: '#06b6d4', design: '#ec4899', general: '#64748b',
};
const catColor = (c) => CAT_COLORS[c?.toLowerCase()] || '#6366f1';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch(`${API_URL}/api/blogs`)
      .then(r => r.json())
      .then(d => { setPosts(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filtered = posts.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.author?.toLowerCase().includes(q);
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (loading) return (
    <div className="blg-page">
      <div className="blg-loading"><div className="blg-spinner" /><p>Loading articles...</p></div>
    </div>
  );

  return (
    <div className="blg-page">
      <SEO
        title="Blog - Tech Insights & Tutorials"
        description="Read the latest tech articles, tutorials, and insights from TechBorg experts. Topics include AI, web development, programming, and more."
        url="/blog"
        keywords="tech blog, programming tutorials, AI articles, web development tips, tech insights"
      />
      {/* Hero */}
      <div className="blg-hero">
        <div className="blg-hero-inner">
          <span className="blg-hero-badge"><BookOpen size={14} /> Our Blog</span>
          <h1>Insights & <span className="blg-accent">Innovation</span></h1>
          <p>Explore the latest trends, tutorials, and insights from our tech experts.</p>

          <div className="blg-search-wrap">
            <Search size={16} className="blg-search-icon" />
            <input className="blg-search" placeholder="Search articles..." value={search}
              onChange={e => setSearch(e.target.value)} />
            {search && <button className="blg-search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
          </div>

          <div className="blg-hero-stats">
            <div className="blg-stat"><span>{posts.length}</span>Articles</div>
            <div className="blg-stat"><span>{categories.length - 1}</span>Categories</div>
            <div className="blg-stat"><span>{Array.from(new Set(posts.map(p => p.author).filter(Boolean))).length}</span>Authors</div>
          </div>
        </div>
      </div>

      <div className="blg-content">
        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="blg-cats">
            {categories.map(c => (
              <button key={c} className={`blg-cat-btn ${activeCategory === c ? 'active' : ''}`}
                style={activeCategory === c && c !== 'All' ? { background: catColor(c), borderColor: catColor(c) } : {}}
                onClick={() => setActiveCategory(c)}>{c}</button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="blg-empty">
            <BookOpen size={48} />
            <p>{search ? `No results for "${search}"` : 'No articles yet.'}</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <Link to={`/blog/${featured._id}`} className="blg-featured">
                <div className="blg-featured-img">
                  {featured.image
                    ? <img src={featured.image} alt={featured.title} onError={e => e.target.style.display='none'} />
                    : <div className="blg-featured-placeholder"><BookOpen size={64} /></div>
                  }
                  <div className="blg-featured-overlay" />
                  {featured.category && (
                    <span className="blg-featured-cat" style={{ background: catColor(featured.category) }}>{featured.category}</span>
                  )}
                  <span className="blg-featured-label">Featured</span>
                </div>
                <div className="blg-featured-body">
                  <div className="blg-featured-meta">
                    {featured.author && <span className="blg-meta-author"><User size={12} />{featured.author}</span>}
                    <span className="blg-meta-date"><Calendar size={12} />{new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h2 className="blg-featured-title">{featured.title}</h2>
                  {featured.description && <p className="blg-featured-excerpt">{featured.description}</p>}
                  {featured.tags?.length > 0 && (
                    <div className="blg-featured-tags">
                      <Tag size={12} />
                      {featured.tags.slice(0, 3).map((t, i) => <span key={i} className="blg-tag">{t}</span>)}
                    </div>
                  )}
                  <span className="blg-featured-btn">Read Article <ChevronRight size={15} /></span>
                </div>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <>
                <p className="blg-count">{rest.length} more article{rest.length !== 1 ? 's' : ''}</p>
                <div className="blg-grid">
                  {rest.map((post, i) => (
                    <Link key={post._id} to={`/blog/${post._id}`} className="blg-card"
                      style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="blg-card-img">
                        {post.image
                          ? <img src={post.image} alt={post.title} onError={e => e.target.style.display='none'} />
                          : <div className="blg-card-placeholder"><BookOpen size={32} /></div>
                        }
                        {post.category && (
                          <span className="blg-card-cat" style={{ background: catColor(post.category) }}>{post.category}</span>
                        )}
                        <div className="blg-card-hover"><span>Read Article <ChevronRight size={13} /></span></div>
                      </div>
                      <div className="blg-card-body">
                        <div className="blg-card-meta">
                          {post.author && <span className="blg-meta-author"><User size={11} />{post.author}</span>}
                          <span className="blg-meta-date"><Calendar size={11} />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <h3 className="blg-card-title">{post.title}</h3>
                        {post.description && <p className="blg-card-desc">{post.description}</p>}
                        {post.tags?.length > 0 && (
                          <div className="blg-card-tags">
                            {post.tags.slice(0, 2).map((t, i) => <span key={i} className="blg-tag">{t}</span>)}
                          </div>
                        )}
                      </div>
                    </Link>
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
