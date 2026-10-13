import React from 'react';
import './HeroBanner.css';

function HeroBanner({ 
  title = "Good Juice. Better Days.", 
  subtitle = "Stay refreshed, stay healthy, and make fruit juice a part of your everyday.", 
  buttonText = "Shop Now", 
  onShopNow 
}) {
  return (
    <section className="hero-banner-section">
      <div className="hero-banner-container">
        
        {/* Content Overlay */}
        <div className="hero-banner-content reveal reveal-left">
          <h2 className="hero-banner-title">
            Good Juice.<br />
            <span className="highlight-text">Better Days.</span>
          </h2>
          <p className="hero-banner-subtitle">{subtitle}</p>
          <button onClick={onShopNow} className="hero-banner-btn">
            {buttonText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}

export default HeroBanner;