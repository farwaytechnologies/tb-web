import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Tag, Share2, Copy, Check, BookOpen, ChevronRight } from 'lucide-react';
import '../Styles/PagesStyle/BlogDetails.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CAT_COLORS = {
  technology: '#3b82f6', tutorial: '#8b5cf6', ai: '#6366f1', science: '#10b981',
  business: '#f59e0b', education: '#06b6d4', design: '#ec4899', general: '#64748b',
};
const catColor = (c) => CAT_COLORS[c?.toLowerCase()] || '#6366f1';

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      fetch(`${API_URL}/api/blogs/${id}`).then(r => r.json()),
      fetch(`${API_URL}/api/blogs`).then(r => r.json()),
    ]).then(([single, all]) => {
      setPost(single);
      setRelated(Array.isArray(all) ? all.filter(b => b._id !== id).slice(0, 3) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const readingTime = post ? Math.max(1, Math.ceil((post.content?.split(' ').length || 0) / 200)) : 0;

  const share = (platform) => {
    const title = encodeURIComponent(post.title);
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
    <div className="bd-page"><div className="bd-loading"><div className="bd-spinner" /><p>Loading article...</p></div></div>
  );
  if (!post) return (
    <div className="bd-page"><div className="bd-error">
      <BookOpen size={48} />
      <h2>Article not found</h2>
      <Link to="/blog" className="bd-error-btn">← Back to Blog</Link>
    </div></div>
  );

  const color = catColor(post.category);

  return (
    <div className="bd-page">
      {post && (
        <SEO
          title={post.title}
          description={post.description || post.content?.slice(0, 155)}
          url={`/blog/${id}`}
          image={post.image}
          article
          publishedTime={post.createdAt}
          modifiedTime={post.updatedAt}
          author={post.author}
          keywords={post.tags?.join(', ')}
        />
      )}
      {/* Cover */}
      <div className="bd-cover" style={post.image ? {} : { background: 'linear-gradient(135deg, #0f172a, #1e1b4b)' }}>
        {post.image && <img src={post.image} alt={post.title} className="bd-cover-img" onError={e => e.target.style.display='none'} />}
        <div className="bd-cover-overlay" />
        <div className="bd-cover-content">
          <button className="bd-back" onClick={() => navigate('/blog')}><ArrowLeft size={15} /> Blog</button>
          {post.category && <span className="bd-cover-cat" style={{ background: color }}>{post.category}</span>}
          <h1 className="bd-cover-title">{post.title}</h1>
          <div className="bd-cover-meta">
            {post.author && <span><User size={13} />{post.author}</span>}
            <span><Calendar size={13} />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span><Clock size={13} />{readingTime} min read</span>
          </div>
          {post.tags?.length > 0 && (
            <div className="bd-cover-tags">
              <Tag size={12} />
              {post.tags.slice(0, 4).map((t, i) => <span key={i} className="bd-tag">{t}</span>)}
            </div>
          )}
        </div>
      </div>

      <div className="bd-layout">
        {/* Main */}
        <main className="bd-main">
          <article className="bd-article">
            {/* Lead */}
            {post.description && (
              <p className="bd-lead">{post.description}</p>
            )}

            {/* Main content */}
            {post.content && (
              <p className="bd-content-text">{post.content}</p>
            )}

            {/* Detailed sections */}
            {Array.isArray(post.detailedSections) && post.detailedSections.length > 0 && (
              <div className="bd-sections">
                {post.detailedSections.map((sec, i) => (
                  <section key={i} className="bd-section">
                    {sec.heading && <h2 className="bd-section-heading" style={{ borderBottomColor: color }}>{sec.heading}</h2>}
                    {sec.text && <p className="bd-section-text">{sec.text}</p>}
                    {Array.isArray(sec.list) && sec.list.length > 0 && (
                      <ul className="bd-list">
                        {sec.list.map((item, j) => (
                          <li key={j}>
                            <span className="bd-list-dot" style={{ background: color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {Array.isArray(sec.tips) && sec.tips.length > 0 && (
                      <div className="bd-tips">
                        <div className="bd-tips-header">💡 Pro Tips</div>
                        <ul className="bd-tips-list">
                          {sec.tips.map((tip, j) => <li key={j}>{tip}</li>)}
                        </ul>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}

            {/* Gallery */}
            {Array.isArray(post.images) && post.images.length > 0 && (
              <div className="bd-gallery">
                <h3 className="bd-gallery-title">Gallery</h3>
                <div className="bd-gallery-grid">
                  {post.images.map((img, i) => (
                    <div key={i} className="bd-gallery-item">
                      <img src={img} alt={`Gallery ${i + 1}`} onError={e => e.target.style.display='none'} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="bd-share">
              <span className="bd-share-label"><Share2 size={14} /> Share</span>
              <div className="bd-share-btns">
                <button className="bd-share-btn bd-twitter" onClick={() => share('twitter')} title="Twitter">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </button>
                <button className="bd-share-btn bd-facebook" onClick={() => share('facebook')} title="Facebook">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </button>
                <button className="bd-share-btn bd-linkedin" onClick={() => share('linkedin')} title="LinkedIn">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </button>
                <button className="bd-share-btn bd-copy" onClick={() => share('copy')} title="Copy link">
                  {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            </div>
          </article>

          {/* Related */}
          {related.length > 0 && (
            <section className="bd-related">
              <h2 className="bd-related-heading">More Articles</h2>
              <div className="bd-related-grid">
                {related.map(r => (
                  <Link key={r._id} to={`/blog/${r._id}`} className="bd-related-card">
                    <div className="bd-related-img">
                      {r.image
                        ? <img src={r.image} alt={r.title} onError={e => e.target.style.display='none'} />
                        : <div className="bd-related-placeholder"><BookOpen size={24} /></div>
                      }
                      {r.category && <span className="bd-related-cat" style={{ background: catColor(r.category) }}>{r.category}</span>}
                    </div>
                    <div className="bd-related-body">
                      {r.author && <span className="bd-related-author"><User size={11} />{r.author}</span>}
                      <h3 className="bd-related-title">{r.title}</h3>
                      <span className="bd-related-link">Read <ChevronRight size={13} /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="bd-sidebar">
          <div className="bd-sidebar-card">
            <h4>About the Author</h4>
            <div className="bd-author">
              <div className="bd-author-avatar" style={{ background: color }}>
                {post.author?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <p className="bd-author-name">{post.author || 'Anonymous'}</p>
                <p className="bd-author-date">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {post.tags?.length > 0 && (
            <div className="bd-sidebar-card">
              <h4><Tag size={14} /> Tags</h4>
              <div className="bd-sidebar-tags">
                {post.tags.map((t, i) => <span key={i} className="bd-tag">{t}</span>)}
              </div>
            </div>
          )}

          <Link to="/blog" className="bd-sidebar-back">
            <ArrowLeft size={14} /> All Articles
          </Link>
        </aside>
      </div>
    </div>
  );
}
