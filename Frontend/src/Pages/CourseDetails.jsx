import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../Styles/PagesStyle/CourseDetails.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/courses/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Course not found');
        return res.json();
      })
      .then((data) => {
        setCourse(data);
        setLoading(false);
        // Check if user is already enrolled
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
          fetch(`${API_URL}/api/enrollments/user/${user._id || user.id}`)
            .then(r => r.json())
            .then(enrollments => {
              if (Array.isArray(enrollments)) {
                setEnrolled(enrollments.some(e => String(e.courseId?._id || e.courseId) === id));
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleEnroll = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { navigate('/login'); return; }
    navigate(`/enroll?courseId=${id}`);
  };

  if (loading) return <div className="techborg-course-loading">Loading...</div>;
  if (error) return <div className="techborg-course-error">Error: {error}</div>;
  if (!course) return null;

  return (
    <div className="techborg-course-detail">
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

          <div className="techborg-course-buttons">
            {enrolled ? (
              <Link to={`/courses/${id}/modules`} className="techborg-enroll-btn" style={{ background: '#10b981' }}>
                ✓ Already Enrolled — Continue
              </Link>
            ) : (
              <button onClick={handleEnroll} className="techborg-enroll-btn">
                Enroll Now
              </button>
            )}
            <Link to={`/courses/${id}/modules`} className="techborg-module-btn">
              View Modules
            </Link>
            <Link to={`/courses/${id}/content`} className="techborg-module-btn">
  Read Learning Material
</Link>

          </div>
        </div>
      </section>

      {course.video && (
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
      )}

      <section className="techborg-course-body">
        {course.modules && (
          <div className="course-learnings">
            <h2>What You'll Learn</h2>
            <ul>
              {course.modules.map((mod, index) => (
                <li key={index}>
                  {mod.name} ({mod.videos?.length || 0} videos)
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="course-description">
          <h2>Course Overview</h2>
          <p>{course.detailedDescription}</p>
        </div>
      </section>

      <section className="techborg-course-footer">
        <Link to="/courses">← Back to All Courses</Link>
      </section>
    </div>
  );
}

export default CourseDetail;
