import React from "react";
import "../Styles/PagesStyle/News.css";

function News() {
  const latestStories = [
    { title: "AI Revolutionizes Online Learning", date: "October 14, 2025" },
    { title: "Tech Innovation Drives Education Growth", date: "October 10, 2025" },
    { title: "Students Excel with Personalized Courses", date: "October 7, 2025" },
    { title: "E-Learning Expands to Rural Areas", date: "October 5, 2025" },
  ];

  const pressReleases = [
    { title: "New Course Launch: MERN Stack Mastery", date: "October 12, 2025" },
    { title: "Company Achieves 1M Student Milestone", date: "October 8, 2025" },
    { title: "Partnership with Global EdTech Leaders", date: "October 2, 2025" },
  ];

  return (
    <div className="news-container">
      <header className="news-header">
        <h1 className="news-title">NEWSROOM</h1>
  
      </header>

      <div className="news-content">
        {/* Latest Stories */}
        <div className="news-column latest-stories">
          <h2>Latest Stories</h2>
          <ul>
            {latestStories.map((story, index) => (
              <li key={index}>
                <h3>{story.title}</h3>
                <p>{story.date}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured Story */}
        <div className="news-column featured-story">
          <h2>Featured Story</h2>
          <img
            src="https://images.unsplash.com/photo-1581091870622-1e7e5f59b74f"
            alt="Featured Story"
            className="featured-image"
          />
          <h3>Exclusive Study Reveals Future of Online Learning</h3>
          <p>
            A new report explores how AI and data-driven personalization are reshaping
            online education platforms, enhancing student engagement, and optimizing outcomes.
          </p>
          <button className="read-more">Read More</button>
        </div>

        {/* Press Releases */}
        <div className="news-column press-releases">
          <h2>Press Releases</h2>
          <ul>
            {pressReleases.map((press, index) => (
              <li key={index}>
                <h3>{press.title}</h3>
                <p>{press.date}</p>
              </li>
            ))}
          </ul>

          <div className="media-kit">
            <h3>Media Kit</h3>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;
