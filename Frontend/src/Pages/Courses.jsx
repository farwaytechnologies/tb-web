import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, X, Users, Clock, ChevronRight, GraduationCap, Star } from 'lucide-react';
import '../Styles/PagesStyle/Courses.css';
import SEO from '../Components/SEO';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const LEVEL_COLORS = { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444' };
const levelColor = (l) => LEVEL_COLORS[l?.toLowerCase()] || '#6366f1';

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

  if (loading) return (
    <div className="crs-page">
      <div className="crs-loading"><div className="crs-spinner" /><p>Loading courses...</p></div>
    </div>
  );

  return (
    <div className="crs-page">
      <SEO
        title="Online Courses"
        description="Browse TechBorg's expert-led online courses in programming, web development, data science, AI and more. Beginner to advanced levels available."
        url="/courses"
        keywords="online courses, programming courses, web development, data science, AI courses, beginner courses India"
      />
      {/* Hero */}
      <div className="crs-hero">
        <div className="crs-hero-inner">
          <span className="crs-hero-badge"><GraduationCap size={14} /> Online Courses</span>
          <h1>Explore Our <span className="crs-accent">Courses</span></h1>
          <p>Master new skills with expertly crafted courses designed for real-world success.</p>

          <div className="crs-search-wrap">
            <Search size={16} className="crs-search-icon" />
            <input className="crs-search" placeholder="Search courses or instructors..." value={search}
              onChange={e => setSearch(e.target.value)} />
            {search && <button className="crs-search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
          </div>

          <div className="crs-hero-stats">
            <div className="crs-stat"><span>{courses.length}</span>Courses</div>
            <div className="crs-stat"><span>{courses.reduce((s, c) => s + (c.modules?.length || 0), 0)}</span>Modules</div>
            <div className="crs-stat"><span>{courses.filter(c => !c.price || c.price === 0).length}</span>Free</div>
          </div>
        </div>
      </div>

      <div className="crs-content">
        {/* Level filter */}
        {levels.length > 1 && (
          <div className="crs-levels">
            {levels.map(l => (
              <button key={l} className={`crs-level-btn ${level === l ? 'active' : ''}`}
                style={level === l && l !== 'All' ? { background: levelColor(l), borderColor: levelColor(l) } : {}}
                onClick={() => setLevel(l)}>{l}</button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="crs-empty">
            <BookOpen size={48} />
            <p>{search ? `No results for "${search}"` : 'No courses available yet.'}</p>
          </div>
        ) : (
          <>
            <p className="crs-count">{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</p>
            <div className="crs-grid">
              {filtered.map((course, i) => (
                <Link key={course._id} to={`/courses/${course._id}`} className="crs-card"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="crs-card-img">
                    {course.image
                      ? <img src={course.image} alt={course.title} onError={e => e.target.style.display='none'} />
                      : <div className="crs-card-placeholder"><BookOpen size={40} /></div>
                    }
                    {course.level && (
                      <span className="crs-card-level" style={{ background: levelColor(course.level) }}>{course.level}</span>
                    )}
                    <div className="crs-card-hover-overlay">
                      <span>View Course <ChevronRight size={14} /></span>
                    </div>
                  </div>
                  <div className="crs-card-body">
                    <h3 className="crs-card-title">{course.title}</h3>
                    {course.instructor && <p className="crs-card-instructor">by {course.instructor}</p>}
                    <p className="crs-card-desc">{course.description}</p>
                    <div className="crs-card-meta">
                      {course.duration && <span className="crs-meta-item"><Clock size={12} />{course.duration}</span>}
                      <span className="crs-meta-item"><BookOpen size={12} />{course.modules?.length || 0} modules</span>
                    </div>
                    <div className="crs-card-footer">
                      <span className="crs-card-price">
                        {course.price ? <><span className="crs-currency">₹</span>{Number(course.price).toLocaleString()}</> : <span className="crs-free">Free</span>}
                      </span>
                      <span className="crs-enroll-cta">Enroll Now <ChevronRight size={13} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
