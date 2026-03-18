import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import MentorEditor from '../Components/MentorEditor';
import './CmsPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function SupportCms() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/support`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch { setMsg({ type: 'err', text: 'Failed to load categories.' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const url = editingId ? `${API_URL}/api/support/${editingId}` : `${API_URL}/api/support`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Save failed.');
      setMsg({ type: 'ok', text: editingId ? 'Category updated.' : 'Category added.' });
      setForm({ title: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    } finally { setSaving(false); }
  };

  const handleEdit = (cat) => {
    setForm({ title: cat.title, description: cat.description });
    setEditingId(cat._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await fetch(`${API_URL}/api/support/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch { setMsg({ type: 'err', text: 'Delete failed.' }); }
  };

  return (
    <div className="cmspage">
      <div className="cmspage-header">
        <Link to="/admin/manage-cms" className="cmspage-back">
          <ArrowLeft size={16} /> Back to CMS
        </Link>
        <h1 className="cmspage-title">Edit Support Page</h1>
      </div>

      {msg && (
        <div className={`cmspage-msg ${msg.type}`}>
          {msg.type === 'ok' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {msg.text}
        </div>
      )}

      <form className="cmspage-form" onSubmit={handleSubmit}>
        <div className="cmspage-field">
          <label className="cmspage-label">Category Title</label>
          <input
            className="cmspage-input"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Getting Started"
            required
          />
        </div>
        <div className="cmspage-field">
          <label className="cmspage-label">Description / Content</label>
          <MentorEditor
            value={form.description}
            onChange={val => setForm(f => ({ ...f, description: val }))}
            placeholder="Enter category description..."
          />
        </div>
        <div className="cmspage-footer">
          <button type="submit" className="cmspage-save-btn" disabled={saving}>
            {saving ? <Loader size={15} className="cmspage-spin" /> : (editingId ? <Save size={15} /> : <Plus size={15} />)}
            {saving ? 'Saving...' : editingId ? 'Update Category' : 'Add Category'}
          </button>
          {editingId && (
            <button type="button" className="cmspage-save-btn" style={{ background: '#6b7280', marginLeft: '0.75rem' }}
              onClick={() => { setEditingId(null); setForm({ title: '', description: '' }); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
          Existing Categories ({categories.length})
        </h2>
        {loading ? (
          <p style={{ color: '#9ca3af' }}>Loading...</p>
        ) : categories.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No categories yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categories.map(cat => (
              <div key={cat._id} style={{
                background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '10px',
                padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, margin: '0 0 0.25rem', color: '#1f2937' }}>{cat.title}</p>
                  <div style={{ fontSize: '0.82rem', color: '#6b7280' }}
                    dangerouslySetInnerHTML={{ __html: cat.description }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => handleEdit(cat)} style={{
                    background: '#eef2ff', color: '#6366f1', border: 'none', borderRadius: '6px',
                    padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                  }}>Edit</button>
                  <button onClick={() => handleDelete(cat._id)} style={{
                    background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px',
                    padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                  }}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
