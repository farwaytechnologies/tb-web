import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Edit2, Trash2, Search, X, Save, Code, ChevronDown, ChevronUp, Eye, Upload, FileJson, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import '../Styles/DashbordStyle/ManageLearn.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const blankMod = () => ({ title: '', description: '', content: '', codeExample: '', image: '' });
const blankForm = () => ({ language: '', shortDescription: '', image: '', modules: [blankMod()] });

export default function AdminManageLearn() {
  const navigate = useNavigate();
  const [learns, setLearns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(blankForm());
  const [saving, setSaving] = useState(false);
  const [expandedMod, setExpandedMod] = useState(0);
  const [preview, setPreview] = useState(null);

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMeta, setUploadMeta] = useState({ language: '', shortDescription: '', image: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null); // { success, message }
  const fileInputRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchData();
  }, [navigate]);

  const fetchData = () =>
    fetch(`${API_URL}/api/learn`).then(r => r.json())
      .then(d => { setLearns(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));

  const filtered = learns.filter(l => {
    const q = search.toLowerCase();
    return !q || l.language?.toLowerCase().includes(q) || l.shortDescription?.toLowerCase().includes(q);
  });

  const openCreate = () => { setEditId(null); setForm(blankForm()); setShowForm(true); setExpandedMod(0); };
  const openEdit = (item) => {
    setEditId(item._id);
    setForm({ language: item.language || '', shortDescription: item.shortDescription || '', image: item.image || '', modules: item.modules?.length ? item.modules.map(m => ({ title: m.title||'', description: m.description||'', content: m.content||'', codeExample: m.codeExample||'', image: m.image||'' })) : [blankMod()] });
    setShowForm(true); setExpandedMod(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this learn module?')) return;
    await fetch(`${API_URL}/api/learn/${id}`, { method: 'DELETE' });
    setLearns(prev => prev.filter(l => l._id !== id));
  };

  const handleSave = async () => {
    if (!form.language.trim()) return alert('Language name is required.');
    if (form.modules.some(m => !m.title.trim())) return alert('All modules need a title.');
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/api/learn/${editId}` : `${API_URL}/api/learn`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    if (!res.ok) return alert('Save failed');
    setShowForm(false);
    fetchData();
  };

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setMod = (mi, k, v) => setForm(f => ({ ...f, modules: f.modules.map((m, i) => i === mi ? { ...m, [k]: v } : m) }));
  const addMod = () => { setForm(f => ({ ...f, modules: [...f.modules, blankMod()] })); setExpandedMod(form.modules.length); };
  const remMod = (i) => setForm(f => ({ ...f, modules: f.modules.filter((_, j) => j !== i) }));

  const totalMods = learns.reduce((s, l) => s + (l.modules?.length || 0), 0);

  const openUpload = () => {
    setUploadFile(null);
    setUploadMeta({ language: '', shortDescription: '', image: '' });
    setUploadResult(null);
    setShowUpload(true);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setUploadFile(f);
    setUploadResult(null);
    // Pre-fill language name from filename for .docx
    if (f.name.endsWith('.docx') && !uploadMeta.language) {
      setUploadMeta(m => ({ ...m, language: f.name.replace(/\.docx$/i, '') }));
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const fd = new FormData();
      fd.append('file', uploadFile);
      if (uploadFile.name.endsWith('.docx')) {
        fd.append('language', uploadMeta.language);
        fd.append('shortDescription', uploadMeta.shortDescription);
        fd.append('image', uploadMeta.image);
      }
      const res = await fetch(`${API_URL}/api/learn/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setUploadResult({ success: true, message: data.message });
      fetchData();
    } catch (err) {
      setUploadResult({ success: false, message: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="ml-page">
      <div className="ml-header">
        <BookOpen size={26} className="ml-header-icon" />
        <div><h1>Manage Learn</h1><p>{learns.length} languages · {totalMods} modules</p></div>
        <div className="ml-header-actions">
          <button className="ml-btn-import" onClick={openUpload}><Upload size={16} /> Import Course</button>
          <button className="ml-btn-add" onClick={openCreate}><Plus size={16} /> Add Course</button>
        </div>
      </div>

      <div className="ml-stats">
        {[
          { label: 'Languages', val: learns.length, color: '#6366f1' },
          { label: 'Modules', val: totalMods, color: '#0891b2' },
          { label: 'This Month', val: learns.filter(l => new Date(l.createdAt) > new Date(Date.now() - 30*86400000)).length, color: '#059669' },
        ].map(s => (
          <div key={s.label} className="ml-stat">
            <span className="ml-stat-val" style={{ color: s.color }}>{s.val}</span>
            <span className="ml-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="ml-controls">
        <div className="ml-search-wrap">
          <Search size={14} />
          <input placeholder="Search language or description..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
      </div>

      {loading ? <p className="ml-empty">Loading...</p> : filtered.length === 0 ? (
        <p className="ml-empty">No learn modules found.</p>
      ) : (
        <div className="ml-grid">
          {filtered.map(item => (
            <div key={item._id} className="ml-card">
              <div className="ml-card-img-wrap">
                {item.image ? <img src={item.image} alt={item.language} className="ml-card-img" onError={e => { e.target.style.display='none'; }} /> : <div className="ml-card-img-placeholder">📚</div>}
                <span className="ml-card-badge">{item.modules?.length || 0} modules</span>
              </div>
              <div className="ml-card-body">
                <h3 className="ml-card-title">{item.language}</h3>
                <p className="ml-card-desc">{item.shortDescription || 'No description'}</p>
                <p className="ml-card-meta">{new Date(item.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</p>
                <div className="ml-card-actions">
                  <button className="ml-action-btn" onClick={() => setPreview(item)}><Eye size={14} /> Preview</button>
                  <button className="ml-action-btn" onClick={() => openEdit(item)}><Edit2 size={14} /> Edit</button>
                  <button className="ml-action-btn danger" onClick={() => handleDelete(item._id)}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="ml-overlay" onClick={() => setShowForm(false)}>
          <div className="ml-modal" onClick={e => e.stopPropagation()}>
            <div className="ml-modal-header">
              <h2>{editId ? 'Edit Language' : 'New Language'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <div className="ml-form-scroll">
              {/* Basic */}
              <div className="ml-form-section">
                <h4 className="ml-form-section-title">Basic Info</h4>
                <div className="ml-form-grid">
                  <div className="ml-field">
                    <label>Language Name *</label>
                    <input value={form.language} onChange={e => sf('language', e.target.value)} placeholder="e.g. Python, JavaScript" />
                  </div>
                  <div className="ml-field">
                    <label>Cover Image URL</label>
                    <input value={form.image} onChange={e => sf('image', e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="ml-field ml-field-full">
                    <label>Short Description</label>
                    <textarea rows={2} value={form.shortDescription} onChange={e => sf('shortDescription', e.target.value)} placeholder="Brief overview of this language..." />
                  </div>
                  {form.image && <div className="ml-field ml-field-full"><img src={form.image} alt="preview" className="ml-img-preview" onError={e => e.target.style.display='none'} /></div>}
                </div>
              </div>

              {/* Modules */}
              <div className="ml-form-section">
                <div className="ml-form-section-header">
                  <h4 className="ml-form-section-title"><Code size={14} /> Modules ({form.modules.length})</h4>
                  <button className="ml-add-btn" onClick={addMod}><Plus size={13} /> Add Module</button>
                </div>
                <div className="ml-modules-list">
                  {form.modules.map((mod, mi) => (
                    <div key={mi} className="ml-module-block">
                      <div className="ml-module-header" onClick={() => setExpandedMod(expandedMod === mi ? -1 : mi)}>
                        <span>Module {mi + 1}{mod.title ? `: ${mod.title}` : ''}</span>
                        <div className="ml-module-header-actions">
                          {form.modules.length > 1 && <button className="ml-rem-btn" onClick={e => { e.stopPropagation(); remMod(mi); }}><Trash2 size={12} /></button>}
                          {expandedMod === mi ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </div>
                      </div>
                      {expandedMod === mi && (
                        <div className="ml-module-body">
                          <div className="ml-field">
                            <label>Title *</label>
                            <input value={mod.title} onChange={e => setMod(mi, 'title', e.target.value)} placeholder="Module title..." />
                          </div>
                          <div className="ml-field">
                            <label>Short Description</label>
                            <textarea rows={2} value={mod.description} onChange={e => setMod(mi, 'description', e.target.value)} placeholder="What this module covers..." />
                          </div>
                          <div className="ml-field">
                            <label>Detailed Content</label>
                            <textarea rows={4} value={mod.content} onChange={e => setMod(mi, 'content', e.target.value)} placeholder="Full explanation, theory, examples..." />
                          </div>
                          <div className="ml-field">
                            <label>Code Example</label>
                            <textarea className="ml-code-input" rows={4} value={mod.codeExample} onChange={e => setMod(mi, 'codeExample', e.target.value)} placeholder={'// Paste code here...\nprint("Hello World")'} spellCheck={false} />
                          </div>
                          <div className="ml-field">
                            <label>Module Image URL</label>
                            <input value={mod.image} onChange={e => setMod(mi, 'image', e.target.value)} placeholder="https://..." />
                            {mod.image && <img src={mod.image} alt="mod" className="ml-img-preview" onError={e => e.target.style.display='none'} />}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="ml-modal-footer">
              <button className="ml-btn-save" onClick={handleSave} disabled={saving}><Save size={15} /> {saving ? 'Saving...' : editId ? 'Update' : 'Publish'}</button>
              <button className="ml-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="ml-overlay" onClick={() => setPreview(null)}>
          <div className="ml-preview-modal" onClick={e => e.stopPropagation()}>
            <button className="ml-preview-close" onClick={() => setPreview(null)}><X size={18} /></button>
            {preview.image && <img src={preview.image} alt={preview.language} className="ml-preview-img" />}
            <div className="ml-preview-body">
              <h2>{preview.language}</h2>
              <p className="ml-preview-desc">{preview.shortDescription}</p>
              {preview.modules?.map((m, i) => (
                <div key={i} className="ml-preview-module">
                  <h4>Module {i + 1}: {m.title}</h4>
                  {m.description && <p>{m.description}</p>}
                  {m.content && <p>{m.content}</p>}
                  {m.codeExample && <pre className="ml-preview-code">{m.codeExample}</pre>}
                  {m.image && <img src={m.image} alt={m.title} style={{ width:'100%', borderRadius:'8px', marginTop:'8px' }} onError={e => e.target.style.display='none'} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="ml-overlay" onClick={() => setShowUpload(false)}>
          <div className="ml-modal ml-upload-modal" onClick={e => e.stopPropagation()}>
            <div className="ml-modal-header">
              <h2><Upload size={18} /> Import Course from File</h2>
              <button onClick={() => setShowUpload(false)}><X size={18} /></button>
            </div>
            <div className="ml-form-scroll">
              <div className="ml-upload-info">
                <div className="ml-upload-format">
                  <FileJson size={20} />
                  <div>
                    <strong>.json</strong>
                    <span>Single or array of course objects with language, modules, etc.</span>
                  </div>
                </div>
                <div className="ml-upload-format">
                  <FileText size={20} />
                  <div>
                    <strong>.docx</strong>
                    <span>Word doc — use H1/H2 headings for module titles, paragraphs for content.</span>
                  </div>
                </div>
              </div>

              {/* Drop zone */}
              <div
                className={`ml-dropzone ${uploadFile ? 'ml-dropzone--has-file' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setUploadFile(f); if (f.name.endsWith('.docx') && !uploadMeta.language) setUploadMeta(m => ({ ...m, language: f.name.replace(/\.docx$/i, '') })); } }}
              >
                <input ref={fileInputRef} type="file" accept=".json,.docx" style={{ display: 'none' }} onChange={handleFileChange} />
                {uploadFile ? (
                  <div className="ml-dropzone-file">
                    {uploadFile.name.endsWith('.json') ? <FileJson size={28} /> : <FileText size={28} />}
                    <span>{uploadFile.name}</span>
                    <button className="ml-dropzone-clear" onClick={e => { e.stopPropagation(); setUploadFile(null); setUploadResult(null); }}><X size={14} /></button>
                  </div>
                ) : (
                  <>
                    <Upload size={28} />
                    <p>Click or drag & drop a <strong>.json</strong> or <strong>.docx</strong> file</p>
                  </>
                )}
              </div>

              {/* Extra fields for .docx */}
              {uploadFile?.name.endsWith('.docx') && (
                <div className="ml-form-section" style={{ marginTop: '16px' }}>
                  <h4 className="ml-form-section-title">Course Info (for .docx)</h4>
                  <div className="ml-form-grid">
                    <div className="ml-field">
                      <label>Language / Course Name *</label>
                      <input value={uploadMeta.language} onChange={e => setUploadMeta(m => ({ ...m, language: e.target.value }))} placeholder="e.g. Python Basics" />
                    </div>
                    <div className="ml-field">
                      <label>Cover Image URL</label>
                      <input value={uploadMeta.image} onChange={e => setUploadMeta(m => ({ ...m, image: e.target.value }))} placeholder="https://..." />
                    </div>
                    <div className="ml-field ml-field-full">
                      <label>Short Description</label>
                      <textarea rows={2} value={uploadMeta.shortDescription} onChange={e => setUploadMeta(m => ({ ...m, shortDescription: e.target.value }))} placeholder="Brief overview..." />
                    </div>
                  </div>
                </div>
              )}

              {/* Result feedback */}
              {uploadResult && (
                <div className={`ml-upload-result ${uploadResult.success ? 'ml-upload-result--ok' : 'ml-upload-result--err'}`}>
                  {uploadResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{uploadResult.message}</span>
                </div>
              )}
            </div>
            <div className="ml-modal-footer">
              <button
                className="ml-btn-save"
                onClick={handleUploadSubmit}
                disabled={!uploadFile || uploading}
              >
                <Upload size={15} /> {uploading ? 'Importing...' : 'Import'}
              </button>
              <button className="ml-btn-cancel" onClick={() => setShowUpload(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
