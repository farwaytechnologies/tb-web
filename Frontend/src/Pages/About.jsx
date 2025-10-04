import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/About.css';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('VITE_API_URL/api/about')
      .then(res => res.json())
      .then(data => {
        setAboutData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching About content:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="techborg-about-loading">Loading...</div>;
  if (!aboutData) return <div className="techborg-about-error">Failed to load About content</div>;

  return (
    <div className="techborg-about-page">
      <h1 className="techborg-about-title">{aboutData.title}</h1>
      <p className="techborg-about-description">{aboutData.description}</p>
    </div>
  );
}

export default About;
