import { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import PagesRout from "./Routes/PagesRoute";
import PopupAd from "./PopupAd";
import { ThemeProvider } from "./context/ThemeContext";
import ToastContainer from "./Components/Toast";


// 🌍 API base URL (Render for production or localhost)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/*
  VisitorTracker component handles:
  - session start
  - page tracking
  - session end (on tab close)
*/
function VisitorTracker() {
  const [visitorId, setVisitorId] = useState(null);
  const location = useLocation();

  // 🔹 Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 🔹 Start session on first load
  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/visitors/start-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referrer: document.referrer || "" }),
        });
        const data = await res.json();
        if (data.visitorId) {
          setVisitorId(data.visitorId);
          console.log("✅ Visitor session started:", data.visitorId);
        }
      } catch (error) {
        console.error("❌ Failed to start visitor session:", error);
      }
    };
    startSession();
  }, []);

  // 🔹 Track every page route change
  useEffect(() => {
    if (!visitorId) return;
    const trackPage = async () => {
      try {
        await fetch(`${API_URL}/api/visitors/track-page`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, page: location.pathname }),
        });
        console.log("📄 Page tracked:", location.pathname);
      } catch (error) {
        console.error("❌ Failed to track page:", error);
      }
    };
    trackPage();
  }, [location.pathname, visitorId]);

  // 🔹 End session when tab/window closes
  useEffect(() => {
    const endSession = () => {
      if (visitorId) {
        const blob = new Blob(
          [JSON.stringify({ visitorId })],
          { type: 'application/json' }
        );
        navigator.sendBeacon(`${API_URL}/api/visitors/end-session`, blob);
      }
    };
    window.addEventListener("beforeunload", endSession);
    return () => window.removeEventListener("beforeunload", endSession);
  }, [visitorId]);

  return null; // Invisible component
}

/*
  Main App Component
*/
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <VisitorTracker />
        <PopupAd />
        <ToastContainer />
        <Navbar />
        <PagesRout />
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
