import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/PagesStyle/Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('https://tb-back-fyvj.onrender.com/api/courses')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="techborg-courses-page">
      {/* Hero Section */}
      <div className="techborg-courses-hero">
        <div className="techborg-hero-content">
          <h1 className="techborg-courses-title">
            Explore Our <span className="techborg-highlight">Courses</span>
          </h1>
          <p className="techborg-courses-subtitle">
            Master new skills with our expertly crafted courses designed for real-world success
          </p>
        </div>
        <div className="techborg-hero-decorations">
          <div className="techborg-deco-circle techborg-deco-1"></div>
          <div className="techborg-deco-circle techborg-deco-2"></div>
          <div className="techborg-deco-circle techborg-deco-3"></div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="techborg-filter-section">
        <div className="techborg-filter-container">
          <button 
            className={`techborg-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Courses
          </button>
          <button 
            className={`techborg-filter-btn ${filter === 'popular' ? 'active' : ''}`}
            onClick={() => setFilter('popular')}
          >
            Popular
          </button>
          <button 
            className={`techborg-filter-btn ${filter === 'new' ? 'active' : ''}`}
            onClick={() => setFilter('new')}
          >
            New
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="techborg-courses-container">
        {loading ? (
          <div className="techborg-loading-state">
            <div className="techborg-spinner"></div>
            <p>Loading amazing courses...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="techborg-courses-grid">
            {courses.map((course, index) => (
              <Link 
                to={`/courses/${course._id}`} 
                className="techborg-courses-card" 
                key={course._id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="techborg-card-image-wrapper">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="techborg-courses-image"
                  />
                  <div className="techborg-card-overlay">
                    <span className="techborg-view-details">View Details →</span>
                  </div>
                  <div className="techborg-card-badge">Featured</div>
                </div>
                
                <div className="techborg-card-content">
                  <h2 className="techborg-card-title">{course.title}</h2>
                  <p className="techborg-card-description">{course.description}</p>
                  
                  <div className="techborg-card-footer">
                    <div className="techborg-card-meta">
                      <span className="techborg-meta-item">
                        <svg className="techborg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        12 weeks
                      </span>
                      <span className="techborg-meta-item">
                        <svg className="techborg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        2.5k students
                      </span>
                    </div>
                    <div className="techborg-card-price">
                      <span className="techborg-currency">₹</span>
                      <span className="techborg-amount">{course.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="techborg-empty-state">
            <div className="techborg-empty-icon">📚</div>
            <h3>No courses found</h3>
            <p>Check back soon for new courses!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;