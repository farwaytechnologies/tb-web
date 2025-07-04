import React, { useEffect, useState } from 'react';
import '../Styles/DashbordStyle/AdminManageInnovation.css';

export default function AdminManageInnovation() {
  const [innovations, setInnovations] = useState([]);
  const [form, setForm] = useState(getEmptyForm());
  const [editId, setEditId] = useState(null);

  function getEmptyForm() {
    return {
      title: '',
      subtitle: '',
      description: '',
      author: '',
      image: '',
      images: [],
      contentSections: [],
    };
  }

  // Fetch all innovations
  const fetchInnovations = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/innovations');
      const data = await res.json();
      setInnovations(data);
    } catch (err) {
      console.error('Failed to fetch innovations:', err);
    }
  };

  useEffect(() => {
    fetchInnovations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId
        ? `http://localhost:8000/api/innovations/${editId}`
        : 'http://localhost:8000/api/innovations';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        fetchInnovations();
        setForm(getEmptyForm());
        setEditId(null);
      } else {
        console.error('Failed to submit innovation');
      }
    } catch (err) {
      console.error('Error submitting innovation:', err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this innovation?')) {
      try {
        const res = await fetch(`http://localhost:8000/api/innovations/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) fetchInnovations();
      } catch (err) {
        console.error('Failed to delete innovation:', err);
      }
    }
  };

  return (
    <div className="techborg-admin-innovation-page">
      <h2>Manage Innovations</h2>

      <form onSubmit={handleSubmit} className="techborg-admin-innovation-form">
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input type="text" name="subtitle" placeholder="Subtitle" value={form.subtitle} onChange={handleChange} />
        <input type="text" name="author" placeholder="Author" value={form.author} onChange={handleChange} />
        <input type="text" name="image" placeholder="Main Image URL" value={form.image} onChange={handleChange} />
        <textarea name="description" placeholder="Short Description" rows={3} value={form.description} onChange={handleChange} />
        <button type="submit">{editId ? 'Update' : 'Add'} Innovation</button>
      </form>

      <div className="techborg-admin-innovation-list">
        {innovations.map((item) => (
          <div className="techborg-admin-innovation-card" key={item._id}>
            <img src={item.image} alt={item.title} />
            <div className="techborg-admin-innovation-card-content">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <small>By {item.author}</small>
              <div className="techborg-admin-innovation-actions">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)} className="delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
