import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Exam.css';

function Exam() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetch('/Exams.json')
      .then((res) => res.json())
      .then((data) => setExams(data))
      .catch((err) => console.error('Failed to load exams:', err));
  }, []);

  return (
    <div className="techborg-exam-page">
      <h1 className="techborg-exam-title">Upcoming Exams</h1>
      <div className="techborg-exam-list">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <div className="techborg-exam-item" key={exam.id}>
              <div className="exam-info">
                <h2>{exam.title}</h2>
                <p><strong>Course:</strong> {exam.course}</p>
                <p><strong>Date:</strong> {exam.date}</p>
                <p><strong>Duration:</strong> {exam.duration}</p>
              </div>
              <div className="exam-action">
                <button className="start-exam-btn">Start Exam</button>
              </div>
            </div>
          ))
        ) : (
          <p className="techborg-no-exam">No exams available right now.</p>
        )}
      </div>
    </div>
  );
}

export default Exam;
