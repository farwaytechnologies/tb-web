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



     <Route path="/courses/:id" element={<CourseDetail/>} /> {/* ✅ this is critical */}
     <Route path="/courses/:id/modules" element={<CourseModules/>} />

      <Route path="/user/dashboard" element={<UserDashboard/>} />
      <Route path="/admin/dashboard" element={<AdminDashboard/>} />
      <Route path='/tutor/dashboard'element={<TutorDashboard/>}/>


      <Route path="/admin/courses" element={<AdminManageCourses/> } /> 


      <Route path="/admin-profile" element={<AdminProfile/>} />
      <Route path="/tutor-profile" element={<TutorProfile/>} />
      <Route path="/user-profile" element={<UserProfile/>} />

      <Route path='/settings'element={<Settings/>}/>
      <Route path='/certificates'element={<Certificates/>}/>
      <Route path="/invoices" element={<Invoice/>} />
      <Route path='/exam'element={<Exam/>}/>

      


     <Route path='/login' element={<Login/>}/>
     
    </Routes>
  );
}

export default PagesRoute;
