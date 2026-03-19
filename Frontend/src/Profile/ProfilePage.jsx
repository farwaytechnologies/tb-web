import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Globe, Linkedin, Twitter, Lock,
  Settings, Camera, CheckCircle, AlertCircle, Save, X,
  Eye, EyeOff, Shield, CreditCard,
} from 'lucide-react';
import './ProfilePage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TABS = [
  { id: 'overview', label: 'Overview',      icon: User },
  { id: 'edit',     label: 'Edit Profile',  icon: Settings },
  { id: 'password', label: 'Password',      icon: Lock },
  { id: 'settings', label: 'Settings',      icon: Shield },
  { id: 'bank',     label: 'Bank Details',  icon: CreditCard, tutorOnly: true },
];

const ROLE_COLORS = {
  admin:   { bg: '#7c3aed', light: '#f5f3ff', badge: '#ede9fe', text: '#6d28d9' },
  tutor:   { bg: '#0891b2', light: '#ecfeff', badge: '#cffafe', text: '#0e7490' },
  student: { bg: '#059669', light: '#ecfdf5', badge: '#d1fae5', text: '#047857' },
};

export default function ProfilePage({ requiredRole }) {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [showPw, setShowPw] = useState({ cur: false, nw: false, cf: false });
  const [settings, setSettings] = useState({ language: 'en', emailNotifications: true, showProfile: true });
  const [bank, setBank] = useState({ accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', branchName: '', upiId: '', accountType: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored || (requiredRole && stored.role !== requiredRole)) {
      navigate('/login'); return;
    }
    setUser(stored);
    setForm(stored);
    setPreview(stored.profilePic || avatarUrl(stored.name));
    setSettings({
      language: stored.language || 'en',
      emailNotifications: stored.emailNotifications !== false,
      showProfile: stored.showProfile !== false,
    });
    if (stored.role === 'tutor') {
      fetch(`${API_URL}/api/auth/bank/${stored._id || stored.id}`)
        .then(r => r.ok ? r.json() : {})
        .then(d => setBank(b => ({ ...b, ...d })))
        .catch(() => {});
    }
  }, [navigate, requiredRole]);

  const avatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=8b5cf6&color=fff&size=200`;

  const colors = ROLE_COLORS[user?.role] || ROLE_COLORS.student;

  const toast = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast('err', 'Image must be under 2MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setForm(f => ({ ...f, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const uid = user._id || user.id;
      const res = await fetch(`${API_URL}/api/auth/update/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      const updated = { ...data.user, _id: data.user._id || data.user.id };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setPreview(updated.profilePic || avatarUrl(updated.name));
      toast('ok', 'Profile updated successfully.');
      setTab('overview');
    } catch (err) {
      toast('err', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast('err', 'Fill all password fields.'); return; }
    if (pwForm.newPassword !== pwForm.confirm) { toast('err', 'New passwords do not match.'); return; }
    if (pwForm.newPassword.length < 6) { toast('err', 'Password must be at least 6 characters.'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password change failed');
      toast('ok', 'Password changed successfully.');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast('err', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const uid = user._id || user.id;
      const res = await fetch(`${API_URL}/api/auth/settings/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Settings update failed');
      const updated = { ...data.user, _id: data.user._id || data.user.id };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      toast('ok', 'Settings saved.');
    } catch (err) {
      toast('err', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBankDetails = async () => {
    setSaving(true);
    try {
      const uid = user._id || user.id;
      const res = await fetch(`${API_URL}/api/auth/bank/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bank),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');
      toast('ok', 'Bank details saved successfully.');
    } catch (err) {
      toast('err', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const displayName = [form.firstName, form.middleName, form.lastName].filter(Boolean).join(' ') || form.name;

  return (
    <div className="pp-page">
      {/* Toast */}
      {msg && (
        <div className={`pp-toast pp-toast--${msg.type}`}>
          {msg.type === 'ok' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {msg.text}
          <button onClick={() => setMsg(null)}><X size={13} /></button>
        </div>
      )}

      <div className="pp-layout">
        {/* ── Sidebar ── */}
        <aside className="pp-sidebar">
          {/* Avatar */}
          <div className="pp-avatar-wrap">
            <img src={preview} alt="avatar" className="pp-avatar"
              onError={e => { e.target.src = avatarUrl(user.name); }} />
            <button className="pp-avatar-btn" onClick={() => fileRef.current?.click()}
              title="Change photo">
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </div>

          <h2 className="pp-sidebar-name">{displayName}</h2>
          <p className="pp-sidebar-email">{user.email}</p>
          <span className="pp-role-badge" style={{ background: colors.badge, color: colors.text }}>
            {user.role?.toUpperCase()}
          </span>

          {user.bio && <p className="pp-sidebar-bio">{user.bio}</p>}

          {/* Social links */}
          <div className="pp-social">
            {user.phone    && <a href={`tel:${user.phone}`}    className="pp-social-link"><Phone size={14} />{user.phone}</a>}
            {user.website  && <a href={user.website}  target="_blank" rel="noreferrer" className="pp-social-link"><Globe size={14} />Website</a>}
            {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="pp-social-link"><Linkedin size={14} />LinkedIn</a>}
            {user.twitter  && <a href={user.twitter}  target="_blank" rel="noreferrer" className="pp-social-link"><Twitter size={14} />Twitter</a>}
          </div>

          {/* Nav */}
          <nav className="pp-nav">
            {TABS.filter(t => !t.tutorOnly || user.role === 'tutor').map(t => (
              <button key={t.id}
                className={`pp-nav-btn ${tab === t.id ? 'active' : ''}`}
                style={tab === t.id ? { background: colors.bg, color: '#fff' } : {}}
                onClick={() => setTab(t.id)}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main ── */}
        <main className="pp-main">

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="pp-section">
              <h3 className="pp-section-title">Profile Overview</h3>
              <div className="pp-info-grid">
                {[
                  { label: 'Full Name',    val: displayName },
                  { label: 'Email',        val: user.email },
                  { label: 'Title',        val: user.title },
                  { label: 'Gender',       val: user.gender },
                  { label: 'Phone',        val: user.phone },
                  { label: 'First Name',   val: user.firstName },
                  { label: 'Middle Name',  val: user.middleName },
                  { label: 'Last Name',    val: user.lastName },
                ].map(f => (
                  <div key={f.label} className="pp-info-item">
                    <span className="pp-info-label">{f.label}</span>
                    <span className="pp-info-val">{f.val || '—'}</span>
                  </div>
                ))}
              </div>

              {user.bio && (
                <div className="pp-bio-block">
                  <span className="pp-info-label">Bio</span>
                  <p>{user.bio}</p>
                </div>
              )}

              {(user.website || user.linkedin || user.twitter) && (
                <div className="pp-links-block">
                  <span className="pp-info-label">Links</span>
                  <div className="pp-links">
                    {user.website  && <a href={user.website}  target="_blank" rel="noreferrer"><Globe size={14} /> {user.website}</a>}
                    {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a>}
                    {user.twitter  && <a href={user.twitter}  target="_blank" rel="noreferrer"><Twitter size={14} /> Twitter</a>}
                  </div>
                </div>
              )}

              <button className="pp-btn pp-btn--primary" style={{ background: colors.bg }}
                onClick={() => setTab('edit')}>
                Edit Profile
              </button>
            </div>
          )}

          {/* EDIT PROFILE */}
          {tab === 'edit' && (
            <div className="pp-section">
              <h3 className="pp-section-title">Edit Profile</h3>

              {/* Profile Picture */}
              <div className="pp-pic-section">
                <img src={preview} alt="avatar" className="pp-pic-preview"
                  onError={e => { e.target.src = avatarUrl(user.name); }} />
                <div className="pp-pic-info">
                  <p className="pp-pic-label">Profile Picture</p>
                  <p className="pp-pic-hint">JPG or PNG, max 2MB</p>
                  <button className="pp-btn pp-btn--ghost" onClick={() => fileRef.current?.click()}>
                    <Camera size={14} /> Change Photo
                  </button>
                </div>
              </div>
              <div className="pp-form-grid">
                <Field label="Display Name" name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <Field label="Title" name="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Mr, Dr, Prof" />
                <Field label="First Name" name="firstName" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                <Field label="Middle Name" name="middleName" value={form.middleName} onChange={e => setForm(f => ({ ...f, middleName: e.target.value }))} />
                <Field label="Last Name" name="lastName" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                <div className="pp-field">
                  <label>Gender</label>
                  <select value={form.gender || ''} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                    <option value="">Select</option>
                    {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <Field label="Phone" name="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                <Field label="Email" value={form.email} disabled />
              </div>

              <div className="pp-field pp-field--full">
                <label>Bio</label>
                <textarea rows={4} value={form.bio || ''} placeholder="Tell us about yourself..."
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>

              <h4 className="pp-subsection">Social & Links</h4>
              <div className="pp-form-grid">
                <Field label="Website" name="website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://yoursite.com" icon={<Globe size={14} />} />
                <Field label="LinkedIn" name="linkedin" value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." icon={<Linkedin size={14} />} />
                <Field label="Twitter / X" name="twitter" value={form.twitter} onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))} placeholder="https://twitter.com/..." icon={<Twitter size={14} />} />
              </div>

              <div className="pp-form-actions">
                <button className="pp-btn pp-btn--primary" style={{ background: colors.bg }}
                  onClick={handleSaveProfile} disabled={saving}>
                  <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="pp-btn pp-btn--ghost" onClick={() => { setForm(user); setTab('overview'); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* CHANGE PASSWORD */}
          {tab === 'password' && (
            <div className="pp-section">
              <h3 className="pp-section-title">Change Password</h3>
              <div className="pp-pw-form">
                <PwField label="Current Password" value={pwForm.currentPassword}
                  show={showPw.cur} onToggle={() => setShowPw(s => ({ ...s, cur: !s.cur }))}
                  onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} />
                <PwField label="New Password" value={pwForm.newPassword}
                  show={showPw.nw} onToggle={() => setShowPw(s => ({ ...s, nw: !s.nw }))}
                  onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} />
                <PwField label="Confirm New Password" value={pwForm.confirm}
                  show={showPw.cf} onToggle={() => setShowPw(s => ({ ...s, cf: !s.cf }))}
                  onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />

                {pwForm.newPassword && pwForm.confirm && (
                  <div className={`pp-pw-match ${pwForm.newPassword === pwForm.confirm ? 'ok' : 'err'}`}>
                    {pwForm.newPassword === pwForm.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </div>
                )}

                <div className="pp-pw-rules">
                  <p>Password must be at least 6 characters.</p>
                </div>

                <button className="pp-btn pp-btn--primary" style={{ background: colors.bg }}
                  onClick={handleChangePassword} disabled={saving}>
                  <Lock size={15} /> {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <div className="pp-section">
              <h3 className="pp-section-title">Account Settings</h3>

              <div className="pp-settings-group">
                <h4 className="pp-settings-label">Language</h4>
                <select className="pp-settings-select" value={settings.language}
                  onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>

              <div className="pp-settings-group">
                <h4 className="pp-settings-label">Notifications</h4>
                <Toggle label="Email Notifications"
                  desc="Receive updates about courses, enrollments and announcements"
                  checked={settings.emailNotifications}
                  onChange={v => setSettings(s => ({ ...s, emailNotifications: v }))} />
              </div>

              <div className="pp-settings-group">
                <h4 className="pp-settings-label">Privacy</h4>
                <Toggle label="Public Profile"
                  desc="Allow other users to see your profile information"
                  checked={settings.showProfile}
                  onChange={v => setSettings(s => ({ ...s, showProfile: v }))} />
              </div>

              <div className="pp-settings-group pp-danger-zone">
                <h4 className="pp-settings-label" style={{ color: '#dc2626' }}>Danger Zone</h4>
                <p className="pp-danger-desc">Deleting your account is permanent and cannot be undone.</p>
                <button className="pp-btn pp-btn--danger" onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                    const uid = user._id || user.id;
                    fetch(`${API_URL}/api/auth/delete/${uid}`, { method: 'DELETE' })
                      .then(() => { localStorage.removeItem('user'); navigate('/login'); })
                      .catch(() => toast('err', 'Failed to delete account.'));
                  }
                }}>Delete Account</button>
              </div>

              <button className="pp-btn pp-btn--primary" style={{ background: colors.bg }}
                onClick={handleSaveSettings} disabled={saving}>
                <Save size={15} /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          )}

          {/* BANK DETAILS — tutor only */}
          {tab === 'bank' && (
            <div className="pp-section">
              <h3 className="pp-section-title">Bank Details</h3>
              <p className="pp-section-desc">These details are used to transfer your earnings. Keep them accurate and up to date.</p>

              <div className="pp-bank-notice">
                <Shield size={15} />
                Your bank information is encrypted and never shared publicly.
              </div>

              <h4 className="pp-subsection">Account Information</h4>
              <div className="pp-form-grid">
                <Field label="Account Holder Name" value={bank.accountHolderName}
                  onChange={e => setBank(b => ({ ...b, accountHolderName: e.target.value }))}
                  placeholder="As per bank records" />
                <Field label="Bank Name" value={bank.bankName}
                  onChange={e => setBank(b => ({ ...b, bankName: e.target.value }))}
                  placeholder="e.g. State Bank of India" />
                <Field label="Account Number" value={bank.accountNumber}
                  onChange={e => setBank(b => ({ ...b, accountNumber: e.target.value }))}
                  placeholder="Enter account number" />
                <Field label="IFSC Code" value={bank.ifscCode}
                  onChange={e => setBank(b => ({ ...b, ifscCode: e.target.value.toUpperCase() }))}
                  placeholder="e.g. SBIN0001234" />
                <Field label="Branch Name" value={bank.branchName}
                  onChange={e => setBank(b => ({ ...b, branchName: e.target.value }))}
                  placeholder="e.g. MG Road, Bangalore" />
                <div className="pp-field">
                  <label>Account Type</label>
                  <select value={bank.accountType || ''} onChange={e => setBank(b => ({ ...b, accountType: e.target.value }))}>
                    <option value="">Select type</option>
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </select>
                </div>
              </div>

              <h4 className="pp-subsection">UPI (Optional)</h4>
              <div className="pp-form-grid">
                <Field label="UPI ID" value={bank.upiId}
                  onChange={e => setBank(b => ({ ...b, upiId: e.target.value }))}
                  placeholder="yourname@upi" />
              </div>

              <div className="pp-form-actions">
                <button className="pp-btn pp-btn--primary" style={{ background: colors.bg }}
                  onClick={handleSaveBankDetails} disabled={saving}>
                  <Save size={15} /> {saving ? 'Saving...' : 'Save Bank Details'}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────
function Field({ label, name, value, onChange, disabled, placeholder, icon }) {
  return (
    <div className="pp-field">
      <label>{label}</label>
      <div className={icon ? 'pp-field-icon-wrap' : ''}>
        {icon && <span className="pp-field-icon">{icon}</span>}
        <input name={name} value={value || ''} onChange={onChange}
          disabled={disabled} placeholder={placeholder || ''}
          className={icon ? 'pp-field-with-icon' : ''} />
      </div>
    </div>
  );
}

function PwField({ label, value, show, onToggle, onChange }) {
  return (
    <div className="pp-field">
      <label>{label}</label>
      <div className="pp-pw-wrap">
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} />
        <button type="button" className="pp-pw-toggle" onClick={onToggle}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <label className="pp-toggle">
      <div className="pp-toggle-text">
        <span className="pp-toggle-label">{label}</span>
        {desc && <span className="pp-toggle-desc">{desc}</span>}
      </div>
      <div className={`pp-toggle-switch ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}>
        <div className="pp-toggle-thumb" />
      </div>
    </label>
  );
}
