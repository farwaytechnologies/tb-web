import { useEffect, useState } from 'react';
import { showToast } from '../Components/Toast';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Plus, Pencil, Trash2, Search, X, ChevronDown, ChevronUp,
  Video, FileText, Save, Loader, AlertCircle, CheckCircle, Users
} from 'lucide-react';
import '../Styles/DashbordStyle/TutorManageCourse.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const EMPTY_MODULE = () => ({
  name: '',
  videos: [{ title: '', video: '', description: '' }],
  learningContent: [{ heading: '', paragraph: '', image: '' }]
});

export default function TutorManageCourse() {
  const [tutor, setTutor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const emptyForm = (name = '') => ({
    title: '', description: '', detailedDescription: '',
    price: '', image: '', video: '', duration: '', level: '',
    instructor: name,
    modules: [EMPTY_MODULE()]
  });

  const [form, setForm] = useState(emptyForm());

  useEffect(() => {
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem('user')); } catch (_) {}
    if (!stored || stored.role !== 'tutor') { navigate('/login'); return; }
    setTutor(stored);
    setForm(emptyForm(stored.name));
    fetchAll(stored.name);
  }, [navigate]);

  const fetchAll = async (tutorName) => {
    setLoading(true);
    try {
      const [cRes, eRes] = await Promise.all([
        fetch(`${API_URL}/api/courses`),
        fetch(`${API_URL}/api/enrollments`)
      ]);
      const [allCourses, allEnrollments] = await Promise.all([cRes.json(), eRes.json()]);
      const mine = Array.isArray(allCourses)
        ? allCourses.filter(c => c.instructor === tutorName)
        : [];
      setCourses(mine);
      setEnrollments(Array.isArray(allEnrollments) ? allEnrollments : []);
    } catch { setMsg({ type: 'err', text: 'Failed to load courses.' }); }
    finally { setLoading(false); }
  };

  const enrollCount = (courseId) =>
    enrollments.filter(e => String(e.courseId) === String(courseId)).length;

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    return !q || c.title?.toLowerCase().includes(q);
  });

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
    setForm(emptyForm(tutor?.name));
    setEditId(null); setExpandedModules({ 0: true });
    setShowForm(true); setMsg(null);
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
        body: JSON.stringify({ ...body, price, instructor: tutor?.name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed.');
      setMsg({ type: 'ok', text: editId ? 'Course updated.' : 'Course created.' });
      setShowForm(false); setEditId(null);
      fetchAll(tutor?.name);
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
    <div className="tcm-page">
      <div className="tcm-header">
        <div className="tcm-header-left">
          <BookOpen size={26} className="tcm-header-icon" />
          <div>
            <h1 className="tcm-title">My Courses</h1>
            <p className="tcm-sub">Manage your course content and modules</p>
          </div>
        </div>
        <button className="tcm-add-btn" onClick={openCreate}>
          <Plus size={16} /> New Course
        </button>
      </div>

      {msg && (
        <div className={`tcm-toast ${msg.type}`}>
          {msg.type === 'ok' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {msg.text}
          <button onClick={() => setMsg(null)}><X size={13} /></button>
        </div>
      )}

      {/* Stats */}
      <div className="tcm-stats">
        {[
          { label: 'My Courses', val: courses.length, color: '#6366f1' },
          { label: 'Total Enrollments', val: courses.reduce((s, c) => s + enrollCount(c._id), 0), color: '#10b981' },
          { label: 'Total Modules', val: courses.reduce((s, c) => s + (c.modules?.length || 0), 0), color: '#f59e0b' },
          { label: 'Total Videos', val: courses.reduce((s, c) => s + (c.modules?.reduce((ms, m) => ms + (m.videos?.length || 0), 0) || 0), 0), color: '#06b6d4' }
        ].map(s => (
          <div key={s.label} className="tcm-stat">
            <span className="tcm-stat-val" style={{ color: s.color }}>{s.val}</span>
            <span className="tcm-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="tcm-controls">
        <div className="tcm-search-wrap">
          <Search size={15} className="tcm-search-icon" />
          <input className="tcm-search" placeholder="Search your courses..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="tcm-search-clear" onClick={() => setSearch('')}><X size={13} /></button>}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="tcm-form-wrap">
          <div className="tcm-form-header">
            <h2 className="tcm-form-title">{editId ? 'Edit Course' : 'New Course'}</h2>
            <button className="tcm-form-close" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>

          <div className="tcm-form-grid">
            <div className="tcm-field tcm-field-full">
              <label>Course Title *</label>
              <input value={form.title} onChange={e => setField('title', e.target.value)} placeholder="e.g. Complete Web Development" />
            </div>
            <div className="tcm-field tcm-field-full">
              <label>Short Description</label>
              <input value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Brief overview shown on cards" />
            </div>
            <div className="tcm-field tcm-field-full">
              <label>Detailed Description</label>
              <textarea rows={4} value={form.detailedDescription} onChange={e => setField('detailedDescription', e.target.value)} placeholder="Full course description..." />
            </div>
            <div className="tcm-field">
              <label>Price (₹)</label>
              <input type="number" min="0" value={form.price} onChange={e => setField('price', e.target.value)} placeholder="0 for free" />
            </div>
            <div className="tcm-field">
              <label>Duration</label>
              <input value={form.duration} onChange={e => setField('duration', e.target.value)} placeholder="e.g. 12 hours" />
            </div>
            <div className="tcm-field">
              <label>Level</label>
              <select value={form.level} onChange={e => setField('level', e.target.value)}>
                <option value="">Select level</option>
                {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="tcm-field">
              <label>Instructor</label>
              <input value={form.instructor} disabled style={{ background: '#f3f4f6', color: '#6b7280' }} />
            </div>
            <div className="tcm-field tcm-field-full">
              <label>Thumbnail Image URL</label>
              <input value={form.image} onChange={e => setField('image', e.target.value)} placeholder="https://..." />
            </div>
            <div className="tcm-field tcm-field-full">
              <label>Preview Video URL</label>
              <input value={form.video} onChange={e => setField('video', e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </div>

          {/* Modules */}
          <div className="tcm-modules-section">
            <div className="tcm-modules-header">
              <h3>Modules ({form.modules.length})</h3>
              <button className="tcm-add-module-btn" onClick={addModule}><Plus size={14} /> Add Module</button>
            </div>

            {form.modules.map((mod, mi) => (
              <div key={mi} className="tcm-module">
                <div className="tcm-module-head" onClick={() => toggleModule(mi)}>
                  <div className="tcm-module-head-left">
                    {expandedModules[mi] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <span className="tcm-module-num">Module {mi + 1}</span>
                    <span className="tcm-module-name-preview">{mod.name || 'Untitled'}</span>
                  </div>
                  <div className="tcm-module-head-right">
                    <span className="tcm-module-meta">{mod.videos.length} videos · {mod.learningContent.length} content</span>
                    {form.modules.length > 1 && (
                      <button className="tcm-remove-module" onClick={e => { e.stopPropagation(); removeModule(mi); }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {expandedModules[mi] && (
                  <div className="tcm-module-body">
                    <div className="tcm-field tcm-field-full">
                      <label>Module Name</label>
                      <input value={mod.name} onChange={e => setModuleName(mi, e.target.value)} placeholder={`Module ${mi + 1} name`} />
                    </div>

                    <div className="tcm-sub-section">
                      <div className="tcm-sub-header">
                        <Video size={14} /> <span>Videos</span>
                        <button className="tcm-add-sub-btn" onClick={() => addVideo(mi)}><Plus size={12} /> Add Video</button>
                      </div>
                      {mod.videos.map((vid, vi) => (
                        <div key={vi} className="tcm-sub-item">
                          <div className="tcm-sub-item-num">{vi + 1}</div>
                          <div className="tcm-sub-item-fields">
                            <input placeholder="Video title" value={vid.title} onChange={e => setVideo(mi, vi, 'title', e.target.value)} />
                            <input placeholder="Video URL" value={vid.video} onChange={e => setVideo(mi, vi, 'video', e.target.value)} />
                            <input placeholder="Description (optional)" value={vid.description} onChange={e => setVideo(mi, vi, 'description', e.target.value)} />
                          </div>
                          {mod.videos.length > 1 && (
                            <button className="tcm-remove-sub" onClick={() => removeVideo(mi, vi)}><X size={13} /></button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="tcm-sub-section">
                      <div className="tcm-sub-header">
                        <FileText size={14} /> <span>Learning Content</span>
                        <button className="tcm-add-sub-btn" onClick={() => addLC(mi)}><Plus size={12} /> Add Block</button>
                      </div>
                      {mod.learningContent.map((lc, li) => (
                        <div key={li} className="tcm-sub-item">
                          <div className="tcm-sub-item-num">{li + 1}</div>
                          <div className="tcm-sub-item-fields">
                            <input placeholder="Heading" value={lc.heading} onChange={e => setLC(mi, li, 'heading', e.target.value)} />
                            <textarea rows={3} placeholder="Paragraph" value={lc.paragraph} onChange={e => setLC(mi, li, 'paragraph', e.target.value)} />
                            <input placeholder="Image URL (optional)" value={lc.image} onChange={e => setLC(mi, li, 'image', e.target.value)} />
                          </div>
                          {mod.learningContent.length > 1 && (
                            <button className="tcm-remove-sub" onClick={() => removeLC(mi, li)}><X size={13} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="tcm-form-actions">
            <button className="tcm-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? <Loader size={15} className="tcm-spin" /> : <Save size={15} />}
              {saving ? 'Saving...' : editId ? 'Update Course' : 'Create Course'}
            </button>
            <button className="tcm-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Course Grid */}
      {loading ? (
        <div className="tcm-loading"><Loader size={28} className="tcm-spin" /><p>Loading courses...</p></div>
      ) : filtered.length === 0 ? (
        <div className="tcm-empty">
          <BookOpen size={40} />
          <p>{search ? 'No courses match your search.' : "You haven't created any courses yet."}</p>
          {!search && <button className="tcm-add-btn" onClick={openCreate}><Plus size={15} /> Create First Course</button>}
        </div>
      ) : (
        <div className="tcm-grid">
          {filtered.map(course => (
            <div key={course._id} className="tcm-card">
              <div className="tcm-card-img-wrap">
                <img
                  src={course.image || 'https://placehold.co/400x220?text=No+Image'}
                  alt={course.title}
                  className="tcm-card-img"
                  onError={e => { e.target.src = 'https://placehold.co/400x220?text=No+Image'; }}
                />
                {course.level && <span className="tcm-card-level">{course.level}</span>}
              </div>
              <div className="tcm-card-body">
                <h3 className="tcm-card-title">{course.title}</h3>
                <p className="tcm-card-desc">{course.description}</p>
                <div className="tcm-card-meta">
                  <span className="tcm-card-price">
                    {course.price ? `₹${Number(course.price).toLocaleString()}` : 'Free'}
                  </span>
                  <span className="tcm-card-enroll">
                    <Users size={12} /> {enrollCount(course._id)} enrolled
                  </span>
                  {course.duration && <span className="tcm-card-dur">{course.duration}</span>}
                </div>
                <div className="tcm-card-modules">
                  {course.modules?.length || 0} modules · {course.modules?.reduce((s, m) => s + (m.videos?.length || 0), 0) || 0} videos
                </div>
              </div>
              <div className="tcm-card-actions">
                <button className="tcm-edit-btn" onClick={() => openEdit(course)}>
                  <Pencil size={13} /> Edit
                </button>
                <button className="tcm-del-btn" onClick={() => handleDelete(course._id, course.title)}>
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
