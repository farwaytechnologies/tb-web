import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../Styles/DashbordStyle/AdminVisitorAnalytics.css";

<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
=======
const API_URL = import.meta.env.VITE_API_URL || "https://tb-back-fyvj.onrender.com";
>>>>>>> 30e6a2c960134f71aa86cc50db655957d6c542cc

const VisitorAnalytics = () => {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const [visitorsRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/visitors`),
          fetch(`${API_URL}/api/visitors/stats`),
        ]);

        const visitorsData = await visitorsRes.json();
        const statsData = await statsRes.json();

        setVisitors(visitorsData.visitors || []);
        setStats(statsData.stats || []);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, []);

  if (loading) {
    return (
      <div className="visitor-loading">
        <div className="spinner" />
        <p>Loading analytics...</p>
      </div>
    );
  }

  const data = {
    labels: stats.map((item) => item._id),
    datasets: [
      {
        label: "Visitors by Country",
        data: stats.map((item) => item.count),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Visitor Analytics</h1>
        <p>Real-time insights from global visitors</p>
      </header>

      <section className="analytics-cards">
        <div className="analytics-card">
          <span className="card-label">Total Visitors</span>
          <h2>{visitors.length}</h2>
        </div>
        <div className="analytics-card">
          <span className="card-label">Countries</span>
          <h2>{stats.length}</h2>
        </div>
        <div className="analytics-card">
          <span className="card-label">Latest Visitor</span>
          <h2>{visitors[0]?.country || "—"}</h2>
        </div>
      </section>

      <section className="chart-section">
        <h3>Visitors by Country</h3>
        <div className="chart-wrapper">
          <Bar data={data} options={{ plugins: { legend: { display: false } } }} />
        </div>
      </section>

      <section className="table-section">
        <h3>Recent Visitors</h3>
        <table>
          <thead>
            <tr>
              <th>IP</th>
              <th>Country</th>
              <th>Region</th>
              <th>City</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {visitors.slice(0, 10).map((v, i) => (
              <tr key={i}>
                <td>{v.ip}</td>
                <td>{v.country}</td>
                <td>{v.region}</td>
                <td>{v.city}</td>
                <td>{new Date(v.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default VisitorAnalytics;
