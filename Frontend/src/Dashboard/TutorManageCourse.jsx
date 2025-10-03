import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/TutorManageCourse.css';

function TutorManageCourse() {
  const currentTutor = localStorage.getItem('userName') || 'Tutor';
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
    instructor: currentTutor,
    modules: [{ name: '', videos: [{ title: '', video: '', description: '' }] }]
  });

  useEffect(() => {
    fetch('https://tb-back-fyvj.onrender.com/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      detailedDescription: '',
      price: '',
      image: '',
      video: '',
      duration: '',
      level: '',
      instructor: currentTutor,
      modules: [{ name: '', videos: [{ title: '', video: '', description: '' }] }]
    });
  };

  const handleAdd = async () => {
    const priceNum = Number(formData.price);
    if (formData.price === '' || isNaN(priceNum) || priceNum <= 0) {
      alert('Enter a valid price greater than 0');
      return;
    }

    try {
      const res = await fetch('https://tb-back-fyvj.onrender.com/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: priceNum })
      });

      if (!res.ok) throw new Error('Failed to add course');
      const newCourse = await res.json();
      setCourses([...courses, newCourse]);
      resetForm();
    } catch (err) {
      alert('Error: ' + err.message);
      console.error(err);
    }
  };

  const handleModuleChange = (index, value) => {
    const updated = [...formData.modules];
    updated[index].name = value;
    setFormData({ ...formData, modules: updated });
  };

  const handleVideoChange = (modIdx, vidIdx, field, value) => {
    const updated = [...formData.modules];
    updated[modIdx].videos[vidIdx][field] = value;
    setFormData({ ...formData, modules: updated });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { name: '', videos: [{ title: '', video: '', description: '' }] }]
    });
  };

  const addVideo = (modIdx) => {
    const updated = [...formData.modules];
    updated[modIdx].videos.push({ title: '', video: '', description: '' });
    setFormData({ ...formData, modules: updated });
  };

  return (
    <div className="techborg-tutor-course-page">
      <h2>Upload New Course</h2>

      <div className="tutor-course-form">
        <input
          type="text"
          placeholder="Course Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <input
          type="text"
          placeholder="Short Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <textarea
          placeholder="Detailed Description"
          value={formData.detailedDescription}
          onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
        />

        <input
          type="text"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*\.?\d*$/.test(val) || val === '') {
              setFormData({ ...formData, price: val });
            }
          }}
        />

        <input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />

        <input
          type="text"
          placeholder="Course Video URL"
          value={formData.video}
          onChange={(e) => setFormData({ ...formData, video: e.target.value })}
        />

        <input
          type="text"
          placeholder="Duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
        />

        <input
          type="text"
          placeholder="Level"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
        />

        <div className="tutor-modules-section">
          <h4>Modules & Videos</h4>
          {formData.modules.map((module, modIdx) => (
            <div key={`mod-${modIdx}`} className="tutor-module-block">
              <input
                type="text"
                placeholder={`Module ${modIdx + 1} Name`}
                value={module.name}
                onChange={(e) => handleModuleChange(modIdx, e.target.value)}
              />

              {module.videos.map((vid, vidx) => (
                <div key={`vid-${modIdx}-${vidx}`} className="tutor-video-group">
                  <input
                    type="text"
                    placeholder="Video Title"
                    value={vid.title}
                    onChange={(e) => handleVideoChange(modIdx, vidx, 'title', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Video URL"
                    value={vid.video}
                    onChange={(e) => handleVideoChange(modIdx, vidx, 'video', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Video Description"
                    value={vid.description}
                    onChange={(e) => handleVideoChange(modIdx, vidx, 'description', e.target.value)}
                  />
                </div>
              ))}
              <button className="add-btn" onClick={() => addVideo(modIdx)}>+ Add Video</button>
            </div>
          ))}
          <button className="add-btn" onClick={addModule}>+ Add Module</button>
        </div>

        <button className="submit-btn" onClick={handleAdd}>Submit Course</button>
      </div>
    </div>
  );
}

export default TutorManageCourse;
