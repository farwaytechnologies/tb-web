import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Copy, Check, Gift, TrendingUp, UserPlus } from 'lucide-react';
import '../Styles/DashbordStyle/Referral.css';

const API = import.meta.env.VITE_API_URL;

export default function UserReferral() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'student') { navigate('/login'); return; }
    fetch(`${API}/api/referral/${user._id || user.id}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const shareLink = data?.referralCode
    ? `${window.location.origin}/login?ref=${data.referralCode}`
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ref-page">
      <div className="ref-header">
        <div className="ref-header-glow" />
        <Gift size={28} className="ref-header-icon" />
        <div>
          <h1 className="ref-title">Referral Program</h1>
          <p className="ref-subtitle">Invite friends and earn reward points</p>
        </div>
      </div>

      {loading ? (
        <div className="ref-loading"><div className="ref-spinner" /></div>
      ) : (
        <>
          {/* Stats row */}
          <div className="ref-stats">
            <div className="ref-stat-card" style={{ '--c': '#6366f1' }}>
              <UserPlus size={20} style={{ color: '#6366f1' }} />
              <span className="ref-stat-val">{data?.referralCount || 0}</span>
              <span className="ref-stat-lbl">Friends Referred</span>
            </div>
            <div className="ref-stat-card" style={{ '--c': '#ec4899' }}>
              <TrendingUp size={20} style={{ color: '#ec4899' }} />
              <span className="ref-stat-val">{data?.pointsFromReferrals || 0}</span>
              <span className="ref-stat-lbl">Points Earned</span>
            </div>
            <div className="ref-stat-card" style={{ '--c': '#10b981' }}>
              <Gift size={20} style={{ color: '#10b981' }} />
              <span className="ref-stat-val">25</span>
              <span className="ref-stat-lbl">Pts per Referral</span>
            </div>
          </div>

          {/* Code card */}
          <div className="ref-code-card">
            <p className="ref-code-label">Your Referral Code</p>
            <div className="ref-code-display">{data?.referralCode || '—'}</div>
            <p className="ref-link-label">Share this link</p>
            <div className="ref-link-row">
              <span className="ref-link-text">{shareLink}</span>
              <button className="ref-copy-btn" onClick={copyLink}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="ref-how">
            <h2 className="ref-section-title">How it works</h2>
            <div className="ref-steps">
              {[
                { n: '1', text: 'Share your referral link with friends' },
                { n: '2', text: 'They sign up using your link' },
                { n: '3', text: 'You earn 25 reward points instantly' },
              ].map(s => (
                <div key={s.n} className="ref-step">
                  <div className="ref-step-num">{s.n}</div>
                  <p className="ref-step-text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Referred users */}
          {data?.referredUsers?.length > 0 && (
            <div className="ref-section">
              <h2 className="ref-section-title"><Users size={16} /> Referred Users</h2>
              <div className="ref-table">
                <div className="ref-table-head">
                  <span>Name</span><span>Role</span><span>Joined</span>
                </div>
                {data.referredUsers.map(u => (
                  <div key={u._id} className="ref-table-row">
                    <span>{u.name}</span>
                    <span className="ref-role-chip">{u.role}</span>
                    <span>{new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="ref-back">
            <Link to="/user/dashboard" className="ref-back-link">← Back to Dashboard</Link>
          </div>
        </>
      )}
    </div>
  );
}
