import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import './AdminDashboard.css';

// Dynamic API base URL for local development vs production (Render)
const API_URL = import.meta.env.VITE_API_URL || '';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'subscribers'
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryFeeInput, setDeliveryFeeInput] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const finalTicketRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('pomona_admin_auth', 'true');
        fetchOrders();
        fetchSubscribers();
      } else {
        setAuthError(data.message || 'Incorrect passcode. Access denied.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('Server error. Make sure backend is running.');
    }
  };

  // Check persisted auth on mount
  useEffect(() => {
    if (localStorage.getItem('pomona_admin_auth') === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
      fetchSubscribers();
    }
  }, []);

  // Fetch orders from Node.js backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscribers from Node.js backend
  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/subscribers`);
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    }
  };

  const formatNaira = (amount) => '₦' + Number(amount).toLocaleString();

  // Handle setting delivery fee & updating database
  const handleUpdateDeliveryFee = async (orderId) => {
    if (!deliveryFeeInput || isNaN(deliveryFeeInput)) {
      alert('Please enter a valid numeric delivery fee.');
      return;
    }

    setUpdatingId(orderId);
    const order = orders.find(o => o._id === orderId);
    const subtotal = order.subtotal;
    const deliveryFeeNum = parseInt(deliveryFeeInput, 10);
    const totalAmountNum = subtotal + deliveryFeeNum;
    const totalFormatted = formatNaira(totalAmountNum);

    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/delivery-quote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryFee: formatNaira(deliveryFeeNum),
          totalAmount: totalFormatted
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? data.order : o));
        setSelectedOrder(data.order);
        alert('Delivery fee added & order quote updated successfully!');
      }
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Generate final ticket image & open WhatsApp with short accompanying message
  const handleSendWhatsAppQuote = async (order) => {
    setSelectedOrder(order);
    
    // Allow React a split second to render the final ticket reference DOM element
    setTimeout(async () => {
      if (!finalTicketRef.current) return;

      try {
        const canvas = await html2canvas(finalTicketRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });

        const imageURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = `Pomona-Final-Invoice-${order.customerName}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Short, clean WhatsApp text accompanying the downloaded ticket image
        let message = `Hello, ${order.customerName}! Here is your official Pomona Juice final order ticket and delivery quote. Please find the ticket image attached above! `;

        const encodedMessage = encodeURIComponent(message);
        const cleanPhone = order.whatsappNumber.startsWith('0') ? '234' + order.whatsappNumber.slice(1) : order.whatsappNumber;

        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
      } catch (err) {
        console.error('Error generating final ticket image:', err);
      }
    }, 400);
  };

  // If not authenticated, show passcode screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login-overlay">
        <div className="admin-login-card">
          <h2>Pomona Admin Portal</h2>
          <p>Enter your secret passcode to access order management.</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter Admin Passcode" 
              value={passcode} 
              onChange={(e) => setPasscode(e.target.value)} 
              required
            />
            {authError && <span className="error-text">{authError}</span>}
            <button type="submit" className="admin-login-btn">Access Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-brand">
          <h1>Pomona Admin Dashboard</h1>
          <span>Manage customer orders & newsletter subscribers</span>
        </div>
        <button className="logout-btn" onClick={() => { setIsAuthenticated(false); localStorage.removeItem('pomona_admin_auth'); }}>
          Lock Dashboard
        </button>
      </header>

      <div className="admin-content">
        {/* Admin Navigation Tabs */}
        <div className="admin-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button 
            style={{ 
              padding: '10px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              background: activeTab === 'orders' ? '#7c5cfc' : 'var(--bg-card, #ede6ff)', 
              color: activeTab === 'orders' ? '#fff' : 'var(--text-primary, #3e3259)', 
              border: '1px solid var(--border-color)', 
              fontWeight: 'bold' 
            }}
            onClick={() => { setActiveTab('orders'); fetchOrders(); }}
          >
            📦 Orders ({orders.length})
          </button>
          <button 
            style={{ 
              padding: '10px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              background: activeTab === 'subscribers' ? '#7c5cfc' : 'var(--bg-card, #ede6ff)', 
              color: activeTab === 'subscribers' ? '#fff' : 'var(--text-primary, #3e3259)', 
              border: '1px solid var(--border-color)', 
              fontWeight: 'bold' 
            }}
            onClick={() => { setActiveTab('subscribers'); fetchSubscribers(); }}
          >
            ✉️ Newsletter Subscribers ({subscribers.length})
          </button>
        </div>

        {/* Tab Content: Subscribers */}
        {activeTab === 'subscribers' ? (
          <div className="subscribers-table-card" style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Newsletter Subscribers List</h3>
              <button className="refresh-btn" onClick={fetchSubscribers}>🔄 Refresh List</button>
            </div>
            {subscribers.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No subscribers signed up yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-primary)' }}>
                      <th style={{ padding: '12px' }}>#</th>
                      <th style={{ padding: '12px' }}>Email Address</th>
                      <th style={{ padding: '12px' }}>Date Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, idx) => (
                      <tr key={sub._id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <td style={{ padding: '12px' }}>{idx + 1}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{sub.email}</td>
                        <td style={{ padding: '12px' }}>{new Date(sub.subscribedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Tab Content: Orders */
          <div>
            <div className="orders-toolbar">
              <h2>Incoming Orders ({orders.length})</h2>
              <button className="refresh-btn" onClick={fetchOrders}>🔄 Refresh Orders</button>
            </div>

            {loading ? (
              <p className="loading-text">Loading orders from database...</p>
            ) : orders.length === 0 ? (
              <div className="no-orders-box">
                <p>No orders received yet. Waiting for customer submissions!</p>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map((order) => (
                  <div className="order-card" key={order._id}>
                    <div className="order-card-header">
                      <span className="customer-name">{order.customerName}</span>
                      <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-meta-details">
                      <p><strong>WhatsApp:</strong> <a href={`https://wa.me/${order.whatsappNumber}`} target="_blank" rel="noreferrer">{order.whatsappNumber}</a></p>
                      <p><strong>Address:</strong> {order.deliveryAddress}</p>
                      <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
                      <p><strong>Date Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="order-items-summary">
                      <h4>Items Ordered:</h4>
                      <ul>
                        {order.items.map((it, idx) => (
                          <li key={idx}>{it.quantity}x {it.name} ({it.price})</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pricing-box">
                      <div className="price-row">
                        <span>Subtotal:</span>
                        <span>{formatNaira(order.subtotal)}</span>
                      </div>
                      <div className="price-row">
                        <span>Delivery Fee:</span>
                        <strong style={{ color: order.deliveryFee === 'TBD' ? '#e67e22' : '#7c5cfc' }}>
                          {order.deliveryFee}
                        </strong>
                      </div>
                      <div className="price-row total">
                        <span>Total:</span>
                        <span>{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Admin Action Section */}
                    <div className="admin-action-box">
                      {order.deliveryFee === 'TBD' ? (
                        <div className="quote-input-group">
                          <input 
                            type="number" 
                            placeholder="Enter delivery fee (e.g. 2000)" 
                            onChange={(e) => setDeliveryFeeInput(e.target.value)}
                          />
                          <button 
                            onClick={() => handleUpdateDeliveryFee(order._id)}
                            disabled={updatingId === order._id}
                          >
                            {updatingId === order._id ? 'Saving...' : 'Set Fee & Save'}
                          </button>
                        </div>
                      ) : (
                        <button className="whatsapp-send-quote-btn" onClick={() => handleSendWhatsAppQuote(order)}>
                          Download Final Ticket & Message WhatsApp
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden Final Ticket Container for Admin to download and send */}
      {selectedOrder && (
        <div style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -1 }}>
          <div ref={finalTicketRef} className="downloadable-ticket-card">
            <div className="ticket-brand-header">
              <h3>POMONA JUICE</h3>
              <span>FINAL CONFIRMED INVOICE</span>
            </div>
            <div className="ticket-meta-info">
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Date:</strong> {selectedOrder.deliveryDate}</p>
            </div>
            <div className="ticket-divider-line"></div>
            <div className="ticket-items-preview">
              {selectedOrder.items.map((item, idx) => (
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
              <span>{formatNaira(selectedOrder.subtotal)}</span>
            </div>
            <div className="ticket-calc-row">
              <span>Delivery Fee</span>
              <span>{selectedOrder.deliveryFee}</span>
            </div>
            <div className="ticket-calc-row total">
              <span>Total Amount</span>
              <span style={{ color: '#7c5cfc' }}>{selectedOrder.totalAmount}</span>
            </div>
            <div className="ticket-footer-note">
              <p><strong>Bank Transfer:</strong> OPay / 7033403644</p>
              <p><strong>Account Name:</strong> Pomona Juice Nigeria</p>
              <p className="footer-tag">cool people drink pomona...</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;