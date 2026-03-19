import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, X, Clock, ChevronRight, GraduationCap, Layers, Tag } from 'lucide-react';
import '../Styles/PagesStyle/Courses.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL;

const LEVEL_META = {
  beginner:     { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
  intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  advanced:     { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)'  },
};
const lvl = (l) => LEVEL_META[l?.toLowerCase()] || { color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)' };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(r => r.json())
      .then(d => { setCourses(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const levels = ['All', ...Array.from(new Set(courses.map(c => c.level).filter(Boolean)))];

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.title?.toLowerCase().includes(q) || c.instructor?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
    const matchLevel = level === 'All' || c.level === level;
    return matchSearch && matchLevel;
  });

  const totalModules = courses.reduce((s, c) => s + (c.modules?.length || 0), 0);
  const freeCount = courses.filter(c => !c.price || c.price === 0).length;

  return (
    <div className="crs-page">
      <SEO
        title="Online Courses"
        description="Browse TechBorg's expert-led online courses in programming, web development, data science, AI and more. Beginner to advanced levels available."
        url="/courses"
        keywords="online courses, programming courses, web development, data science, AI courses, beginner courses India"
      />

      {/* Hero */}
      <section className="crs-hero">
        <div className="crs-hero-glow" />
        <div className="crs-hero-inner">
          <span className="crs-hero-badge">
            <GraduationCap size={13} /> Online Courses
          </span>
          <h1>Explore Our <span className="crs-accent">Courses</span></h1>
          <p>Master new skills with expertly crafted courses designed for real-world success.</p>

          <div className="crs-search-wrap">
            <Search size={16} className="crs-search-icon" />
            <input
              className="crs-search"
              placeholder="Search courses, instructors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="crs-search-clear" onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="crs-hero-stats">
            <div className="crs-stat">
              <span className="crs-stat-val">{courses.length}</span>
              <span className="crs-stat-label">Courses</span>
            </div>
            <div className="crs-stat-divider" />
            <div className="crs-stat">
              <span className="crs-stat-val">{totalModules}</span>
              <span className="crs-stat-label">Modules</span>
            </div>
            <div className="crs-stat-divider" />
            <div className="crs-stat">
              <span className="crs-stat-val">{freeCount}</span>
              <span className="crs-stat-label">Free</span>
            </div>
          </div>
        </div>
      </section>

      <div className="crs-body">
        {/* Filters */}
        <div className="crs-filters">
          <div className="crs-levels">
            {levels.map(l => {
              const m = lvl(l);
              return (
                <button
                  key={l}
                  className={`crs-level-btn${level === l ? ' active' : ''}`}
                  style={level === l && l !== 'All' ? { background: m.bg, borderColor: m.border, color: m.color } : {}}
                  onClick={() => setLevel(l)}
                >{l}</button>
              );
            })}
          </div>
          {filtered.length > 0 && (
            <p className="crs-count">{filtered.length} course{filtered.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {loading ? (
          <div className="crs-state"><div className="crs-spinner" /><p>Loading courses...</p></div>
        ) : filtered.length === 0 ? (
          <div className="crs-state">
            <BookOpen size={48} />
            <p>{search ? `No results for "${search}"` : 'No courses available yet.'}</p>
          </div>
        ) : (
          <div className="crs-grid">
            {filtered.map((course, i) => {
              const m = lvl(course.level);
              return (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="crs-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Thumbnail */}
                  <div className="crs-card-thumb">
                    {course.image
                      ? <img src={course.image} alt={course.title} onError={e => e.target.style.display = 'none'} />
                      : <div className="crs-card-thumb-placeholder"><BookOpen size={36} /></div>
                    }
                    {course.level && (
                      <span
                        className="crs-card-level"
                        style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}
                      >{course.level}</span>
                    )}
                    {(!course.price || course.price === 0) && (
                      <span className="crs-card-free-badge">Free</span>
                    )}
                    <div className="crs-card-overlay">
                      <span>View Course <ChevronRight size={14} /></span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="crs-card-body">
                    {course.instructor && (
                      <p className="crs-card-instructor">{course.instructor}</p>
                    )}
                    <h3 className="crs-card-title">{course.title}</h3>
                    {course.description && (
                      <p className="crs-card-desc">{course.description}</p>
                    )}

                    <div className="crs-card-chips">
                      {course.duration && (
                        <span className="crs-chip"><Clock size={11} />{course.duration}</span>
                      )}
                      <span className="crs-chip"><Layers size={11} />{course.modules?.length || 0} modules</span>
                    </div>

                    <div className="crs-card-footer">
                      <span className="crs-card-price">
                        {course.price
                          ? <><span className="crs-currency">₹</span>{Number(course.price).toLocaleString()}</>
                          : <span className="crs-free">Free</span>
                        }
                      </span>
                      <span className="crs-enroll-cta">Enroll <ChevronRight size={13} /></span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
