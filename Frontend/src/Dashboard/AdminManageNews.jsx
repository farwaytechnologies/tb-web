import React, { useEffect, useState } from "react";
import "../Styles/DashbordStyle/AdminManageNews.css";

const API_URL = "http://localhost:8000/api/news";

function AdminManageNews() {
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    category: "latest",
    image: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch all news
  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setNewsList(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add or Update news
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
      setFormData({ title: "", content: "", date: "", category: "latest", image: "" });
      setEditId(null);
    } catch (err) {
      console.error(err);
      setError("Error saving news");
    }
  };

  // ✅ Delete news
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchNews();
    } catch (err) {
      console.error("Error deleting news:", err);
      setError("Failed to delete news");
    }
  };

  // ✅ Edit news
  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      content: item.content || "",
      date: item.date ? item.date.split("T")[0] : "",
      category: item.category || "latest",
      image: item.image || "",
    });
  };

  return (
    <div className="admin-manage-news-container">
      <h1 className="admin-page-title">📰 Admin Manage News</h1>

      {/* 📝 Add/Edit News Form */}
      <form className="news-form" onSubmit={handleSubmit}>
        <h2>{editId ? "Edit News" : "Add New News"}</h2>
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
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="latest">Latest</option>
            <option value="press">Press</option>
            <option value="featured">Featured</option>
          </select>
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="News Content..."
            rows="4"
            value={formData.content}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          {editId ? "Update News" : "Add News"}
        </button>
      </form>

      {/* ⚙ News Table */}
      <div className="news-list">
        <h2>All News Items</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
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
                  <td className="category">{item.category}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
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
