import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import PagesRout from './Routes/PagesRoute';

// ✅ Visitor tracker function
const trackVisitor = async () => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/visitors/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Visitor tracking failed:", error);
  }
};

function App() {
  useEffect(() => {
    // Run once on app mount to log visitor
    trackVisitor();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <PagesRout />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
