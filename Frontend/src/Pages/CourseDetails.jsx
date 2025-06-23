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
    return <div className="techborg-course-loading">Loading...</div>;
  }

  return (
    <div className="techborg-course-detail">
      {/* Header Split */}
      <section className="techborg-course-header">
        <div className="course-image">
          <img src={course.image} alt={course.title} />
        </div>
        <div className="course-summary">
          <h1>{course.title}</h1>
          <p className="summary">{course.description}</p>
          <ul className="meta">
            <li><strong>Instructor:</strong> {course.instructor}</li>
            <li><strong>Level:</strong> {course.level}</li>
            <li><strong>Duration:</strong> {course.duration}</li>
            <li><strong>Price:</strong> ₹{course.price}</li>
          </ul>
        </div>
      </section>

      {/* Video */}
      <section className="techborg-course-video">
        <h2>Course Preview</h2>
        <div className="video-wrapper">
          <iframe
            src={course.video}
            title="Course Preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Learnings + Description */}
      <section className="techborg-course-body">
        <div className="course-learnings">
          <h2>What You'll Learn</h2>
          <ul>
            {course.modules.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="course-description">
          <h2>Course Overview</h2>
          <p>{course.detailedDescription}</p>
        </div>
      </section>

      {/* Back */}
      <section className="techborg-course-footer">
        <Link to="/courses">← Back to All Courses</Link>
      </section>
    </div>
  );
}

export default CourseDetail;
