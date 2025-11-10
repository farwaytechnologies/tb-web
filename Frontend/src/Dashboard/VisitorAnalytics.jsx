import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import "../Styles/DashbordStyle/AdminVisitorAnalytics.css";

// API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Use TopoJSON format for better compatibility
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const VisitorAnalytics = () => {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch visitor data
  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [visitorsRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/visitors`),
          fetch(`${API_URL}/api/visitors/stats`),
        ]);

        if (!visitorsRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const visitorsData = await visitorsRes.json();
        const statsData = await statsRes.json();

        console.log("Visitors data:", visitorsData.visitors); // Debug log
        setVisitors(visitorsData.visitors || []);
        setStats(statsData.stats || []);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, []);

  if (loading) {
    return (
      <div className="va-loading-container">
        <div className="va-spinner" />
        <p className="va-loading-text">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="va-loading-container">
        <div className="va-error-icon">⚠️</div>
        <p className="va-error-text">Error loading analytics: {error}</p>
        <button onClick={() => window.location.reload()} className="va-retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="va-container">
      {/* Animated Background */}
      <div className="va-bg-animation"></div>

      <div className="va-content">
        <header className="va-header">
          <div className="va-header-badge">📊 Analytics</div>
          <h1 className="va-header-title">Visitor Analytics Dashboard</h1>
          <p className="va-header-subtitle">Real-time insights into your global reach</p>
        </header>

        {/* Summary Cards */}
        <section className="va-cards-grid">
          <div className="va-card va-card-primary">
            <div className="va-card-icon">👥</div>
            <div className="va-card-content">
              <span className="va-card-label">Total Visitors</span>
              <h2 className="va-card-value">{visitors.length}</h2>
            </div>
            <div className="va-card-glow"></div>
          </div>
          
          <div className="va-card va-card-secondary">
            <div className="va-card-icon">🌍</div>
            <div className="va-card-content">
              <span className="va-card-label">Unique Countries</span>
              <h2 className="va-card-value">{stats.length}</h2>
            </div>
            <div className="va-card-glow"></div>
          </div>
          
          <div className="va-card va-card-tertiary">
            <div className="va-card-icon">📍</div>
            <div className="va-card-content">
              <span className="va-card-label">Latest Visitor</span>
              <h2 className="va-card-value va-card-value-small">
                {visitors.length > 0 && visitors[0]?.country ? visitors[0].country : "—"}
              </h2>
            </div>
            <div className="va-card-glow"></div>
          </div>
        </section>

        {/* World Map */}
        <section className="va-map-section">
          <div className="va-section-header">
            <h3 className="va-section-title">Global Visitor Map</h3>
            <p className="va-section-subtitle">{visitors.length} visitors tracked</p>
          </div>
          
          <div className="va-map-container">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 140,
                center: [0, 30],
              }}
              width={800}
              height={400}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#334155" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Visitor Markers with better visibility */}
              {visitors.map((visitor, index) => {
                const lat = parseFloat(visitor.lat);
                const lon = parseFloat(visitor.lon);
                
                console.log(`Visitor ${index}:`, { lat, lon, city: visitor.city, country: visitor.country }); // Debug
                
                if (!lat || !lon || isNaN(lat) || isNaN(lon) || 
                    lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                  console.log(`Invalid coordinates for visitor ${index}`); // Debug
                  return null;
                }

                return (
                  <Marker key={`marker-${visitor.ip}-${index}`} coordinates={[lon, lat]}>
                    <g>
                      {/* Outer glow */}
                      <circle
                        r={8}
                        fill="#6366f1"
                        opacity={0.3}
                        className="va-marker-glow"
                      />
                      {/* Main marker */}
                      <circle
                        r={4}
                        fill="#6366f1"
                        stroke="#fff"
                        strokeWidth={2}
                        className="va-marker-dot"
                        style={{ cursor: "pointer" }}
                      />
                    </g>
                    <title>
                      {`${visitor.city || "Unknown City"}, ${visitor.country || "Unknown Country"}\nIP: ${visitor.ip || "N/A"}`}
                    </title>
                  </Marker>
                );
              })}
            </ComposableMap>
          </div>
        </section>

        {/* Top Countries */}
        <section className="va-countries-section">
          <div className="va-section-header">
            <h3 className="va-section-title">Top Countries</h3>
            <p className="va-section-subtitle">Most active regions</p>
          </div>
          
          <div className="va-countries-grid">
            {stats.length > 0 ? (
              stats.slice(0, 5).map((item, index) => (
                <div className="va-country-card" key={`country-${item._id}-${index}`}>
                  <div className="va-country-rank">#{index + 1}</div>
                  <div className="va-country-info">
                    <span className="va-country-name">{item._id || "Unknown"}</span>
                    <span className="va-country-count">
                      {item.count} {item.count === 1 ? 'visitor' : 'visitors'}
                    </span>
                  </div>
                  <div className="va-country-bar">
                    <div 
                      className="va-country-bar-fill" 
                      style={{ width: `${(item.count / stats[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="va-no-data">No country data available</p>
            )}
          </div>
        </section>

        {/* Recent Visitors Table */}
        <section className="va-table-section">
          <div className="va-section-header">
            <h3 className="va-section-title">Recent Visitors</h3>
            <p className="va-section-subtitle">Last 10 visitors</p>
          </div>
          
          <div className="va-table-wrapper">
            <table className="va-table">
              <thead>
                <tr>
                  <th>IP Address</th>
                  <th>Country</th>
                  <th>Region</th>
                  <th>City</th>
                  <th>Visit Date</th>
                  <th>Pages</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {visitors.length > 0 ? (
                  visitors.slice(0, 10).map((v, i) => (
                    <tr key={`visitor-${v.ip}-${i}`}>
                      <td className="va-table-ip">{v.ip || "—"}</td>
                      <td>{v.country || "—"}</td>
                      <td>{v.region || "—"}</td>
                      <td>{v.city || "—"}</td>
                      <td className="va-table-date">
                        {v.createdAt ? new Date(v.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className="va-table-center">{v.pagesVisited?.length || 0}</td>
                      <td className="va-table-center">{v.duration || 0}s</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="va-no-data">
                      No visitors recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VisitorAnalytics;