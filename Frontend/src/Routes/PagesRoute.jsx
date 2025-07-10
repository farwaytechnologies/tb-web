import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page Components
import Home from '../Pages/Home';
import About from '../Pages/About';
import Courses from '../Pages/Courses';
import Contact from '../Pages/Contact';
import CourseDetail from '../Pages/CourseDetails';
import CourseModules from '../Pages/CourseModule';
import Login from '../Pages/Login';
import Innovation from '../Pages/Inoovation';
import UserDashboard from '../Dashboard/UserDashbord';
import AdminDashboard from '../Dashboard/AdminDashbord';
import TutorDashboard from '../Dashboard/TutorDashbord';
import AdminProfile from '../Profile/AdminProfile';
import TutorProfile from '../Profile/TutorProfile';
import UserProfile from '../Profile/UserProfile';
import Settings from '../Pages/Settings';
import Blog from '../Pages/Blog';
import BlogDetails from '../Pages/BlogDetails';
import Certificates from '../Pages/Certificates';
import Invoice from '../Pages/Invoice';
import Exam from '../Pages/Exam'
import AdminManageCourses from '../Dashboard/AdminManageCourse';
import AdminManageUser from '../Dashboard/AdminManageUser';
import AdminManageBlogs from '../Dashboard/AdminManageBlogs';
import EnrollmentForm from '../Pages/EnrollmentForm';
import AdminManageEnrollments from '../Dashboard/AdminManageEnrollments';
import AdminManageTutor from '../Dashboard/AdminManageTutor';
import TutorManageBlog from '../Dashboard/TutorManageBlog';
import TutorManageCourse from '../Dashboard/TutorManageCourse';
import InnovationDetail from '../Pages/InnovationDetail';
import AdminManageInnovation from '../Dashboard/AdminManageInnovation';
import AdminManageAdmin from '../Dashboard/AdminManageAdmin';
import TutorManageStudents from '../Dashboard/TutorManageStudents';
import Support from '../Pages/Support';
import Notifications from '../Pages/Notifications';
import AdminManageCms from '../Dashboard/AdminManageCms';
import HomeCms from '../AdminCms/HomeCms';
import AboutCms from '../AdminCms/AboutCms';
import ContactCms from '../AdminCms/ContactCms';
import SupportCms from '../AdminCms/SupportCms';
import PrivacyCms from '../AdminCms/PrivacyCms';
import TermCondCms from '../AdminCms/TermCondCms';
import CourseTextContent from '../Pages/CourseTextContent';
import AdminViewContact from '../Dashboard/AdminViewContact';




function PagesRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/innovation" element={<Innovation/>} />
      <Route path="/blog" element={<Blog/>} />
      <Route path="/blog/:id" element={<BlogDetails/>} />
      <Route path="/innovation/:id" element={<InnovationDetail/>} />
      <Route path="/support" element={<Support/>} />
      <Route path="/notifications" element={<Notifications />} />


     <Route path="/courses/:id" element={<CourseDetail/>} /> {/* ✅ this is critical */}
     <Route path="/courses/:id/modules" element={<CourseModules/>} />
     <Route path="/courses/:id/content" element={<CourseTextContent />} />


      <Route path="/user/dashboard" element={<UserDashboard/>} />
      <Route path="/admin/dashboard" element={<AdminDashboard/>} />
      <Route path='/tutor/dashboard'element={<TutorDashboard/>}/>



      <Route path="/admin/courses" element={<AdminManageCourses/> } /> 
      <Route path="/admin/users" element={<AdminManageUser/>} />
      <Route path="/admin/blogs" element={<AdminManageBlogs />} />
      <Route path="/admin/tutors" element={<AdminManageTutor/>} />
      <Route path="/admin/manage-admins" element={<AdminManageAdmin/>} />
      <Route path="/admin/enrollments" element={<AdminManageEnrollments/>} />
      <Route path="/admin/innovations" element={<AdminManageInnovation/>} />
      <Route path="/admin/manage-cms" element={<AdminManageCms />} />



        <Route path="/admin/edit-home" element={<HomeCms />} />
        <Route path="/admin/edit-about" element={<AboutCms/>} />
        <Route path="/admin/edit-contact" element={<ContactCms />} />
        <Route path="/admin/edit-support" element={<SupportCms />} />
        <Route path="/admin/edit-privacy-policy" element={<PrivacyCms />} />
        <Route path="/admin/edit-terms" element={<TermCondCms />} />
        <Route path="/admin/view-contact" element={<AdminViewContact/>} />


      <Route path="/tutor/blogs" element={<TutorManageBlog/>} />
      <Route path="/tutor/courses" element={<TutorManageCourse/> } /> 
      <Route path="/tutor/students" element={<TutorManageStudents/>} />



      <Route path="/admin-profile" element={<AdminProfile/>} />
      <Route path="/tutor-profile" element={<TutorProfile/>} />
      <Route path="/user-profile" element={<UserProfile/>} />
     

      <Route path='/settings'element={<Settings/>}/>
      <Route path='/certificates'element={<Certificates/>}/>
      <Route path="/invoices" element={<Invoice/>} />
      <Route path='/exam'element={<Exam/>}/>

      


     <Route path='/login' element={<Login/>}/>
     <Route path="/enroll" element={<EnrollmentForm/>} />
     
    </Routes>
  );
}

export default PagesRoute;
