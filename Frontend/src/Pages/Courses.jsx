import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/PagesStyle/Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/courses')
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
      <h1 className="techborg-courses-title">Our Courses</h1>
      <div className="techborg-courses-grid">
        {loading ? (
          <p className="techborg-courses-loading">Loading courses...</p>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <Link to={`/courses/${course._id}`} className="techborg-courses-card" key={course._id}>
              <img
                src={course.image}
                alt={course.title}
                className="techborg-courses-image"
              />
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p className="techborg-courses-price">₹{course.price}</p>
            </Link>
          ))
        ) : (
          <p className="techborg-courses-loading">No courses found.</p>
        )}
      </div>
    </div>
  );
}

export default Courses;
