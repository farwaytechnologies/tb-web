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
    modules: [
      {
        name: '',
        videos: [{ title: '', video: '', description: '' }]
      }
    ]
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this course?');
    if (!confirm) return;

    await fetch(`http://localhost:8000/api/courses/${id}`, { method: 'DELETE' });
    setCourses(courses.filter(c => c._id !== id));
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
      modules: [
        {
          name: '',
          videos: [{ title: '', video: '', description: '' }]
        }
      ]
    });
  };

  const handleModuleNameChange = (value, index) => {
    const updated = [...formData.modules];
    updated[index].name = value;
    setFormData({ ...formData, modules: updated });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, {
        name: '',
        videos: [{ title: '', video: '', description: '' }]
      }]
    });
  };

  const removeModule = (index) => {
    const updated = [...formData.modules];
    updated.splice(index, 1);
    setFormData({ ...formData, modules: updated });
  };

  const handleVideoChange = (modIdx, vidIdx, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[modIdx].videos[vidIdx][field] = value;
    setFormData({ ...formData, modules: updatedModules });
  };

  const addVideo = (modIdx) => {
    const updatedModules = [...formData.modules];
    updatedModules[modIdx].videos.push({ title: '', video: '', description: '' });
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeVideo = (modIdx, vidIdx) => {
    const updatedModules = [...formData.modules];
    updatedModules[modIdx].videos.splice(vidIdx, 1);
    setFormData({ ...formData, modules: updatedModules });
  };

  return (
    <div className="techborg-admin-course-page">
      <h2>Manage Courses</h2>

      <div className="techborg-course-form">
        <input type="text" placeholder="Title" value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <input type="text" placeholder="Short Description" value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <textarea placeholder="Detailed Description" value={formData.detailedDescription}
          onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })} />
        <input type="number" placeholder="Price" value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
        <input type="text" placeholder="Image URL" value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
        <input type="text" placeholder="Course Video URL" value={formData.video}
          onChange={(e) => setFormData({ ...formData, video: e.target.value })} />
        <input type="text" placeholder="Duration" value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
        <input type="text" placeholder="Level" value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value })} />
        <input type="text" placeholder="Instructor" value={formData.instructor}
          onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />

        {/* Modules with Videos */}
        <div className="section-group">
          <h4>Modules & Videos</h4>
          {formData.modules.map((mod, idx) => (
            <div key={idx} className="module-group">
              <div className="flex-between">
                <input
                  type="text"
                  placeholder={`Module ${idx + 1} Name`}
                  value={mod.name}
                  onChange={(e) => handleModuleNameChange(e.target.value, idx)}
                />
                {formData.modules.length > 1 && (
                  <button className="remove-btn" onClick={() => removeModule(idx)}>Remove Module</button>
                )}
              </div>

              <div className="section-group nested">
                <h5>Videos for {mod.name || `Module ${idx + 1}`}</h5>
                {mod.videos.map((vid, vidx) => (
                  <div className="video-group" key={vidx}>
                    <input
                      type="text"
                      placeholder="Video Title"
                      value={vid.title}
                      onChange={(e) => handleVideoChange(idx, vidx, 'title', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Video URL"
                      value={vid.video}
                      onChange={(e) => handleVideoChange(idx, vidx, 'video', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Video Description"
                      value={vid.description}
                      onChange={(e) => handleVideoChange(idx, vidx, 'description', e.target.value)}
                    />
                    {mod.videos.length > 1 && (
                      <button className="remove-btn" onClick={() => removeVideo(idx, vidx)}>Remove Video</button>
                    )}
                  </div>
                ))}
                <button onClick={() => addVideo(idx)} className="add-btn">+ Add Video</button>
              </div>
            </div>
          ))}
          <button onClick={addModule} className="add-btn">+ Add Module</button>
        </div>

        <button className="submit-btn" onClick={handleAdd}>Add Course</button>
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
