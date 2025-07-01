import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/EnrollmentForm.css';

const EnrollmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  const [courses, setCourses] = useState([]);

  // Fetch courses from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/courses')
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error('Error fetching courses:', err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      alert('Please login to enroll in a course.');
      return;
    }

    const payload = {
      userId: user.id, // ✅ must match "id" key from login
      courseId: formData.course,
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || ''
    };

    console.log('🔍 Submitting enrollment with payload:', payload);

    try {
      const res = await fetch('http://localhost:8000/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Enrollment failed');
      }

      alert('✅ Enrollment submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        message: ''
      });
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error('Enrollment error:', err);
    }
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

        <div className="enroll-form-group">
          <label htmlFor="message">Message (optional)</label>
          <textarea
            id="message"
            name="message"
            className="enroll-textarea"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="enroll-submit-btn">
          Enroll Now
        </button>
      </form>
    </div>
  );
};

export default EnrollmentForm;
