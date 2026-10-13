import React from 'react';
import './Testimonials.css';

function Testimonials({ title = "What Our Customers Say", reviews = [] }) {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        
        {/* Section Title */}
        <h2 className="testimonials-title reveal">{title}</h2>

        {/* Reviews Grid */}
        <div className="testimonials-grid">
          {reviews.map((review, index) => (
            <div className={`testimonial-card reveal reveal-stagger-${index + 1}`} key={index}>
              <div className="testimonial-header">
                <img src={review.image} alt={review.name} className="testimonial-avatar" />
                <p className="testimonial-quote">"{review.quote}"</p>
              </div>

              <div className="testimonial-footer">
                <span className="testimonial-name">{review.name}</span>
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#ad0000" stroke="#ad0000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;