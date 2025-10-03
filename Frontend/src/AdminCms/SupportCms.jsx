import React, { useEffect, useState } from "react";
import "../Styles/CmsStyle/AdminManageSupport.css";

function AdminManageSupport() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("https://tb-back-fyvj.onrender.com/api/support");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = "https://tb-back-fyvj.onrender.com/api/support";
      let method = "POST";

      if (editingId) {
        url = `https://tb-back-fyvj.onrender.com/api/support/${editingId}`;
        method = "PUT";
      }

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm({ title: "", description: "" });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit category
  const handleEdit = (cat) => {
    setForm({ title: cat.title, description: cat.description });
    setEditingId(cat._id);
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
      await fetch(`https://tb-back-fyvj.onrender.com/api/support/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="manage-support-page">
      <h1>Manage Support Categories</h1>

      {/* Form */}
      <form className="support-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Category Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Category Description"
          value={form.description}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">{editingId ? "Update" : "Add"} Category</button>
      </form>

      {/* List */}
      <div className="support-list">
        {categories.map((cat) => (
          <div className="support-item" key={cat._id}>
            <div>
              <h3>{cat.title}</h3>
              <p>{cat.description}</p>
            </div>
            <div className="support-actions">
              <button onClick={() => handleEdit(cat)}>Edit</button>
              <button onClick={() => handleDelete(cat._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminManageSupport;
