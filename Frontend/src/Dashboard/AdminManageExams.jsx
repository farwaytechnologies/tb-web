import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, Trash2, Edit2, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import '../Styles/DashbordStyle/AdminManageExams.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const blankQ = () => ({ question: '', options: ['', '', '', ''], correctIndex: 0 });
const blankExam = () => ({ title: '', courseName: '', duration: 30, passMark: 50, active: true, questions: [blankQ()] });

export default function AdminManageExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // exam id or null
  const [form, setForm] = useState(blankExam());
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchExams();
  }, [navigate]);

  const fetchExams = () => {
    fetch(`${API_URL}/api/exams/manage`)
      .then(r => r.json())
      .then(d => { setExams(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const openCreate = () => { setEditing(null); setForm(blankExam()); setShowForm(true); };
  const openEdit = (exam) => {
    setEditing(exam._id);
    setForm({ title: exam.title, courseName: exam.courseName || '', duration: exam.duration, passMark: exam.passMark, active: exam.active, questions: exam.questions.map(q => ({ ...q, options: [...q.options] })) });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam?')) return;
    await fetch(`${API_URL}/api/exams/${id}`, { method: 'DELETE' });
    setExams(prev => prev.filter(e => e._id !== id));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return alert('Exam title is required.');
    for (const q of form.questions) {
      if (!q.question.trim()) return alert('All questions must have text.');
      if (q.options.some(o => !o.trim())) return alert('All options must be filled.');
    }
    setSaving(true);
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API_URL}/api/exams/${editing}` : `${API_URL}/api/exams`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return alert(data.error || 'Save failed');
    setShowForm(false);
    fetchExams();
  };

  // Question helpers
  const setQ = (qi, field, val) => setForm(f => ({ ...f, questions: f.questions.map((q, i) => i === qi ? { ...q, [field]: val } : q) }));
  const setOpt = (qi, oi, val) => setForm(f => ({ ...f, questions: f.questions.map((q, i) => i === qi ? { ...q, options: q.options.map((o, j) => j === oi ? val : o) } : q) }));
  const addQ = () => setForm(f => ({ ...f, questions: [...f.questions, blankQ()] }));
  const removeQ = (qi) => setForm(f => ({ ...f, questions: f.questions.filter((_, i) => i !== qi) }));

  return (
    <div className="ame-page">
      <div className="ame-header">
        <ClipboardList size={26} />
        <div>
          <h1>Manage Exams</h1>
          <p>{exams.length} exam{exams.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="ame-btn-add" onClick={openCreate}><Plus size={16} /> New Exam</button>
      </div>

      {loading ? <p className="ame-empty">Loading...</p> : exams.length === 0 ? (
        <p className="ame-empty">No exams yet. Create one.</p>
      ) : (
        <div className="ame-list">
          {exams.map(exam => (
            <div key={exam._id} className="ame-card">
              <div className="ame-card-top">
                <div className="ame-card-info">
                  <h3>{exam.title}</h3>
                  <span className="ame-meta">{exam.courseName || 'General'} · {exam.duration} min · Pass: {exam.passMark}% · {exam.questions?.length || 0} Qs</span>
                  <span className={`ame-badge ${exam.active ? 'active' : 'inactive'}`}>{exam.active ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="ame-card-actions">
                  <button className="ame-icon-btn" onClick={() => setExpanded(expanded === exam._id ? null : exam._id)}>
                    {expanded === exam._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button className="ame-icon-btn" onClick={() => openEdit(exam)}><Edit2 size={15} /></button>
                  <button className="ame-icon-btn danger" onClick={() => handleDelete(exam._id)}><Trash2 size={15} /></button>
                </div>
              </div>
              {expanded === exam._id && (
                <div className="ame-attempts">
                  <strong>Attempts ({exam.attempts?.length || 0})</strong>
                  {exam.attempts?.length === 0 ? <p className="ame-no-attempts">No attempts yet.</p> : (
                    <table className="ame-table">
                      <thead><tr><th>Student</th><th>Score</th><th>%</th><th>Result</th><th>Date</th></tr></thead>
                      <tbody>
                        {exam.attempts.map((a, i) => {
                          const pct = a.total ? Math.round((a.score / a.total) * 100) : 0;
                          return (
                            <tr key={i}>
                              <td>{a.userName || '—'}</td>
                              <td>{a.score}/{a.total}</td>
                              <td>{pct}%</td>
                              <td><span className={`ame-result ${pct >= exam.passMark ? 'pass' : 'fail'}`}>{pct >= exam.passMark ? 'Pass' : 'Fail'}</span></td>
                              <td>{new Date(a.submittedAt).toLocaleDateString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="ame-overlay" onClick={() => setShowForm(false)}>
          <div className="ame-modal" onClick={e => e.stopPropagation()}>
            <div className="ame-modal-header">
              <h2>{editing ? 'Edit Exam' : 'New Exam'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>

            <div className="ame-form-grid">
              <div className="ame-field">
                <label>Exam Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. JavaScript Basics Quiz" />
              </div>
              <div className="ame-field">
                <label>Course Name</label>
                <input value={form.courseName} onChange={e => setForm(f => ({ ...f, courseName: e.target.value }))} placeholder="e.g. Web Development" />
              </div>
              <div className="ame-field">
                <label>Duration (minutes)</label>
                <input type="number" min="1" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} />
              </div>
              <div className="ame-field">
                <label>Pass Mark (%)</label>
                <input type="number" min="1" max="100" value={form.passMark} onChange={e => setForm(f => ({ ...f, passMark: +e.target.value }))} />
              </div>
              <div className="ame-field ame-toggle-field">
                <label>Active</label>
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
              </div>
            </div>

            <div className="ame-questions">
              <div className="ame-q-header">
                <h3>Questions ({form.questions.length})</h3>
                <button className="ame-btn-ghost" onClick={addQ}><Plus size={14} /> Add Question</button>
              </div>
              {form.questions.map((q, qi) => (
                <div key={qi} className="ame-question">
                  <div className="ame-q-top">
                    <span className="ame-q-num">Q{qi + 1}</span>
                    {form.questions.length > 1 && (
                      <button className="ame-icon-btn danger" onClick={() => removeQ(qi)}><X size={13} /></button>
                    )}
                  </div>
                  <input className="ame-q-input" placeholder="Question text..." value={q.question}
                    onChange={e => setQ(qi, 'question', e.target.value)} />
                  <div className="ame-options">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className={`ame-option ${q.correctIndex === oi ? 'correct' : ''}`}>
                        <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi}
                          onChange={() => setQ(qi, 'correctIndex', oi)} />
                        <input className="ame-opt-input" placeholder={`Option ${oi + 1}`} value={opt}
                          onChange={e => setOpt(qi, oi, e.target.value)} />
                        {q.correctIndex === oi && <span className="ame-correct-tag">✓ Correct</span>}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="ame-modal-footer">
              <button className="ame-btn-save" onClick={handleSave} disabled={saving}>
                <Save size={15} /> {saving ? 'Saving...' : 'Save Exam'}
              </button>
              <button className="ame-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
