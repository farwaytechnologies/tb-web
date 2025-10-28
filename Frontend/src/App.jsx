import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import PagesRout from "./Routes/PagesRoute";

// ✅ Visitor tracker function using fetch
const trackVisitor = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  try {
    await fetch(`${apiUrl}/api/visitors/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp: new Date().toISOString() }), // small safe payload
    });
    console.log("✅ Visitor tracked successfully");
  } catch (error) {
    console.error("❌ Visitor tracking failed:", error);
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
