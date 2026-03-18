import { useEffect, useState } from 'react';
import { Plus, X, Edit2, Trash2, Newspaper, Search, Calendar, Tag, Image } from 'lucide-react';
import '../Styles/DashbordStyle/AdminManageNews.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const EMPTY = { title: '', content: '', date: '', category: '', image: '' };

const CATEGORY_COLORS = {
  technology: '#3b82f6', ai: '#8b5cf6', science: '#10b981', business: '#f59e0b',
  education: '#06b6d4', health: '#ef4444', innovation: '#f97316',
};
const catColor = (c) => CATEGORY_COLORS[c?.toLowerCase()] || '#6366f1';

export default function AdminManageNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchNews = () => {
    setLoading(true);
    fetch(`${API_URL}/api/news`)
      .then(r => r.json())
      .then(d => { setNews(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchNews(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true); };
  const openEdit = (item) => {
    setForm({ title: item.title, content: item.content || '', date: item.date ? item.date.split('T')[0] : '', category: item.category || '', image: item.image || '' });
    setEditId(item._id); setError(''); setModal(true);
  };
  const closeModal = () => { setModal(false); setEditId(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/api/news/${editId}` : `${API_URL}/api/news`;
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed to save');
      fetchNews(); closeModal();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news item?')) return;
    await fetch(`${API_URL}/api/news/${id}`, { method: 'DELETE' });
    setNews(prev => prev.filter(n => n._id !== id));
  };

  const filtered = news.filter(n => {
    const q = search.toLowerCase();
    return !q || n.title?.toLowerCase().includes(q) || n.category?.toLowerCase().includes(q);
  });

  return (
    <div className="amn-page">
      {/* Header */}
      <div className="amn-header">
        <div className="amn-header-left">
          <Newspaper size={22} className="amn-header-icon" />
          <div>
            <h1 className="amn-title">Manage News</h1>
            <p className="amn-subtitle">{news.length} article{news.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button className="amn-add-btn" onClick={openAdd}><Plus size={16} /> Add News</button>
      </div>

      {/* Search */}
      <div className="amn-toolbar">
        <div className="amn-search-wrap">
          <Search size={15} className="amn-search-icon" />
          <input className="amn-search" placeholder="Search news..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="amn-search-clear" onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="amn-loading"><div className="amn-spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="amn-empty"><Newspaper size={40} /><p>{search ? 'No results found.' : 'No news yet. Add your first article.'}</p></div>
      ) : (
        <div className="amn-grid">
          {filtered.map(item => (
            <div key={item._id} className="amn-card">
              <div className="amn-card-img">
                {item.image
                  ? <img src={item.image} alt={item.title} onError={e => e.target.style.display='none'} />
                  : <div className="amn-card-placeholder"><Newspaper size={28} /></div>
                }
                {item.category && <span className="amn-card-cat" style={{ background: catColor(item.category) }}>{item.category}</span>}
              </div>
              <div className="amn-card-body">
                <div className="amn-card-meta">
                  <span className="amn-card-date"><Calendar size={11} />{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="amn-card-title">{item.title}</h3>
                {item.content && <p className="amn-card-excerpt">{item.content}</p>}
              </div>
              <div className="amn-card-actions">
                <button className="amn-edit-btn" onClick={() => openEdit(item)}><Edit2 size={14} /> Edit</button>
                <button className="amn-del-btn" onClick={() => handleDelete(item._id)}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="amn-overlay" onClick={closeModal}>
          <div className="amn-modal" onClick={e => e.stopPropagation()}>
            <div className="amn-modal-header">
              <h2>{editId ? 'Edit Article' : 'Add Article'}</h2>
              <button className="amn-modal-close" onClick={closeModal}><X size={18} /></button>
            </div>
            <form className="amn-form" onSubmit={handleSubmit}>
              {error && <p className="amn-error">{error}</p>}

              <div className="amn-form-row">
                <div className="amn-field">
                  <label>Title *</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Article title" required />
                </div>
              </div>

              <div className="amn-form-row amn-two-col">
                <div className="amn-field">
                  <label>Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
                </div>
                <div className="amn-field">
                  <label>Category</label>
                  <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Technology" />
                </div>
              </div>

              <div className="amn-field">
                <label>Image URL</label>
                <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." />
                {form.image && (
                  <div className="amn-img-preview">
                    <img src={form.image} alt="preview" onError={e => e.target.style.display='none'} />
                  </div>
                )}
              </div>

              <div className="amn-field">
                <label>Content</label>
                <textarea rows={5} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Article content..." />
              </div>

              <div className="amn-form-actions">
                <button type="button" className="amn-cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="amn-save-btn" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Publish'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
