import React, { useEffect, useState } from "react";
import "../Styles/DashbordStyle/AdminManageNews.css";

const API_URL = "https://tb-back-fyvj.onrender.com/api/news";

function AdminManageNews() {
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    category: "",
    image: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all news
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      setNewsList(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update news
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save news");

      await fetchNews();
      setFormData({ title: "", content: "", date: "", category: "", image: "" });
      setEditId(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error saving news");
    }
  };

  // Delete news
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete news");
      setNewsList(newsList.filter((item) => item._id !== id));
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete news");
    }
  };

  // Edit news
  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      content: item.content || "",
      date: item.date ? item.date.split("T")[0] : "",
      category: item.category || "",
      image: item.image || "",
    });
  };

  return (
    <div className="admin-manage-news-container">
      <h1 className="admin-page-title">📰 Manage News</h1>

      {/* Add/Edit News Form */}
      <form className="news-form" onSubmit={handleSubmit}>
        <h2>{editId ? "Edit News" : "Add New News"}</h2>

        {error && <p className="error-text">{error}</p>}

        <div className="form-grid">
          <input
            type="text"
            name="title"
            placeholder="News Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category (optional)"
            value={formData.category}
            onChange={handleChange}
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL (optional)"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="content"
          placeholder="News Content..."
          rows="4"
          value={formData.content}
          onChange={handleChange}
        ></textarea>

        <button type="submit" className="submit-btn">
          {editId ? "Update News" : "Add News"}
        </button>
      </form>

      {/* News Table */}
      <div className="news-list">
        <h2>All News Items</h2>
        {loading ? (
          <p>Loading...</p>
        ) : newsList.length === 0 ? (
          <p>No news available.</p>
        ) : (
          <table className="news-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button className="edit-btn" onClick={() => handleEdit(item)}>
                        ✏️ Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminManageNews;