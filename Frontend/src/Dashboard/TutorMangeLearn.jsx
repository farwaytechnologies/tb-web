import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Plus, Edit2, Trash2, Search, X, Save,
  Code, ChevronDown, ChevronUp, Eye, Zap, Layers
} from 'lucide-react';
import '../Styles/DashbordStyle/TutorMangeLearn.css';

const API_URL = import.meta.env.VITE_API_URL;
const blankMod = () => ({ title: '', description: '', content: '', codeExample: '', image: '' });
const blankForm = () => ({ language: '', shortDescription: '', image: '', modules: [blankMod()] });

export default function TutorManageLearn() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [learns, setLearns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(blankForm());
  const [saving, setSaving] = useState(false);
  const [expandedMod, setExpandedMod] = useState(0);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored || stored.role !== 'tutor') { navigate('/login'); return; }
    setUser(stored);
    fetchData(stored._id || stored.id);
  }, [navigate]);

  const fetchData = (tutorId) =>
    fetch(`${API_URL}/api/learn`)
      .then(r => r.json())
      .then(d => {
        const all = Array.isArray(d) ? d : [];
        // Show only this tutor's content
        setLearns(all.filter(l => l.createdBy === tutorId || String(l.createdBy) === String(tutorId)));
        setLoading(false);
      })
      .catch(() => setLoading(false));

  const filtered = learns.filter(l => {
    const q = search.toLowerCase();
    return !q || l.language?.toLowerCase().includes(q) || l.shortDescription?.toLowerCase().includes(q);
  });

  const totalModules = learns.reduce((s, l) => s + (l.modules?.length || 0), 0);

  const openCreate = () => { setEditId(null); setForm(blankForm()); setShowForm(true); setExpandedMod(0); };
  const openEdit = (item) => {
    setEditId(item._id);
    setForm({
      language: item.language || '',
      shortDescription: item.shortDescription || '',
      image: item.image || '',
      modules: item.modules?.length
        ? item.modules.map(m => ({ title: m.title||'', description: m.description||'', content: m.content||'', codeExample: m.codeExample||'', image: m.image||'' }))
        : [blankMod()]
    });
    setShowForm(true);
    setExpandedMod(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this learn content?')) return;
    await fetch(`${API_URL}/api/learn/${id}`, { method: 'DELETE' });
    setLearns(prev => prev.filter(l => l._id !== id));
  };

  const handleSave = async () => {
    if (!form.language.trim()) return alert('Language name is required.');
    if (form.modules.some(m => !m.title.trim())) return alert('All modules need a title.');
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/api/learn/${editId}` : `${API_URL}/api/learn`;
    const payload = editId ? form : { ...form, createdBy: user?._id || user?.id };
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) return alert('Save failed');
    setShowForm(false);
    fetchData(user?._id || user?.id);
  };

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setMod = (mi, k, v) => setForm(f => ({ ...f, modules: f.modules.map((m, i) => i === mi ? { ...m, [k]: v } : m) }));
  const addMod = () => { setForm(f => ({ ...f, modules: [...f.modules, blankMod()] })); setExpandedMod(form.modules.length); };
  const remMod = (i) => setForm(f => ({ ...f, modules: f.modules.filter((_, j) => j !== i) }));

  return (
    <div className="tml-page">
      {/* Header */}
      <div className="tml-header">
        <div className="tml-header-glow" />
        <div className="tml-header-left">
          <div className="tml-header-icon"><BookOpen size={22} /></div>
          <div>
            <h1>Learn Content</h1>
            <p>{learns.length} course{learns.length !== 1 ? 's' : ''} · {totalModules} modules</p>
          </div>
        </div>
        <button className="tml-btn-add" onClick={openCreate}>
          <Plus size={15} /> New Course
        </button>
      </div>

      {/* Stats */}
      <div className="tml-stats">
        {[
          { icon: BookOpen, label: 'Courses', val: learns.length, color: '#f59e0b' },
          { icon: Layers,   label: 'Modules',  val: totalModules,  color: '#10b981' },
          { icon: Zap,      label: 'Points',   val: `+${learns.length * 15}`, color: '#8b5cf6' },
        ].map(({ icon: Icon, label, val, color }) => (
          <div key={label} className="tml-stat-card">
            <div className="tml-stat-icon" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <span className="tml-stat-val" style={{ color }}>{val}</span>
              <span className="tml-stat-lbl">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="tml-controls">
        <div className="tml-search">
          <Search size={14} />
          <input
            placeholder="Search by language or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="tml-loading"><div className="tml-spinner" /><p>Loading...</p></div>
      ) : filtered.length === 0 ? (
        <div className="tml-empty">
          <BookOpen size={40} />
          <h3>{search ? 'No results found' : 'No learn content yet'}</h3>
          <p>{search ? 'Try a different search term.' : 'Create your first course to earn +15 reward points.'}</p>
          {!search && <button className="tml-btn-add" onClick={openCreate}><Plus size={14} /> Create Course</button>}
        </div>
      ) : (
        <div className="tml-grid">
          {filtered.map(item => (
            <div key={item._id} className="tml-card">
              <div className="tml-card-img">
                {item.image
                  ? <img src={item.image} alt={item.language} onError={e => e.target.style.display='none'} />
                  : <div className="tml-card-img-placeholder"><BookOpen size={28} /></div>
                }
                <span className="tml-card-badge"><Layers size={11} /> {item.modules?.length || 0}</span>
              </div>
              <div className="tml-card-body">
                <h3 className="tml-card-title">{item.language}</h3>
                <p className="tml-card-desc">{item.shortDescription || 'No description'}</p>
                <p className="tml-card-date">
                  {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <div className="tml-card-actions">
                  <button className="tml-action-btn" onClick={() => setPreview(item)}>
                    <Eye size={13} /> Preview
                  </button>
                  <button className="tml-action-btn" onClick={() => openEdit(item)}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button className="tml-action-btn danger" onClick={() => handleDelete(item._id)}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="tml-overlay" onClick={() => setShowForm(false)}>
          <div className="tml-modal" onClick={e => e.stopPropagation()}>
            <div className="tml-modal-header">
              <h2>{editId ? 'Edit Course' : 'New Course'}</h2>
              <button className="tml-modal-close" onClick={() => setShowForm(false)}><X size={16} /></button>
            </div>

            <div className="tml-form-scroll">
              {/* Basic Info */}
              <div className="tml-form-section">
                <h4 className="tml-section-title">Basic Info</h4>
                <div className="tml-form-grid">
                  <div className="tml-field">
                    <label>Language / Course Name *</label>
                    <input value={form.language} onChange={e => sf('language', e.target.value)} placeholder="e.g. Python, JavaScript" />
                  </div>
                  <div className="tml-field">
                    <label>Cover Image URL</label>
                    <input value={form.image} onChange={e => sf('image', e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="tml-field tml-field-full">
                    <label>Short Description</label>
                    <textarea rows={2} value={form.shortDescription} onChange={e => sf('shortDescription', e.target.value)} placeholder="Brief overview of this course..." />
                  </div>
                  {form.image && (
                    <div className="tml-field tml-field-full">
                      <img src={form.image} alt="preview" className="tml-img-preview" onError={e => e.target.style.display='none'} />
                    </div>
                  )}
                </div>
              </div>

              {/* Modules */}
              <div className="tml-form-section">
                <div className="tml-section-header">
                  <h4 className="tml-section-title"><Code size={14} /> Modules ({form.modules.length})</h4>
                  <button className="tml-add-mod-btn" onClick={addMod}><Plus size={13} /> Add Module</button>
                </div>
                <div className="tml-modules-list">
                  {form.modules.map((mod, mi) => (
                    <div key={mi} className="tml-module-block">
                      <div className="tml-module-header" onClick={() => setExpandedMod(expandedMod === mi ? -1 : mi)}>
                        <span className="tml-module-label">
                          <span className="tml-module-num">{mi + 1}</span>
                          {mod.title || 'Untitled Module'}
                        </span>
                        <div className="tml-module-header-right">
                          {form.modules.length > 1 && (
                            <button className="tml-rem-btn" onClick={e => { e.stopPropagation(); remMod(mi); }}>
                              <Trash2 size={12} />
                            </button>
                          )}
                          {expandedMod === mi ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </div>
                      </div>
                      {expandedMod === mi && (
                        <div className="tml-module-body">
                          <div className="tml-field">
                            <label>Title *</label>
                            <input value={mod.title} onChange={e => setMod(mi, 'title', e.target.value)} placeholder="Module title..." />
                          </div>
                          <div className="tml-field">
                            <label>Short Description</label>
                            <textarea rows={2} value={mod.description} onChange={e => setMod(mi, 'description', e.target.value)} placeholder="What this module covers..." />
                          </div>
                          <div className="tml-field">
                            <label>Detailed Content</label>
                            <textarea rows={5} value={mod.content} onChange={e => setMod(mi, 'content', e.target.value)} placeholder="Full explanation, theory, examples..." />
                          </div>
                          <div className="tml-field">
                            <label>Code Example</label>
                            <textarea className="tml-code-input" rows={4} value={mod.codeExample} onChange={e => setMod(mi, 'codeExample', e.target.value)} placeholder={'// Paste code here...'} spellCheck={false} />
                          </div>
                          <div className="tml-field">
                            <label>Module Image URL</label>
                            <input value={mod.image} onChange={e => setMod(mi, 'image', e.target.value)} placeholder="https://..." />
                            {mod.image && <img src={mod.image} alt="mod" className="tml-img-preview" onError={e => e.target.style.display='none'} />}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="tml-modal-footer">
              <button className="tml-btn-save" onClick={handleSave} disabled={saving}>
                <Save size={14} /> {saving ? 'Saving...' : editId ? 'Update' : 'Publish'}
              </button>
              <button className="tml-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="tml-overlay" onClick={() => setPreview(null)}>
          <div className="tml-preview-modal" onClick={e => e.stopPropagation()}>
            <button className="tml-modal-close tml-preview-close" onClick={() => setPreview(null)}><X size={16} /></button>
            {preview.image && <img src={preview.image} alt={preview.language} className="tml-preview-img" />}
            <div className="tml-preview-body">
              <h2>{preview.language}</h2>
              <p className="tml-preview-desc">{preview.shortDescription}</p>
              <div className="tml-preview-modules">
                {preview.modules?.map((m, i) => (
                  <div key={i} className="tml-preview-module">
                    <h4><span className="tml-module-num">{i + 1}</span> {m.title}</h4>
                    {m.description && <p className="tml-preview-mod-desc">{m.description}</p>}
                    {m.content && <p className="tml-preview-mod-content">{m.content}</p>}
                    {m.codeExample && <pre className="tml-preview-code">{m.codeExample}</pre>}
                    {m.image && <img src={m.image} alt={m.title} className="tml-preview-mod-img" onError={e => e.target.style.display='none'} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
