// src/Routes/PagesRoute.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 🌍 General Pages
import Home from '../Pages/Home';
import About from '../Pages/About';
import Courses from '../Pages/Courses';
import Contact from '../Pages/Contact';
import Innovation from '../Pages/Inoovation';
import Blog from '../Pages/Blog';
import Learn from '../Pages/Learn';
import Support from '../Pages/Support';
import Notifications from '../Pages/Notifications';
import News from '../Pages/News';
import JobAlert from '../Pages/JobAlert';
import JobApplication from '../Pages/JobApplication';
import CourseDetail from '../Pages/CourseDetails';
import CourseModules from '../Pages/CourseModule';
import CourseTextContent from '../Pages/CourseTextContent';
import BlogDetails from '../Pages/BlogDetails';
import InnovationDetail from '../Pages/InnovationDetail';
import EnrollmentForm from '../Pages/EnrollmentForm';
import Certificates from '../Pages/Certificates';
import Invoice from '../Pages/Invoice';
import Exam from '../Pages/Exam';
import Settings from '../Pages/Settings';
import Login from '../Pages/Login';
import TutorLogin from '../Pages/TutorLogin';
import AdminLogin from '../Pages/AdminLogin';

// 🎓 Exam Guides
import Polytechnic from '../ExamGuide/Polytechnic';
import Engineering from '../ExamGuide/Engineering';
import Degree from '../ExamGuide/Degree';
import PG from '../ExamGuide/PG';

// 🧑‍💼 Dashboards
import UserDashboard from '../Dashboard/UserDashbord';
import TutorDashboard from '../Dashboard/TutorDashbord';
import AdminDashboard from '../Dashboard/AdminDashbord';

// ⚙️ Admin Management
import AdminManageCourses from '../Dashboard/AdminManageCourse';
import AdminManageUser from '../Dashboard/AdminManageUser';
import AdminManageBlogs from '../Dashboard/AdminManageBlogs';
import AdminManageTutor from '../Dashboard/AdminManageTutor';
import AdminManageAdmin from '../Dashboard/AdminManageAdmin';
import AdminManageEnrollments from '../Dashboard/AdminManageEnrollments';
import AdminManageInnovation from '../Dashboard/AdminManageInnovation';
import AdminManageCms from '../Dashboard/AdminManageCms';
import AdminManageNotifications from '../Dashboard/AdminManageNotifications';
import AdminAddJob from '../Dashboard/AdminAddJob';
import AdminViewContact from '../Dashboard/AdminViewContact';
import AdminViewApplications from '../Dashboard/AdminViewApplications';
import AdminManageNews from "../Dashboard/AdminManageNews";

// 🧠 Tutor Management
import TutorManageBlog from '../Dashboard/TutorManageBlog';
import TutorManageCourse from '../Dashboard/TutorManageCourse';
import TutorManageStudents from '../Dashboard/TutorManageStudents';
import TutorManageLearn from '../Dashboard/TutorMangeLearn';
import TutorRewards from '../Dashboard/TutorRewards';


// 👤 Profiles
import AdminProfile from '../Profile/AdminProfile';
import TutorProfile from '../Profile/TutorProfile';
import UserProfile from '../Profile/UserProfile';

// 📝 CMS Editing
import HomeCms from '../AdminCms/HomeCms';
import AboutCms from '../AdminCms/AboutCms';
import ContactCms from '../AdminCms/ContactCms';
import SupportCms from '../AdminCms/SupportCms';
import PrivacyCms from '../AdminCms/PrivacyCms';
import TermCondCms from '../AdminCms/TermCondCms';
import LearnDetails from '../Pages/LearnDetails';
import AdminManageLearn from '../Dashboard/AdminManageLearn';
import VisitorAnalytics from '../Dashboard/VisitorAnalytics';
import NewsDetail from '../Pages/NewsDetail';

// ✅ Legal / Static Pages (added)
import Privacy from '../Legal/Privacy';
import Terms from '../Legal/Terms';
import Cookies from '../Legal/Cookies';
import Faq from '../Legal/Faq';

