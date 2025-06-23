import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/PagesStyle/Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/Courses.json')
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error('Error:', err));
  }, []);

  return (
    <div className="techborg-courses-page">
      <h1 className="techborg-courses-title">Our Courses</h1>
      <div className="techborg-courses-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Link to={`/courses/${course.id}`} className="techborg-courses-card" key={course.id}>
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
          <p className="techborg-courses-loading">Loading courses...</p>
        )}
      </div>
    </div>
  );
}

export default Courses;
