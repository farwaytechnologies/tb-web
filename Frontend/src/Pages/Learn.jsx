import React from "react";
import "../Styles/PagesStyle/Learn.css"; // or Tailwind directly

const Learn = () => {
  const courses = [
    {
      title: "HTML",
      description: "Learn the structure of web pages using HTML.",
      image: "/images/html.png",
      link: "/learn/html",
    },
    {
      title: "CSS",
      description: "Style your websites beautifully with CSS.",
      image: "/images/css.png",
      link: "/learn/css",
    },
    {
      title: "JavaScript",
      description: "Add interactivity and dynamic features to your site.",
      image: "/images/javascript.png",
      link: "/learn/javascript",
    },
    {
      title: "React",
      description: "Build modern, scalable frontends with React.js.",
      image: "/images/react.png",
      link: "/learn/react",
    },
    {
      title: "Python",
      description: "Master backend logic and scripting with Python.",
      image: "/images/python.png",
      link: "/learn/python",
    },
  ];

  return (
    <div className="learn-container">
      <h1 className="learn-heading">Learn Programming Languages</h1>
      <p className="learn-subtext">Start your coding journey with hands-on tutorials.</p>
      <div className="courses-grid">
        {courses.map((course, index) => (
          <div key={index} className="course-card">
            <img src={course.image} alt={course.title} className="course-image" />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <a href={course.link} className="learn-btn">Start Learning</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
