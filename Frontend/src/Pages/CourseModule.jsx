import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Circle, BookOpen } from 'lucide-react';
import '../Styles/PagesStyle/CourseModule.css';

const API = import.meta.env.VITE_API_URL;

function CourseModules() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedMod, setSelectedMod] = useState(0);
  const [selectedVid, setSelectedVid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [marking, setMarking] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userId = user?._id || user?.id;

  const totalLessons = course?.modules?.reduce((s, m) => s + (m.videos?.length || 0), 0) || 0;

  const fetchProgress = useCallback(async () => {
    if (!userId) return;
    try {
      const r = await fetch(`${API}/api/progress/${userId}/${id}`);
      const d = await r.json();
      setProgress(d);
    } catch {}
  }, [userId, id]);

  useEffect(() => {
    fetch(`${API}/api/courses/${id}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        const first = data.modules?.find(m => m.videos?.length > 0);
        setSelectedVideo(first?.videos?.[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const lessonKey = (mIdx, vIdx) => `${mIdx}-${vIdx}`;
  const isCompleted = (mIdx, vIdx) => progress?.completedLessons?.includes(lessonKey(mIdx, vIdx));

  const getEnrollmentId = async () => {
    if (!userId) return null;
    try {
      const r = await fetch(`${API}/api/enrollments/user/${userId}`);
      const data = await r.json();
      const enr = data.find(e => e.courseId?._id === id || e.courseId === id);
      return enr?._id || null;
    } catch { return null; }
  };

  const toggleLesson = async (mIdx, vIdx) => {
    if (!userId || marking) return;
    setMarking(true);
    const key = lessonKey(mIdx, vIdx);
    const completed = isCompleted(mIdx, vIdx);
    const enrollmentId = await getEnrollmentId();
    if (!enrollmentId) { setMarking(false); return; }

    try {
      const endpoint = completed ? 'unmark' : 'mark';
      await fetch(`${API}/api/progress/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courseId: id, enrollmentId, lessonKey: key, totalLessons }),
      });
      await fetchProgress();
    } catch {}
    setMarking(false);
  };

  if (loading) return <div className="course-modules-loading">Loading modules...</div>;
  if (!course || !course.modules?.length) return <div className="course-modules-empty">No modules available.</div>;

  const pct = progress?.progressPercent || 0;

  return (
    <div className="course-modules-wrapper">
      <div className="course-modules-header">
        <h1>{course.title}</h1>
        <div className="cm-header-meta">
          <span>{totalLessons} Videos</span>
          {userId && (
            <div className="cm-progress-wrap">
              <div className="cm-progress-bar">
                <div className="cm-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="cm-progress-pct">{pct}% complete</span>
            </div>
          )}
        </div>
      </div>

      <div className="course-modules-main-content">
        <aside className="course-modules-sidebar">
          {course.modules.map((mod, modIdx) => (
            <div key={modIdx} className="module-block">
              <h4 className="module-title">{mod.name}</h4>
              {mod.videos.map((video, vidIdx) => {
                const done = isCompleted(modIdx, vidIdx);
                const active = selectedMod === modIdx && selectedVid === vidIdx;
                return (
                  <div
                    key={vidIdx}
                    className={`course-module-list-item ${active ? 'active' : ''} ${done ? 'done' : ''}`}
                    onClick={() => { setSelectedVideo(video); setSelectedMod(modIdx); setSelectedVid(vidIdx); }}
                  >
                    <span className="cm-lesson-icon">
                      {done ? <CheckCircle size={14} color="#10b981" /> : <Circle size={14} color="#475569" />}
                    </span>
                    {modIdx + 1}.{vidIdx + 1} {video.title}
                  </div>
                );
              })}
            </div>
          ))}
        </aside>

        <section className="course-modules-video-area">
          {selectedVideo ? (
            <>
              <div className="course-main-video-wrapper">
                <iframe
                  src={selectedVideo.video}
                  title={selectedVideo.title}
                  allowFullScreen
                  frameBorder="0"
                />
              </div>
              <div className="course-video-content">
                <div className="cm-video-title-row">
                  <h2>{selectedVideo.title}</h2>
                  {userId && (
                    <button
                      className={`cm-mark-btn ${isCompleted(selectedMod, selectedVid) ? 'marked' : ''}`}
                      onClick={() => toggleLesson(selectedMod, selectedVid)}
                      disabled={marking}
                    >
                      {isCompleted(selectedMod, selectedVid)
                        ? <><CheckCircle size={15} /> Completed</>
                        : <><Circle size={15} /> Mark Complete</>}
                    </button>
                  )}
                </div>
                <p>{selectedVideo.description}</p>
              </div>
            </>
          ) : (
            <div className="cm-no-video"><BookOpen size={40} /><p>Select a lesson to start</p></div>
          )}
        </section>
      </div>

      <div className="course-modules-back">
        <Link to="/courses">← Back to All Courses</Link>
      </div>
    </div>
  );
}

export default CourseModules;
