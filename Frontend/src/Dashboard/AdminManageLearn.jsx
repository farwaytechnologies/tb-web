import React, { useState, useEffect } from "react";
import "../Styles/DashbordStyle/AdminManageLearn.css";

export default function AdminManageLearn() {
  const [learns, setLearns] = useState([]);
  const [form, setForm] = useState({
    language: "",
    shortDescription: "",
    image: "",
    modules: [{ title: "", description: "", content: "", codeExample: "", image: "" }],
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all learn data
  useEffect(() => {
    fetchLearnData();
  }, []);

  const fetchLearnData = async () => {
    try {
      const res = await fetch("https://tb-back-fyvj.onrender.com/api/learn");
      const data = await res.json();
      setLearns(data);
    } catch (err) {
      console.error("Error fetching learn data:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleModuleChange = (index, e) => {
    const updatedModules = [...form.modules];
    updatedModules[index][e.target.name] = e.target.value;
    setForm({ ...form, modules: updatedModules });
  };

  const addModule = () => {
    setForm({
      ...form,
      modules: [...form.modules, { title: "", description: "", content: "", codeExample: "", image: "" }],
    });
  };

  const removeModule = (index) => {
    const updatedModules = form.modules.filter((_, i) => i !== index);
    setForm({ ...form, modules: updatedModules });
  };

  const resetForm = () => {
    setForm({
      language: "",
      shortDescription: "",
      image: "",
      modules: [{ title: "", description: "", content: "", codeExample: "", image: "" }],
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `https://tb-back-fyvj.onrender.com/api/learn/${editingId}`
        : "https://tb-back-fyvj.onrender.com/api/learn";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error saving language");

      await fetchLearnData();
      resetForm();
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await fetch(`https://tb-back-fyvj.onrender.com/api/learn/${id}`, { method: "DELETE" });
      fetchLearnData();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="admin-learn-container">
      <h1 className="admin-learn-title">Manage Learn Modules</h1>

      <form onSubmit={handleSubmit} className="admin-learn-form">
        <div className="form-group">
          <label>Language Name</label>
          <input
            type="text"
            name="language"
            value={form.language}
            onChange={handleChange}
            placeholder="e.g. Python, JavaScript"
            required
          />
        </div>

        <div className="form-group">
          <label>Short Description</label>
          <textarea
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="Brief description of this course"
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="modules-section">
          <h3>Modules</h3>
          {form.modules.map((mod, index) => (
            <div key={index} className="module-item">
              <div className="module-header">
                <h4>Module {index + 1}</h4>
                {form.modules.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeModule(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
              <input
                type="text"
                name="title"
                value={mod.title}
                onChange={(e) => handleModuleChange(index, e)}
                placeholder="Module Title"
                required
              />
              <textarea
                name="description"
                value={mod.description}
                onChange={(e) => handleModuleChange(index, e)}
                placeholder="Short Description"
              />
              <textarea
                name="content"
                value={mod.content}
                onChange={(e) => handleModuleChange(index, e)}
                placeholder="Detailed Content"
              />
              <input
                type="text"
                name="codeExample"
                value={mod.codeExample}
                onChange={(e) => handleModuleChange(index, e)}
                placeholder="Code Example"
              />
              <input
                type="text"
                name="image"
                value={mod.image}
                onChange={(e) => handleModuleChange(index, e)}
                placeholder="Module Image URL"
              />
            </div>
          ))}
          <button type="button" className="add-module-btn" onClick={addModule}>
            + Add Module
          </button>
        </div>

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update Course" : "Add Course"}
        </button>
        {editingId && (
          <button type="button" className="cancel-btn" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <hr />

      <div className="admin-learn-list">
        <h2>All Courses</h2>
        <div className="learn-list-grid">
          {learns.map((item) => (
            <div key={item._id} className="learn-card-admin">
              <img src={item.image} alt={item.language} className="learn-img-admin" />
              <h3>{item.language}</h3>
              <p>{item.shortDescription}</p>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEdit(item)}>
                  ✎ Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
          {learns.length === 0 && <p>No courses found.</p>}
        </div>
      </div>
    </div>
  );
}
