import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './CartDrawer.css';

function CartDrawer({ isOpen, onClose, cartItems = [], onUpdateQuantity, onRemoveItem }) {
  const [step, setStep] = useState('cart'); // 'cart' -> 'form' -> 'success'
  const [formData, setFormData] = useState({
    customerName: '',
    whatsappNumber: '',
    deliveryAddress: '',
    deliveryDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const ticketRef = useRef(null);

  // Calculate items subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10) || 0;
    return acc + numericPrice * item.quantity;
  }, 0);

  const formatNaira = (amount) => '₦' + amount.toLocaleString();

  // Handle form field changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Order to Backend & Generate Ticket
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.whatsappNumber || !formData.deliveryAddress || !formData.deliveryDate) {
      setErrorMessage('Please fill in all delivery details.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // 1. Send order data to Node.js backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
          subtotal
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to submit order');
      }

      // 2. Generate and download the Ticket Image with TBD delivery
      if (ticketRef.current) {
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });

        const imageURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = `Pomona-Order-Ticket-${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }

      // 3. Move to success view
      setStep('success');
    } catch (error) {
      console.error('Order submission error:', error);
      setErrorMessage('Could not connect to server. Make sure your backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="cart-header">
          <h2>
            {step === 'cart' && 'Your Cart & Order Ticket'}
            {step === 'form' && 'Delivery Information'}
            {step === 'success' && 'Order Successful! 🎉'}
          </h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* STEP 1: CART ITEMS & SUMMARY */}
        {step === 'cart' && (
          <div className="cart-body">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty.</p>
                <span>Add some fresh juice to get started!</span>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <span className="cart-item-price">{item.price}</span>
                    </div>
                    <div className="cart-item-controls">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-item-btn" onClick={() => onRemoveItem(item.id)}>&times;</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: DELIVERY DETAILS FORM */}
        {step === 'form' && (
          <div className="cart-body">
            <form onSubmit={handleOrderSubmit} className="order-form">
              <p className="form-instruction">Please provide your details so we can calculate your delivery fee and finalise your order.</p>
              
              {errorMessage && <div className="form-error-msg">{errorMessage}</div>}

              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="customerName" 
                  placeholder="e.g., Tolu Adebayo" 
                  value={formData.customerName} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Phone Number</label>
                <input 
                  type="tel" 
                  name="whatsappNumber" 
                  placeholder="e.g., 08012345678" 
                  value={formData.whatsappNumber} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Delivery Address</label>
                <textarea 
                  name="deliveryAddress" 
                  placeholder="Enter your street address & landmark" 
                  value={formData.deliveryAddress} 
                  onChange={handleInputChange} 
                  rows="3"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Preferred Delivery Date</label>
                <input 
                  type="date" 
                  name="deliveryDate" 
                  value={formData.deliveryDate} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="form-actions-inline">
                <button type="button" className="back-btn" onClick={() => setStep('cart')}>Back to Cart</button>
                <button type="submit" className="whatsapp-ticket-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting Order...' : 'Generate Order Ticket'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS SCREEN */}
        {step === 'success' && (
          <div className="cart-body success-body">
            <div className="success-icon-box">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Order Successfully Generated!</h3>
            <p className="success-notice">
              Your ticket has been saved to your gallery/downloads. Our team will review your delivery address and message you on WhatsApp (<strong>{formData.whatsappNumber}</strong>) shortly with your final delivery quote and payment details!
            </p>
            <button className="whatsapp-ticket-btn" onClick={() => { setStep('cart'); onClose(); }}>
              Done & Close
            </button>
          </div>
        )}

        {/* FOOTER ACTION FOR CART STEP */}
        {step === 'cart' && cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className="tbd-text">Calculated at checkout</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Due</span>
                <span>To be decided</span>
              </div>
            </div>

            <button className="whatsapp-ticket-btn" onClick={() => setStep('form')}>
              <span>Proceed to Checkout</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}

      </div>

      {/* Hidden Styled Ticket Capture Area (Reflects Delivery: To be decided) */}
      <div className="ticket-export-container" style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -1 }}>
        <div ref={ticketRef} className="downloadable-ticket-card">
          
          <div className="ticket-brand-header">
            <h3>POMONA JUICE</h3>
            <span>PENDING ORDER TICKET</span>
          </div>

          <div className="ticket-meta-info">
            <p><strong>Customer:</strong> {formData.customerName || 'Guest'}</p>
            <p><strong>Date:</strong> {formData.deliveryDate || new Date().toLocaleDateString()}</p>
          </div>

          <div className="ticket-divider-line"></div>

          <div className="ticket-items-preview">
            {cartItems.map((item, idx) => (
              <div key={idx} className="ticket-item-row">
                <span className="ticket-item-name">{item.quantity}x {item.name}</span>
                <span className="ticket-item-price">
                  {formatNaira((parseInt(item.price.replace(/[^\d]/g, ''), 10) || 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="ticket-divider-line"></div>

          <div className="ticket-calc-row">
            <span>Subtotal</span>
            <span>{formatNaira(subtotal)}</span>
          </div>
          <div className="ticket-calc-row">
            <span>Delivery Fee</span>
            <span style={{ color: '#e67e22', fontWeight: 700 }}>To be decided (TBD)</span>
          </div>
          <div className="ticket-calc-row total">
            <span>Total Amount</span>
            <span style={{ color: '#e67e22' }}>To be confirmed</span>
          </div>

          <div className="ticket-footer-note">
            <p><strong>Delivery Address:</strong> {formData.deliveryAddress || 'Pending location'}</p>
            <p style={{ marginTop: '6px' }}><em>Our team will message your WhatsApp with your delivery quote!</em></p>
            <p className="footer-tag">cool people drink pomona...</p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default CartDrawer;