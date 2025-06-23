import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/PagesStyle/CourseDetails.css';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetch('/Courses.json')
      .then((res) => res.json())
      .then((data) => {
        const selected = data.find((c) => String(c.id) === id);
        setCourse(selected);
      });
  }, [id]);

  if (!course) {
    return <div className="techborg-course-detail-loading">Loading...</div>;
  }

  return (
    <div className="techborg-course-detail-page">
      <div className="techborg-course-detail-container">
        <img src={course.image} alt={course.title} />
        <div className="techborg-course-detail-content">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <h3>Price: ₹{course.price}</h3>
          <Link to="/courses" className="techborg-course-back-btn">← Back to Courses</Link>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
