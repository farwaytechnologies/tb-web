import React, { useEffect, useState } from 'react';
import '../Styles/CmsStyle/AboutCms.css';

function AboutCms() {
  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);

  // Fetch current About content
  useEffect(() => {
    fetch('VITE_API_URL/api/about')
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title || '',
          description: data.description || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching About content:', err);
        setLoading(false);
      });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form data
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('VITE_API_URL/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        alert('✅ About content updated successfully!');
      })
      .catch((err) => {
        console.error('Error updating About content:', err);
        alert('❌ Failed to update About content.');
      });
  };

  if (loading) return <div className="aboutcms-loading">Loading...</div>;

  return (
    <div className="aboutcms-page">
      <div className="aboutcms-container">
        <h2 className="aboutcms-heading">Edit About Page Content</h2>

        <form className="aboutcms-form" onSubmit={handleSubmit}>
          <label className="aboutcms-label">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="aboutcms-input"
            placeholder="Enter title"
            required
          />

          <label className="aboutcms-label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="aboutcms-textarea"
            placeholder="Enter description"
            required
          ></textarea>

          <button type="submit" className="aboutcms-submit">Update Content</button>
        </form>
      </div>
    </div>
  );
}

export default AboutCms;
