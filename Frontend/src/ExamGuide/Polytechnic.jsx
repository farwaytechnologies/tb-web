import React, { useState } from 'react';
import '../Styles/ExamGuideStyle/Polytechnic.css';

const years = [2010, 2015, 2020];

export default function Polytechnic() {
  const [selectedYear, setSelectedYear] = useState(2010);
  const [searchTerm, setSearchTerm] = useState('');

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  const semesterData = {
    1: { subjects: 6, papers: 14, credits: 22 },
    2: { subjects: 6, papers: 15, credits: 24 },
    3: { subjects: 5, papers: 13, credits: 23 },
    4: { subjects: 5, papers: 14, credits: 24 },
    5: { subjects: 5, papers: 12, credits: 22 },
    6: { subjects: 4, papers: 10, credits: 20 }
  };

  return (
    <div className="poly-page-wrapper">
      {/* Header Section */}
      <div className="poly-header-section">
        <div className="poly-header-content">
          <div className="poly-header-text">
            <div className="poly-header-icon-mobile">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h1 className="poly-main-title">Polytechnic Exam Guide</h1>
            <p className="poly-subtitle">Complete diploma course materials and examination guidelines</p>
          </div>
          <div className="poly-header-icon-desktop">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="poly-controls-section">
        <div className="poly-search-box">
          <svg className="poly-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search subjects, topics..."
            className="poly-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="poly-year-selector">
          <svg className="poly-calendar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="poly-year-label">Academic Year:</span>
          <div className="poly-year-buttons">
            {years.map((year) => (
              <button
                key={year}
                className={`poly-year-btn ${selectedYear === year ? 'poly-year-btn-active' : ''}`}
                onClick={() => handleYearClick(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Grid */}
      <div className="poly-semester-grid">
        {[1, 2, 3, 4, 5, 6].map((sem) => (
          <div key={sem} className="poly-semester-card">
            <div className="poly-card-header">
              <div className="poly-sem-badge">Sem {sem}</div>
              <div className="poly-year-badge">{selectedYear}</div>
            </div>
            
            <h3 className="poly-card-title">Semester {sem}</h3>
            
            <div className="poly-card-stats">
              <div className="poly-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div>
                  <div className="poly-stat-value">{semesterData[sem].subjects}</div>
                  <div className="poly-stat-label">Subjects</div>
                </div>
              </div>
              <div className="poly-stat-divider"></div>
              <div className="poly-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                <div>
                  <div className="poly-stat-value">{semesterData[sem].papers}</div>
                  <div className="poly-stat-label">Papers</div>
                </div>
              </div>
              <div className="poly-stat-divider"></div>
              <div className="poly-stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <div>
                  <div className="poly-stat-value">{semesterData[sem].credits}</div>
                  <div className="poly-stat-label">Credits</div>
                </div>
              </div>
            </div>

            <div className="poly-card-actions">
              <button className="poly-btn-primary">
                View Syllabus
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <button className="poly-btn-secondary">
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