import React, { useState } from "react";
import "../Styles/LegalStyle/Faq.css";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

const Faq = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const faqs = [
    {
      category: "Account & Registration",
      questions: [
        {
          q: "How do I create an account?",
          a: "To create an account, click the 'Sign Up' button on our homepage. Enter your email address, create a strong password, and provide basic information like your name. Verify your email through the confirmation link sent to your inbox. Once verified, your account is ready to use!"
        },
        {
          q: "Can I change my email address?",
          a: "Yes, you can change your email address in your account settings. Go to Profile > Settings > Email Preferences. Enter your new email address and verify it through the confirmation link. Your old email will no longer be associated with your account."
        },
        {
          q: "What should I do if I forgot my password?",
          a: "Click 'Forgot Password' on the login page. Enter your registered email address, and we'll send a password reset link. Click the link in the email and create a new password. If you don't receive the email, check your spam folder or contact support."
        },
        {
          q: "Is my account information secure?",
          a: "Yes, we use industry-standard encryption and security protocols to protect your personal information. Your password is securely hashed, and we comply with international data protection regulations including GDPR and CCPA."
        }
      ]
    },
    {
      category: "Courses & Learning",
      questions: [
        {
          q: "How do I enroll in a course?",
          a: "Browse our course catalog, click on the course you're interested in, and click the 'Enroll' button. For free courses, enrollment is instant. For paid courses, you'll proceed to checkout. Once enrolled, you can access all course materials immediately."
        },
        {
          q: "Can I download course materials?",
          a: "Yes! Most course materials including video lectures, PDFs, and resources can be downloaded for offline access. Use the download button on each content item. You can access downloaded materials anytime, even without internet connection."
        },
        {
          q: "Is there a time limit to complete a course?",
          a: "Most courses don't have expiration dates. You can learn at your own pace and access materials indefinitely. Some instructor-led courses may have specific start and end dates. Check the course details page for specific timeline information."
        },
        {
          q: "Can I get a certificate after completing a course?",
          a: "Yes! Upon successful completion of course requirements, you'll receive a certificate of completion. You can download, print, or share it. Our certificates are recognized and can enhance your professional profile."
        },
        {
          q: "What if I'm not satisfied with a course?",
          a: "We offer a 30-day refund guarantee on paid courses. If you're not satisfied, contact our support team within 30 days of purchase with your course ID and reason for dissatisfaction."
        }
      ]
    },
    {
      category: "Payment & Billing",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, digital wallets, and bank transfers depending on your region. All payments are processed securely through industry-standard payment gateways."
        },
        {
          q: "Is there a trial period for paid courses?",
          a: "Some courses offer a free preview of the first few lessons. For most paid courses, we offer a 30-day money-back guarantee, essentially serving as a risk-free trial period."
        },
        {
          q: "How do I view my invoices?",
          a: "Go to your account dashboard and click 'Billing' or 'Invoices'. You'll see all your purchase history with downloadable invoices. Invoices are also emailed automatically after each purchase."
        },
        {
          q: "Do you offer discounts or scholarships?",
          a: "Yes! We regularly offer promotional discounts, bundle deals, and seasonal sales. We also provide need-based scholarships. Contact our support team to inquire about scholarship eligibility."
        },
        {
          q: "Can I get a refund for a paid course?",
          a: "We offer full refunds within 30 days of purchase if you're unsatisfied with the course. After 30 days, refunds are available on a case-by-case basis. Contact support with your course ID and reason."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "What browsers and devices are supported?",
          a: "Our platform works on all modern browsers (Chrome, Firefox, Safari, Edge) and is fully responsive on desktops, tablets, and smartphones. For the best experience, use the latest version of your browser."
        },
        {
          q: "I'm experiencing video playback issues. What should I do?",
          a: "Try these solutions: 1) Clear your browser cache and cookies, 2) Disable browser extensions, 3) Check your internet connection speed, 4) Try a different browser. If issues persist, contact support with your browser and device information."
        },
        {
          q: "Can I use the platform offline?",
          a: "You can download course materials for offline access. However, features like quizzes, discussions, and live sessions require an internet connection. Download materials before going offline."
        },
        {
          q: "How do I contact customer support?",
          a: "Visit our Support page or email support@learning.com. We also offer live chat during business hours. For urgent issues, use the Help icon in your dashboard. Average response time is 24-48 hours."
        },
        {
          q: "Are there any system requirements?",
          a: "Minimum: 4GB RAM, stable internet connection, and an updated browser. Recommended: 8GB RAM, broadband connection. Video courses require speakers or headphones. No special software installation is needed."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          q: "How is my personal data protected?",
          a: "We use SSL encryption, secure servers, and strict access controls to protect your data. We comply with GDPR, CCPA, and other privacy laws. Your data is never sold to third parties. Review our Privacy Policy for detailed information."
        },
        {
          q: "Can I delete my account?",
          a: "Yes. Go to Settings > Account > Delete Account. You'll be asked to confirm. Your account and associated data will be permanently deleted within 30 days. You can download your data before deletion."
        },
        {
          q: "Do you use cookies?",
          a: "Yes, we use cookies to enhance your experience, remember preferences, and analyze usage. You can control cookie settings in your browser. Read our Cookie Policy for detailed information about the types of cookies we use."
        },
        {
          q: "Is my learning history private?",
          a: "Yes, your learning progress and history are private by default. You can choose to make your certificate public or share your achievements. Your course participation is never visible to other users without your permission."
        }
      ]
    },
    {
      category: "Instructors & Support",
      questions: [
        {
          q: "Can I become an instructor?",
          a: "Yes! We welcome expert instructors. Apply through our Instructor Portal. You'll need a portfolio or samples of your work, teaching experience, and subject expertise. Our team will review your application within 5-7 business days."
        },
        {
          q: "How do I contact my instructor?",
          a: "Use the 'Contact Instructor' button on the course page or in course discussions. Most instructors respond within 24-48 hours. You can also post questions in the course discussion forum for community support."
        },
        {
          q: "Do you offer live classes or tutoring?",
          a: "Some instructors offer optional live sessions and office hours. Check the course syllabus for schedule information. We also have community forums where students help each other."
        },
        {
          q: "Can I request a specific course topic?",
          a: "Absolutely! Use the 'Request a Course' feature in your dashboard or email suggestions@learning.com. We review all suggestions and use them to plan future course development. Popular requests often become new courses."
        }
      ]
    }
  ];

  // Filter FAQs based on search
  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="faq-page">
      <div className="faq-container">
        {/* Hero Section */}
        <div className="faq-hero">
          <HelpCircle className="faq-hero-icon" size={60} />
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <div className="faq-divider"></div>
          <p className="faq-subtitle">
            Find answers to common questions about our platform
          </p>
        </div>

        {/* Search Bar */}
        <div className="faq-search-container">
          <div className="faq-search-wrapper">
            <Search className="faq-search-icon" size={20} />
            <input
              type="text"
              className="faq-search-input"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <p className="faq-search-result-count">
              Found {filteredFaqs.reduce((acc, cat) => acc + cat.questions.length, 0)} results
            </p>
          )}
        </div>

        {/* FAQ Sections */}
        {filteredFaqs.length > 0 ? (
          <div className="faq-sections">
            {filteredFaqs.map((category, catIndex) => (
              <div key={catIndex} className="faq-category">
                <h2 className="faq-category-title">{category.category}</h2>
                <div className="faq-questions-container">
                  {category.questions.map((faq, qIndex) => {
                    const globalIndex = `${catIndex}-${qIndex}`;
                    return (
                      <div
                        key={qIndex}
                        className={`faq-item ${
                          expandedQuestion === globalIndex ? "expanded" : ""
                        }`}
                      >
                        <button
                          className="faq-question-button"
                          onClick={() => toggleQuestion(globalIndex)}
                        >
                          <h3 className="faq-question-text">{faq.q}</h3>
                          <ChevronDown className="faq-chevron" size={24} />
                        </button>
                        <div className="faq-answer-container">
                          <p className="faq-answer-text">{faq.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="faq-no-results">
            <p>No results found for "{searchTerm}"</p>
            <p className="faq-no-results-hint">Try using different keywords or browse all categories</p>
          </div>
        )}

        {/* Still Need Help */}
        <div className="faq-section faq-help-section">
          <h2 className="faq-section-title">Still Need Help?</h2>
          <p className="faq-section-text">
            Couldn't find the answer you're looking for? Our support team is here to help!
          </p>
          <div className="faq-contact-options">
            <div className="faq-contact-card">
              <h4>Email Support</h4>
              <p>support@learning.com</p>
              <p className="faq-contact-detail">24/7 email support</p>
            </div>
            <div className="faq-contact-card">
              <h4>Live Chat</h4>
              <p>Available on dashboard</p>
              <p className="faq-contact-detail">Mon-Fri, 9AM-6PM EST</p>
            </div>
            <div className="faq-contact-card">
              <h4>Phone Support</h4>
              <p>+1 (555) 123-4567</p>
              <p className="faq-contact-detail">Mon-Fri, 9AM-6PM EST</p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="faq-section faq-feedback-section">
          <h2 className="faq-section-title">Help Us Improve</h2>
          <p className="faq-section-text">
            Was this FAQ helpful? Let us know what topics you'd like us to cover:
          </p>
          <button className="faq-feedback-button">Send Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default Faq;