import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, User, BarChart2, Play, ChevronDown, ChevronUp, CheckCircle, Lock } from 'lucide-react';
import '../Styles/PagesStyle/CourseDetails.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const LEVEL_COLORS = { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444' };
const levelColor = (l) => LEVEL_COLORS[l?.toLowerCase()] || '#6366f1';

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
      .then(r => { if (!r.ok) throw new Error('Course not found'); return r.json(); })
      .then(data => {
        setCourse(data);
        setLoading(false);
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
          fetch(`${API_URL}/api/enrollments/user/${user._id || user.id}`)
            .then(r => r.json())
            .then(enrollments => {
              if (Array.isArray(enrollments))
                setEnrolled(enrollments.some(e => String(e.courseId?._id || e.courseId) === id));
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
    <div className="cd-page"><div className="cd-loading"><div className="cd-spinner" /><p>Loading course...</p></div></div>
  );
  if (error || !course) return (
    <div className="cd-page"><div className="cd-error">
      <BookOpen size={48} />
      <h2>Course not found</h2>
      <Link to="/courses" className="cd-error-btn">← Back to Courses</Link>
    </div></div>
  );

  const totalVideos = course.modules?.reduce((s, m) => s + (m.videos?.length || 0), 0) || 0;
  const color = levelColor(course.level);

  return (
    <div className="cd-page">
      {course && (
        <SEO
          title={course.title}
          description={course.description || `Learn ${course.title} with TechBorg. ${course.level ? course.level + ' level.' : ''} ${course.modules?.length || 0} modules available.`}
          url={`/courses/${id}`}
          image={course.image}
          keywords={`${course.title}, ${course.level || ''} course, ${course.instructor || ''}, online course`}
        />
      )}
      {/* Hero banner */}
      <div className="cd-hero" style={course.image ? {} : { background: 'linear-gradient(135deg, #0f172a, #312e81)' }}>
        {course.image && <img src={course.image} alt={course.title} className="cd-hero-bg" onError={e => e.target.style.display='none'} />}
        <div className="cd-hero-overlay" />
        <div className="cd-hero-content">
          <Link to="/courses" className="cd-back"><ArrowLeft size={15} /> All Courses</Link>
          {course.level && <span className="cd-level-badge" style={{ background: color }}>{course.level}</span>}
          <h1 className="cd-hero-title">{course.title}</h1>
          <p className="cd-hero-desc">{course.description}</p>
          <div className="cd-hero-meta">
            {course.instructor && <span><User size={14} />{course.instructor}</span>}
            {course.duration && <span><Clock size={14} />{course.duration}</span>}
            {course.modules?.length > 0 && <span><BookOpen size={14} />{course.modules.length} modules · {totalVideos} videos</span>}
          </div>
        </div>
      </div>

      <div className="cd-layout">
        {/* Main content */}
        <main className="cd-main">
          {/* Video preview */}
          {course.video && (
            <div className="cd-section">
              <h2 className="cd-section-title"><Play size={16} /> Course Preview</h2>
              <div className="cd-video-wrap">
                <iframe src={course.video} title="Course Preview" frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
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

          {/* Modules */}
          {course.modules?.length > 0 && (
            <div className="cd-section">
              <h2 className="cd-section-title"><BookOpen size={16} /> Course Content</h2>
              <p className="cd-modules-meta">{course.modules.length} modules · {totalVideos} videos</p>
              <div className="cd-modules">
                {course.modules.map((mod, i) => (
                  <div key={i} className="cd-module">
                    <button className="cd-module-head" onClick={() => setExpandedMod(expandedMod === i ? -1 : i)}>
                      <div className="cd-module-head-left">
                        {expandedMod === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        <span className="cd-module-num">Module {i + 1}</span>
                        <span className="cd-module-name">{mod.name}</span>
                      </div>
                      <span className="cd-module-count">{mod.videos?.length || 0} videos</span>
                    </button>
                    {expandedMod === i && (
                      <div className="cd-module-body">
                        {mod.videos?.map((vid, vi) => (
                          <div key={vi} className="cd-video-item">
                            <Play size={13} className="cd-video-icon" />
                            <span className="cd-video-title">{vid.title || `Video ${vi + 1}`}</span>
                            {!enrolled && <Lock size={12} className="cd-lock-icon" />}
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

        {/* Sticky sidebar */}
        <aside className="cd-sidebar">
          <div className="cd-sidebar-card">
            {course.image && (
              <div className="cd-sidebar-img">
                <img src={course.image} alt={course.title} onError={e => e.target.style.display='none'} />
              </div>
            )}
            <div className="cd-sidebar-body">
              <div className="cd-sidebar-price">
                {course.price ? <><span className="cd-price-currency">₹</span><span className="cd-price-amount">{Number(course.price).toLocaleString()}</span></> : <span className="cd-price-free">Free</span>}
              </div>

              {enrolled ? (
                <Link to={`/courses/${id}/modules`} className="cd-enroll-btn cd-enrolled-btn">
                  <CheckCircle size={16} /> Continue Learning
                </Link>
              ) : (
                <button className="cd-enroll-btn" onClick={handleEnroll}>Enroll Now</button>
              )}

              <Link to={`/courses/${id}/modules`} className="cd-modules-btn">View Modules</Link>
              <Link to={`/courses/${id}/content`} className="cd-modules-btn">Learning Material</Link>

              <div className="cd-sidebar-details">
                {course.instructor && (
                  <div className="cd-detail-row"><User size={14} /><span><strong>Instructor:</strong> {course.instructor}</span></div>
                )}
                {course.level && (
                  <div className="cd-detail-row"><BarChart2 size={14} /><span><strong>Level:</strong> {course.level}</span></div>
                )}
                {course.duration && (
                  <div className="cd-detail-row"><Clock size={14} /><span><strong>Duration:</strong> {course.duration}</span></div>
                )}
                <div className="cd-detail-row"><BookOpen size={14} /><span><strong>Modules:</strong> {course.modules?.length || 0}</span></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
