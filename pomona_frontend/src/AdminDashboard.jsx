import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import './AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryFeeInput, setDeliveryFeeInput] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const finalTicketRef = useRef(null);

  // ------------------------------------
  // ADMIN LOGIN
  // ------------------------------------

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

  // ------------------------------------
  // CHECK SAVED LOGIN
  // ------------------------------------

  useEffect(() => {
    if (localStorage.getItem('pomona_admin_auth') === 'true') {
      setIsAuthenticated(true);
      fetchOrders();
      fetchSubscribers();
    }
  }, []);

  // ------------------------------------
  // FETCH ORDERS
  // ------------------------------------

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

  // ------------------------------------
  // DELETE ORDER
  // ------------------------------------

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this order? This action cannot be undone.'
    );

    if (!confirmed) return;

    setDeletingId(orderId);

    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete order.');
      }

      setOrders(currentOrders =>
        currentOrders.filter(order => order._id !== orderId)
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(null);
      }

      alert('Order deleted successfully.');

    } catch (err) {
      console.error('Error deleting order:', err);
      alert(err.message || 'Could not delete the order. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // ------------------------------------
  // FETCH SUBSCRIBERS
  // ------------------------------------

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

  const formatNaira = (amount) =>
    '₦' + Number(amount).toLocaleString();

  // ------------------------------------
  // FORMAT WHATSAPP NUMBER
  // ------------------------------------

  const getWhatsAppNumber = (phone) => {
    let number = String(phone || '').replace(/\D/g, '');

    if (number.startsWith('0')) {
      number = '234' + number.slice(1);
    }

    return number;
  };

  // ------------------------------------
  // UPDATE DELIVERY FEE
  // ------------------------------------

  const handleUpdateDeliveryFee = async (orderId) => {
    if (!deliveryFeeInput || isNaN(deliveryFeeInput)) {
      alert('Please enter a valid numeric delivery fee.');
      return;
    }

    const order = orders.find(o => o._id === orderId);

    if (!order) {
      alert('Order not found.');
      return;
    }

    setUpdatingId(orderId);

    const subtotal = Number(order.subtotal);
    const deliveryFeeNum = parseInt(deliveryFeeInput, 10);
    const totalAmountNum = subtotal + deliveryFeeNum;

    try {
      const res = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/delivery-quote`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deliveryFee: formatNaira(deliveryFeeNum),
            totalAmount: formatNaira(totalAmountNum)
          })
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update delivery fee.');
      }

      setOrders(currentOrders =>
        currentOrders.map(o => o._id === orderId ? data.order : o)
      );

      setSelectedOrder(data.order);
      setDeliveryFeeInput('');

      alert('Delivery fee added & order quote updated successfully!');

    } catch (err) {
      console.error('Error updating order:', err);
      alert(err.message || 'Could not update the delivery fee.');
    } finally {
      setUpdatingId(null);
    }
  };

  // ------------------------------------
  // SEND WHATSAPP QUOTE
  // ------------------------------------

  const handleSendWhatsAppQuote = async (order) => {
    setSelectedOrder(order);

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
        downloadLink.download =
          `Pomona-Final-Invoice-${order.customerName}.png`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        const message =
          `Hello, ${order.customerName}! Here is your official Pomona Juice final order ticket and delivery quote. Please find the ticket image attached above!`;

        const encodedMessage = encodeURIComponent(message);
        const cleanPhone = getWhatsAppNumber(order.whatsappNumber);

        window.open(
          `https://wa.me/${cleanPhone}?text=${encodedMessage}`,
          '_blank'
        );

      } catch (err) {
        console.error('Error generating final ticket image:', err);
        alert('Could not generate the final ticket. Please try again.');
      }
    }, 400);
  };

  // ------------------------------------
  // LOGIN SCREEN
  // ------------------------------------

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

            {authError && (
              <span className="error-text">{authError}</span>
            )}

            <button type="submit" className="admin-login-btn">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ------------------------------------
  // MAIN DASHBOARD
  // ------------------------------------

  return (
    <div className="admin-dashboard">

      <header className="admin-header">
        <div className="admin-brand">
          <h1>Pomona Admin Dashboard</h1>
          <span>Manage customer orders & newsletter subscribers</span>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            setIsAuthenticated(false);
            localStorage.removeItem('pomona_admin_auth');
          }}
        >
          Lock Dashboard
        </button>
      </header>

      <div className="admin-content">

        {/* ADMIN TABS */}

        <div
          className="admin-tabs"
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}
        >
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: activeTab === 'orders'
                ? '#7c5cfc'
                : 'var(--bg-card, #ede6ff)',
              color: activeTab === 'orders'
                ? '#fff'
                : 'var(--text-primary, #3e3259)',
              border: '1px solid var(--border-color)',
              fontWeight: 'bold'
            }}
            onClick={() => {
              setActiveTab('orders');
              fetchOrders();
            }}
          >
            📦 Orders ({orders.length})
          </button>

          <button
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: activeTab === 'subscribers'
                ? '#7c5cfc'
                : 'var(--bg-card, #ede6ff)',
              color: activeTab === 'subscribers'
                ? '#fff'
                : 'var(--text-primary, #3e3259)',
              border: '1px solid var(--border-color)',
              fontWeight: 'bold'
            }}
            onClick={() => {
              setActiveTab('subscribers');
              fetchSubscribers();
            }}
          >
            ✉️ Newsletter Subscribers ({subscribers.length})
          </button>
        </div>

        {/* SUBSCRIBERS TAB */}

        {activeTab === 'subscribers' ? (

          <div
            className="subscribers-table-card"
            style={{
              background: 'var(--bg-card)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <h3 style={{ margin: 0 }}>
                Newsletter Subscribers List
              </h3>

              <button
                className="refresh-btn"
                onClick={fetchSubscribers}
              >
                🔄 Refresh List
              </button>
            </div>

            {subscribers.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>
                No subscribers signed up yet.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    borderCollapse: 'collapse'
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: '2px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <th style={{ padding: '12px' }}>#</th>
                      <th style={{ padding: '12px' }}>Email Address</th>
                      <th style={{ padding: '12px' }}>Date Subscribed</th>
                    </tr>
                  </thead>

                  <tbody>
                    {subscribers.map((sub, idx) => (
                      <tr
                        key={sub._id}
                        style={{
                          borderBottom: '1px solid var(--border-color)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <td style={{ padding: '12px' }}>{idx + 1}</td>

                        <td
                          style={{
                            padding: '12px',
                            fontWeight: 'bold',
                            color: 'var(--text-primary)'
                          }}
                        >
                          {sub.email}
                        </td>

                        <td style={{ padding: '12px' }}>
                          {new Date(sub.subscribedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        ) : (

          /* ORDERS TAB */

          <div>
            <div className="orders-toolbar">
              <h2>Incoming Orders ({orders.length})</h2>

              <button
                className="refresh-btn"
                onClick={fetchOrders}
              >
                🔄 Refresh Orders
              </button>
            </div>

            {loading ? (
              <p className="loading-text">
                Loading orders from database...
              </p>
            ) : orders.length === 0 ? (
              <div className="no-orders-box">
                <p>
                  No orders received yet. Waiting for customer submissions!
                </p>
              </div>
            ) : (

              <div className="orders-grid">

                {orders.map((order) => (

                  <div className="order-card" key={order._id}>

                    <div className="order-card-header">
                      <span className="customer-name">
                        {order.customerName}
                      </span>

                      <span
                        className={`status-badge ${
                          (order.status || 'Pending')
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                        }`}
                      >
                        {order.status || 'Pending'}
                      </span>
                    </div>

                    {/* CUSTOMER DETAILS */}

                    <div className="order-meta-details">

                      <p>
                        <strong>WhatsApp:</strong>{' '}

                        <a
                          href={`https://wa.me/${getWhatsAppNumber(order.whatsappNumber)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#25D366',
                            fontWeight: 'bold',
                            textDecoration: 'none'
                          }}
                        >
                          {order.whatsappNumber}
                        </a>
                      </p>

                      <p>
                        <strong>Address:</strong> {order.deliveryAddress}
                      </p>

                      <p>
                        <strong>Delivery Date:</strong> {order.deliveryDate}
                      </p>

                      <p>
                        <strong>Date Placed:</strong>{' '}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>

                      <a
                        href={`https://wa.me/${getWhatsAppNumber(order.whatsappNumber)}?text=${encodeURIComponent(
                          `Hello ${order.customerName}, thank you for placing an order with Pomona Juice! We have received your order and will contact you shortly regarding your delivery.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-send-quote-btn"
                        style={{
                          display: 'inline-block',
                          marginTop: '10px',
                          padding: '10px 16px',
                          backgroundColor: '#25D366',
                          color: '#ffffff',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}
                      >
                        Message Customer on WhatsApp
                      </a>

                    </div>

                    {/* ITEMS ORDERED */}

                    <div className="order-items-summary">
                      <h4>Items Ordered:</h4>

                      <ul>
                        {(order.items || []).map((it, idx) => (
                          <li key={idx}>
                            {it.quantity}x {it.name} ({it.price})
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* PRICING */}

                    <div className="pricing-box">

                      <div className="price-row">
                        <span>Subtotal:</span>
                        <span>{formatNaira(order.subtotal)}</span>
                      </div>

                      <div className="price-row">
                        <span>Delivery Fee:</span>

                        <strong
                          style={{
                            color: order.deliveryFee === 'TBD'
                              ? '#e67e22'
                              : '#7c5cfc'
                          }}
                        >
                          {order.deliveryFee}
                        </strong>
                      </div>

                      <div className="price-row total">
                        <span>Total:</span>
                        <span>{order.totalAmount}</span>
                      </div>

                    </div>

                    {/* ADMIN ACTIONS */}

                    <div className="admin-action-box">

                      {order.deliveryFee === 'TBD' ? (

                        <div className="quote-input-group">

                          <input
                            type="number"
                            placeholder="Enter delivery fee (e.g. 2000)"
                            value={deliveryFeeInput}
                            onChange={(e) =>
                              setDeliveryFeeInput(e.target.value)
                            }
                          />

                          <button
                            onClick={() =>
                              handleUpdateDeliveryFee(order._id)
                            }
                            disabled={updatingId === order._id}
                          >
                            {updatingId === order._id
                              ? 'Saving...'
                              : 'Set Fee & Save'}
                          </button>

                        </div>

                      ) : (

                        <button
                          className="whatsapp-send-quote-btn"
                          onClick={() => handleSendWhatsAppQuote(order)}
                        >
                          Download Final Ticket & Message WhatsApp
                        </button>

                      )}

                      {/* DELETE BUTTON */}

                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order._id)}
                        disabled={deletingId === order._id}
                        style={{
                          display: 'block',
                          width: '100%',
                          marginTop: '14px',
                          padding: '11px 16px',
                          backgroundColor:
                            deletingId === order._id ? '#9ca3af' : '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          cursor:
                            deletingId === order._id
                              ? 'not-allowed'
                              : 'pointer',
                          opacity: deletingId === order._id ? 0.75 : 1
                        }}
                      >
                        {deletingId === order._id
                          ? 'Deleting Order...'
                          : '🗑 Delete Order'}
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}
          </div>
        )}

      </div>

      {/* HIDDEN FINAL TICKET */}

      {selectedOrder && (

        <div
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '0',
            zIndex: -1
          }}
        >

          <div
            ref={finalTicketRef}
            className="downloadable-ticket-card"
          >

            <div className="ticket-brand-header">
              <h3>POMONA JUICE</h3>
              <span>FINAL CONFIRMED INVOICE</span>
            </div>

            <div className="ticket-meta-info">
              <p>
                <strong>Customer:</strong> {selectedOrder.customerName}
              </p>

              <p>
                <strong>Date:</strong> {selectedOrder.deliveryDate}
              </p>
            </div>

            <div className="ticket-divider-line"></div>

            <div className="ticket-items-preview">

              {selectedOrder.items.map((item, idx) => (

                <div key={idx} className="ticket-item-row">

                  <span className="ticket-item-name">
                    {item.quantity}x {item.name}
                  </span>

                  <span className="ticket-item-price">
                    {formatNaira(
                      (parseInt(
                        String(item.price).replace(/[^\d]/g, ''),
                        10
                      ) || 0) * item.quantity
                    )}
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

              <span style={{ color: '#7c5cfc' }}>
                {selectedOrder.totalAmount}
              </span>
            </div>

            <div className="ticket-footer-note">
              <p>
                <strong>Bank Transfer:</strong> OPay / 7033403644
              </p>

              <p>
                <strong>Account Name:</strong> Pomona Juice Nigeria
              </p>

              <p className="footer-tag">
                cool people drink pomona...
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;