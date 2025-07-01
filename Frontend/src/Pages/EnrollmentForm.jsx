import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/EnrollmentForm.css';

const EnrollmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
  });

  const [courses, setCourses] = useState([]);

  // Fetch courses from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/courses')
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error('Error fetching courses:', err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enrollment Data:', formData);

    // You can send formData to backend here if needed
    // Example:
    // fetch('http://localhost:8000/api/enrollments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });

    alert('Enrollment submitted!');
  };

  return (
    <div className="enroll-container">
      <h2 className="enroll-title">Course Enrollment Form</h2>
      <form className="enroll-form" onSubmit={handleSubmit}>
        <div className="enroll-form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="enroll-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="enroll-form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="enroll-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="enroll-form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="enroll-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="enroll-form-group">
          <label htmlFor="course">Select Course</label>
          <select
            id="course"
            name="course"
            className="enroll-select"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="enroll-submit-btn">
          Enroll Now
        </button>
      </form>
    </div>
  );
};

export default EnrollmentForm;
