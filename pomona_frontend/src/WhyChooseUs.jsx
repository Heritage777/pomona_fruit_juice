import React from 'react';
import './WhyChooseUs.css';

function WhyChooseUs({ title = "Why Choose Pomona?", features = [] }) {
  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        
        {/* Section Header */}
        <div className="why-choose-header reveal">
          <div className="header-accent-line"></div>
          <h2 className="why-choose-title">{title}</h2>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className={`feature-item reveal reveal-stagger-${index + 1}`} key={index}>
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;