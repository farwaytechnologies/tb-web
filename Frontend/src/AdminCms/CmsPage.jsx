/**
 * CmsPage — generic wrapper used by all CMS editor pages.
 * Props:
 *   title       — page heading
 *   fields      — array of { key, label, type: 'text'|'rich'|'textarea'|'url' }
 *   fetchUrl    — GET endpoint
 *   saveUrl     — PUT/POST endpoint
 *   saveMethod  — 'PUT' | 'POST' (default 'PUT')
 *   transform   — optional fn(data) → form object after fetch
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import MentorEditor from '../Components/MentorEditor';
import './CmsPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CmsPage({ title, fields, fetchUrl, saveUrl, saveMethod = 'PUT', transform }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'ok'|'err', text }

  useEffect(() => {
    fetch(`${API_URL}${fetchUrl}`)
      .then(r => r.json())
      .then(data => {
        setForm(transform ? transform(data) : (data || {}));
      })
      .catch(() => setMsg({ type: 'err', text: 'Failed to load content.' }))
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}${saveUrl}`, {
        method: saveMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed.');
      setMsg({ type: 'ok', text: 'Changes saved successfully.' });
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="cmspage-loading">
        <Loader size={28} className="cmspage-spin" />
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="cmspage">
      <div className="cmspage-header">
        <Link to="/admin/manage-cms" className="cmspage-back">
          <ArrowLeft size={16} /> Back to CMS
        </Link>
        <h1 className="cmspage-title">{title}</h1>
      </div>

      {msg && (
        <div className={`cmspage-msg ${msg.type}`}>
          {msg.type === 'ok' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {msg.text}
        </div>
      )}

      <form className="cmspage-form" onSubmit={handleSave}>
        {fields.map(f => (
          <div key={f.key} className="cmspage-field">
            <label className="cmspage-label">{f.label}</label>

            {f.type === 'rich' && (
              <MentorEditor
                value={form[f.key] || ''}
                onChange={val => set(f.key, val)}
                placeholder={`Enter ${f.label.toLowerCase()}...`}
              />
            )}

            {f.type === 'textarea' && (
              <textarea
                className="cmspage-textarea"
                value={form[f.key] || ''}
                onChange={e => set(f.key, e.target.value)}
                placeholder={`Enter ${f.label.toLowerCase()}...`}
                rows={5}
              />
            )}

            {(f.type === 'text' || f.type === 'url' || !f.type) && (
              <input
                className="cmspage-input"
                type={f.type === 'url' ? 'url' : 'text'}
                value={form[f.key] || ''}
                onChange={e => set(f.key, e.target.value)}
                placeholder={`Enter ${f.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}

        <div className="cmspage-footer">
          <button type="submit" className="cmspage-save-btn" disabled={saving}>
            {saving ? <Loader size={15} className="cmspage-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
