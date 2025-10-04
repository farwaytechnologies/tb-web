import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageBlogs.css';

export default function AdminManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(getInitialForm());
  const [editId, setEditId] = useState(null);

  function getInitialForm() {
    return {
      title: '',
      description: '',
      content: '',
      author: 'Admin',
      image: '',
      images: [''],
      category: '',
      tags: [''],
      detailedSections: [
        {
          heading: '',
          text: '',
          list: [''],
          tips: ['']
        }
      ]
    };
  }

  useEffect(() => {
    fetch('VITE_API_URL/api/blogs')
      .then((res) => res.json())
      .then(setBlogs)
      .catch(console.error);
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...form[field]];
    newArray[index] = e.target.value;
    setForm({ ...form, [field]: newArray });
  };

  const handleDetailedSectionChange = (index, field, value, subIndex = null) => {
    const updatedSections = [...form.detailedSections];
    if (subIndex !== null) {
      updatedSections[index][field][subIndex] = value;
    } else {
      updatedSections[index][field] = value;
    }
    setForm({ ...form, detailedSections: updatedSections });
  };

  const addDetailedSection = () => {
    setForm({
      ...form,
      detailedSections: [
        ...form.detailedSections,
        { heading: '', text: '', list: [''], tips: [''] }
      ]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `VITE_API_URL/api/blogs/${editId}`
      : 'VITE_API_URL/api/blogs';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(() => {
        setEditId(null);
        setForm(getInitialForm());
        return fetch('VITE_API_URL/api/blogs');
      })
      .then((res) => res.json())
      .then(setBlogs)
      .catch(console.error);
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title || '',
      description: blog.description || '',
      content: blog.content || '',
      author: blog.author || 'Admin',
      image: blog.image || '',
      images: Array.isArray(blog.images) && blog.images.length > 0 ? blog.images : [''],
      category: blog.category || '',
      tags: Array.isArray(blog.tags) && blog.tags.length > 0 ? blog.tags : [''],
      detailedSections: Array.isArray(blog.detailedSections) && blog.detailedSections.length > 0
        ? blog.detailedSections.map(section => ({
            heading: section.heading || '',
            text: section.text || '',
            list: Array.isArray(section.list) && section.list.length > 0 ? section.list : [''],
            tips: Array.isArray(section.tips) && section.tips.length > 0 ? section.tips : ['']
          }))
        : [{ heading: '', text: '', list: [''], tips: [''] }]
    });

    setEditId(blog._id);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure?')) return;
    fetch(`VITE_API_URL/api/blogs/${id}`, { method: 'DELETE' })
      .then(() => fetch('VITE_API_URL/api/blogs').then((res) => res.json()))
      .then(setBlogs)
      .catch(console.error);
  };

  return (
    <div className="techborg-admin-blog-container">
      <h2 className="techborg-admin-blog-heading">Manage Blogs</h2>

      <form className="techborg-admin-blog-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleInput} required />
        <input name="description" placeholder="Short Description" value={form.description} onChange={handleInput} required />
        <input name="image" placeholder="Cover Image URL" value={form.image} onChange={handleInput} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleInput} />
        <textarea name="content" placeholder="Main Content" value={form.content} onChange={handleInput} required />

        <label>Slideshow Images</label>
        {form.images.map((img, idx) => (
          <input
            key={idx}
            value={img}
            onChange={(e) => handleArrayChange(e, idx, 'images')}
            placeholder={`Image URL ${idx + 1}`}
          />
        ))}

        <label>Tags</label>
        {form.tags.map((tag, idx) => (
          <input
            key={idx}
            value={tag}
            onChange={(e) => handleArrayChange(e, idx, 'tags')}
            placeholder={`Tag ${idx + 1}`}
          />
        ))}

        <label>Detailed Sections</label>
        {form.detailedSections.map((section, i) => (
          <div key={i} className="techborg-admin-blog-section">
            <input
              placeholder="Heading"
              value={section.heading}
              onChange={(e) => handleDetailedSectionChange(i, 'heading', e.target.value)}
            />
            <textarea
              placeholder="Text"
              value={section.text}
              onChange={(e) => handleDetailedSectionChange(i, 'text', e.target.value)}
            />
            <label>List</label>
            {section.list.map((item, j) => (
              <input
                key={j}
                value={item}
                onChange={(e) => handleDetailedSectionChange(i, 'list', e.target.value, j)}
                placeholder={`List item ${j + 1}`}
              />
            ))}
            <label>Tips</label>
            {section.tips.map((tip, k) => (
              <input
                key={k}
                value={tip}
                onChange={(e) => handleDetailedSectionChange(i, 'tips', e.target.value, k)}
                placeholder={`Tip ${k + 1}`}
              />
            ))}
          </div>
        ))}

        <button type="button" onClick={addDetailedSection}>+ Add Section</button>
        <button type="submit">{editId ? 'Update Blog' : 'Create Blog'}</button>
      </form>

      <div className="techborg-admin-blog-list">
        {blogs.map((blog) => (
          <div key={blog._id} className="techborg-admin-blog-card">
            <img src={blog.image} alt={blog.title} />
            <div className="techborg-admin-blog-details">
              <h3>{blog.title}</h3>
              <p>{blog.description}</p>
              <p><small>{new Date(blog.createdAt).toLocaleDateString()}</small></p>
              <div className="techborg-admin-blog-actions">
                <button onClick={() => handleEdit(blog)}>Edit</button>
                <button onClick={() => handleDelete(blog._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
