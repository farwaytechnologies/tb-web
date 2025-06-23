import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page Components
import Home from '../Pages/Home';
import About from '../Pages/About';
import Courses from '../Pages/Courses';
import Contact from '../Pages/Contact';
import CourseDetail from '../Pages/CourseDetails';
import CourseModules from '../Pages/CourseModule';


function PagesRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/contact" element={<Contact />} />


     <Route path="/courses/:id" element={<CourseDetail/>} /> {/* ✅ this is critical */}
     <Route path="/courses/:id/modules" element={<CourseModules/>} />

    </Routes>
  );
}

export default PagesRoute;
