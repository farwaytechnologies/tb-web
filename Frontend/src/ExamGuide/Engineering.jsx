import React, { useState } from 'react';
import '../Styles/ExamGuideStyle/Engineering.css';

const years = [2010, 2015, 2020];

export default function Engineering() {
  const [selectedYear, setSelectedYear] = useState(2010);

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  return (
    <div className="engineering-container">
      <h1>Engineering Exam Guide</h1>
      <p>Select a year to view semester details:</p>

      <div className="engineering-year-selector">
        {years.map((year) => (
          <button
            key={year}
            className={`engineering-year-btn ${selectedYear === year ? 'active' : ''}`}
            onClick={() => handleYearClick(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="engineering-semester-grid">
        {[1, 2, 3, 4, 5, 6].map((sem) => (
          <div key={sem} className="engineering-semester-card">
            <h3>Semester {sem}</h3>
            <p>Year: {selectedYear}</p>
            <p>Subject and syllabus info...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
