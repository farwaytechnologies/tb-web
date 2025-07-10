import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/PagesStyle/CourseTextContent.css';

export default function CourseTextContent() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/courses/${id}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching course content:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="techborg-course-text-loading">Loading content...</div>;
  if (!course) return <div className="techborg-course-text-error">Course not found</div>;

  return (
    <div className="techborg-course-text-wrapper">
      <h1 className="techborg-course-text-title">
        {course.title} - Learning Material
      </h1>

      <div
        className="techborg-course-text-content"
        dangerouslySetInnerHTML={{ __html: course.learningContent }}
      />

      <Link to={`/courses/${id}`} className="techborg-course-text-back-btn">
        ← Back to Course Details
      </Link>
    </div>
  );
}
