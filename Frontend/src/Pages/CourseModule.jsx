import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/PagesStyle/CourseModule.css';

function CourseModules() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/courses/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch course data');
        return res.json();
      })
      .then((data) => {
        setCourse(data);
        setSelectedVideo(data?.modulesVideos?.[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading course:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="course-modules-loading">Loading modules...</div>;
  }

  if (!course || !course.modulesVideos?.length) {
    return <div className="course-modules-empty">No modules available for this course.</div>;
  }

  return (
    <div className="course-modules-wrapper">
      <div className="course-modules-header">
        <h1>{course.title}</h1>
        <p>{course.modulesVideos.length} Modules</p>
      </div>

      <div className="course-modules-main-content">
        {/* Sidebar - Module List */}
        <aside className="course-modules-sidebar">
          {course.modulesVideos.map((module, index) => (
            <div
              key={index}
              className={`course-module-list-item ${selectedVideo?.title === module.title ? 'active' : ''}`}
              onClick={() => setSelectedVideo(module)}
            >
              <h4>{index + 1}. {module.title}</h4>
            </div>
          ))}
        </aside>

        {/* Main Video Area */}
        <section className="course-modules-video-area">
          <div className="course-main-video-wrapper">
            <iframe
              src={selectedVideo?.video}
              title={selectedVideo?.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="course-video-content">
            <h2>{selectedVideo?.title}</h2>
            <p>{selectedVideo?.description}</p>
          </div>
        </section>
      </div>

      <div className="course-modules-back">
        <Link to="/courses">← Back to All Courses</Link>
      </div>
    </div>
  );
}

export default CourseModules;
