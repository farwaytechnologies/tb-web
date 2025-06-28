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
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        const first = data.modules?.find(m => m.videos?.length > 0);
        setSelectedVideo(first?.videos?.[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading course:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="course-modules-loading">Loading modules...</div>;
  if (!course || !course.modules?.length) return <div className="course-modules-empty">No modules available.</div>;

  return (
    <div className="course-modules-wrapper">
      <div className="course-modules-header">
        <h1>{course.title}</h1>
        <p>{course.modules.reduce((sum, m) => sum + m.videos.length, 0)} Videos</p>
      </div>

      <div className="course-modules-main-content">
        <aside className="course-modules-sidebar">
          {course.modules.map((mod, modIdx) => (
            <div key={modIdx} className="module-block">
              <h4 className="module-title">{mod.name}</h4>
              {mod.videos.map((video, vidIdx) => (
                <div
                  key={vidIdx}
                  className={`course-module-list-item ${
                    selectedVideo?.title === video.title ? 'active' : ''
                  }`}
                  onClick={() => setSelectedVideo(video)}
                >
                  {modIdx + 1}.{vidIdx + 1} {video.title}
                </div>
              ))}
            </div>
          ))}
        </aside>

        <section className="course-modules-video-area">
          {selectedVideo ? (
            <>
              <div className="course-main-video-wrapper">
                <iframe
                  src={selectedVideo.video}
                  title={selectedVideo.title}
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              </div>
              <div className="course-video-content">
                <h2>{selectedVideo.title}</h2>
                <p>{selectedVideo.description}</p>
              </div>
            </>
          ) : (
            <p>No video selected.</p>
          )}
        </section>
      </div>

      <div className="course-modules-back">
        <Link to="/courses">← Back to All Courses</Link>
      </div>
    </div>
  );
}

export default CourseModules;
