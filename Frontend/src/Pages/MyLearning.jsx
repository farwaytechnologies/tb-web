import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, Award, Play, TrendingUp } from 'lucide-react';
import '../Styles/PagesStyle/MyLearning.css';

const API = import.meta.env.VITE_API_URL;

export default function MyLearning() {
  const [progressList, setProgressList] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    Promise.all([
      fetch(`${API}/api/progress/${userId}`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/enrollments/user/${userId}`).then(r => r.json()).catch(() => []),
    ]).then(([prog, enr]) => {
      setProgressList(Array.isArray(prog) ? prog : []);
      setEnrollments(Array.isArray(enr) ? enr : []);
    }).finally(() => setLoading(false));
  }, []);

  // Merge enrollments with progress data
  const accepted = enrollments.filter(e => e.status === 'Accepted');
  const courses = accepted.map(enr => {
    const prog = progressList.find(p =>
      (p.courseId?._id || p.courseId) === (enr.courseId?._id || enr.courseId)
    );
    return { enr, prog };
  });

  const completed = courses.filter(c => c.prog?.progressPercent >= 100).length;
  const inProgress = courses.filter(c => c.prog && c.prog.progressPercent > 0 && c.prog.progressPercent < 100).length;
  const notStarted = courses.filter(c => !c.prog || c.prog.progressPercent === 0).length;

  const stats = [
    { icon: BookOpen,    val: accepted.length, label: 'Enrolled',    color: '#6366f1' },
    { icon: TrendingUp,  val: inProgress,       label: 'In Progress', color: '#f59e0b' },
    { icon: CheckCircle, val: completed,         label: 'Completed',   color: '#10b981' },
    { icon: Award,       val: notStarted,        label: 'Not Started', color: '#64748b' },
  ];

  return (
    <div className="ml-page">
      <div className="ml-header">
        <div className="ml-header-glow" />
        <div>
          <h1 className="ml-title">My Learning</h1>
          <p className="ml-sub">Track your progress across all enrolled courses</p>
        </div>
        <Link to="/courses" className="ml-browse-btn">Browse Courses</Link>
      </div>

      <div className="ml-stats">
        {stats.map(s => (
          <div key={s.label} className="ml-stat">
            <div className="ml-stat-icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <span className="ml-stat-val" style={{ color: s.color }}>{loading ? '—' : s.val}</span>
            <span className="ml-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="ml-state"><div className="ml-spinner" /></div>
      ) : courses.length === 0 ? (
        <div className="ml-state">
          <BookOpen size={44} style={{ color: '#334155' }} />
          <p>No active courses yet.</p>
          <Link to="/courses" className="ml-browse-btn">Find a Course</Link>
        </div>
      ) : (
        <div className="ml-grid">
          {courses.map(({ enr, prog }) => {
            const course = enr.courseId;
            const pct = prog?.progressPercent || 0;
            const done = pct >= 100;
            const totalLessons = course?.modules?.reduce((s, m) => s + (m.videos?.length || 0), 0) || 0;
            const completedCount = prog?.completedLessons?.length || 0;

            return (
              <div key={enr._id} className={`ml-card ${done ? 'ml-card-done' : ''}`}>
                <div className="ml-card-img-wrap">
                  <img
                    src={course?.image || 'https://placehold.co/320x160?text=Course'}
                    alt={course?.title}
                    className="ml-card-img"
                    onError={e => { e.target.src = 'https://placehold.co/320x160?text=Course'; }}
                  />
                  {done && <div className="ml-done-badge"><CheckCircle size={14} /> Completed</div>}
                </div>

                <div className="ml-card-body">
                  <p className="ml-card-title">{course?.title || 'Course'}</p>
                  <div className="ml-card-meta">
                    {course?.instructor && <span>{course.instructor}</span>}
                    {course?.level && <span className="ml-level">{course.level}</span>}
                  </div>

                  <div className="ml-progress-section">
                    <div className="ml-progress-row">
                      <span className="ml-progress-label">{completedCount}/{totalLessons} lessons</span>
                      <span className="ml-progress-pct" style={{ color: done ? '#10b981' : '#f59e0b' }}>{pct}%</span>
                    </div>
                    <div className="ml-bar">
                      <div
                        className="ml-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: done
                            ? 'linear-gradient(90deg,#10b981,#34d399)'
                            : 'linear-gradient(90deg,#6366f1,#8b5cf6)'
                        }}
                      />
                    </div>
                  </div>

                  {prog?.lastAccessedAt && (
                    <p className="ml-last-access">
                      <Clock size={11} /> Last accessed {new Date(prog.lastAccessedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}

                  <Link
                    to={`/courses/${course?._id}/modules`}
                    className={`ml-continue-btn ${done ? 'ml-review-btn' : ''}`}
                  >
                    <Play size={13} />
                    {done ? 'Review Course' : pct > 0 ? 'Continue' : 'Start Learning'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
