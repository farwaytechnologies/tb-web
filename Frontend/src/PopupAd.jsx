import React, { useState, useEffect } from "react";
import posterImg from "./assets/images/poster-2.png";

function PopupAd() {
  const [showAd, setShowAd] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAd(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!showAd) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button onClick={() => setShowAd(false)} style={styles.close}>✖</button>
        <img src={posterImg} alt="Ad" style={styles.image} />
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },
  popup: {
    position: "relative",
    display: "inline-block",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)"
  },
  image: {
    display: "block",
    width: "380px",
    height: "auto",
    borderRadius: "8px"
  },
  close: {
    position: "absolute",
    top: "8px",
    right: "10px",
    border: "none",
    background: "rgba(0,0,0,0.45)",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1
  }
};

export default PopupAd;
