import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Plus, Edit2, Trash2, Search, X, Save,
  Tag, Image, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import '../Styles/DashbordStyle/ManageBlogs.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const blankSection = () => ({ heading: '', text: '', list: [''], tips: [''] });
const blankForm = (author = 'Admin') => ({
  title: '', description: '', content: '', author,
  image: '', images: [''], category: '', tags: [''],
  detailedSections: [blankSection()],
});

export default function AdminManageBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(blankForm());
  const [saving, setSaving] = useState(false);
  const [expandedSec, setExpandedSec] = useState(0);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = () =>
    fetch(`${API_URL}/api/blogs`)
      .then(r => r.json())
      .then(d => { setBlogs(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));

  const categories = ['All', ...new Set(blogs.map(b => b.category || 'General').filter(Boolean))];

  const filtered = blogs.filter(b => {
    const q = search.toLowerCase();
    const matchQ = !q || b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q) || b.category?.toLowerCase().includes(q);
    const matchC = catFilter === 'All' || b.category === catFilter;
    return matchQ && matchC;
  });

  const openCreate = () => { setEditId(null); setForm(blankForm()); setShowForm(true); setExpandedSec(0); };
  const openEdit = (b) => {
    setEditId(b._id);
    setForm({
      title: b.title || '', description: b.description || '', content: b.content || '',
      author: b.author || 'Admin', image: b.image || '', images: b.images?.length ? b.images : [''],
      category: b.category || '', tags: b.tags?.length ? b.tags : [''],
      detailedSections: b.detailedSections?.length
        ? b.detailedSections.map(s => ({ heading: s.heading || '', text: s.text || '', list: s.list?.length ? s.list : [''], tips: s.tips?.length ? s.tips : [''] }))
        : [blankSection()],
    });
    setShowForm(true); setExpandedSec(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    await fetch(`${API_URL}/api/blogs/${id}`, { method: 'DELETE' });
    setBlogs(prev => prev.filter(b => b._id !== id));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return alert('Title and content are required.');
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/api/blogs/${editId}` : `${API_URL}/api/blogs`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    if (!res.ok) return alert('Save failed');
    setShowForm(false);
    fetchBlogs();
  };

  // Form helpers
  const sf = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const setArr = (field, i, val) => setForm(f => { const a = [...f[field]]; a[i] = val; return { ...f, [field]: a }; });
  const addArr = (field) => setForm(f => ({ ...f, [field]: [...f[field], ''] }));
  const remArr = (field, i) => setForm(f => ({ ...f, [field]: f[field].filter((_, j) => j !== i) }));
  const setSec = (si, field, val) => setForm(f => { const s = f.detailedSections.map((sec, i) => i === si ? { ...sec, [field]: val } : sec); return { ...f, detailedSections: s }; });
  const setSecArr = (si, field, i, val) => setForm(f => { const s = f.detailedSections.map((sec, idx) => { if (idx !== si) return sec; const a = [...sec[field]]; a[i] = val; return { ...sec, [field]: a }; }); return { ...f, detailedSections: s }; });
  const addSecArr = (si, field) => setForm(f => { const s = f.detailedSections.map((sec, i) => i === si ? { ...sec, [field]: [...sec[field], ''] } : sec); return { ...f, detailedSections: s }; });
  const remSecArr = (si, field, i) => setForm(f => { const s = f.detailedSections.map((sec, idx) => i === 0 ? sec : idx === si ? { ...sec, [field]: sec[field].filter((_, j) => j !== i) } : sec); return { ...f, detailedSections: s }; });
  const addSec = () => setForm(f => ({ ...f, detailedSections: [...f.detailedSections, blankSection()] }));
  const remSec = (i) => setForm(f => ({ ...f, detailedSections: f.detailedSections.filter((_, j) => j !== i) }));

  const fmt = d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="mb-page">
      {/* Header */}
      <div className="mb-header">
        <FileText size={26} className="mb-header-icon" />
        <div>
          <h1>Manage Blogs</h1>
          <p>{blogs.length} total · {filtered.length} shown</p>
        </div>
        <button className="mb-btn-add" onClick={openCreate}><Plus size={16} /> New Blog</button>
      </div>

      {/* Stats */}
      <div className="mb-stats">
        {[
          { label: 'Total', val: blogs.length, color: '#6366f1' },
          { label: 'Categories', val: categories.length - 1, color: '#0891b2' },
          { label: 'This Month', val: blogs.filter(b => new Date(b.createdAt) > new Date(Date.now() - 30 * 86400000)).length, color: '#059669' },
        ].map(s => (
          <div key={s.label} className="mb-stat">
            <span className="mb-stat-val" style={{ color: s.color }}>{s.val}</span>
            <span className="mb-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-controls">
        <div className="mb-search-wrap">
          <Search size={14} />
          <input placeholder="Search title, author, category..." value={search}
            onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
        <div className="mb-cats">
          {categories.map(c => (
            <button key={c} className={`mb-cat-btn ${catFilter === c ? 'active' : ''}`}
              onClick={() => setCatFilter(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? <p className="mb-empty">Loading...</p> : filtered.length === 0 ? (
        <p className="mb-empty">No blogs found.</p>
      ) : (
        <div className="mb-grid">
          {filtered.map(b => (
            <div key={b._id} className="mb-card">
              <div className="mb-card-img-wrap">
                {b.image
                  ? <img src={b.image} alt={b.title} className="mb-card-img" onError={e => { e.target.style.display = 'none'; }} />
                  : <div className="mb-card-img-placeholder"><Image size={28} /></div>
                }
                <span className="mb-card-cat">{b.category || 'General'}</span>
              </div>
              <div className="mb-card-body">
                <h3 className="mb-card-title">{b.title}</h3>
                <p className="mb-card-desc">{b.description}</p>
                <div className="mb-card-meta">
                  <span className="mb-card-author">{b.author}</span>
                  <span className="mb-card-date">{fmt(b.createdAt)}</span>
                </div>
                {b.tags?.filter(Boolean).length > 0 && (
                  <div className="mb-card-tags">
                    {b.tags.filter(Boolean).slice(0, 3).map((t, i) => <span key={i} className="mb-tag">{t}</span>)}
                  </div>
                )}
                <div className="mb-card-actions">
                  <button className="mb-action-btn" onClick={() => setPreview(b)}><Eye size={14} /> Preview</button>
                  <button className="mb-action-btn" onClick={() => openEdit(b)}><Edit2 size={14} /> Edit</button>
                  <button className="mb-action-btn danger" onClick={() => handleDelete(b._id)}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="mb-overlay" onClick={() => setShowForm(false)}>
          <div className="mb-modal" onClick={e => e.stopPropagation()}>
            <div className="mb-modal-header">
              <h2>{editId ? 'Edit Blog' : 'New Blog'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>

            <div className="mb-form-scroll">
              {/* Basic */}
              <div className="mb-form-section">
                <h4 className="mb-form-section-title">Basic Info</h4>
                <div className="mb-form-grid">
                  <div className="mb-field mb-field-full">
                    <label>Title *</label>
                    <input value={form.title} onChange={e => sf('title', e.target.value)} placeholder="Blog title..." />
                  </div>
                  <div className="mb-field mb-field-full">
                    <label>Short Description *</label>
                    <input value={form.description} onChange={e => sf('description', e.target.value)} placeholder="Brief summary..." />
                  </div>
                  <div className="mb-field">
                    <label>Author</label>
                    <input value={form.author} onChange={e => sf('author', e.target.value)} />
                  </div>
                  <div className="mb-field">
                    <label>Category</label>
                    <input value={form.category} onChange={e => sf('category', e.target.value)} placeholder="e.g. Technology" />
                  </div>
                  <div className="mb-field mb-field-full">
                    <label>Cover Image URL</label>
                    <input value={form.image} onChange={e => sf('image', e.target.value)} placeholder="https://..." />
                    {form.image && <img src={form.image} alt="preview" className="mb-img-preview" onError={e => e.target.style.display='none'} />}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-form-section">
                <h4 className="mb-form-section-title">Main Content *</h4>
                <textarea className="mb-textarea-lg" value={form.content} rows={6}
                  onChange={e => sf('content', e.target.value)} placeholder="Write the main blog content..." />
              </div>

              {/* Tags */}
              <div className="mb-form-section">
                <div className="mb-form-section-header">
                  <h4 className="mb-form-section-title"><Tag size={14} /> Tags</h4>
                  <button className="mb-add-btn" onClick={() => addArr('tags')}><Plus size={13} /> Add</button>
                </div>
                <div className="mb-chips-row">
                  {form.tags.map((t, i) => (
                    <div key={i} className="mb-chip-input">
                      <input value={t} onChange={e => setArr('tags', i, e.target.value)} placeholder={`Tag ${i + 1}`} />
                      {form.tags.length > 1 && <button onClick={() => remArr('tags', i)}><X size={11} /></button>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Slideshow images */}
              <div className="mb-form-section">
                <div className="mb-form-section-header">
                  <h4 className="mb-form-section-title"><Image size={14} /> Slideshow Images</h4>
                  <button className="mb-add-btn" onClick={() => addArr('images')}><Plus size={13} /> Add</button>
                </div>
                {form.images.map((img, i) => (
                  <div key={i} className="mb-img-row">
                    <input value={img} onChange={e => setArr('images', i, e.target.value)} placeholder={`Image URL ${i + 1}`} />
                    {img && <img src={img} alt="" className="mb-img-thumb" onError={e => e.target.style.display='none'} />}
                    {form.images.length > 1 && <button className="mb-rem-btn" onClick={() => remArr('images', i)}><X size={12} /></button>}
                  </div>
                ))}
              </div>

              {/* Detailed Sections */}
              <div className="mb-form-section">
                <div className="mb-form-section-header">
                  <h4 className="mb-form-section-title">Detailed Sections</h4>
                  <button className="mb-add-btn" onClick={addSec}><Plus size={13} /> Add Section</button>
                </div>
                {form.detailedSections.map((sec, si) => (
                  <div key={si} className="mb-section-block">
                    <div className="mb-section-header" onClick={() => setExpandedSec(expandedSec === si ? -1 : si)}>
                      <span>Section {si + 1}{sec.heading ? `: ${sec.heading}` : ''}</span>
                      <div className="mb-section-header-actions">
                        {form.detailedSections.length > 1 && (
                          <button className="mb-rem-btn" onClick={e => { e.stopPropagation(); remSec(si); }}><Trash2 size={12} /></button>
                        )}
                        {expandedSec === si ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </div>
                    </div>
                    {expandedSec === si && (
                      <div className="mb-section-body">
                        <div className="mb-field">
                          <label>Heading</label>
                          <input value={sec.heading} onChange={e => setSec(si, 'heading', e.target.value)} placeholder="Section heading..." />
                        </div>
                        <div className="mb-field">
                          <label>Text</label>
                          <textarea rows={3} value={sec.text} onChange={e => setSec(si, 'text', e.target.value)} placeholder="Section content..." />
                        </div>
                        <div className="mb-field">
                          <div className="mb-form-section-header">
                            <label>List Items</label>
                            <button className="mb-add-btn" onClick={() => addSecArr(si, 'list')}><Plus size={12} /></button>
                          </div>
                          {sec.list.map((item, li) => (
                            <div key={li} className="mb-sub-row">
                              <input value={item} onChange={e => setSecArr(si, 'list', li, e.target.value)} placeholder={`Item ${li + 1}`} />
                              {sec.list.length > 1 && <button className="mb-rem-btn" onClick={() => remSecArr(si, 'list', li)}><X size={11} /></button>}
                            </div>
                          ))}
                        </div>
                        <div className="mb-field">
                          <div className="mb-form-section-header">
                            <label>Tips</label>
                            <button className="mb-add-btn" onClick={() => addSecArr(si, 'tips')}><Plus size={12} /></button>
                          </div>
                          {sec.tips.map((tip, ti) => (
                            <div key={ti} className="mb-sub-row">
                              <input value={tip} onChange={e => setSecArr(si, 'tips', ti, e.target.value)} placeholder={`Tip ${ti + 1}`} />
                              {sec.tips.length > 1 && <button className="mb-rem-btn" onClick={() => remSecArr(si, 'tips', ti)}><X size={11} /></button>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-modal-footer">
              <button className="mb-btn-save" onClick={handleSave} disabled={saving}>
                <Save size={15} /> {saving ? 'Saving...' : editId ? 'Update Blog' : 'Publish Blog'}
              </button>
              <button className="mb-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="mb-overlay" onClick={() => setPreview(null)}>
          <div className="mb-preview-modal" onClick={e => e.stopPropagation()}>
            <button className="mb-preview-close" onClick={() => setPreview(null)}><X size={18} /></button>
            {preview.image && <img src={preview.image} alt={preview.title} className="mb-preview-img" />}
            <div className="mb-preview-body">
              <span className="mb-card-cat">{preview.category || 'General'}</span>
              <h2>{preview.title}</h2>
              <p className="mb-preview-meta">{preview.author} · {fmt(preview.createdAt)}</p>
              <p className="mb-preview-desc">{preview.description}</p>
              <p className="mb-preview-content">{preview.content}</p>
              {preview.detailedSections?.filter(s => s.heading || s.text).map((s, i) => (
                <div key={i} className="mb-preview-section">
                  {s.heading && <h4>{s.heading}</h4>}
                  {s.text && <p>{s.text}</p>}
                  {s.list?.filter(Boolean).length > 0 && <ul>{s.list.filter(Boolean).map((l, j) => <li key={j}>{l}</li>)}</ul>}
                  {s.tips?.filter(Boolean).length > 0 && <div className="mb-preview-tips">{s.tips.filter(Boolean).map((t, j) => <span key={j}>💡 {t}</span>)}</div>}
                </div>
              ))}
              {preview.tags?.filter(Boolean).length > 0 && (
                <div className="mb-card-tags">{preview.tags.filter(Boolean).map((t, i) => <span key={i} className="mb-tag">{t}</span>)}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
