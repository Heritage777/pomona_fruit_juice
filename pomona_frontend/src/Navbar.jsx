
import React, { useState } from 'react';
import './Navbar.css';
import logoImage from './assets/pomona-logo.png';

function Navbar({
  cartCount = 0,
  onOpenCart,
  isDarkMode = false,
  onToggleTheme,
  onAboutClick,
  onContactClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleAboutClick = (event) => {
    event.preventDefault();
    closeMenu();
    onAboutClick?.();
  };

  const handleContactClick = (event) => {
    event.preventDefault();
    closeMenu();
    onContactClick?.();
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo and Tagline */}
        <div className="navbar-brand-group">
          <a
            href="#home"
            className="logo-link"
            onClick={closeMenu}
          >
            <img
              src={logoImage}
              alt="Pomona Logo"
              className="brand-logo-img"
            />
          </a>

          <span className="brand-tagline">
            cool people drink pomona...
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-links" aria-label="Main navigation">
          <a href="#home" className="nav-link active">
            Home
          </a>

          <a href="#shop" className="nav-link">
            Shop
          </a>

          <a
            href="#about"
            className="nav-link"
            onClick={handleAboutClick}
          >
            About
          </a>

          <a
            href="#contact"
            className="nav-link"
            onClick={handleContactClick}
          >
            Contact
          </a>
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            className="icon-btn theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={
              isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
            title={
              isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            {isDarkMode ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Shopping Cart */}
          <div
            className="cart-wrapper"
            onClick={onOpenCart}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            aria-label="Open shopping cart drawer"
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpenCart?.();
              }
            }}
          >
            <button
              type="button"
              className="icon-btn"
              aria-label="Shopping cart"
              onClick={(event) => {
                event.stopPropagation();
                onOpenCart?.();
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </button>

            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>

          {/* Desktop Order Button */}
          <a
            href="#shop"
            className="order-now-btn"
            onClick={(event) => {
              event.preventDefault();
              onOpenCart?.();
            }}
          >
            Order Now
          </a>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className={`hamburger-btn ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={
              menuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? (
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <nav
        id="mobile-navigation"
        className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <a
          href="#home"
          className="mobile-nav-link active"
          onClick={closeMenu}
        >
          Home
        </a>

        <a
          href="#shop"
          className="mobile-nav-link"
          onClick={closeMenu}
        >
          Shop
        </a>

        <a
          href="#about"
          className="mobile-nav-link"
          onClick={handleAboutClick}
        >
          About
        </a>

        <a
          href="#contact"
          className="mobile-nav-link"
          onClick={handleContactClick}
        >
          Contact
        </a>

        <a
          href="#shop"
          className="mobile-order-btn"
          onClick={(event) => {
            event.preventDefault();
            closeMenu();
            onOpenCart?.();
          }}
        >
          Order Now
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
