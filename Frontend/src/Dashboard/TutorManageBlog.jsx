import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/TutorManageBlog.css';

export default function TutorManageBlog() {
  const user = JSON.parse(localStorage.getItem('user'));
  const currentTutor = user?.name || 'Tutor';
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(getInitialForm());
  const [editId, setEditId] = useState(null);

  function getInitialForm() {
    return {
      title: '',
      description: '',
      content: '',
      author: currentTutor,
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
    fetch('http://localhost:8000/api/blogs')
      .then((res) => res.json())
      .then((all) => {
        const tutorBlogs = all.filter((b) => b.author === currentTutor);
        setBlogs(tutorBlogs);
      })
      .catch(console.error);
  }, [currentTutor]);

  const handleInput = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === 'title' || e.target.name === 'description') {
      updatedForm.author = currentTutor; // ensure author is always set
    }
    setForm(updatedForm);
  };

  const handleArrayChange = (e, index, field) => {
    const updated = [...form[field]];
    updated[index] = e.target.value;
    setForm({ ...form, [field]: updated });
  };

  const handleDetailedSectionChange = (index, field, value, subIndex = null) => {
    const updated = [...form.detailedSections];
    if (subIndex !== null) {
      updated[index][field][subIndex] = value;
    } else {
      updated[index][field] = value;
    }
    setForm({ ...form, detailedSections: updated });
  };

  const addDetailedSection = () => {
    setForm({
      ...form,
      detailedSections: [...form.detailedSections, { heading: '', text: '', list: [''], tips: [''] }]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `http://localhost:8000/api/blogs/${editId}`
      : 'http://localhost:8000/api/blogs';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, author: currentTutor }) // enforce author
    })
      .then(() => {
        setEditId(null);
        setForm(getInitialForm());
        return fetch('http://localhost:8000/api/blogs');
      })
      .then((res) => res.json())
      .then((all) => {
        const tutorBlogs = all.filter((b) => b.author === currentTutor);
        setBlogs(tutorBlogs);
      })
      .catch(console.error);
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      author: blog.author,
      image: blog.image,
      images: blog.images.length ? blog.images : [''],
      category: blog.category,
      tags: blog.tags.length ? blog.tags : [''],
      detailedSections: blog.detailedSections.length
        ? blog.detailedSections.map(sec => ({
            heading: sec.heading || '',
            text: sec.text || '',
            list: sec.list.length ? sec.list : [''],
            tips: sec.tips.length ? sec.tips : ['']
          }))
        : [{ heading: '', text: '', list: [''], tips: [''] }]
    });
    setEditId(blog._id);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure?')) return;
    fetch(`http://localhost:8000/api/blogs/${id}`, { method: 'DELETE' })
      .then(() => fetch('http://localhost:8000/api/blogs'))
      .then((res) => res.json())
      .then((all) => {
        const tutorBlogs = all.filter(b => b.author === currentTutor);
        setBlogs(tutorBlogs);
      })
      .catch(console.error);
  };

  return (
    <div className="techborg-tutor-blog-container">
      <h2 className="techborg-tutor-blog-heading">Manage Your Blogs</h2>

      <form className="techborg-tutor-blog-form" onSubmit={handleSubmit}>
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
          <div key={i} className="techborg-tutor-blog-section">
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

      <div className="techborg-tutor-blog-list">
        {blogs.map((blog) => (
          <div key={blog._id} className="techborg-tutor-blog-card">
            <img src={blog.image} alt={blog.title} />
            <div className="techborg-tutor-blog-details">
              <h3>{blog.title}</h3>
              <p>{blog.description}</p>
              <p><small>{new Date(blog.createdAt).toLocaleDateString()}</small></p>
              <div className="techborg-tutor-blog-actions">
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
