import React, { useState } from 'react';
import './ContactDrawer.css';

function ContactDrawer({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Enquiry',
    message: '',
  });

  const emailAddress = 'folorunsokhairah@gmail.com';
  const whatsappNumber = '2347033403644';
  const instagramUrl =
    'https://www.instagram.com/pomona.ng?obrf=eGU4ejAyMXp1c2cy';
  const tiktokUrl =
    'https://www.tiktok.com/@pomona_fruits?_r=1&_t=ZS-9AVU4xMQQMf';

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const messageText = `Hi Pomona! 🍹\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Subject:* ${formData.subject}\n\n*Message:*\n${formData.message}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      messageText
    )}`;

    window.open(whatsappUrl, '_blank');

    setFormData({
      name: '',
      email: '',
      subject: 'General Enquiry',
      message: '',
    });

    if (onClose) {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`contact-overlay ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
      inert={!isOpen ? '' : undefined}
    >
      <aside
        className="contact-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
      >
        {/* HEADER */}
        <div className="contact-header">
          <div>
            <span className="contact-eyebrow reveal">
              WE'RE HERE FOR YOU
            </span>

            <h2 id="contact-title" className="reveal">
              Get in Touch
            </h2>

            <p className="reveal">
              Have a question or an order enquiry? We'd love to hear
              from you.
            </p>
          </div>

          <button
            type="button"
            className="contact-close"
            onClick={onClose}
            aria-label="Close contact drawer"
          >
            &times;
          </button>
        </div>

        <div className="contact-content">
          {/* CONTACT METHODS */}
          <h3 className="reveal">Let's connect</h3>

          <div className="contact-methods">
            <a
              href={`mailto:${emailAddress}`}
              className="contact-method reveal"
            >
              <span className="contact-icon email-icon">@</span>

              <span className="contact-method-text">
                <strong>Email Us</strong>
                <small>{emailAddress}</small>
              </span>

              <span className="contact-arrow">↗</span>
            </a>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-method reveal"
            >
              <span className="contact-icon whatsapp-icon">W</span>

              <span className="contact-method-text">
                <strong>WhatsApp</strong>
                <small>Chat with us directly</small>
              </span>

              <span className="contact-arrow">↗</span>
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-method reveal"
            >
              <span className="contact-icon instagram-icon">◎</span>

              <span className="contact-method-text">
                <strong>Instagram</strong>
                <small>Follow our juice journey</small>
              </span>

              <span className="contact-arrow">↗</span>
            </a>

            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-method reveal"
            >
              <span className="contact-icon tiktok-icon">♪</span>

              <span className="contact-method-text">
                <strong>TikTok</strong>
                <small>See what's fresh</small>
              </span>

              <span className="contact-arrow">↗</span>
            </a>
          </div>

          {/* DIVIDER */}
          <div className="contact-divider reveal">
            <span>OR SEND US A QUICK MESSAGE</span>
          </div>

          {/* CONTACT FORM */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field reveal">
              <label htmlFor="contact-name">Your name</label>

              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="contact-field reveal">
              <label htmlFor="contact-email">Email address</label>

              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="contact-field reveal">
              <label htmlFor="contact-subject">
                What is this about?
              </label>

              <select
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <option>General Enquiry</option>
                <option>Order Enquiry</option>
                <option>Delivery Question</option>
                <option>Wholesale & Partnerships</option>
                <option>Feedback</option>
                <option>Other</option>
              </select>
            </div>

            <div className="contact-field reveal">
              <label htmlFor="contact-message">Your message</label>

              <textarea
                id="contact-message"
                name="message"
                placeholder="How can we help you?"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="contact-submit reveal"
            >
              Send via WhatsApp <span>↗</span>
            </button>

            <p className="contact-form-note reveal">
              Clicking send will open WhatsApp with your message
              pre-filled.
            </p>
          </form>

          {/* BOTTOM NOTE */}
          <div className="contact-bottom-note reveal">
            <span className="contact-status-dot"></span>

            <p>
              Fresh juice, friendly service, and we're always happy
              to hear from you.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default ContactDrawer;