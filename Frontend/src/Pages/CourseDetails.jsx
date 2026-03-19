import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, BookOpen, User, BarChart2, Play,
  ChevronDown, ChevronUp, CheckCircle, Lock, Layers, Tag
} from 'lucide-react';
import '../Styles/PagesStyle/CourseDetails.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL;

const LEVEL_META = {
  beginner:     { color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
  intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
  advanced:     { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.3)'  },
};
const lvl = (l) => LEVEL_META[l?.toLowerCase()] || { color: '#818cf8', bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.3)' };

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [expandedMod, setExpandedMod] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_URL}/api/courses/${id}`)
      .then(r => { if (!r.ok) throw new Error('Not found'); return r.json(); })
      .then(data => {
        setCourse(data);
        setLoading(false);
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
          fetch(`${API_URL}/api/enrollments/user/${user._id || user.id}`)
            .then(r => r.json())
            .then(list => {
              if (Array.isArray(list))
                setEnrolled(list.some(e => String(e.courseId?._id || e.courseId) === id));
            }).catch(() => {});
        }
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  const handleEnroll = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { navigate('/login'); return; }
    navigate(`/enroll?courseId=${id}`);
  };

  if (loading) return (
    <div className="cd-page">
      <div className="cd-state"><div className="cd-spinner" /><p>Loading course...</p></div>
    </div>
  );
  if (error || !course) return (
    <div className="cd-page">
      <div className="cd-state cd-error-state">
        <BookOpen size={52} />
        <h2>Course not found</h2>
        <Link to="/courses" className="cd-back-btn">← Back to Courses</Link>
      </div>
    </div>
  );

  const totalVideos = course.modules?.reduce((s, m) => s + (m.videos?.length || 0), 0) || 0;
  const m = lvl(course.level);

  return (
    <div className="cd-page">
      <SEO
        title={course.title}
        description={course.description || `Learn ${course.title} with TechBorg. ${course.level ? course.level + ' level.' : ''} ${course.modules?.length || 0} modules.`}
        url={`/courses/${id}`}
        image={course.image}
        keywords={`${course.title}, ${course.level || ''} course, ${course.instructor || ''}, online course`}
      />

      {/* Hero */}
      <div className="cd-hero" style={!course.image ? { background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' } : {}}>
        {course.image && (
          <img src={course.image} alt={course.title} className="cd-hero-bg" onError={e => e.target.style.display = 'none'} />
        )}
        <div className="cd-hero-overlay" />
        <div className="cd-hero-content">
          <Link to="/courses" className="cd-back">
            <ArrowLeft size={14} /> All Courses
          </Link>
          <div className="cd-hero-badges">
            {course.level && (
              <span className="cd-level-badge" style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
                {course.level}
              </span>
            )}
            {(!course.price || course.price === 0) && (
              <span className="cd-free-badge">Free</span>
            )}
          </div>
          <h1 className="cd-hero-title">{course.title}</h1>
          {course.description && <p className="cd-hero-desc">{course.description}</p>}
          <div className="cd-hero-meta">
            {course.instructor && <span><User size={13} />{course.instructor}</span>}
            {course.duration && <span><Clock size={13} />{course.duration}</span>}
            {course.modules?.length > 0 && (
              <span><Layers size={13} />{course.modules.length} modules · {totalVideos} videos</span>
            )}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="cd-layout">
        <main className="cd-main">
          {/* Video preview */}
          {course.video && (
            <div className="cd-section">
              <h2 className="cd-section-title"><Play size={16} /> Course Preview</h2>
              <div className="cd-video-wrap">
                <iframe
                  src={course.video} title="Course Preview" frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Overview */}
          {course.detailedDescription && (
            <div className="cd-section">
              <h2 className="cd-section-title"><BookOpen size={16} /> Course Overview</h2>
              <p className="cd-overview-text">{course.detailedDescription}</p>
            </div>
          )}

          {/* What you'll learn */}
          {course.objectives?.length > 0 && (
            <div className="cd-section">
              <h2 className="cd-section-title"><CheckCircle size={16} /> What You'll Learn</h2>
              <div className="cd-objectives">
                {course.objectives.map((obj, i) => (
                  <div key={i} className="cd-objective-item">
                    <CheckCircle size={14} className="cd-obj-icon" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modules */}
          {course.modules?.length > 0 && (
            <div className="cd-section">
              <h2 className="cd-section-title"><Layers size={16} /> Course Content</h2>
              <p className="cd-modules-meta">{course.modules.length} modules · {totalVideos} videos</p>
              <div className="cd-modules">
                {course.modules.map((mod, i) => (
                  <div key={i} className={`cd-module${expandedMod === i ? ' cd-module--open' : ''}`}>
                    <button
                      className="cd-module-head"
                      onClick={() => setExpandedMod(expandedMod === i ? -1 : i)}
                    >
                      <div className="cd-module-head-left">
                        <span className="cd-module-num">
                          {expandedMod === i ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </span>
                        <div>
                          <span className="cd-module-label">Module {i + 1}</span>
                          <span className="cd-module-name">{mod.name}</span>
                        </div>
                      </div>
                      <span className="cd-module-count">{mod.videos?.length || 0} videos</span>
                    </button>
                    {expandedMod === i && (
                      <div className="cd-module-body">
                        {mod.videos?.map((vid, vi) => (
                          <div key={vi} className="cd-video-item">
                            <Play size={12} className="cd-video-icon" />
                            <span className="cd-video-title">{vid.title || `Video ${vi + 1}`}</span>
                            {!enrolled && <Lock size={11} className="cd-lock-icon" />}
                          </div>
                        ))}
                        {(!mod.videos || mod.videos.length === 0) && (
                          <p className="cd-no-videos">No videos in this module.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="cd-sidebar">
          <div className="cd-sidebar-card">
            {course.image && (
              <div className="cd-sidebar-thumb">
                <img src={course.image} alt={course.title} onError={e => e.target.style.display = 'none'} />
                <div className="cd-sidebar-thumb-overlay">
                  <Play size={28} />
                </div>
              </div>
            )}
            <div className="cd-sidebar-body">
              <div className="cd-price-row">
                {course.price
                  ? <><span className="cd-price-sym">₹</span><span className="cd-price-val">{Number(course.price).toLocaleString()}</span></>
                  : <span className="cd-price-free">Free</span>
                }
              </div>

              {enrolled ? (
                <Link to={`/courses/${id}/modules`} className="cd-btn cd-btn-enrolled">
                  <CheckCircle size={16} /> Continue Learning
                </Link>
              ) : (
                <button className="cd-btn cd-btn-enroll" onClick={handleEnroll}>
                  Enroll Now
                </button>
              )}

              <Link to={`/courses/${id}/modules`} className="cd-btn cd-btn-outline">
                View Modules
              </Link>
              <Link to={`/courses/${id}/content`} className="cd-btn cd-btn-outline">
                Learning Material
              </Link>

              <div className="cd-sidebar-details">
                {course.instructor && (
                  <div className="cd-detail-row">
                    <User size={13} />
                    <span><strong>Instructor</strong>{course.instructor}</span>
                  </div>
                )}
                {course.level && (
                  <div className="cd-detail-row">
                    <BarChart2 size={13} />
                    <span><strong>Level</strong>{course.level}</span>
                  </div>
                )}
                {course.duration && (
                  <div className="cd-detail-row">
                    <Clock size={13} />
                    <span><strong>Duration</strong>{course.duration}</span>
                  </div>
                )}
                <div className="cd-detail-row">
                  <Layers size={13} />
                  <span><strong>Modules</strong>{course.modules?.length || 0}</span>
                </div>
                <div className="cd-detail-row">
                  <Play size={13} />
                  <span><strong>Videos</strong>{totalVideos}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
