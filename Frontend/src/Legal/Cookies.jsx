import React, { useState } from "react";
import "../Styles/LegalStyle/Cookies.css";
import { ChevronDown, Cookie } from "lucide-react";

const Cookies = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "These cookies are strictly necessary for the platform to function. They enable basic functionality like page navigation, secure access, and system security. Without these cookies, the platform cannot operate properly.",
      examples: ["Session ID", "Authentication tokens", "Security credentials"]
    },
    {
      name: "Performance Cookies",
      description: "These cookies collect information about how you interact with our platform. They help us understand which features are most used, identify technical issues, and improve overall performance and speed.",
      examples: ["Page load time", "Error logs", "Navigation patterns"]
    },
    {
      name: "Functional Cookies",
      description: "These cookies enable the platform to remember your preferences and provide personalized features. They improve your user experience by remembering your choices and learning patterns.",
      examples: ["Language preference", "Display settings", "Course bookmarks"]
    },
    {
      name: "Marketing & Analytics Cookies",
      description: "These cookies track your behavior across our platform and external sites to help us understand user patterns and optimize marketing efforts. They allow us to measure campaign effectiveness.",
      examples: ["Visit duration", "Page interactions", "Conversion tracking"]
    }
  ];

  const sections = [
    {
      title: "1. What Are Cookies?",
      content: "Cookies are small text files that are stored on your device (computer, tablet, or smartphone) when you visit a website or use an application. They contain information about your browsing and interactions with the platform. Cookies serve various purposes, including maintaining your login status, remembering preferences, and tracking how you use our services. Most web browsers automatically accept cookies, but you can configure your browser to refuse or warn you when receiving cookies."
    },
    {
      title: "2. Types of Cookies We Use",
      content: "Our platform uses four main categories of cookies: essential cookies for basic functionality, performance cookies to analyze usage, functional cookies for personalization, and marketing cookies for analytics and optimization. Each category serves specific purposes to enhance your experience and help us improve our services. Some cookies are set by our organization, while others are set by third-party providers who offer services on our behalf."
    },
    {
      title: "3. First-Party vs Third-Party Cookies",
      content: "First-party cookies are set directly by our platform and are used to store your preferences and login information. Third-party cookies are set by external service providers such as analytics platforms and advertising networks. These third parties may collect information about your online activities across different websites. We carefully select our third-party partners to ensure they maintain appropriate privacy and security standards."
    },
    {
      title: "4. Session vs Persistent Cookies",
      content: "Session cookies are temporary and are deleted when you close your browser. They help maintain your login session and secure transactions. Persistent cookies remain on your device for a specified period, even after closing your browser. These cookies help us remember your preferences and provide a more personalized experience on your next visit. You can manually delete persistent cookies through your browser settings at any time."
    },
    {
      title: "5. Cookie Consent & Management",
      content: "When you first visit our platform, we display a consent banner explaining our cookie usage. You can accept all cookies or customize your preferences. We obtain your consent before placing non-essential cookies on your device. You can change your cookie preferences at any time through your account settings or by modifying your browser settings. Disabling essential cookies may limit your ability to use certain platform features."
    },
    {
      title: "6. Analytics & Performance Tracking",
      content: "We use analytics tools like Google Analytics to understand how users interact with our platform. These tools track metrics such as page views, session duration, bounce rate, and user flow. This information helps us identify areas for improvement, optimize course content, and enhance the overall user experience. Analytics data is aggregated and anonymized; we cannot identify you personally through this data."
    },
    {
      title: "7. Personalization & Preferences",
      content: "Functional cookies allow us to remember your preferences, such as language settings, display preferences, and courses you've bookmarked. They enable features like auto-saving your progress and providing course recommendations. These cookies create a more tailored learning experience. You can clear these cookies if you prefer to reset your preferences, but this will affect your personalized experience."
    },
    {
      title: "8. Third-Party Service Providers",
      content: "We partner with service providers who use cookies for analytics, payment processing, customer support, and marketing. These partners include Google (analytics), payment processors, and communication platforms. Each partner has its own privacy policy governing their cookie usage. We ensure all partners comply with relevant privacy laws and maintain appropriate data protection standards."
    },
    {
      title: "9. Managing Your Cookie Preferences",
      content: "You can manage cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. You can also delete existing cookies through your browser. Note that blocking essential cookies may prevent proper platform functionality. Some platform features may not work correctly if you disable certain cookies. You can review specific cookie categories in your privacy settings."
    },
    {
      title: "10. Updates to Cookie Policy",
      content: "We may update this Cookie Policy periodically to reflect changes in our practices or technologies. We will notify you of significant changes via email or prominent notice on the platform. Your continued use of the platform following updates indicates your acceptance of the revised policy. We encourage you to review this policy regularly to stay informed about how we use cookies."
    }
  ];

  return (
    <div className="cookies-page">
      <div className="cookies-container">
        {/* Hero Section */}
        <div className="cookies-hero">
          <Cookie className="cookies-hero-icon" size={60} />
          <h1 className="cookies-title">Cookie Policy</h1>
          <div className="cookies-divider"></div>
          <p className="cookies-subtitle">
            Learn how we use cookies to enhance your learning experience
          </p>
          <p className="cookies-last-updated">Last updated: November 2024</p>
        </div>

        {/* Introduction */}
        <div className="cookies-section">
          <h2 className="cookies-section-title">Understanding Our Cookie Usage</h2>
          <p className="cookies-section-text">
            This Cookie Policy explains how we use cookies and similar tracking technologies on our educational platform. Cookies help us provide a better user experience, understand your preferences, and improve our services. We're committed to transparency regarding our cookie practices and respecting your privacy choices.
          </p>
          <p className="cookies-section-text">
            By using our platform, you consent to our use of cookies as described in this policy, unless you modify your cookie settings. We recommend reviewing this policy to understand how cookies enhance your learning experience.
          </p>
        </div>

        {/* Cookie Types Grid */}
        <div className="cookies-types-container">
          <h2 className="cookies-section-title" style={{ marginBottom: "2rem" }}>Types of Cookies We Use</h2>
          <div className="cookies-types-grid">
            {cookieTypes.map((type, index) => (
              <div key={index} className="cookies-type-card">
                <h3 className="cookies-type-name">{type.name}</h3>
                <p className="cookies-type-description">{type.description}</p>
                <div className="cookies-type-examples">
                  <strong>Examples:</strong>
                  <ul>
                    {type.examples.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="cookies-sections-container">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`cookies-expandable-section ${
                expandedSection === index ? "expanded" : ""
              }`}
            >
              <button
                className="cookies-section-header"
                onClick={() => toggleSection(index)}
              >
                <h3 className="cookies-section-heading">{section.title}</h3>
                <ChevronDown className="cookies-chevron" size={24} />
              </button>
              <div className="cookies-section-content">
                <p className="cookies-section-body">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Control Panel */}
        <div className="cookies-section cookies-control-section">
          <h2 className="cookies-section-title">Your Cookie Controls</h2>
          <div className="cookies-control-options">
            <div className="cookies-control-item">
              <h4>Essential Cookies</h4>
              <p>Always enabled - required for platform functionality</p>
              <input type="checkbox" disabled checked className="cookies-checkbox" />
            </div>
            <div className="cookies-control-item">
              <h4>Performance Cookies</h4>
              <p>Help us understand how you use our platform</p>
              <input type="checkbox" defaultChecked className="cookies-checkbox" />
            </div>
            <div className="cookies-control-item">
              <h4>Functional Cookies</h4>
              <p>Remember your preferences for a better experience</p>
              <input type="checkbox" defaultChecked className="cookies-checkbox" />
            </div>
            <div className="cookies-control-item">
              <h4>Marketing Cookies</h4>
              <p>Track marketing effectiveness and user behavior</p>
              <input type="checkbox" className="cookies-checkbox" />
            </div>
          </div>
          <button className="cookies-save-button">Save Preferences</button>
        </div>

        {/* Contact Section */}
        <div className="cookies-section cookies-contact-section">
          <h2 className="cookies-section-title">Questions About Cookies?</h2>
          <p className="cookies-section-text">
            If you have any questions about our cookie practices or need assistance managing your preferences, please contact us:
          </p>
          <div className="cookies-contact-info">
            <p><strong>Email:</strong> cookies@learning.com</p>
            <p><strong>Privacy Team:</strong> privacy@learning.com</p>
            <p><strong>Response Time:</strong> Within 24-48 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;