import React, { useState } from "react";
import "../Styles/LegalStyle/Terms.css";
import { ChevronDown, AlertCircle, CheckCircle } from "lucide-react";

const Terms = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using this educational platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. Your continued use of the platform after modifications to these terms constitutes your acceptance of the updated terms."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily download one copy of the materials (information or software) on our platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to decompile or reverse engineer any software contained on the platform; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or 'mirror' the materials on any other server."
    },
    {
      title: "3. Disclaimer of Warranties",
      content: "The materials on our platform are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on the Internet or relating to such materials or on any sites linked to this site."
    },
    {
      title: "4. Limitations of Liability",
      content: "In no event shall our platform or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the platform, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you."
    },
    {
      title: "5. Accuracy of Materials",
      content: "The materials appearing on the platform could include technical, typographical, or photographic errors. We do not warrant that any of the materials on the platform are accurate, complete, or current. We may make changes to the materials contained on the platform at any time without notice. However, we do not make any commitment to update the materials. Course content reflects information available at the time of creation and may require updates."
    },
    {
      title: "6. Materials & Course Content",
      content: "The materials provided through our platform, including but not limited to course content, video lectures, reading materials, and assessments, are protected by copyright and other intellectual property laws. You may use these materials solely for your personal educational purposes. Reproduction, distribution, modification, or commercial use of course materials without express permission is prohibited. Upon course completion, you retain access to materials for personal reference purposes only."
    },
    {
      title: "7. User Accounts & Responsibilities",
      content: "To access certain features, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials and password. You agree to accept responsibility for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account. You agree not to use another user's account or provide false information about your identity or background."
    },
    {
      title: "8. User Conduct & Restrictions",
      content: "You agree not to engage in any conduct that restricts or inhibits anyone's use or enjoyment of the platform. Prohibited behavior includes: harassing or causing distress or inconvenience to any person; offending the dignity of any person; disrupting normal flow of dialogue; posting obscene or defamatory messages; inserting images or sounds without permission; disrupting others' studies; intentionally or unintentionally violating any applicable local, state, national, or international law; or infecting others with viruses or malicious code."
    },
    {
      title: "9. Payment & Refunds",
      content: "If you choose to purchase paid courses or services, you agree to pay all applicable fees. All fees are non-refundable unless otherwise stated. Payment processing is handled securely through third-party payment processors. We reserve the right to change fees with 30 days' notice. For course withdrawals, refund eligibility depends on the refund policy applicable to that specific course, communicated at the time of purchase."
    },
    {
      title: "10. Intellectual Property Rights",
      content: "The platform and all its content, features, and functionality are owned by our organization, its licensors, or other providers of such material and are protected by international copyright, trademark, and other intellectual property laws. You agree not to reproduce, distribute, modify, create derivative works, publicly display, or use any platform content for commercial purposes without explicit written permission from the copyright holder."
    },
    {
      title: "11. Links to Third-Party Sites",
      content: "Our platform may contain links to third-party websites and services that are not operated by us. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party sites is at your own risk and subject to their terms and conditions. We do not endorse any third-party sites or services and are not liable for any harm or loss resulting from your use of them."
    },
    {
      title: "12. Certificate of Completion",
      content: "Upon successful completion of a course, you may be eligible to receive a certificate of completion. These certificates are non-transferable and represent completion of the course material. Certificates do not constitute academic credit or accreditation unless explicitly stated. We reserve the right to revoke certificates obtained through fraudulent means or policy violations. Certificates are issued at our sole discretion based on completion criteria."
    },
    {
      title: "13. Termination & Suspension",
      content: "We reserve the right to refuse service, terminate accounts, or remove any content at our sole discretion, with or without cause, and with or without notice. Causes for termination include violation of these Terms of Service, disruptive behavior, fraudulent activity, or non-payment of fees. Upon termination, your right to use the platform ceases immediately. Sections addressing liability, indemnification, and intellectual property survive termination."
    },
    {
      title: "14. Dispute Resolution",
      content: "Any disputes arising out of or relating to these Terms of Service or the platform shall be governed by the laws of the jurisdiction in which our organization is located. You agree to submit to the exclusive jurisdiction of the courts in that location. Before pursuing legal action, you agree to attempt resolution through good faith negotiation. If negotiation fails, you may pursue remedies through arbitration or small claims court as applicable."
    },
    {
      title: "15. Modifications to Terms",
      content: "We reserve the right to modify these Terms of Service at any time. Changes become effective immediately upon posting to the platform. Your continued use of the platform following the posting of revised terms means that you accept and agree to the changes. We encourage you to review these terms periodically. Significant changes will be communicated via email or prominent notice on the platform."
    }
  ];

  return (
    <div className="terms-page">
      <div className="terms-container">
        {/* Hero Section */}
        <div className="terms-hero">
          <h1 className="terms-title">Terms of Service</h1>
          <div className="terms-divider"></div>
          <p className="terms-subtitle">
            Please read these terms carefully before using our platform
          </p>
          <p className="terms-last-updated">Effective Date: November 2024</p>
        </div>

        {/* Important Notice */}
        <div className="terms-notice">
          <AlertCircle size={24} className="terms-notice-icon" />
          <div className="terms-notice-content">
            <h3>Important Notice</h3>
            <p>
              By accessing this platform, you agree to be bound by all terms and conditions. If you disagree with any part of these terms, you may not use the platform. Please contact us if you have questions.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="terms-section">
          <h2 className="terms-section-title">Overview</h2>
          <p className="terms-section-text">
            Welcome to our educational platform. These Terms of Service govern your access to and use of our website, mobile applications, and all services provided through these platforms (collectively, the "Platform"). Our mission is to provide accessible, high-quality educational content and learning experiences to students worldwide.
          </p>
          <p className="terms-section-text">
            These terms establish a legally binding agreement between you and our organization. We encourage you to read these terms thoroughly and contact us with any questions or concerns before proceeding.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="terms-sections-container">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`terms-expandable-section ${
                expandedSection === index ? "expanded" : ""
              }`}
            >
              <button
                className="terms-section-header"
                onClick={() => toggleSection(index)}
              >
                <h3 className="terms-section-heading">{section.title}</h3>
                <ChevronDown className="terms-chevron" size={24} />
              </button>
              <div className="terms-section-content">
                <p className="terms-section-body">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Key Points */}
        <div className="terms-section terms-key-points">
          <h2 className="terms-section-title">Quick Reference</h2>
          <div className="terms-points-grid">
            <div className="terms-point-card">
              <CheckCircle className="terms-point-icon" size={28} />
              <h4>Account Security</h4>
              <p>You're responsible for maintaining your account confidentiality</p>
            </div>
            <div className="terms-point-card">
              <CheckCircle className="terms-point-icon" size={28} />
              <h4>Content Rights</h4>
              <p>Educational materials are protected intellectual property</p>
            </div>
            <div className="terms-point-card">
              <CheckCircle className="terms-point-icon" size={28} />
              <h4>User Conduct</h4>
              <p>Users must not engage in harassment or disruptive behavior</p>
            </div>
            <div className="terms-point-card">
              <CheckCircle className="terms-point-icon" size={28} />
              <h4>Liability Limits</h4>
              <p>We limit liability for damages arising from platform use</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="terms-section terms-contact-section">
          <h2 className="terms-section-title">Questions About These Terms?</h2>
          <p className="terms-section-text">
            If you have any questions, concerns, or disagreements regarding these Terms of Service, please contact us directly:
          </p>
          <div className="terms-contact-info">
            <p><strong>Email:</strong> legal@learning.com</p>
            <p><strong>Address:</strong> 123 Education Street, Learning City, LC 12345</p>
            <p><strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM (EST)</p>
            <p><strong>Response Time:</strong> We respond to all inquiries within 5 business days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;