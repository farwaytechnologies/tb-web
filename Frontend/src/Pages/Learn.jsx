import React, { useEffect, useState } from "react";
import "../Styles/PagesStyle/Learn.css";

const Learn = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearnTopics = async () => {
      try {
        const res = await fetch("https://tb-back-fyvj.onrender.com/api/learn");
        if (!res.ok) throw new Error("Failed to fetch learn topics");
        const data = await res.json();
        setTopics(data);
      } catch (error) {
        console.error("❌ Error fetching learn topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnTopics();
  }, []);

  if (loading) {
    return <div className="loading-text">Loading topics...</div>;
  }

  return (
    <div className="learn-container">
      <h1 className="learn-heading">Learn Programming Languages</h1>
      <p className="learn-subtext">
        Explore tutorials and resources to master your favorite languages.
      </p>

      <div className="courses-grid">
        {topics.length > 0 ? (
          topics.map((topic, index) => (
            <div key={index} className="course-card">
              <img
                src={
                  topic.image
                    ? `https://tb-back-fyvj.onrender.com/uploads/learn/${topic.image}`
                    : "/images/default-course.png"
                }
                alt={topic.title}
                className="course-image"
              />
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <a
                href={topic.link}
                target="_blank"
                rel="noopener noreferrer"
                className="learn-btn"
              >
                Start Learning
              </a>
            </div>
          ))
        ) : (
          <p className="no-courses-text">No topics available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Learn;
