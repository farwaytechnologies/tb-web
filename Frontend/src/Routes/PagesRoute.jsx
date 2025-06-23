import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page Components
import Home from '../Pages/Home';
import About from '../Pages/About';
import Courses from '../Pages/Courses';
import Contact from '../Pages/Contact';

function PagesRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default PagesRoute;
