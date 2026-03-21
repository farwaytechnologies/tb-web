import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Copy, Check, Gift, TrendingUp, UserPlus, Share2, Star } from 'lucide-react';
import '../Styles/DashbordStyle/Referral.css';

const API = import.meta.env.VITE_API_URL;

export default function UserReferral() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'student') { navigate('/login'); return; }
    fetch(`${API}/api/referral/${user._id || user.id}`)
      .then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [navigate]);

  const shareLink = data?.referralCode ? `${window.location.origin}/login?ref=${data.referralCode}` : '';

  const copy = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="ref-page">
      {/* Hero */}
      <div className="ref-hero">
        <div className="ref-hero-glow" />
        <div className="ref-hero-left">
          <div className="ref-hero-icon"><Gift size={22} /></div>
          <div>
            <h1>Referral Program</h1>
            <p>Invite friends and earn 25 reward points per signup</p>
          </div>
        </div>
        <div className="ref-hero-badge">
          <Star size={14} />
          <span>25 pts / referral</span>
        </div>
      </div>

      {loading ? (
        <div className="ref-loading"><div className="ref-spinner" /></div>
      ) : (
        <>
          {/* Stats */}
          <div className="ref-stats">
            {[
              { icon: UserPlus,   val: data?.referralCount || 0,       lbl: 'Friends Referred', color: '#6366f1' },
              { icon: TrendingUp, val: data?.pointsFromReferrals || 0, lbl: 'Points Earned',    color: '#ec4899' },
              { icon: Gift,       val: 25,                              lbl: 'Pts per Referral', color: '#10b981' },
            ].map(({ icon: Icon, val, lbl, color }) => (
              <div key={lbl} className="ref-stat-card">
                <div className="ref-stat-icon" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="ref-stat-val" style={{ color }}>{val}</span>
                <span className="ref-stat-lbl">{lbl}</span>
              </div>
            ))}
          </div>

          {/* Code card */}
          <div className="ref-code-card">
            <div className="ref-code-top">
              <div>
                <p className="ref-code-label">Your Referral Code</p>
                <div className="ref-code-display">{data?.referralCode || '—'}</div>
              </div>
              <button className="ref-copy-code-btn" onClick={() => copy(data?.referralCode, setCopiedCode)}>
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <div className="ref-divider" />
            <p className="ref-link-label"><Share2 size={12} /> Share your invite link</p>
            <div className="ref-link-row">
              <span className="ref-link-text">{shareLink}</span>
              <button className="ref-copy-btn" onClick={() => copy(shareLink, setCopiedLink)}>
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="ref-how">
            <h2 className="ref-section-title">How it works</h2>
            <div className="ref-steps">
              {[
                { n: '1', title: 'Share',   text: 'Send your referral link to friends' },
                { n: '2', title: 'Sign Up', text: 'They register using your link' },
                { n: '3', title: 'Earn',    text: 'You get +25 reward points instantly' },
              ].map(s => (
                <div key={s.n} className="ref-step">
                  <div className="ref-step-num">{s.n}</div>
                  <p className="ref-step-title">{s.title}</p>
                  <p className="ref-step-text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Referred users */}
          {data?.referredUsers?.length > 0 ? (
            <div className="ref-section">
              <h2 className="ref-section-title"><Users size={15} /> Referred Users ({data.referredUsers.length})</h2>
              <div className="ref-table">
                <div className="ref-table-head">
                  <span>Name</span><span>Role</span><span>Joined</span>
                </div>
                {data.referredUsers.map(u => (
                  <div key={u._id} className="ref-table-row">
                    <span className="ref-user-name">
                      <img
                        src={u.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff&size=28`}
                        alt={u.name}
                        className="ref-user-avatar"
                      />
                      {u.name}
                    </span>
                    <span className={`ref-role-chip ref-role-${u.role}`}>{u.role}</span>
                    <span className="ref-date">{fmt(u.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="ref-no-refs">
              <UserPlus size={32} />
              <p>No referrals yet. Share your link to get started!</p>
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
