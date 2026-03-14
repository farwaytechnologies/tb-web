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

           <a href="https://beta.publishers.adsterra.com/referral/feF8Lgzu83" rel="nofollow"><img alt="banner" src="https://landings-cdn.adsterratech.com/referralBanners/png/200%20x%20200%20px.png" /></a>
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
    background: "#fff",
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
