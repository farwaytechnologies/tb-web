import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import '../Styles/PagesStyle/Exam.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Exam() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);   // exam being taken
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);   // last submission result
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored) { navigate('/login'); return; }
    setUser(stored);
    const uid = stored._id || stored.id;
    Promise.all([
      fetch(`${API_URL}/api/exams`).then(r => r.json()),
      fetch(`${API_URL}/api/exams/results/${uid}`).then(r => r.json()),
    ]).then(([e, r]) => {
      setExams(Array.isArray(e) ? e : []);
      setResults(Array.isArray(r) ? r : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [navigate]);

  const attemptedIds = new Set(results.map(r => r.examId?.toString()));

  const startExam = async (examId) => {
    const res = await fetch(`${API_URL}/api/exams/${examId}`);
    const data = await res.json();
    setActive(data);
    setAnswers(new Array(data.questions.length).fill(null));
    setResult(null);
    setTimeLeft(data.duration * 60);
  };

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [active]);

  const handleSubmit = async (auto = false) => {
    if (!auto && !window.confirm('Submit exam now?')) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    const uid = user._id || user.id;
    const res = await fetch(`${API_URL}/api/exams/${active._id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid, userName: user.name, answers: answers.map(a => a ?? -1) }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { alert(data.error || 'Submission failed'); return; }
    setResult(data);
    setActive(null);
    // refresh results
    fetch(`${API_URL}/api/exams/results/${uid}`).then(r => r.json()).then(r => setResults(Array.isArray(r) ? r : []));
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return <div className="exam-page"><p className="exam-loading">Loading exams...</p></div>;

  // ── Taking exam ──
  if (active) {
    const answered = answers.filter(a => a !== null).length;
    return (
      <div className="exam-page">
        <div className="exam-taking">
          <div className="exam-taking-header">
            <h2>{active.title}</h2>
            <div className={`exam-timer ${timeLeft < 60 ? 'urgent' : ''}`}>
              <Clock size={15} /> {fmt(timeLeft)}
            </div>
          </div>
          <div className="exam-progress-bar">
            <div style={{ width: `${(answered / active.questions.length) * 100}%` }} />
          </div>
          <p className="exam-progress-text">{answered} / {active.questions.length} answered</p>

          <div className="exam-questions">
            {active.questions.map((q, qi) => (
              <div key={qi} className="exam-q">
                <p className="exam-q-text"><span className="exam-q-num">Q{qi + 1}.</span> {q.question}</p>
                <div className="exam-opts">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className={`exam-opt ${answers[qi] === oi ? 'selected' : ''}`}>
                      <input type="radio" name={`q${qi}`} checked={answers[qi] === oi}
                        onChange={() => setAnswers(a => { const n = [...a]; n[qi] = oi; return n; })} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="exam-submit-btn" onClick={() => handleSubmit(false)} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>
    );
  }

  // ── Result screen ──
  if (result) {
    return (
      <div className="exam-page">
        <div className="exam-result">
          <div className={`exam-result-icon ${result.passed ? 'pass' : 'fail'}`}>
            {result.passed ? <CheckCircle size={56} /> : <XCircle size={56} />}
          </div>
          <h2>{result.passed ? 'Congratulations!' : 'Better luck next time'}</h2>
          <p className="exam-result-score">{result.score} / {result.total} &nbsp;·&nbsp; {result.percent}%</p>
          <p className="exam-result-sub">Pass mark: {result.passMark}%</p>
          <span className={`exam-result-badge ${result.passed ? 'pass' : 'fail'}`}>
            {result.passed ? 'PASSED' : 'FAILED'}
          </span>
          <button className="exam-back-btn" onClick={() => setResult(null)}>Back to Exams</button>
        </div>
      </div>
    );
  }

  // ── Exam list ──
  return (
    <div className="exam-page">
      <div className="exam-header">
        <ClipboardList size={30} />
        <div>
          <h1>Exams</h1>
          <p>{exams.length} available</p>
        </div>
      </div>

      {results.length > 0 && (
        <div className="exam-results-section">
          <h2 className="exam-section-title">My Results</h2>
          <div className="exam-results-grid">
            {results.map(r => (
              <div key={r.examId} className="exam-result-card">
                <div className="exam-result-card-top">
                  <span className={`exam-result-dot ${r.passed ? 'pass' : 'fail'}`} />
                  <strong>{r.title}</strong>
                </div>
                <p className="exam-result-card-score">{r.score}/{r.total} · {r.percent}%</p>
                <span className={`exam-result-badge sm ${r.passed ? 'pass' : 'fail'}`}>{r.passed ? 'Passed' : 'Failed'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="exam-section-title">Available Exams</h2>
      {exams.length === 0 ? (
        <p className="exam-empty">No exams available right now.</p>
      ) : (
        <div className="exam-list">
          {exams.map(exam => {
            const done = attemptedIds.has(exam._id);
            const res = results.find(r => r.examId === exam._id);
            return (
              <div key={exam._id} className="exam-card">
                <div className="exam-card-info">
                  <h3>{exam.title}</h3>
                  <p className="exam-card-meta">
                    {exam.courseName || 'General'} · <Clock size={12} /> {exam.duration} min · {exam.questions?.length || 0} questions
                  </p>
                  <p className="exam-card-pass">Pass mark: {exam.passMark}%</p>
                </div>
                <div className="exam-card-action">
                  {done ? (
                    <span className={`exam-result-badge ${res?.passed ? 'pass' : 'fail'}`}>
                      {res?.passed ? 'Passed' : 'Failed'} · {res?.percent}%
                    </span>
                  ) : (
                    <button className="exam-start-btn" onClick={() => startExam(exam._id)}>
                      Start <ChevronRight size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
