import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../Styles/DashbordStyle/AdminVisitorAnalytics.css"; // ✅ we'll style next

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  if (loading) return <div className="visitor-loading">Loading visitor data...</div>;

  const data = {
    labels: stats.map((item) => item._id),
    datasets: [
      {
        label: "Visitors by Country",
        data: stats.map((item) => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="visitor-analytics-container">
      <h2 className="visitor-page-title">🌍 Visitor Analytics Dashboard</h2>

      <div className="visitor-summary">
        <div className="visitor-card">
          <h3>Total Visitors</h3>
          <p>{visitors.length}</p>
        </div>
      </div>

      <div className="visitor-chart-section">
        <h3>Visitors by Country</h3>
        <div className="visitor-chart">
          <Bar data={data} />
        </div>
      </div>

      <div className="visitor-table-section">
        <h3>Recent Visitors</h3>
        <table className="visitor-table">
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
      </div>
    </div>
  );
};

export default VisitorAnalytics;
