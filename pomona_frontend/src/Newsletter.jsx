import React, { useState } from 'react';
import './Newsletter.css';

// Dynamic API base URL for local development vs production (Render)
const API_URL = import.meta.env.VITE_API_URL || '';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', isError: false });

    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ text: data.message, isError: false });
        setEmail('');
      } else {
        setStatusMsg({ text: data.message, isError: true });
      }
    } catch (err) {
      console.error('Newsletter submission failed:', err);
      setStatusMsg({ text: 'Network error. Please try again.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter-section reveal">
      <div className="newsletter-card">
        <div className="newsletter-content">
          <h2>Join the Cool Pomona Club </h2>
          <p>Get exclusive discounts, new flavor announcements, and wellness tips straight to your inbox.</p>
        </div>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {statusMsg.text && (
          <div className={`newsletter-status ${statusMsg.isError ? 'error' : 'success'}`}>
            {statusMsg.text}
          </div>
        )}
      </div>
    </section>
  );
}

export default Newsletter;