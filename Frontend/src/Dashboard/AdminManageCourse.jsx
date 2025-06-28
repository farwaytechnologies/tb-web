import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageCourse.css';


function AdminManageCourses() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    price: '',
    image: '',
    video: '',
    duration: '',
    level: '',
    instructor: '',
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/courses')
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this course?');
    if (!confirm) return;

    await fetch(`http://localhost:8000/api/courses/${id}`, { method: 'DELETE' });
    setCourses(courses.filter((c) => c._id !== id));
  };

  const handleAdd = async () => {
    const res = await fetch('http://localhost:8000/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const newCourse = await res.json();
    setCourses([...courses, newCourse]);
    setFormData({
      title: '',
      description: '',
      detailedDescription: '',
      price: '',
      image: '',
      video: '',
      duration: '',
      level: '',
      instructor: '',
    });
  };

  return (
    <div className="techborg-admin-course-page">
      <h2>Manage Courses</h2>

      <div className="techborg-course-form">
        <input type="text" placeholder="Title" value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <input type="text" placeholder="Short Description" value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <input type="text" placeholder="Detailed Description" value={formData.detailedDescription}
          onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })} />
        <input type="number" placeholder="Price" value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
        <input type="text" placeholder="Image URL" value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
        <input type="text" placeholder="Video URL" value={formData.video}
          onChange={(e) => setFormData({ ...formData, video: e.target.value })} />
        <input type="text" placeholder="Duration" value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
        <input type="text" placeholder="Level" value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value })} />
        <input type="text" placeholder="Instructor" value={formData.instructor}
          onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />
        <button onClick={handleAdd}>Add Course</button>
      </div>

      <div className="techborg-admin-course-grid">
        {courses.map((course) => (
          <div className="techborg-admin-course-card" key={course._id}>
            <img src={course.image} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>₹{course.price}</p>
            <button onClick={() => handleDelete(course._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminManageCourses;
