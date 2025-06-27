import React, { useEffect, useState } from 'react';
import '../Styles/PagesStyle/Certificates.css';

function Certificates() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetch('/Certificates.json')  // ✅ Make sure the file is in /public
      .then((res) => res.json())
      .then((data) => setCertificates(data))
      .catch((err) => console.error('Failed to load certificates:', err));
  }, []);

  return (
    <div className="techborg-certificates-page">
      <h1 className="techborg-certificates-title">Certificates</h1>
      <p className="techborg-certificates-count">{certificates.length} certificates unlocked</p>

      <div className="techborg-certificates-grid">
        {certificates.length > 0 ? (
          certificates.map((cert) => (
            <div className="techborg-certificates-card" key={cert.id}>
              <img src={cert.image} alt={cert.title} className="techborg-certificates-img" />
              <h3>{cert.title}</h3>
              <p className="techborg-certificates-date">{cert.date}</p>
            </div>
          ))
        ) : (
          <p className="techborg-certificates-loading">Loading certificates...</p>
        )}
      </div>
    </div>
  );
}

export default Certificates;
