import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, Star, Zap, BookOpen, FileText, Users, Award, Coins } from 'lucide-react';
import '../Styles/DashbordStyle/TutorRewards.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ALL_BADGES = [
  { name: '🌱 Newcomer', minPoints: 0 },
  { name: '⭐ Rising Star', minPoints: 100 },
  { name: '🔥 Active Tutor', minPoints: 300 },
  { name: '🏆 Top Educator', minPoints: 600 },
  { name: '💎 Elite Mentor', minPoints: 1000 }
];

const PTS = { perCourse: 50, perBlog: 20, perEnrollment: 10, perLearnContent: 15 };

function calcPoints(b) {
  return b.courses * PTS.perCourse + b.blogs * PTS.perBlog +
    b.enrollments * PTS.perEnrollment + b.learnContent * PTS.perLearnContent;
}

function getBadges(pts) {
  return ALL_BADGES.filter(b => pts >= b.minPoints).map(b => b.name);
}

function getCurrentBadge(pts) {
  return [...ALL_BADGES].reverse().find(b => pts >= b.minPoints);
}

export default function TutorRewards() {
  const [breakdown, setBreakdown] = useState({ courses: 0, blogs: 0, enrollments: 0, learnContent: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem('user')); } catch (_) {}
    if (!stored || stored.role !== 'tutor') { navigate('/login'); return; }

    const load = async () => {
      try {
        // Fetch all data independently so one failure doesn't break everything
        const safeJson = async (url) => {
          try {
            const r = await fetch(url);
            if (!r.ok) return [];
            const d = await r.json();
            return Array.isArray(d) ? d : [];
          } catch { return []; }
        };

        const [allCourses, allBlogs, allEnrollments, lb] = await Promise.all([
          safeJson(`${API_URL}/api/courses`),
          safeJson(`${API_URL}/api/blogs`),
          safeJson(`${API_URL}/api/enrollments`),
          safeJson(`${API_URL}/api/rewards/leaderboard`)
        ]);

        const tutorCourses = allCourses.filter(c => c.instructor === stored.name);
        const tutorCourseIds = tutorCourses.map(c => String(c._id));
        const tutorBlogs = allBlogs.filter(b => b.author === stored.name);
        const tutorEnrollments = allEnrollments.filter(e => tutorCourseIds.includes(String(e.courseId)));

        const counts = {
          courses: tutorCourses.length,
          blogs: tutorBlogs.length,
          enrollments: tutorEnrollments.length,
          learnContent: 0
        };

        setBreakdown(counts);
        setLeaderboard(lb);

        // Save to backend silently — don't block UI on this
        fetch(`${API_URL}/api/rewards/tutor/${stored._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(counts)
        }).catch(() => {});
      } catch (err) {
        console.error('Rewards load error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const points = calcPoints(breakdown);
  const earnedBadges = getBadges(points);
  const currentBadge = getCurrentBadge(points);
  const nextBadge = ALL_BADGES.find(b => b.minPoints > points);
  const progressPct = nextBadge ? Math.min(100, Math.round((points / nextBadge.minPoints) * 100)) : 100;

  if (loading) {
    return (
      <div className="tr-page">
        <div className="tr-loading-spinner">
          <Trophy size={40} className="tr-spin-icon" />
          <p>Loading your rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tr-page">
      {/* Header */}
      <div className="tr-header">
        <Trophy size={32} className="tr-header-icon" />
        <div>
          <h1 className="tr-title">Your Rewards</h1>
          <p className="tr-subtitle">Earn points by teaching and creating content</p>
        </div>
      </div>

      {/* Hero: Points card + Breakdown */}
      <div className="tr-hero">
        <div className="tr-points-card">
          <span className="tr-points-value">{points}</span>
          <span className="tr-points-label">Total Points</span>
          <span className="tr-current-badge">{currentBadge?.name}</span>
          <div className="tr-progress-wrap">
            <div className="tr-progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
          {nextBadge
            ? <p className="tr-next-badge">{nextBadge.minPoints - points} pts to unlock {nextBadge.name}</p>
            : <p className="tr-next-badge">You've reached the highest rank!</p>
          }
        </div>

        <div className="tr-breakdown">
          {[
            { icon: BookOpen, label: 'Courses', count: breakdown.courses, pts: PTS.perCourse, color: '#10b981' },
            { icon: FileText, label: 'Blogs', count: breakdown.blogs, pts: PTS.perBlog, color: '#06b6d4' },
            { icon: Users, label: 'Enrollments', count: breakdown.enrollments, pts: PTS.perEnrollment, color: '#8b5cf6' },
            { icon: Zap, label: 'Learn Content', count: breakdown.learnContent, pts: PTS.perLearnContent, color: '#f59e0b' }
          ].map(({ icon: Icon, label, count, pts, color }) => (
            <div key={label} className="tr-breakdown-card">
              <Icon size={22} style={{ color }} />
              <div className="tr-breakdown-info">
                <span className="tr-breakdown-count">{count}</span>
                <span className="tr-breakdown-label">{label}</span>
              </div>
              <span className="tr-breakdown-pts">+{count * pts} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Badges */}
      <div className="tr-section">
        <h2 className="tr-section-title"><Award size={18} /> All Badges</h2>
        <div className="tr-badges-grid">
          {ALL_BADGES.map(b => {
            const earned = points >= b.minPoints;
            return (
              <div key={b.name} className={`tr-badge-card ${earned ? 'earned' : 'locked'}`}>
                <span className="tr-badge-name">{b.name}</span>
                <span className="tr-badge-req">{b.minPoints} pts</span>
                {earned && <span className="tr-badge-check">✓ Earned</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="tr-section">
        <h2 className="tr-section-title"><Star size={18} /> Leaderboard</h2>
        <div className="tr-leaderboard">
          {leaderboard.length === 0
            ? <p className="tr-empty">No leaderboard data yet.</p>
            : leaderboard.map((entry, i) => (
              <div key={entry.tutorId} className="tr-lb-row">
                <span className={`tr-lb-rank rank-${i + 1}`}>#{i + 1}</span>
                <img
                  src={entry.profilePic ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name || 'T')}&background=8b5cf6&color=fff&size=40`}
                  alt={entry.name || 'Tutor'}
                  className="tr-lb-avatar"
                />
                <span className="tr-lb-name">{entry.name || 'Tutor'}</span>
                <span className="tr-lb-points">{entry.points} pts</span>
                <span className="tr-lb-badge">{entry.currentBadge}</span>
              </div>
            ))
          }
        </div>
      </div>

      <div className="tr-back">
        <Link to="/tutor/borgcoins" className="tr-back-link" style={{ marginRight: '1.5rem', color: '#f59e0b' }}>
          <Coins size={15} style={{ display: 'inline', marginRight: 4 }} /> BorgCoins Wallet
        </Link>
        <Link to="/tutor/dashboard" className="tr-back-link">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
