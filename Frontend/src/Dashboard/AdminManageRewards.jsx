import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Star, Search, Plus, Minus, RotateCcw, ChevronDown, ChevronUp, X
} from 'lucide-react';
import '../Styles/DashbordStyle/AdminManageRewards.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ALL_BADGES = [
  { name: '🌱 Newcomer', minPoints: 0 },
  { name: '⭐ Rising Star', minPoints: 100 },
  { name: '🔥 Active Tutor', minPoints: 300 },
  { name: '🏆 Top Educator', minPoints: 600 },
  { name: '💎 Elite Mentor', minPoints: 1000 }
];

export default function AdminManageRewards() {
  const [tutors, setTutors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('points');
  const [modal, setModal] = useState(null); // { tutor, mode: 'bonus'|'history'|'reset' }
  const [bonusInput, setBonusInput] = useState('');
  const [bonusReason, setBonusReason] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored || stored.role !== 'admin') { navigate('/login'); return; }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/rewards/admin/all`);
      const data = await res.json();
      setTutors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let list = [...tutors];
    if (search) list = list.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a, b) => sortBy === 'points' ? b.points - a.points : a.name.localeCompare(b.name));
    setFiltered(list);
  }, [tutors, search, sortBy]);

  const handleBonus = async (positive) => {
    const val = parseInt(bonusInput);
    if (!val || val <= 0) return;
    const bonus = positive ? val : -val;
    try {
      await fetch(`${API_URL}/api/rewards/admin/bonus/${modal.tutor.tutorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bonus, reason: bonusReason || (positive ? 'Admin bonus' : 'Admin deduction') })
      });
      setActionMsg(`${positive ? '+' : '-'}${val} pts applied to ${modal.tutor.name}`);
      setBonusInput(''); setBonusReason('');
      setModal(null);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleReset = async () => {
    try {
      await fetch(`${API_URL}/api/rewards/admin/reset/${modal.tutor.tutorId}`, { method: 'DELETE' });
      setActionMsg(`Bonus points reset for ${modal.tutor.name}`);
      setModal(null);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const getBadgeColor = (badge) => {
    if (badge?.includes('Elite')) return '#7c3aed';
    if (badge?.includes('Top')) return '#f59e0b';
    if (badge?.includes('Active')) return '#ef4444';
    if (badge?.includes('Rising')) return '#3b82f6';
    return '#6b7280';
  };

  return (
    <div className="amr-page">
      {/* Header */}
      <div className="amr-header">
        <div className="amr-header-left">
          <Trophy size={28} className="amr-header-icon" />
          <div>
            <h1 className="amr-title">Reward Management</h1>
            <p className="amr-subtitle">Control tutor points, badges and leaderboard</p>
          </div>
        </div>
        <button className="amr-refresh-btn" onClick={fetchAll}>↻ Refresh</button>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className="amr-toast">
          {actionMsg}
          <button onClick={() => setActionMsg('')}><X size={14} /></button>
        </div>
      )}

      {/* Stats bar */}
      <div className="amr-stats-bar">
        <div className="amr-stat"><span className="amr-stat-val">{tutors.length}</span><span className="amr-stat-lbl">Total Tutors</span></div>
        <div className="amr-stat"><span className="amr-stat-val">{tutors.filter(t => t.points > 0).length}</span><span className="amr-stat-lbl">Active Earners</span></div>
        <div className="amr-stat"><span className="amr-stat-val">{tutors.reduce((s, t) => s + t.points, 0)}</span><span className="amr-stat-lbl">Total Points Awarded</span></div>
        <div className="amr-stat"><span className="amr-stat-val">{tutors[0]?.name || '—'}</span><span className="amr-stat-lbl">Top Tutor</span></div>
      </div>

      {/* Controls */}
      <div className="amr-controls">
        <div className="amr-search-wrap">
          <Search size={16} className="amr-search-icon" />
          <input
            className="amr-search"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="amr-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="points">Sort by Points</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="amr-loading">Loading reward data...</div>
      ) : (
        <div className="amr-table-wrap">
          <table className="amr-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tutor</th>
                <th>Badge</th>
                <th>Total Pts</th>
                <th>Activity Pts</th>
                <th>Bonus Pts</th>
                <th>Courses</th>
                <th>Blogs</th>
                <th>Enrollments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="amr-empty">No tutors found.</td></tr>
              )}
              {filtered.map((t, i) => (
                <tr key={t.tutorId} className={i === 0 ? 'amr-row-top' : ''}>
                  <td className="amr-rank">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </td>
                  <td>
                    <div className="amr-tutor-cell">
                      <img
                        src={t.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=8b5cf6&color=fff&size=40`}
                        alt={t.name}
                        className="amr-avatar"
                      />
                      <div>
                        <span className="amr-name">{t.name}</span>
                        <span className="amr-email">{t.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="amr-badge" style={{ color: getBadgeColor(t.currentBadge) }}>
                      {t.currentBadge}
                    </span>
                  </td>
                  <td><strong>{t.points}</strong></td>
                  <td>{t.activityPoints}</td>
                  <td className={t.bonusPoints > 0 ? 'amr-bonus-pos' : t.bonusPoints < 0 ? 'amr-bonus-neg' : ''}>
                    {t.bonusPoints > 0 ? `+${t.bonusPoints}` : t.bonusPoints}
                  </td>
                  <td>{t.breakdown.courses}</td>
                  <td>{t.breakdown.blogs}</td>
                  <td>{t.breakdown.enrollments}</td>
                  <td>
                    <div className="amr-actions">
                      <button className="amr-btn amr-btn-bonus" title="Adjust Points"
                        onClick={() => { setModal({ tutor: t, mode: 'bonus' }); setBonusInput(''); setBonusReason(''); }}>
                        <Plus size={14} /> Bonus
                      </button>
                      <button className="amr-btn amr-btn-reset" title="Reset Bonus"
                        onClick={() => setModal({ tutor: t, mode: 'reset' })}>
                        <RotateCcw size={14} /> Reset
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leaderboard preview */}
      <div className="amr-lb-section">
        <h2 className="amr-lb-title"><Star size={18} /> Top 5 Leaderboard</h2>
        <div className="amr-lb-list">
          {filtered.slice(0, 5).map((t, i) => (
            <div key={t.tutorId} className="amr-lb-row">
              <span className={`amr-lb-rank rank-${i + 1}`}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
              <img src={t.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=8b5cf6&color=fff&size=40`} alt={t.name} className="amr-lb-avatar" />
              <span className="amr-lb-name">{t.name}</span>
              <div className="amr-lb-bar-wrap">
                <div className="amr-lb-bar" style={{ width: `${Math.min(100, (t.points / (filtered[0]?.points || 1)) * 100)}%` }} />
              </div>
              <span className="amr-lb-pts">{t.points} pts</span>
              <span className="amr-lb-badge" style={{ color: getBadgeColor(t.currentBadge) }}>{t.currentBadge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge reference */}
      <div className="amr-badges-ref">
        <h2 className="amr-lb-title"><Trophy size={18} /> Badge Thresholds</h2>
        <div className="amr-badges-row">
          {ALL_BADGES.map(b => (
            <div key={b.name} className="amr-badge-ref-card">
              <span className="amr-badge-ref-name">{b.name}</span>
              <span className="amr-badge-ref-pts">{b.minPoints} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="amr-modal-overlay" onClick={() => setModal(null)}>
          <div className="amr-modal" onClick={e => e.stopPropagation()}>
            <button className="amr-modal-close" onClick={() => setModal(null)}><X size={18} /></button>

            {modal.mode === 'bonus' && (
              <>
                <h3 className="amr-modal-title">Adjust Points — {modal.tutor.name}</h3>
                <p className="amr-modal-sub">Current total: <strong>{modal.tutor.points} pts</strong> (bonus: {modal.tutor.bonusPoints})</p>
                <input
                  className="amr-modal-input"
                  type="number"
                  min="1"
                  placeholder="Enter points amount"
                  value={bonusInput}
                  onChange={e => setBonusInput(e.target.value)}
                />
                <input
                  className="amr-modal-input"
                  type="text"
                  placeholder="Reason (optional)"
                  value={bonusReason}
                  onChange={e => setBonusReason(e.target.value)}
                />
                <div className="amr-modal-btns">
                  <button className="amr-modal-add" onClick={() => handleBonus(true)}><Plus size={14} /> Add Points</button>
                  <button className="amr-modal-sub" onClick={() => handleBonus(false)}><Minus size={14} /> Deduct Points</button>
                </div>
              </>
            )}

            {modal.mode === 'reset' && (
              <>
                <h3 className="amr-modal-title">Reset Bonus — {modal.tutor.name}</h3>
                <p className="amr-modal-sub">This will reset all manually added/deducted bonus points to 0. Activity points are unaffected.</p>
                <div className="amr-modal-btns">
                  <button className="amr-modal-add" onClick={handleReset}>Confirm Reset</button>
                  <button className="amr-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
