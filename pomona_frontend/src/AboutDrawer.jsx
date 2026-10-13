import React, { useEffect } from 'react';
import './AboutDrawer.css';
import kiara from './assets/kiara.jpg';
import hibba from './assets/hibba.JPG';

function AboutDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="about-overlay" onClick={onClose}>
      <aside
        className="about-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="about-drawer-header">
          <span className="about-drawer-brand">
            Pomona<span>.</span>
          </span>

          <button
            type="button"
            className="about-close-btn"
            onClick={onClose}
            aria-label="Close About panel"
          >
            &times;
          </button>
        </header>

        <div className="about-drawer-content">
          {/* INTRO */}
          <section className="about-intro">
            <span className="about-eyebrow reveal">
              GET TO KNOW US
            </span>

            <h1 id="about-drawer-title" className="reveal">
              A little more about
              <span> Pomona.</span>
            </h1>

            <p className="reveal">
              Fresh fruit, thoughtful choices, and refreshing moments.
              Here is the story behind the juice you love.
            </p>
          </section>

          {/* FOUNDER */}
          <section className="about-content-section founder-section">
            <div className="about-section-heading reveal">
              <h2>Meet our founder.</h2>
            </div>

            <div className="about-founder-card reveal">
              <div className="about-founder-image">
                <img
                  src={kiara}
                  alt="Khairah, founder of Pomona"
                />
              </div>

              <div className="about-founder-info">
                <span className="about-founder-label">
                  FOUNDER &amp; CEO
                </span>

                <h3>Khairah Folorunso</h3>

                <p>
                  A law student, entrepreneur, and tech girlie with a
                  passion for creating things that make everyday life
                  better.
                </p>

                <p>
                  Pomona grew from a love for fresh fruit juice and a
                  desire to move away from soda towards better everyday
                  drink choices. The goal is simple: make enjoying
                  something refreshing feel good, taste good, and fit
                  naturally into everyday life.
                </p>
              </div>
            </div>
          </section>

          {/* WELCOME NOTE */}
          <section className="about-welcome-section">
            <span className="about-eyebrow reveal">
              A NOTE TO YOU
            </span>

            <h2 className="reveal">We're glad you're here.</h2>

            <p className="reveal">
              Pomona started from a simple love for fresh fruit juice
              and a desire to quit soda and now we are here, sharing
              that with you! Whether you are having a bottle of tangy
              blend with friends or bottle of tropical blend after an
              exhausting day or having a just because drink, we hope
              you enjoy every sip.
            </p>

            <p className="reveal">
              We’re still growing, trying new things and creating more
              flavours for you, so keep coming back and growing with us.
            </p>

            <p className="reveal">
              Thank you for choosing Pomona. We’re glad you’re here!
            </p>

            <span className="about-signoff reveal">
              With love, the Pomona team.
            </span>
          </section>

          {/* WHY POMONA */}
          <section className="about-content-section about-why-section">
            <div className="about-section-heading reveal">
              <span className="about-eyebrow">WHY POMONA?</span>
              <h2>Better choices can taste amazing.</h2>
            </div>

            <p className="reveal">
              We believe that choosing a refreshing drink should be
              simple and enjoyable. Pomona is about bringing fruit
              juice into everyday moments, with attention to flavour,
              carefully selected ingredients, and consistency in
              every bottle.
            </p>

            <div className="about-values-grid">
              <article className="about-value-card reveal">
                <span className="about-value-icon">✳</span>
                <h3>Refreshing flavour</h3>
                <p>
                  Fruit-forward drinks made for enjoyable,
                  refreshing moments.
                </p>
              </article>

              <article className="about-value-card reveal">
                <span className="about-value-icon">♡</span>
                <h3>Made with care</h3>
                <p>
                  Thoughtful choices and consistency matter in
                  every bottle we share.
                </p>
              </article>

              <article className="about-value-card reveal">
                <span className="about-value-icon">☀</span>
                <h3>Everyday enjoyment</h3>
                <p>
                  Making a refreshing alternative an easy part
                  of your day.
                </p>
              </article>
            </div>
          </section>

          {/* OUR PURPOSE */}
          <section className="about-content-section about-purpose-section">
            <div className="about-section-heading reveal">
              <span className="about-eyebrow">OUR PURPOSE</span>
              <h2>Where we're headed.</h2>
            </div>

            <div className="about-purpose-card reveal">
              <span className="about-purpose-number">01</span>
              <div>
                <h3>Our vision</h3>
                <p>
                  To become a trusted Nigerian fruit juice brand,
                  making fresh, enjoyable, and healthy drinks a
                  natural part of everyday life.
                </p>
              </div>
            </div>

            <div className="about-purpose-card reveal">
              <span className="about-purpose-number">02</span>
              <div>
                <h3>Our mission</h3>
                <p>
                  To create delicious, refreshing fruit drinks using
                  carefully selected ingredients, with consistency
                  and care. We want to make better drink choices
                  simple, enjoyable, and accessible — one bottle
                  at a time.
                </p>
              </div>
            </div>
          </section>

          {/* CUSTOMER SMILE */}
          <section className="about-smile-section">
            <div className="about-smile-image reveal">
              <img
                src={hibba}
                alt="A happy Pomona customer"
              />
            </div>

            <div className="about-smile-copy reveal">
              <span className="about-eyebrow">
                THIS IS WHY WE DO IT
              </span>

              <h2>
                This smile on our customer's face, ladies and
                gentlemen, is exactly why Pomona was founded.
              </h2>

              <p>
                Every bottle is an opportunity to create a little
                moment of joy. That is what keeps us going.
              </p>
            </div>
          </section>

          {/* CLOSING */}
          <section className="about-closing-section">
            <span className="about-eyebrow reveal">
              YOUR NEXT REFRESHING MOMENT
            </span>

            <h2 className="reveal">
              There's a little Pomona for everyone.
            </h2>

            <p className="reveal">
              Thanks for getting to know us. Now, let's find your
              next favourite flavour.
            </p>

            <button
              type="button"
              className="about-explore-btn reveal"
              onClick={onClose}
            >
              Back to the homepage <span aria-hidden="true">→</span>
            </button>
          </section>

          {/* FOOTER */}
          <footer className="about-drawer-footer reveal">
            <span>© {new Date().getFullYear()} Pomona</span>
            <span>cool people drink pomona...</span>
          </footer>
        </div>
      </aside>
    </div>
  );
}

export default AboutDrawer;