import React, { useState, useEffect, useRef } from 'react';
import './Stats.css';

function Stats() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // Trigger animation only once when scrolled into view
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="stats-container">
        
        {/* 1. Liters Dispensed */}
        <div className="stat-card reveal reveal-stagger-1">
          <div className="stat-number">
            {inView ? <Counter end={200} suffix="+" /> : '0'}
          </div>
          <p className="stat-label">Liters Dispensed</p>
        </div>

        {/* 2. Bottles Crafted */}
        <div className="stat-card reveal reveal-stagger-2">
          <div className="stat-number">
            {inView ? <Counter end={300} suffix="+" /> : '0'}
          </div>
          <p className="stat-label">Bottles Crafted</p>
        </div>

        {/* 3. Customer & Social Audience */}
        <div className="stat-card reveal reveal-stagger-3">
          <div className="stat-number">
            {inView ? <Counter end={1000} suffix="+" /> : '0'}
          </div>
          <p className="stat-label">Customer & Social Audience</p>
        </div>

        {/* 4. Partnerships & Collaborations */}
        <div className="stat-card reveal reveal-stagger-4">
          <div className="stat-number">
            {inView ? <Counter end={5} suffix="+" /> : '0'}
          </div>
          <p className="stat-label">Partnerships & Collaborations</p>
        </div>

      </div>
    </section>
  );
}

// Sub-component for the smooth rapid counting animation
function Counter({ end, suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // Animation duration in milliseconds (2 seconds)
    const steps = 60;
    const increment = end / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
    </span>
  );
}

export default Stats;