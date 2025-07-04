import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/PagesStyle/InnovationDetail.css';

export default function InnovationDetail() {
  const { id } = useParams();
  const [innovation, setInnovation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/innovations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setInnovation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching innovation detail:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="techborg-innovation-detail-loader">Loading...</div>;
  if (!innovation) return <div className="techborg-innovation-detail-error">Innovation not found.</div>;

  return (
    <div className="techborg-innovation-detail-wrapper">
      <div className="techborg-innovation-detail-hero">
        {innovation.image && <img src={innovation.image} alt={innovation.title} />}
        <div className="techborg-innovation-detail-hero-text">
          <h1>{innovation.title}</h1>
          {innovation.subtitle && <p className="techborg-innovation-subtitle">{innovation.subtitle}</p>}
          <div className="techborg-innovation-meta">
            <span>By {innovation.author}</span>
            <span>{new Date(innovation.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="techborg-innovation-detail-main">
        <section className="techborg-innovation-section">
          <h2>Description</h2>
          <p>{innovation.description}</p>
        </section>

        {innovation.images?.length > 0 && (
          <section className="techborg-innovation-section">
            <h2>Gallery</h2>
            <div className="techborg-innovation-gallery">
              {innovation.images.map((img, i) => (
                <img key={i} src={img} alt={`slide-${i}`} />
              ))}
            </div>
          </section>
        )}

        {innovation.contentSections?.map((section, idx) => (
          <section className="techborg-innovation-section" key={idx}>
            <h3>{section.heading}</h3>
            <p>{section.text}</p>

            {section.bullets?.length > 0 && (
              <ul className="techborg-innovation-list">
                {section.bullets.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}

            {section.tips?.length > 0 && (
              <div className="techborg-innovation-tips">
                <h4>Tips:</h4>
                <ul>
                  {section.tips.map((tip, k) => (
                    <li key={k}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
