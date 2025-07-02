import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/TutorManageCourse.css';

function TutorManageCourses() {
  const currentTutor = localStorage.getItem('userName') || 'Tutor';

  function getInitialForm() {
    return {
      title: '',
      description: '',
      detailedDescription: '',
      price: '',
      image: '',
      video: '',
      duration: '',
      level: '',
      instructor: currentTutor,
      modules: [
        {
          name: '',
          videos: [{ title: '', video: '', description: '' }]
        }
      ]
    };
  }

  const [formData, setFormData] = useState(getInitialForm());
  const [courses, setCourses] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/courses')
      .then(res => res.json())
      .then(data => {
        const ownCourses = data.filter(
          course => course.instructor?.toLowerCase() === currentTutor.toLowerCase()
        );
        setCourses(ownCourses);
      });
  }, [currentTutor]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleAddOrUpdate = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `http://localhost:8000/api/courses/${editId}`
      : 'http://localhost:8000/api/courses';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (editId) {
      setCourses(courses.map(c => (c._id === editId ? data : c)));
    } else {
      setCourses([...courses, data]);
    }

    setFormData(getInitialForm());
    setEditId(null);
  };

  const handleEdit = (course) => {
    if (course.instructor?.toLowerCase() !== currentTutor.toLowerCase()) return;

    setFormData({
      title: course.title,
      description: course.description,
      detailedDescription: course.detailedDescription,
      price: course.price,
      image: course.image,
      video: course.video,
      duration: course.duration,
      level: course.level,
      instructor: course.instructor,
      modules: course.modules || []
    });

    setEditId(course._id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this course?');
    if (!confirm) return;

    await fetch(`http://localhost:8000/api/courses/${id}`, { method: 'DELETE' });
    setCourses(courses.filter(c => c._id !== id));
  };

  return (
    <div className="techborg-tutor-course-page">
      <h2>Your Courses</h2>

      <div className="techborg-tutor-course-form">
        <input type="text" placeholder="Title" value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)} />
        <input type="text" placeholder="Short Description" value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)} />
        <textarea placeholder="Detailed Description" value={formData.detailedDescription}
          onChange={(e) => handleInputChange('detailedDescription', e.target.value)} />
        <input type="number" placeholder="Price" value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value)} />
        <input type="text" placeholder="Image URL" value={formData.image}
          onChange={(e) => handleInputChange('image', e.target.value)} />
        <input type="text" placeholder="Course Video URL" value={formData.video}
          onChange={(e) => handleInputChange('video', e.target.value)} />
        <input type="text" placeholder="Duration" value={formData.duration}
          onChange={(e) => handleInputChange('duration', e.target.value)} />
        <input type="text" placeholder="Level" value={formData.level}
          onChange={(e) => handleInputChange('level', e.target.value)} />

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

        <button className="submit-btn" onClick={handleAddOrUpdate}>
          {editId ? 'Update Course' : 'Add Course'}
        </button>
      </div>

      <div className="techborg-tutor-course-grid">
        {courses.map((course) => (
          <div className="techborg-tutor-course-card" key={course._id}>
            <img src={course.image} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>₹{course.price}</p>
            <div className="techborg-tutor-actions">
              <button onClick={() => handleEdit(course)}>Edit</button>
              <button onClick={() => handleDelete(course._id)}>Delete</button>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <p className="techborg-tutor-empty">You haven't added any courses yet.</p>
        )}
      </div>
    </div>
  );
}

export default TutorManageCourses;
