import React from 'react';
import './Footer.css';
import logoImage from './assets/pomona-logo.png';

function Footer({ onAboutClick, onContactClick}) {
  const currentYear = new Date().getFullYear();

  const handleAboutClick = (event) => {
    event.preventDefault();
    onAboutClick?.();
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Brand Logo, Copyright and Developer Credit */}
        <div className="footer-left">
          <a href="#home" className="footer-logo-link">
            <img
              src={logoImage}
              alt="Pomona Logo"
              className="footer-logo-img"
            />
          </a>

          <p className="footer-copyright">
            © {currentYear} Pomona. All rights reserved.
          </p>

          <p className="footer-developer">
            Developed by <span className="dev-name">Heritage Abajesude</span>
          </p>
        </div>

        {/* Footer Navigation */}
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#home" className="footer-link">
            Home
          </a>

          <a href="#shop" className="footer-link">
            Shop
          </a>

          <a
            href="#about"
            className="footer-link"
            onClick={handleAboutClick}
          >
            About
          </a>

          <a href="#blog" className="footer-link">
            Blog
          </a>

          <a
  href="#contact"
  onClick={(e) => {
    e.preventDefault();
    onContactClick?.();
    closeMenu();
  }}
>
  Contact
</a>
        </nav>

        {/* Social Icons and Tagline */}
        <div className="footer-right">
          <div className="footer-socials">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="TikTok"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              aria-label="WhatsApp"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>

            <a
              href="mailto:hello@pomonajuice.com"
              className="social-icon"
              aria-label="Email Pomona"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>

          <div className="footer-signature">
            <span>...cool people drink pomona...</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 1.5 3.5.4 9.2A7 7 0 0 1 11 20z" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;