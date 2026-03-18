import React, { useEffect, useState } from 'react';
import { MessageCircle, Phone, Mail, Search, Loader, AlertCircle } from 'lucide-react';
import '../Styles/PagesStyle/Support.css';
import SEO from '../Components/SEO';

function Support() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://tb-back-fyvj.onrender.com/api/support');

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        console.error('Error fetching support categories:', err);
        setError('Failed to load support categories. Please try again later.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="support-page">
      <SEO
        title="Support Center"
        description="Find answers to your questions in TechBorg's support center. Browse help topics or contact our team directly."
        url="/support"
        keywords="TechBorg support, help center, FAQ, e-learning help, customer support"
      />
      {/* Hero Section */}
      <div className="support-hero">
        <h1 className="support-hero-title">
          How can we <span className="support-highlight">help you?</span>
        </h1>
        <p className="support-hero-subtitle">
          Welcome to TechBorg Support. Choose a category or search for what you need.
        </p>

        {/* Search Bar */}
        <div className="support-search-wrapper">
          <Search className="support-search-icon" />
          <input
            type="text"
            placeholder="Search support topics..."
            className="support-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="support-container">
        {/* Loading State */}
        {loading && (
          <div className="support-loading-container">
            <div className="support-loading-spinner">
              <Loader className="support-spinner-icon" />
            </div>
            <p className="support-loading-text">Loading support categories...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="support-error-container">
            <AlertCircle className="support-error-icon" />
            <p className="support-error-text">{error}</p>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && categories.length > 0 && (
          <div className="support-categories">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <div
                  key={cat._id}
                  className={`support-card ${expandedCard === cat._id ? 'expanded' : ''}`}
                  onClick={() => setExpandedCard(expandedCard === cat._id ? null : cat._id)}
                >
                  <div className="support-card-header">
                    <div className="support-card-icon">
                      <MessageCircle />
                    </div>
                    <h3 className="support-card-title">{cat.title}</h3>
                  </div>

                  <p className="support-card-description">{cat.description}</p>

                  {cat.subcategories && Array.isArray(cat.subcategories) && (
                    <div className="support-card-subcategories">
                      <h4 className="support-subcategories-title">Related Topics:</h4>
                      <ul className="support-subcategories-list">
                        {cat.subcategories.map((subcat, index) => (
                          <li key={index} className="support-subcat-item">
                            {subcat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="support-no-results">
                <p>No support categories found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && categories.length === 0 && (
          <div className="support-empty-container">
            <AlertCircle className="support-empty-icon" />
            <p className="support-empty-text">No support categories available</p>
          </div>
        )}
      </div>

      {/* Contact Support Section */}
      <div className="support-contact-section">
        <div className="support-contact-container">
          <h2 className="support-contact-title">Still need help?</h2>
          <p className="support-contact-subtitle">
            Get in touch with our support team directly
          </p>

          <div className="support-contact-options">
            {/* Email */}
            <div className="support-contact-option">
              <div className="support-contact-icon">
                <Mail />
              </div>
              <h3 className="support-contact-label">Email Support</h3>
              <p className="support-contact-info">support@techborg.com</p>
            </div>

            {/* Phone */}
            <div className="support-contact-option">
              <div className="support-contact-icon">
                <Phone />
              </div>
              <h3 className="support-contact-label">Phone Support</h3>
              <p className="support-contact-info">+91 (XXX) XXX-XXXX</p>
            </div>

            {/* Chat */}
            <div className="support-contact-option">
              <div className="support-contact-icon">
                <MessageCircle />
              </div>
              <h3 className="support-contact-label">Live Chat</h3>
              <p className="support-contact-info">Mon - Fri: 9 AM - 6 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;