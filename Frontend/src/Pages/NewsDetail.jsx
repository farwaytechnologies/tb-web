import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Tag, Share2, Copy, Check, Newspaper, ChevronRight, ChevronLeft } from 'lucide-react';
import '../Styles/PagesStyle/NewsDetails.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CATEGORY_COLORS = {
  technology: '#3b82f6', ai: '#8b5cf6', science: '#10b981', business: '#f59e0b',
  education: '#06b6d4', health: '#ef4444', innovation: '#f97316', default: '#6366f1',
};
const catColor = (c) => CATEGORY_COLORS[c?.toLowerCase()] || CATEGORY_COLORS.default;

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [allNews, setAllNews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      fetch(`${API_URL}/api/news/${id}`).then(r => r.json()),
      fetch(`${API_URL}/api/news`).then(r => r.json()),
    ]).then(([single, all]) => {
      setItem(single);
      const sorted = Array.isArray(all) ? [...all].sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
      setAllNews(sorted);
      setRelated(sorted.filter(n => n._id !== id).slice(0, 3));
      setLoading(false);
    }).catch(e => { setError(e.message); setLoading(false); });
  }, [id]);

  const share = (platform) => {
    const title = encodeURIComponent(item.title);
    const url = encodeURIComponent(window.location.href);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      facebook: `https://facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } else if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) return (
    <div className="nd-page"><div className="nd-loading"><div className="nd-spinner" /><p>Loading article...</p></div></div>
  );
  if (error || !item) return (
    <div className="nd-page"><div className="nd-error">
      <Newspaper size={48} />
      <h2>Article not found</h2>
      <p>{error || "This article doesn't exist."}</p>
      <Link to="/news" className="nd-error-btn">← Back to News</Link>
    </div></div>
  );

  const color = catColor(item.category);
  const currentIdx = allNews.findIndex(n => n._id === id);
  const prevItem = currentIdx > 0 ? allNews[currentIdx - 1] : null;
  const nextItem = currentIdx < allNews.length - 1 ? allNews[currentIdx + 1] : null;

  return (
    <div className="nd-page">
      {item && (
        <SEO
          title={item.title}
          description={item.content?.slice(0, 155)}
          url={`/news/${id}`}
          image={item.image}
          article
          publishedTime={item.date}
          keywords={item.category ? `${item.category}, tech news, TechBorg` : 'tech news, TechBorg'}
        />
      )}
      {/* Cover image hero */}
      <div className="nd-cover" style={item.image ? {} : { background: 'linear-gradient(135deg, #0f172a, #1e1b4b)' }}>
        {item.image && <img src={item.image} alt={item.title} className="nd-cover-img" onError={e => e.target.style.display='none'} />}
        <div className="nd-cover-overlay" />
        <div className="nd-cover-content">
          <button className="nd-back" onClick={() => navigate('/news')}><ArrowLeft size={16} /> News</button>
          {item.category && <span className="nd-cover-cat" style={{ background: color }}>{item.category}</span>}
          <h1 className="nd-cover-title">{item.title}</h1>
          <div className="nd-cover-meta">
            <span><Calendar size={13} />{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="nd-content">
        {/* Article body */}
        <article className="nd-article">
          <div className="nd-article-body">
            <p className="nd-article-text">{item.content}</p>
          </div>

          {/* Share */}
          <div className="nd-share">
            <span className="nd-share-label"><Share2 size={14} /> Share</span>
            <div className="nd-share-btns">
              <button className="nd-share-btn nd-twitter" onClick={() => share('twitter')} title="Twitter">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </button>
              <button className="nd-share-btn nd-facebook" onClick={() => share('facebook')} title="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </button>
              <button className="nd-share-btn nd-linkedin" onClick={() => share('linkedin')} title="LinkedIn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </button>
              <button className="nd-share-btn nd-copy" onClick={() => share('copy')} title="Copy link">
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>
        </article>

        {/* Prev / Next navigation */}
        {(prevItem || nextItem) && (
          <div className="nd-prevnext">
            {prevItem ? (
              <button className="nd-prevnext-btn nd-prev" onClick={() => navigate(`/news/${prevItem._id}`)}>
                <ChevronLeft size={18} />
                <div className="nd-prevnext-text">
                  <span className="nd-prevnext-label">Previous</span>
                  <span className="nd-prevnext-title">{prevItem.title}</span>
                </div>
              </button>
            ) : <div />}
            {nextItem ? (
              <button className="nd-prevnext-btn nd-next" onClick={() => navigate(`/news/${nextItem._id}`)}>
                <div className="nd-prevnext-text nd-prevnext-text--right">
                  <span className="nd-prevnext-label">Next</span>
                  <span className="nd-prevnext-title">{nextItem.title}</span>
                </div>
                <ChevronRight size={18} />
              </button>
            ) : <div />}
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="nd-related">
            <h2 className="nd-related-heading">More Articles</h2>
            <div className="nd-related-grid">
              {related.map(r => (
                <article key={r._id} className="nd-related-card" onClick={() => navigate(`/news/${r._id}`)}>
                  <div className="nd-related-img">
                    {r.image
                      ? <img src={r.image} alt={r.title} onError={e => e.target.style.display='none'} />
                      : <div className="nd-related-placeholder"><Newspaper size={24} /></div>
                    }
                    {r.category && <span className="nd-related-cat" style={{ background: catColor(r.category) }}>{r.category}</span>}
                  </div>
                  <div className="nd-related-body">
                    <span className="nd-related-date"><Calendar size={11} />{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <h3 className="nd-related-title">{r.title}</h3>
                    <span className="nd-related-link">Read <ChevronRight size={13} /></span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