// =============================
// 🚀 Main Route Component
// =============================
function PagesRoute() {
  return (
    <Routes>

      {/* 🌐 General Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/innovation" element={<Innovation />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/learn/:id" element={<LearnDetails />} />
      <Route path="/news" element={<News />} />
      <Route path="/support" element={<Support />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/job-alerts" element={<JobAlert />} />
      <Route path="/apply/:jobId" element={<JobApplication />} />
      <Route path="/news/:id" element={<NewsDetail />} />

      {/* 📘 Course Routes */}
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/courses/:id/modules" element={<CourseModules />} />
      <Route path="/courses/:id/content" element={<CourseTextContent />} />
      <Route path="/enroll" element={<EnrollmentForm />} />

      {/* 🧩 Dynamic Pages */}
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/innovation/:id" element={<InnovationDetail />} />

      {/* 🎓 Exam Guide */}
      <Route path="/exam-guide/polytechnic" element={<Polytechnic />} />
      <Route path="/exam-guide/engineering" element={<Engineering />} />
      <Route path="/exam-guide/degree" element={<Degree />} />
      <Route path="/exam-guide/pg" element={<PG />} />

      {/* 📊 Dashboards */}
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/tutor/dashboard" element={<TutorDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* 🧩 Admin Management */}
      <Route path="/admin/courses" element={<AdminManageCourses />} />
      <Route path="/admin/users" element={<AdminManageUser />} />
      <Route path="/admin/blogs" element={<AdminManageBlogs />} />
      <Route path="/admin/tutors" element={<AdminManageTutor />} />
      <Route path="/admin/manage-admins" element={<AdminManageAdmin />} />
      <Route path="/admin/enrollments" element={<AdminManageEnrollments />} />
      <Route path="/admin/innovations" element={<AdminManageInnovation />} />
      <Route path="/admin/manage-cms" element={<AdminManageCms />} />
      <Route path="/admin/manage-notifications" element={<AdminManageNotifications />} />
      <Route path="/admin/add-job" element={<AdminAddJob />} />
      <Route path="/admin/view-contact" element={<AdminViewContact />} />
      <Route path="/admin/applications" element={<AdminViewApplications />} />
      <Route path="/admin/news" element={<AdminManageNews />} />
      <Route path="/admin/manage-learn" element={<AdminManageLearn />} />
      <Route path="/admin/visitors" element={<VisitorAnalytics />} />

      {/* 🧾 CMS Editing */}
      <Route path="/admin/edit-home" element={<HomeCms />} />
      <Route path="/admin/edit-about" element={<AboutCms />} />
      <Route path="/admin/edit-contact" element={<ContactCms />} />
      <Route path="/admin/edit-support" element={<SupportCms />} />
      <Route path="/admin/edit-privacy-policy" element={<PrivacyCms />} />
      <Route path="/admin/edit-terms" element={<TermCondCms />} />

      {/* 🧠 Tutor Management */}
      <Route path="/tutor/blogs" element={<TutorManageBlog />} />
      <Route path="/tutor/courses" element={<TutorManageCourse />} />
      <Route path="/tutor/students" element={<TutorManageStudents />} />
      <Route path="/tutor/learn" element={<TutorManageLearn />} />
      <Route path="/tutor/rewards" element={<TutorRewards />} />

      {/* 👤 Profiles */}
      <Route path="/admin-profile" element={<AdminProfile />} />
      <Route path="/tutor-profile" element={<TutorProfile />} />
      <Route path="/user-profile" element={<UserProfile />} />

      {/* ⚙️ General Utility Pages */}
      <Route path="/settings" element={<Settings />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/invoices" element={<Invoice />} />
      <Route path="/exam" element={<Exam />} />

      {/* 🔐 Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/tutor-login" element={<TutorLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* 📜 Legal / Static Pages */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/faq" element={<Faq />} />

      {/* 404 fallback (optional) */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default PagesRoute;
