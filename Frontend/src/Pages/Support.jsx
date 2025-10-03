import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Support.css';

function Support() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://tb-back-fyvj.onrender.com/api/support")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="techborg-support-page">
      <div className="support-hero">
        <h1>How can we help you?</h1>
        <p>Welcome to TechBorg Support. Choose a category or contact us directly.</p>
      </div>

      <div className="support-categories">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div className="support-card" key={cat._id}>
              <h3>{cat.title}</h3>
              <p>{cat.description}</p>
            </div>
          ))
        ) : (
          <p>Loading categories...</p>
        )}
      </div>
    </div>
  );
}

export default Support;
