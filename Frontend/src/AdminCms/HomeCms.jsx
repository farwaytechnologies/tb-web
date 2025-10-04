import React, { useEffect, useState } from 'react';
import '../Styles/CmsStyle/HomeCms.css';

function HomeCms() {
  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    features: [{ title: '', description: '' }],
    ctaText: '',
    ctaButtonText: '',
    ctaLink: ''
  });

  const [message, setMessage] = useState('');

  // Fetch existing home content on mount
  useEffect(() => {
    fetch('VITE_API_URL/api/home')
      .then(res => res.json())
      .then(data => {
        if (data) setForm(data);
      })
      .catch(() => {
        setMessage('Failed to load home content');
      });
  }, []);

  // Generic input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle feature field change
  const handleFeatureChange = (index, e) => {
    const newFeatures = [...form.features];
    newFeatures[index][e.target.name] = e.target.value;
    setForm({ ...form, features: newFeatures });
  };

  // Add new feature
  const addFeature = () => {
    setForm({ ...form, features: [...form.features, { title: '', description: '' }] });
  };

  // Remove a feature
  const removeFeature = (index) => {
    const updated = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: updated });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('VITE_API_URL/api/home/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to update');
        }
        setMessage(data.message || 'Update successful');
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.message || 'Failed to update');
      });
  };

  return (
    <div className="homecms-container">
      <h2>Manage Home Page Content</h2>

      <form onSubmit={handleSubmit}>
        {/* Hero Section */}
        <div className="cms-section">
          <label>Hero Title</label>
          <input
            name="heroTitle"
            value={form.heroTitle}
            onChange={handleChange}
            placeholder="Enter hero title"
          />

          <label>Hero Subtitle</label>
          <textarea
            name="heroSubtitle"
            value={form.heroSubtitle}
            onChange={handleChange}
            placeholder="Enter hero subtitle"
          />
        </div>

        {/* Features Section */}
        <div className="cms-section">
          <label>Features</label>
          {form.features.map((feature, index) => (
            <div className="feature-block" key={index}>
              <input
                name="title"
                placeholder="Feature Title"
                value={feature.title}
                onChange={(e) => handleFeatureChange(index, e)}
              />
              <textarea
                name="description"
                placeholder="Feature Description"
                value={feature.description}
                onChange={(e) => handleFeatureChange(index, e)}
              />
              {form.features.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeFeature(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addFeature} className="add-btn">+ Add Feature</button>
        </div>

        {/* CTA Section */}
        <div className="cms-section">
          <label>CTA Text</label>
          <input
            name="ctaText"
            value={form.ctaText}
            onChange={handleChange}
            placeholder="Call to action text"
          />

          <label>CTA Button Text</label>
          <input
            name="ctaButtonText"
            value={form.ctaButtonText}
            onChange={handleChange}
            placeholder="CTA button label"
          />

          <label>CTA Link</label>
          <input
            name="ctaLink"
            value={form.ctaLink}
            onChange={handleChange}
            placeholder="/login, /courses, etc."
          />
        </div>

        <button type="submit" className="submit-btn">Save Changes</button>
      </form>

      {message && <p className="cms-message">{message}</p>}
    </div>
  );
}

export default HomeCms;
