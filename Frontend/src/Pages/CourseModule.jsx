import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/PagesStyle/CourseModule.css';

function CourseModules() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetch('/Courses.json')
      .then((res) => res.json())
      .then((data) => {
        const selected = data.find((c) => String(c.id) === id);
        setCourse(selected);
        setSelectedVideo(selected?.modulesVideos?.[0]); // Load first module by default
      });
  }, [id]);

  if (!course || !course.modulesVideos) {
    return <div className="modules-loading">Loading modules...</div>;
  }

  return (
    <div className="modules-wrapper">
      <div className="modules-header">
        <h1>{course.title}</h1>
        <p>{course.modulesVideos.length} Modules</p>
      </div>

      <div className="modules-main-content">
        {/* Left - Module List */}
        <div className="modules-sidebar">
          {course.modulesVideos.map((module, index) => (
            <div
              key={index}
              className={`module-list-item ${selectedVideo?.title === module.title ? 'active' : ''}`}
              onClick={() => setSelectedVideo(module)}
            >
              <h4>{index + 1}. {module.title}</h4>
            </div>
          ))}
        </div>

        {/* Right - Video Player */}
        <div className="modules-video-area">
          <div className="main-video-wrapper">
            <iframe
              src={selectedVideo?.video}
              title={selectedVideo?.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <h2>{selectedVideo?.title}</h2>
          <p>{selectedVideo?.description}</p>
        </div>
      </div>

      <div className="modules-back">
        <Link to="/dashboard">← Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default CourseModules;
