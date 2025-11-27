import React, { useState } from "react";
import "../Styles/LegalStyle/Privacy.css";
import { ChevronDown } from "lucide-react";

const Privacy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us. This includes your name, email address, phone number, and educational background. We also automatically collect certain information about your device and how you interact with our platform, including IP address, browser type, pages visited, and course engagement data."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our educational services. This includes delivering course content, processing enrollments, sending educational updates, personalizing your learning experience, and analyzing platform usage patterns. We may also use your information to comply with legal obligations, enforce our terms, and protect the rights and safety of our users and platform."
    },
    {
      title: "3. Information Sharing & Disclosure",
      content: "We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements. We may also disclose information when required by law, to enforce our agreements, or to protect the safety and rights of our users."
    },
    {
      title: "4. Data Security",
      content: "We implement comprehensive security measures to protect your personal information from unauthorized access, alteration, and disclosure. Our platform uses industry-standard encryption protocols and secure servers. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security. We encourage you to use strong passwords and maintain confidentiality of your account credentials."
    },
    {
      title: "5. Your Rights & Choices",
      content: "You have the right to access, update, or delete your personal information at any time through your account settings. You can opt out of promotional communications while maintaining essential service notifications. Depending on your location, you may have additional rights under applicable data protection laws. Contact us to exercise any of these rights."
    },
    {
      title: "6. Cookies & Tracking",
      content: "We use cookies and similar tracking technologies to enhance your user experience and analyze platform usage. These tools help us remember your preferences, understand learning patterns, and improve our services. You can control cookie settings through your browser, though this may affect functionality. Learn more about our cookie practices in our Cookie Policy."
    },
    {
      title: "7. Data Retention",
      content: "We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. After you close your account, we may retain certain information as required by law or for legitimate business purposes. You can request deletion of your data subject to legal and operational requirements."
    },
    {
      title: "8. International Transfers",
      content: "Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have different data protection laws. By using our platform, you consent to such transfers. We ensure appropriate safeguards are in place to protect your information during international transfers."
    },
    {
      title: "9. Third-Party Links",
      content: "Our platform may contain links to third-party websites and services that are not operated by us. This Privacy Policy applies only to information collected through our platform. We are not responsible for the privacy practices of third-party sites. We encourage you to review their privacy policies before providing any information."
    },
    {
      title: "10. Contact Us",
      content: "If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at privacy@learning.com or through our contact form. We will respond to your inquiries within 30 days. You also have the right to lodge a complaint with your local data protection authority."
    }
  ];

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        {/* Hero Section */}
        <div className="privacy-hero">
          <h1 className="privacy-title">Privacy Policy</h1>
          <div className="privacy-divider"></div>
          <p className="privacy-subtitle">
            Your privacy is important to us. Learn how we collect, use, and protect your data.
          </p>
          <p className="privacy-last-updated">Last updated: November 2024</p>
        </div>

        {/* Introduction */}
        <div className="privacy-section">
          <h2 className="privacy-section-title">Overview</h2>
          <p className="privacy-section-text">
            This Privacy Policy explains how our educational platform collects, uses, maintains, and discloses information obtained from users of our website and mobile applications. We are committed to protecting your privacy and ensuring you have a positive experience on our platform.
          </p>
          <p className="privacy-section-text">
            Please read this policy carefully. By accessing and using our platform, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our platform.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="privacy-sections-container">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`privacy-expandable-section ${
                expandedSection === index ? "expanded" : ""
              }`}
            >
              <button
                className="privacy-section-header"
                onClick={() => toggleSection(index)}
              >
                <h3 className="privacy-section-heading">{section.title}</h3>
                <ChevronDown
                  className="privacy-chevron"
                  size={24}
                />
              </button>
              <div className="privacy-section-content">
                <p className="privacy-section-body">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Data Protection */}
        <div className="privacy-section privacy-highlight-section">
          <h2 className="privacy-section-title">Your Data Protection Rights</h2>
          <div className="privacy-rights-grid">
            <div className="privacy-right-card">
              <h4 className="privacy-right-title">Right to Access</h4>
              <p className="privacy-right-text">Request access to your personal data at any time</p>
            </div>
            <div className="privacy-right-card">
              <h4 className="privacy-right-title">Right to Correction</h4>
              <p className="privacy-right-text">Update or correct your information</p>
            </div>
            <div className="privacy-right-card">
              <h4 className="privacy-right-title">Right to Deletion</h4>
              <p className="privacy-right-text">Request deletion of your data in certain circumstances</p>
            </div>
            <div className="privacy-right-card">
              <h4 className="privacy-right-title">Right to Opt-Out</h4>
              <p className="privacy-right-text">Control how your data is used for marketing</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="privacy-section privacy-contact-section">
          <h2 className="privacy-section-title">Questions or Concerns?</h2>
          <p className="privacy-section-text">
            If you have any questions about this Privacy Policy or our privacy practices, please don't hesitate to contact us:
          </p>
          <div className="privacy-contact-info">
            <p><strong>Email:</strong> privacy@learning.com</p>
            <p><strong>Address:</strong> 123 Education Street, Learning City, LC 12345</p>
            <p><strong>Response Time:</strong> We respond to all inquiries within 30 business days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;