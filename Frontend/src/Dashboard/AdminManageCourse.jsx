import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Plus, Pencil, Trash2, Search, X, ChevronDown, ChevronUp,
  Video, FileText, Save, Loader, AlertCircle, CheckCircle, Users
} from 'lucide-react';
import '../Styles/DashbordStyle/AdminManageCourse.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const EMPTY_MODULE = () => ({
  name: '',
  videos: [{ title: '', video: '', description: '' }],
  learningContent: [{ heading: '', paragraph: '', image: '' }]
});

const EMPTY_FORM = () => ({
  title: '', description: '', detailedDescription: '',
  price: '', image: '', video: '', duration: '', level: '', instructor: '',
  modules: [EMPTY_MODULE()]
});

export default function AdminManageCourse() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM());
  const [expandedModules, setExpandedModules] = useState({});
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'admin') { navigate('/login'); return; }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, eRes] = await Promise.all([
        fetch(`${API_URL}/api/courses`),
        fetch(`${API_URL}/api/enrollments`)
      ]);
      const [c, e] = await Promise.all([cRes.json(), eRes.json()]);
      setCourses(Array.isArray(c) ? c : []);
      setEnrollments(Array.isArray(e) ? e : []);
    } catch { setMsg({ type: 'err', text: 'Failed to load courses.' }); }
    finally { setLoading(false); }
  };

  const enrollCount = (courseId) =>
    enrollments.filter(e => String(e.courseId) === String(courseId)).length;

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.title?.toLowerCase().includes(q) || c.instructor?.toLowerCase().includes(q);
    const matchLevel = levelFilter === 'all' || c.level?.toLowerCase() === levelFilter;
    return matchSearch && matchLevel;
  });

  const levels = [...new Set(courses.map(c => c.level).filter(Boolean))];

  // ── Form helpers ──────────────────────────────────────────────
  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const setModuleName = (mi, val) => {
    const m = [...form.modules]; m[mi] = { ...m[mi], name: val };
    setField('modules', m);
  };

  const setVideo = (mi, vi, key, val) => {
    const m = [...form.modules];
    m[mi].videos[vi] = { ...m[mi].videos[vi], [key]: val };
    setField('modules', m);
  };

  const setLC = (mi, li, key, val) => {
    const m = [...form.modules];
    m[mi].learningContent[li] = { ...m[mi].learningContent[li], [key]: val };
    setField('modules', m);
  };

  const addModule = () => setField('modules', [...form.modules, EMPTY_MODULE()]);
  const removeModule = (mi) => setField('modules', form.modules.filter((_, i) => i !== mi));

  const addVideo = (mi) => {
    const m = [...form.modules];
    m[mi].videos.push({ title: '', video: '', description: '' });
    setField('modules', m);
  };
  const removeVideo = (mi, vi) => {
    const m = [...form.modules];
    m[mi].videos = m[mi].videos.filter((_, i) => i !== vi);
    setField('modules', m);
  };

  const addLC = (mi) => {
    const m = [...form.modules];
    m[mi].learningContent.push({ heading: '', paragraph: '', image: '' });
    setField('modules', m);
  };
  const removeLC = (mi, li) => {
    const m = [...form.modules];
    m[mi].learningContent = m[mi].learningContent.filter((_, i) => i !== li);
    setField('modules', m);
  };

  const toggleModule = (i) => setExpandedModules(p => ({ ...p, [i]: !p[i] }));

  // ── CRUD ──────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(EMPTY_FORM()); setEditId(null);
    setExpandedModules({ 0: true }); setShowForm(true);
    setMsg(null);
  };

  const openEdit = (course) => {
    setForm({ ...course, price: String(course.price ?? '') });
    setEditId(course._id);
    const exp = {};
    course.modules?.forEach((_, i) => { exp[i] = false; });
    setExpandedModules(exp);
    setShowForm(true); setMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setMsg({ type: 'err', text: 'Title is required.' }); return; }
    const price = Number(form.price);
    if (isNaN(price) || price < 0) { setMsg({ type: 'err', text: 'Enter a valid price.' }); return; }

    setSaving(true); setMsg(null);
    try {
      const url = editId ? `${API_URL}/api/courses/${editId}` : `${API_URL}/api/courses`;
      const method = editId ? 'PUT' : 'POST';
      const { _id, __v, createdAt, ...body } = form;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, price })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed.');
      setMsg({ type: 'ok', text: editId ? 'Course updated.' : 'Course created.' });
      setShowForm(false); setEditId(null);
      fetchAll();
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await fetch(`${API_URL}/api/courses/${id}`, { method: 'DELETE' });
      setCourses(c => c.filter(x => x._id !== id));
      setMsg({ type: 'ok', text: 'Course deleted.' });
    } catch { setMsg({ type: 'err', text: 'Delete failed.' }); }
  };

  return (
    <div className="acm-page">
      {/* Header */}
      <div className="acm-header">
        <div className="acm-header-left">
          <BookOpen size={26} className="acm-header-icon" />
          <div>
            <h1 className="acm-title">Course Management</h1>
            <p className="acm-sub">Create, edit and manage all courses</p>
          </div>
        </div>
        <button className="acm-add-btn" onClick={openCreate}>
          <Plus size={16} /> New Course
        </button>
      </div>

      {/* Toast */}
      {msg && (
        <div className={`acm-toast ${msg.type}`}>
          {msg.type === 'ok' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {msg.text}
          <button onClick={() => setMsg(null)}><X size={13} /></button>
        </div>
      )}

      {/* Stats */}
      <div className="acm-stats">
        {[
          { label: 'Total Courses', val: courses.length, color: '#6366f1' },
          { label: 'Total Enrollments', val: enrollments.length, color: '#10b981' },
          { label: 'Avg Enrollments', val: courses.length ? Math.round(enrollments.length / courses.length) : 0, color: '#f59e0b' },
          { label: 'Free Courses', val: courses.filter(c => !c.price || c.price === 0).length, color: '#06b6d4' }
        ].map(s => (
          <div key={s.label} className="acm-stat">
            <span className="acm-stat-val" style={{ color: s.color }}>{s.val}</span>
            <span className="acm-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="acm-controls">
        <div className="acm-search-wrap">
          <Search size={15} className="acm-search-icon" />
          <input className="acm-search" placeholder="Search by title or instructor..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="acm-search-clear" onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
        <select className="acm-filter" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
          <option value="all">All Levels</option>
          {levels.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="acm-form-wrap">
          <div className="acm-form-header">
            <h2 className="acm-form-title">{editId ? 'Edit Course' : 'New Course'}</h2>
            <button className="acm-form-close" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>

          <div className="acm-form-grid">
            <div className="acm-field acm-field-full">
              <label>Course Title *</label>
              <input value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. Complete Web Development" />
            </div>
            <div className="acm-field acm-field-full">
              <label>Short Description</label>
              <input value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Brief overview shown on cards" />
            </div>
            <div className="acm-field acm-field-full">
              <label>Detailed Description</label>
              <textarea rows={4} value={form.detailedDescription} onChange={e => setField('detailedDescription', e.target.value)} placeholder="Full course description..." />
            </div>
            <div className="acm-field">
              <label>Price (₹)</label>
              <input type="number" min="0" value={form.price} onChange={e => setField('price', e.target.value)} placeholder="0 for free" />
            </div>
            <div className="acm-field">
              <label>Duration</label>
              <input value={form.duration} onChange={e => setField('duration', e.target.value)} placeholder="e.g. 12 hours" />
            </div>
            <div className="acm-field">
              <label>Level</label>
              <select value={form.level} onChange={e => setField('level', e.target.value)}>
                <option value="">Select level</option>
                {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="acm-field">
              <label>Instructor</label>
              <input value={form.instructor} onChange={e => setField('instructor', e.target.value)} placeholder="Instructor name" />
            </div>
            <div className="acm-field acm-field-full">
              <label>Thumbnail Image URL</label>
              <input value={form.image} onChange={e => setField('image', e.target.value)} placeholder="https://..." />
            </div>
            <div className="acm-field acm-field-full">
              <label>Preview Video URL</label>
              <input value={form.video} onChange={e => setField('video', e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </div>

          {/* Modules */}
          <div className="acm-modules-section">
            <div className="acm-modules-header">
              <h3>Modules ({form.modules.length})</h3>
              <button className="acm-add-module-btn" onClick={addModule}><Plus size={14} /> Add Module</button>
            </div>

            {form.modules.map((mod, mi) => (
              <div key={mi} className="acm-module">
                <div className="acm-module-head" onClick={() => toggleModule(mi)}>
                  <div className="acm-module-head-left">
                    {expandedModules[mi] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <span className="acm-module-num">Module {mi + 1}</span>
                    <span className="acm-module-name-preview">{mod.name || 'Untitled'}</span>
                  </div>
                  <div className="acm-module-head-right">
                    <span className="acm-module-meta">{mod.videos.length} videos · {mod.learningContent.length} content</span>
                    {form.modules.length > 1 && (
                      <button className="acm-remove-module" onClick={e => { e.stopPropagation(); removeModule(mi); }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {expandedModules[mi] && (
                  <div className="acm-module-body">
                    <div className="acm-field acm-field-full">
                      <label>Module Name</label>
                      <input value={mod.name} onChange={e => setModuleName(mi, e.target.value)} placeholder={`Module ${mi + 1} name`} />
                    </div>

                    {/* Videos */}
                    <div className="acm-sub-section">
                      <div className="acm-sub-header">
                        <Video size={14} /> <span>Videos</span>
                        <button className="acm-add-sub-btn" onClick={() => addVideo(mi)}><Plus size={12} /> Add Video</button>
                      </div>
                      {mod.videos.map((vid, vi) => (
                        <div key={vi} className="acm-sub-item">
                          <div className="acm-sub-item-num">{vi + 1}</div>
                          <div className="acm-sub-item-fields">
                            <input placeholder="Video title" value={vid.title} onChange={e => setVideo(mi, vi, 'title', e.target.value)} />
                            <input placeholder="Video URL" value={vid.video} onChange={e => setVideo(mi, vi, 'video', e.target.value)} />
                            <input placeholder="Description (optional)" value={vid.description} onChange={e => setVideo(mi, vi, 'description', e.target.value)} />
                          </div>
                          {mod.videos.length > 1 && (
                            <button className="acm-remove-sub" onClick={() => removeVideo(mi, vi)}><X size={13} /></button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Learning Content */}
                    <div className="acm-sub-section">
                      <div className="acm-sub-header">
                        <FileText size={14} /> <span>Learning Content</span>
                        <button className="acm-add-sub-btn" onClick={() => addLC(mi)}><Plus size={12} /> Add Block</button>
                      </div>
                      {mod.learningContent.map((lc, li) => (
                        <div key={li} className="acm-sub-item">
                          <div className="acm-sub-item-num">{li + 1}</div>
                          <div className="acm-sub-item-fields">
                            <input placeholder="Heading" value={lc.heading} onChange={e => setLC(mi, li, 'heading', e.target.value)} />
                            <textarea rows={3} placeholder="Paragraph" value={lc.paragraph} onChange={e => setLC(mi, li, 'paragraph', e.target.value)} />
                            <input placeholder="Image URL (optional)" value={lc.image} onChange={e => setLC(mi, li, 'image', e.target.value)} />
                          </div>
                          {mod.learningContent.length > 1 && (
                            <button className="acm-remove-sub" onClick={() => removeLC(mi, li)}><X size={13} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="acm-form-actions">
            <button className="acm-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? <Loader size={15} className="acm-spin" /> : <Save size={15} />}
              {saving ? 'Saving...' : editId ? 'Update Course' : 'Create Course'}
            </button>
            <button className="acm-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Course Grid */}
      {loading ? (
        <div className="acm-loading"><Loader size={28} className="acm-spin" /><p>Loading courses...</p></div>
      ) : filtered.length === 0 ? (
        <div className="acm-empty">
          <BookOpen size={40} />
          <p>{search ? 'No courses match your search.' : 'No courses yet. Create one!'}</p>
        </div>
      ) : (
        <div className="acm-grid">
          {filtered.map(course => (
            <div key={course._id} className="acm-card">
              <div className="acm-card-img-wrap">
                <img
                  src={course.image || 'https://placehold.co/400x220?text=No+Image'}
                  alt={course.title}
                  className="acm-card-img"
                  onError={e => { e.target.src = 'https://placehold.co/400x220?text=No+Image'; }}
                />
                {course.level && <span className="acm-card-level">{course.level}</span>}
              </div>
              <div className="acm-card-body">
                <h3 className="acm-card-title">{course.title}</h3>
                <p className="acm-card-instructor">by {course.instructor || 'Unknown'}</p>
                <p className="acm-card-desc">{course.description}</p>
                <div className="acm-card-meta">
                  <span className="acm-card-price">
                    {course.price ? `₹${Number(course.price).toLocaleString()}` : 'Free'}
                  </span>
                  <span className="acm-card-enroll">
                    <Users size={12} /> {enrollCount(course._id)} enrolled
                  </span>
                  {course.duration && <span className="acm-card-dur">{course.duration}</span>}
                </div>
                <div className="acm-card-modules">
                  {course.modules?.length || 0} modules · {course.modules?.reduce((s, m) => s + (m.videos?.length || 0), 0) || 0} videos
                </div>
              </div>
              <div className="acm-card-actions">
                <button className="acm-edit-btn" onClick={() => openEdit(course)}>
                  <Pencil size={13} /> Edit
                </button>
                <button className="acm-del-btn" onClick={() => handleDelete(course._id, course.title)}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
