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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Country filter state
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryHovered, setCountryHovered] = useState(null);

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

        console.log("Visitors data:", visitorsData.visitors);
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

  // Filter visitors based on search term and selected country
  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = 
      v.ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.region?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry ? v.country?.toLowerCase() === selectedCountry.toLowerCase() : true;
    
    return matchesSearch && matchesCountry;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVisitors = filteredVisitors.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle geography click
  const handleCountryClick = (geo) => {
    const countryName = geo.properties?.name;
    if (countryName) {
      setSelectedCountry(countryName);
      setCurrentPage(1);
    }
  };

  // Clear country filter
  const handleClearCountryFilter = () => {
    setSelectedCountry(null);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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
            <p className="va-section-subtitle">{visitors.length} visitors tracked | Click on countries to filter</p>
          </div>
          
          <div className="va-map-wrapper">
            <div className="va-map-container">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 160,
                  center: [0, 20],
                }}
                width={800}
                height={500}
                style={{ width: "100%", height: "100%" }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryName = geo.properties?.name;
                      const isSelected = countryName?.toLowerCase() === selectedCountry?.toLowerCase();
                      const isHovered = countryName?.toLowerCase() === countryHovered?.toLowerCase();
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleCountryClick(geo)}
                          onMouseEnter={() => setCountryHovered(countryName)}
                          onMouseLeave={() => setCountryHovered(null)}
                          style={{
                            default: {
                              fill: isSelected ? "#818cf8" : "#1e293b",
                              stroke: "#334155",
                              strokeWidth: 0.5,
                              outline: "none",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            },
                            hover: {
                              fill: isSelected ? "#818cf8" : "#334155",
                              stroke: "#6366f1",
                              strokeWidth: 1,
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: {
                              fill: "#818cf8",
                              stroke: "#6366f1",
                              strokeWidth: 1,
                              outline: "none",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>

                {visitors.map((visitor, index) => {
                  const lat = parseFloat(visitor.lat);
                  const lon = parseFloat(visitor.lon);
                  
                  if (!lat || !lon || isNaN(lat) || isNaN(lon) || 
                      lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                    return null;
                  }

                  return (
                    <Marker key={`marker-${visitor.ip}-${index}`} coordinates={[lon, lat]}>
                      <g>
                        <circle
                          r={3}
                          fill="#6366f1"
                          opacity={0.2}
                          className="va-marker-glow"
                        />
                        <circle
                          r={1.5}
                          fill="#6366f1"
                          stroke="#fff"
                          strokeWidth={0.8}
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

            {/* Country Filter Info */}
            {selectedCountry && (
              <div className="va-country-filter-badge">
                <span className="va-filter-text">📍 Filtering: <strong>{selectedCountry}</strong></span>
                <button 
                  className="va-filter-clear-btn"
                  onClick={handleClearCountryFilter}
                >
                  ✕ Clear
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Top Countries */}
        <section className="va-countries-section">
          <div className="va-section-header">
            <h3 className="va-section-title">Top Countries</h3>
            <p className="va-section-subtitle">Most active regions</p>
          </div>
          
          {stats.length > 0 ? (
            <div className="va-countries-container">
              {stats.slice(0, 5).map((item, index) => (
                <div 
                  className="va-country-structure" 
                  key={`country-${item._id}-${index}`}
                  onClick={() => {
                    setSelectedCountry(item._id);
                    setCurrentPage(1);
                  }}
                >
                  <div className="va-structure-header">
                    <div className="va-structure-rank">
                      <span className="va-rank-number">#{index + 1}</span>
                      <span className="va-rank-badge">{item._id || "Unknown"}</span>
                    </div>
                    <div className="va-structure-stats">
                      <div className="va-stat-box">
                        <span className="va-stat-label">Visitors</span>
                        <span className="va-stat-value">{item.count}</span>
                      </div>
                      <div className="va-stat-box">
                        <span className="va-stat-label">% of Total</span>
                        <span className="va-stat-value">{((item.count / stats.reduce((sum, s) => sum + s.count, 0)) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="va-structure-people">
                    <div className="va-people-label">People Structure</div>
                    <div className="va-people-dots">
                      {Array(Math.min(item.count, 20)).fill(0).map((_, i) => (
                        <div 
                          key={i} 
                          className="va-people-dot"
                          title={`Person ${i + 1}`}
                        />
                      ))}
                      {item.count > 20 && (
                        <div className="va-people-more">+{item.count - 20}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="va-structure-bar">
                    <div 
                      className="va-bar-fill" 
                      style={{ width: `${(item.count / stats[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="va-no-data">No country data available</p>
          )}
        </section>

        {/* All Visitors Table with Pagination */}
        <section className="va-table-section">
          <div className="va-section-header">
            <h3 className="va-section-title">All Visitors</h3>
            <p className="va-section-subtitle">
              {selectedCountry ? (
                <>Visitors from <strong>{selectedCountry}</strong>: </>
              ) : (
                <>All Visitors: </>
              )}
              Showing {filteredVisitors.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredVisitors.length)} of {filteredVisitors.length}
            </p>
          </div>

          {/* Table Controls */}
          <div className="va-table-controls">
            <div className="va-search-box">
              <input
                type="text"
                className="va-search-input"
                placeholder="🔍 Search by IP, country, city, or region..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="va-items-per-page">
              <label>Show:</label>
              <select 
                className="va-items-select"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={filteredVisitors.length}>All ({filteredVisitors.length})</option>
              </select>
            </div>
          </div>
          
          <div className="va-table-wrapper">
            <table className="va-table">
              <thead>
                <tr>
                  <th>#</th>
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
                {currentVisitors.length > 0 ? (
                  currentVisitors.map((v, i) => (
                    <tr key={`visitor-${v.ip}-${i}`}>
                      <td className="va-table-center">{startIndex + i + 1}</td>
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
                    <td colSpan="8" className="va-no-data">
                      {selectedCountry 
                        ? `No visitors from ${selectedCountry}` 
                        : searchTerm 
                        ? `No visitors found matching "${searchTerm}"` 
                        : "No visitors recorded yet"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredVisitors.length > 0 && (
            <div className="va-pagination">
              <div className="va-pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="va-pagination-buttons">
                <button
                  className="va-pagination-btn"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                
                <button
                  className="va-pagination-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Prev
                </button>

                <div className="va-page-numbers">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="va-pagination-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        className={`va-pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="va-pagination-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>

                <button
                  className="va-pagination-btn"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default VisitorAnalytics;