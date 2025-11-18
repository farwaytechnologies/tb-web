import React, { useState } from 'react';
import '../Styles/ExamGuideStyle/Engineering.css';

const years = [2010, 2015, 2020];

export default function Engineering() {
  const [selectedYear, setSelectedYear] = useState(2010);
  const [searchTerm, setSearchTerm] = useState('');

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  const semesterData = {
    1: { subjects: 5, papers: 12, credits: 24 },
    2: { subjects: 5, papers: 14, credits: 26 },
    3: { subjects: 6, papers: 15, credits: 28 },
    4: { subjects: 6, papers: 16, credits: 28 },
    5: { subjects: 5, papers: 13, credits: 25 },
    6: { subjects: 5, papers: 14, credits: 26 },
    7: { subjects: 4, papers: 10, credits: 22 },
    8: { subjects: 3, papers: 8, credits: 20 }
  };

  return (
    <div className="eng-page-wrapper">
      {/* Header Section */}
      <div className="eng-header-section">
        <div className="eng-header-content">
          <div className="eng-header-text">
            <div className="eng-header-icon-mobile">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h1 className="eng-main-title">Engineering Exam Guide</h1>
            <p className="eng-subtitle">Comprehensive study resources and syllabus for all semesters</p>
          </div>
          <div className="eng-header-icon-desktop">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="eng-controls-section">
        <div className="eng-search-box">
          <svg className="eng-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search subjects, topics..."
            className="eng-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="eng-year-selector">
          <svg className="eng-calendar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="eng-year-label">Academic Year:</span>
          <div className="eng-year-buttons">
            {years.map((year) => (
              <button
                key={year}
                className={`eng-year-btn ${selectedYear === year ? 'eng-year-btn-active' : ''}`}
                onClick={() => handleYearClick(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Grid */}
      <div className="eng-semester-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <div key={sem} className="eng-semester-card">
            <div className="eng-card-header">
              <div className="eng-sem-badge">Sem {sem}</div>
              <div className="eng-year-badge">{selectedYear}</div>
            </div>
            
            <h3 className="eng-card-title">Semester {sem}</h3>
            
            <div className="eng-card-stats">
              <div className="eng-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div>
                  <div className="eng-stat-value">{semesterData[sem].subjects}</div>
                  <div className="eng-stat-label">Subjects</div>
                </div>
              </div>
              <div className="eng-stat-divider"></div>
              <div className="eng-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <div>
                  <div className="eng-stat-value">{semesterData[sem].papers}</div>
                  <div className="eng-stat-label">Papers</div>
                </div>
              </div>
              <div className="eng-stat-divider"></div>
              <div className="eng-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <div>
                  <div className="eng-stat-value">{semesterData[sem].credits}</div>
                  <div className="eng-stat-label">Credits</div>
                </div>
              </div>
            </div>

            <div className="eng-card-actions">
              <button className="eng-btn-primary">
                View Syllabus
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <button className="eng-btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Resources
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}