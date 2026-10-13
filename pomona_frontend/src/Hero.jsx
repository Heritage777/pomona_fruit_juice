import React, { useEffect, useState } from 'react';
import './Hero.css';
import pomonaHero from './assets/pomona-hero.png';

const headlines = [
  "Nature's Goodness in Every Sip",
  'Fresh Fruits. Feel-Good Flavour.',
  'Your Daily Dose of Delicious.',
];

function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = headlines[phraseIndex];
    let delay;

    if (!isDeleting && displayText === currentPhrase) {
      // Let the reader enjoy the complete headline.
      delay = 2600;
    } else if (isDeleting && displayText === '') {
      // Move to the next headline.
      delay = 350;
    } else {
      // Smooth typing and deleting speeds.
      delay = isDeleting ? 32 : 65;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentPhrase) {
        setIsDeleting(true);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setPhraseIndex((previous) => (previous + 1) % headlines.length);
      } else if (isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
      } else {
        setDisplayText(
          currentPhrase.substring(0, displayText.length + 1)
        );
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <section className="hero-section" id="home">
      <div className="hero-container">

        <div className="hero-content reveal reveal-left">

          <div className="hero-eyebrow">
            <span className="eyebrow-dot"></span>
            100% NATURAL&nbsp; · &nbsp;NO ADDED SUGAR
          </div>

          <h1 className="hero-title">
            <span
              className="hero-title-text"
              aria-label={headlines[phraseIndex]}
            >
              {displayText}
              <span className="typewriter-caret" aria-hidden="true">
                |
              </span>
            </span>
          </h1>

          <p className="hero-description">
            Fresh, healthy and delicious fruit juices made
            from real fruits. Because you deserve the best
            nature has to offer.
          </p>

          <a href="#shop" className="hero-cta">
            Shop Now
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>

          {/* Benefit Indicators */}
          <div className="hero-benefits">

            <div className="hero-benefit">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 4C11 3 5 7 5 14c0 3 2 5 5 5 7 0 11-7 10-15Z" />
                <path d="M3 21c3-6 7-9 12-12" />
              </svg>
              <span>
                100% Natural
                <small>Ingredients</small>
              </span>
            </div>

            <div className="hero-benefit">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>
                No Added
                <small>Sugar</small>
              </span>
            </div>

            <div className="hero-benefit">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 7h11v11H3z" />
                <path d="M14 11h4l3 4v3h-7z" />
                <circle cx="7.5" cy="19" r="2" />
                <circle cx="18" cy="19" r="2" />
                <path d="M6 11h5M8.5 8.5v5" />
              </svg>
              <span>
                Fast & Reliable
                <small>Delivery</small>
              </span>
            </div>

          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="hero-visual reveal reveal-right">
          <div className="hero-image-glow"></div>

          <img
            src={pomonaHero}
            alt="Pomona fresh fruit juices"
            className="hero-image"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;