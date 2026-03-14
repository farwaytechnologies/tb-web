import React, { useState, useEffect } from "react";

function PopupAd() {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAd(true);
    }, 3000); // show popup after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!showAd) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button onClick={() => setShowAd(false)} style={styles.close}>
          ✖
        </button>

        {/* Ad Content */}
        <h3>Sponsored</h3>

           <img
            src="src/img/poster-1.png" 
            alt="Ad"
            style={{ width: "30%", height: "20%", borderRadius: "1px" }}
          />
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
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },
  popup: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    position: "relative"
  },
  close: {
    position: "absolute",
    top: "5px",
    right: "10px",
    border: "none",
    background: "none",
    fontSize: "18px",
    cursor: "pointer"
  }
};

export default PopupAd;
