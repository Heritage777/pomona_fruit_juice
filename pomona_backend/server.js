// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Your Vite dev server
  credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ------------------------------------
// API ROUTES
// ------------------------------------

// 1. Customer Endpoint: Submit New Order (Pending Delivery Fee)
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, whatsappNumber, deliveryAddress, deliveryDate, items, subtotal } = req.body;

    if (!customerName || !whatsappNumber || !deliveryAddress || !deliveryDate || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide all required order details.' });
    }

    const newOrder = new Order({
      customerName,
      whatsappNumber,
      deliveryAddress,
      deliveryDate,
      items,
      subtotal,
      deliveryFee: 'TBD',
      totalAmount: 'To be confirmed via WhatsApp',
      status: 'Pending Delivery Quote'
    });

    const savedOrder = await newOrder.save();

    // TODO: We will hook up our instant notification trigger (e.g. WhatsApp alert to Admin) right here!

    return res.status(201).json({
      success: true,
      message: 'Order submitted successfully! Our team will contact you shortly.',
      order: savedOrder
    });

  } catch (error) {
    console.error('Error submitting order:', error);
    return res.status(500).json({ success: false, message: 'Server error placing order.' });
  }
});

// 2. Admin Endpoint: Fetch All Orders
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
});

// 3. Admin Endpoint: Add Custom Delivery Fee & Update Order
app.patch('/api/admin/orders/:id/delivery-quote', async (req, res) => {
  try {
    const { deliveryFee, totalAmount } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        deliveryFee,
        totalAmount,
        status: 'Quote Sent'
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Delivery fee updated successfully!',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating delivery quote:', error);
    return res.status(500).json({ success: false, message: 'Failed to update order.' });
  }
});


// Admin Login / Authentication Route
app.post('/api/admin/login', (req, res) => {
  const { passcode } = req.body;
  const adminSecret = process.env.ADMIN_PASSCODE || 'iyaalaje1';

  if (passcode === adminSecret) {
    return res.status(200).json({
      success: true,
      message: 'Access granted!'
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Incorrect passcode. Access denied.'
    });
  }
});



const Subscriber = require('./models/Subscriber');

// POST /api/newsletter/subscribe - Public endpoint to subscribe
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You are already subscribed to our newsletter!' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ success: true, message: 'Thank you for subscribing to Pomona!' });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET /api/admin/subscribers - Admin endpoint to fetch subscriber list
app.get('/api/admin/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.status(200).json({ success: true, subscribers });
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve subscribers.' });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Pomona Backend Server running on http://localhost:${PORT}`);
});