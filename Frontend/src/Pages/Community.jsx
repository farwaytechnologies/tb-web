import { useEffect, useState, useCallback, useRef } from 'react';
import { MessageSquare, Heart, Pin, Search, Plus, X, Send, Trash2, Users, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import '../Styles/PagesStyle/Community.css';
import SEO from '../Components/SEO';

const API = import.meta.env.VITE_API_URL;

const CATEGORIES = [
  { key: 'all',          label: 'All Posts',     color: '#8b5cf6' },
  { key: 'general',      label: 'General',       color: '#06b6d4' },
  { key: 'question',     label: 'Questions',     color: '#f59e0b' },
  { key: 'showcase',     label: 'Showcase',      color: '#10b981' },
  { key: 'resource',     label: 'Resources',     color: '#ec4899' },
  { key: 'announcement', label: 'Announcements', color: '#f87171' },
];

const CAT_COLORS = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]));

function authHeader() {
  const t = localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function Avatar({ user, size = 32 }) {
  if (user?.profilePic) return <div className="cm-avatar" style={{ width: size, height: size }}><img src={user.profilePic} alt={user.name} /></div>;
  return <div className="cm-avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>{user?.name?.[0]?.toUpperCase() || '?'}</div>;
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function Community() {
  const [posts, setPosts]           = useState([]);
  const [total, setTotal]           = useState(0);
  const [pages, setPages]           = useState(1);
  const [page, setPage]             = useState(1);
  const [category, setCategory]     = useState('all');
  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading]       = useState(true);
  const [stats, setStats]           = useState(null);
  const [showNew, setShowNew]       = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [toast, setToast]           = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`${API}/api/community/posts?${params}`);
      const d = await res.json();
      setPosts(d.posts || []);
      setTotal(d.total || 0);
      setPages(d.pages || 1);
    } catch { /* silent */ }
    setLoading(false);
  }, [page, category, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    fetch(`${API}/api/community/stats`)
      .then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="cm-page">
      <SEO
        title="Community — Ask, Share & Connect"
        description="Join the TechBorg learner community. Ask questions, share projects, discuss tech topics, and connect with developers and students across India."
        url="/community"
        keywords="TechBorg community, developer forum, coding questions, tech discussion, student community India"
      />

      {toast && <div className={`cm-toast cm-toast--${toast.type}`}>{toast.text}</div>}

      {/* Hero */}
      <div className="cm-hero">
        <div className="cm-hero-glow" />
        <h1>TechBorg <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Community</span></h1>
        <p>Ask questions, share projects, and learn together</p>
        {stats && (
          <div className="cm-hero-stats">
            <span className="cm-hero-stat"><strong>{stats.posts}</strong> posts</span>
            <span className="cm-hero-stat"><strong>{stats.comments}</strong> comments</span>
          </div>
        )}
      </div>

      <div className="cm-layout">
        {/* Sidebar */}
        <aside className="cm-sidebar">
          <div className="cm-sidebar-card">
            <h4>Categories</h4>
            {CATEGORIES.map(cat => (
              <button key={cat.key} className={`cm-cat-btn ${category === cat.key ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.key)}>
                <span className="cm-cat-dot" style={{ background: cat.color }} />
                {cat.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="cm-main">
          {/* Topbar */}
          <div className="cm-topbar">
            <form className="cm-search" onSubmit={handleSearch}>
              <Search size={15} />
              <input placeholder="Search posts..." value={searchInput}
                onChange={e => setSearchInput(e.target.value)} />
            </form>
            {currentUser ? (
              <button className="cm-new-btn" onClick={() => setShowNew(true)}>
                <Plus size={15} /> New Post
              </button>
            ) : (
              <a href="/login" className="cm-new-btn" style={{ textDecoration: 'none' }}>
                <Plus size={15} /> Sign in to Post
              </a>
            )}
          </div>

          {/* Posts */}
          {loading ? (
            <div className="cm-loading">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="cm-empty">
              <MessageSquare size={48} />
              <p>No posts yet. Be the first to start a discussion!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} currentUser={currentUser}
                onOpen={() => setSelectedPost(post)}
                onLiked={(id, data) => setPosts(ps => ps.map(p => p._id === id ? { ...p, likes: Array(data.likes).fill(null) } : p))}
                showToast={showToast} />
            ))
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="cm-pagination">
              <button className="cm-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`cm-page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="cm-page-btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* New Post Modal */}
      {showNew && (
        <NewPostModal onClose={() => setShowNew(false)}
          onCreated={(post) => { setPosts(ps => [post, ...ps]); setShowNew(false); showToast('ok', 'Post created!'); }} />
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal post={selectedPost} currentUser={currentUser}
          onClose={() => setSelectedPost(null)}
          onDeleted={(id) => { setPosts(ps => ps.filter(p => p._id !== id)); setSelectedPost(null); showToast('ok', 'Post deleted.'); }}
          showToast={showToast} />
      )}
    </div>
  );
}

/* ── Post Card ── */
function PostCard({ post, currentUser, onOpen, onLiked, showToast }) {
  const liked = currentUser && post.likes?.some(l => (l?._id || l) === currentUser.id);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) { showToast('err', 'Login to like posts'); return; }
    try {
      const res = await fetch(`${API}/api/community/posts/${post._id}/like`, { method: 'POST', headers: authHeader() });
      const d = await res.json();
      onLiked(post._id, d);
    } catch { showToast('err', 'Failed to like'); }
  };

  return (
    <div className={`cm-post-card ${post.isPinned ? 'pinned' : ''}`} onClick={onOpen}>
      <div className="cm-post-meta">
        <Avatar user={post.author} />
        <span className="cm-author-name">{post.author?.name || 'Unknown'}</span>
        {post.author?.role && <span className={`cm-role-badge ${post.author.role}`}>{post.author.role}</span>}
        {post.isPinned && <Pin size={13} className="cm-pin-icon" />}
        <span className="cm-post-time">{timeAgo(post.createdAt)}</span>
      </div>
      <div className="cm-post-title">{post.title}</div>
      <div className="cm-post-body">{post.body}</div>
      <div className="cm-post-footer">
        <span className="cm-cat-tag" style={{ background: `${CAT_COLORS[post.category]}18`, color: CAT_COLORS[post.category], border: `1px solid ${CAT_COLORS[post.category]}30` }}>
          {post.category}
        </span>
        {post.tags?.slice(0, 3).map(t => <span key={t} className="cm-tag">#{t}</span>)}
        <div className="cm-action-btns">
          <button className={`cm-action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} /> {post.likes?.length || 0}
          </button>
          <button className="cm-action-btn" onClick={onOpen}>
            <MessageSquare size={14} /> {post.commentCount || 0}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── New Post Modal ── */
function NewPostModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', body: '', category: 'general', tags: '' });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/community/posts`, {
        method: 'POST', headers: authHeader(),
        body: JSON.stringify({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }),
      });
      if (!res.ok) throw new Error();
      onCreated(await res.json());
    } catch { /* silent */ }
    setSaving(false);
  };

  return (
    <div className="cm-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cm-modal">
        <h2>Create Post</h2>
        <form onSubmit={submit}>
          <div className="cm-form-group">
            <label>Title</label>
            <input required maxLength={200} placeholder="What's on your mind?"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="cm-form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.filter(c => c.key !== 'all').map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div className="cm-form-group">
            <label>Content</label>
            <textarea required rows={6} maxLength={5000} placeholder="Share your thoughts, question, or project..."
              value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
          </div>
          <div className="cm-form-group">
            <label>Tags (comma separated)</label>
            <input placeholder="python, webdev, career" maxLength={150}
              value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          </div>
          <div className="cm-modal-actions">
            <button type="button" className="cm-btn cm-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="cm-btn cm-btn--primary" disabled={saving}>{saving ? 'Posting...' : 'Post'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Post Detail Modal ── */
function PostDetailModal({ post, currentUser, onClose, onDeleted, showToast }) {
  const [comments, setComments]   = useState([]);
  const [loadingC, setLoadingC]   = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [likes, setLikes]         = useState(post.likes?.length || 0);
  const [liked, setLiked]         = useState(currentUser && post.likes?.some(l => (l?._id || l) === currentUser.id));

  useEffect(() => {
    fetch(`${API}/api/community/posts/${post._id}/comments`)
      .then(r => r.json()).then(d => { setComments(d); setLoadingC(false); }).catch(() => setLoadingC(false));
  }, [post._id]);

  const handleLike = async () => {
    if (!currentUser) { showToast('err', 'Login to like'); return; }
    try {
      const res = await fetch(`${API}/api/community/posts/${post._id}/like`, { method: 'POST', headers: authHeader() });
      const d = await res.json();
      setLikes(d.likes); setLiked(d.liked);
    } catch { showToast('err', 'Failed'); }
  };

  const submitComment = async () => {
    if (!commentText.trim() || !currentUser) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/community/posts/${post._id}/comments`, {
        method: 'POST', headers: authHeader(),
        body: JSON.stringify({ body: commentText, parent: replyTo }),
      });
      const c = await res.json();
      if (replyTo) {
        setComments(cs => cs.map(cm => cm._id === replyTo ? { ...cm, replies: [...(cm.replies || []), c] } : cm));
      } else {
        setComments(cs => [...cs, { ...c, replies: [] }]);
      }
      setCommentText(''); setReplyTo(null);
    } catch { showToast('err', 'Failed to post comment'); }
    setSubmitting(false);
  };

  const deleteComment = async (id, parentId) => {
    try {
      await fetch(`${API}/api/community/comments/${id}`, { method: 'DELETE', headers: authHeader() });
      if (parentId) {
        setComments(cs => cs.map(c => c._id === parentId ? { ...c, replies: c.replies.filter(r => r._id !== id) } : c));
      } else {
        setComments(cs => cs.filter(c => c._id !== id));
      }
    } catch { showToast('err', 'Failed to delete'); }
  };

  const deletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await fetch(`${API}/api/community/posts/${post._id}`, { method: 'DELETE', headers: authHeader() });
      onDeleted(post._id);
    } catch { showToast('err', 'Failed to delete post'); }
  };

  const canDelete = currentUser && (currentUser.id === post.author?._id || currentUser.role === 'admin');

  return (
    <div className="cm-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cm-detail-modal">
        {/* Header */}
        <div className="cm-detail-header">
          <Avatar user={post.author} size={40} />
          <div className="cm-detail-header-text">
            <div className="cm-post-meta" style={{ marginBottom: '0.25rem' }}>
              <span className="cm-author-name">{post.author?.name}</span>
              {post.author?.role && <span className={`cm-role-badge ${post.author.role}`}>{post.author.role}</span>}
              <span className="cm-post-time">{timeAgo(post.createdAt)}</span>
            </div>
            <span className="cm-cat-tag" style={{ background: `${CAT_COLORS[post.category]}18`, color: CAT_COLORS[post.category], border: `1px solid ${CAT_COLORS[post.category]}30`, fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
              {post.category}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
            {canDelete && <button className="cm-action-btn" onClick={deletePost} title="Delete post"><Trash2 size={15} /></button>}
            <button className="cm-action-btn" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div className="cm-detail-title">{post.title}</div>
        <div className="cm-detail-body">{post.body}</div>

        {post.tags?.length > 0 && (
          <div className="cm-detail-tags">
            {post.tags.map(t => <span key={t} className="cm-tag">#{t}</span>)}
          </div>
        )}

        <div className="cm-detail-actions">
          <button className={`cm-action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            <Heart size={15} fill={liked ? 'currentColor' : 'none'} /> {likes} {likes === 1 ? 'Like' : 'Likes'}
          </button>
          <span className="cm-action-btn" style={{ cursor: 'default' }}>
            <MessageSquare size={15} /> {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>

        {/* Comments */}
        <div className="cm-comments-title">Comments</div>
        {loadingC ? <div className="cm-loading">Loading...</div> : (
          comments.map(c => (
            <CommentItem key={c._id} comment={c} currentUser={currentUser}
              onReply={() => setReplyTo(c._id)}
              onDelete={(id) => deleteComment(id, null)}
              onDeleteReply={(id) => deleteComment(id, c._id)}
              showToast={showToast} />
          ))
        )}

        {/* Comment input */}
        {currentUser ? (
          <div>
            {replyTo && (
              <div style={{ fontSize: '0.78rem', color: '#a78bfa', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Replying to comment <button onClick={() => setReplyTo(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
              </div>
            )}
            <div className="cm-comment-input-row">
              <Avatar user={currentUser} size={32} />
              <textarea rows={2} placeholder={replyTo ? 'Write a reply...' : 'Write a comment...'}
                value={commentText} onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); } }} />
              <button className="cm-comment-submit" onClick={submitComment} disabled={submitting || !commentText.trim()}>
                <Send size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="cm-login-prompt">
            <a href="/login">Sign in</a> to join the conversation
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Comment Item ── */
function CommentItem({ comment, currentUser, onReply, onDelete, onDeleteReply, showToast }) {
  const canDelete = currentUser && (currentUser.id === comment.author?._id || currentUser.role === 'admin');

  return (
    <div className="cm-comment">
      <Avatar user={comment.author} size={30} />
      <div className="cm-comment-body">
        <div className="cm-comment-bubble">
          <div className="cm-comment-author">
            {comment.author?.name}
            {comment.author?.role && <span className={`cm-role-badge ${comment.author.role}`} style={{ marginLeft: '0.4rem' }}>{comment.author.role}</span>}
          </div>
          <div className="cm-comment-text">{comment.body}</div>
        </div>
        <div className="cm-comment-footer">
          <span className="cm-comment-time">{timeAgo(comment.createdAt)}</span>
          {currentUser && <button className="cm-reply-btn" onClick={onReply}>Reply</button>}
          {canDelete && <button className="cm-reply-btn" style={{ color: '#f87171' }} onClick={() => onDelete(comment._id)}>Delete</button>}
        </div>
        {/* Replies */}
        {comment.replies?.length > 0 && (
          <div className="cm-replies">
            {comment.replies.map(r => (
              <div key={r._id} className="cm-comment" style={{ marginBottom: '0.75rem' }}>
                <Avatar user={r.author} size={26} />
                <div className="cm-comment-body">
                  <div className="cm-comment-bubble">
                    <div className="cm-comment-author">{r.author?.name}</div>
                    <div className="cm-comment-text">{r.body}</div>
                  </div>
                  <div className="cm-comment-footer">
                    <span className="cm-comment-time">{timeAgo(r.createdAt)}</span>
                    {currentUser && (currentUser.id === r.author?._id || currentUser.role === 'admin') && (
                      <button className="cm-reply-btn" style={{ color: '#f87171' }} onClick={() => onDeleteReply(r._id)}>Delete</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
