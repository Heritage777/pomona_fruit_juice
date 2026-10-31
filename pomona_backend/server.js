
// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Order = require('./models/Order');
const Subscriber = require('./models/Subscriber');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------
// MIDDLEWARE
// ------------------------------------

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://pomona-fruit-juice.onrender.com'
  ],
  credentials: true
}));

app.use(express.json());

// ------------------------------------
// EMAIL NOTIFICATION CONFIGURATION
// ------------------------------------

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Prevent an unresponsive mail connection from
  // remaining open indefinitely.
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000
});

// ------------------------------------
// HELPER: SEND NEW ORDER NOTIFICATION
// ------------------------------------

async function sendOrderNotification(order) {
  const itemsList = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        ${item.name}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        ${item.quantity}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        ${item.price}
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Pomona Juice" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Pomona Order - ${order.customerName}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        color: #333;
        line-height: 1.6;
      ">

        <div style="
          background: #7c5cfc;
          color: white;
          padding: 20px;
          border-radius: 8px 8px 0 0;
        ">
          <h2 style="margin: 0;">Pomona Juice</h2>
          <p style="margin: 5px 0 0;">
            New Order Notification
          </p>
        </div>

        <div style="
          padding: 20px;
          border: 1px solid #eee;
          border-radius: 0 0 8px 8px;
        ">

          <h3>A new order has been received!</h3>

          <p>
            A customer has submitted an order through the Pomona Juice website.
          </p>

          <h3>Customer Details</h3>

          <p>
            <strong>Name:</strong> ${order.customerName}
          </p>

          <p>
            <strong>WhatsApp Number:</strong> ${order.whatsappNumber}
          </p>

          <p>
            <strong>Delivery Address:</strong> ${order.deliveryAddress}
          </p>

          <p>
            <strong>Delivery Date:</strong> ${order.deliveryDate}
          </p>

          <h3>Order Details</h3>

          <table style="
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          ">
            <thead>
              <tr style="background: #f5f2ff;">
                <th style="padding: 8px;">Item</th>
                <th style="padding: 8px;">Quantity</th>
                <th style="padding: 8px;">Price</th>
              </tr>
            </thead>

            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <p>
            <strong>Subtotal:</strong>
            ₦${Number(order.subtotal).toLocaleString()}
          </p>

          <p>
            <strong>Delivery Fee:</strong>
            To be confirmed
          </p>

          <p>
            <strong>Status:</strong>
            ${order.status}
          </p>

          <hr />

          <p>
            Please log in to the Pomona Admin Dashboard to manage this order.
          </p>

        </div>
      </div>
    `
  };

  await emailTransporter.sendMail(mailOptions);
}

// ------------------------------------
// HELPER: SEND EMAIL IN BACKGROUND
// ------------------------------------

function sendOrderNotificationInBackground(order) {
  sendOrderNotification(order)
    .then(() => {
      console.log('✅ New order notification email sent!');
    })
    .catch((emailError) => {
      console.error(
        '❌ Failed to send order notification:',
        emailError
      );
    });
}

// ------------------------------------
// 1. CUSTOMER: SUBMIT NEW ORDER
// ------------------------------------

app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerName,
      whatsappNumber,
      deliveryAddress,
      deliveryDate,
      items,
      subtotal
    } = req.body;

    if (
      !customerName ||
      !whatsappNumber ||
      !deliveryAddress ||
      !deliveryDate ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required order details.'
      });
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

    // Save the order to MongoDB first.
    const savedOrder = await newOrder.save();

    // Start email notification independently.
    // The customer does NOT wait for Gmail.
    sendOrderNotificationInBackground(savedOrder);

    // Respond immediately after the order is saved.
    return res.status(201).json({
      success: true,
      message: 'Order submitted successfully! Our team will contact you shortly.',
      order: savedOrder
    });

  } catch (error) {
    console.error('Error submitting order:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error placing order.'
    });
  }
});

// ------------------------------------
// 2. ADMIN: FETCH ALL ORDERS
// ------------------------------------

app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders.'
    });
  }
});



// ------------------------------------
// ADMIN: DELETE AN ORDER
// ------------------------------------

app.delete('/api/admin/orders/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID.'
      });
    }

    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully!'
    });

  } catch (error) {
    console.error('Error deleting order:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete order.'
    });
  }
});

// ------------------------------------
// 3. ADMIN: UPDATE DELIVERY QUOTE
// ------------------------------------

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
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Delivery fee updated successfully!',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating delivery quote:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update order.'
    });
  }
});

// ------------------------------------
// 4. ADMIN LOGIN
// ------------------------------------

app.post('/api/admin/login', (req, res) => {
  const { passcode } = req.body;
  const adminSecret = process.env.ADMIN_PASSCODE || 'iyaalaje1';

  if (passcode === adminSecret) {
    return res.status(200).json({
      success: true,
      message: 'Access granted!'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Incorrect passcode. Access denied.'
  });
});

// ------------------------------------
// 5. NEWSLETTER: SUBSCRIBE
// ------------------------------------

app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await Subscriber.findOne({
      email: normalizedEmail
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already subscribed to our newsletter!'
      });
    }

    const newSubscriber = new Subscriber({
      email: normalizedEmail
    });

    await newSubscriber.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to Pomona!'
    });

  } catch (error) {
    console.error('Newsletter error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// ------------------------------------
// 6. ADMIN: FETCH SUBSCRIBERS
// ------------------------------------

app.get('/api/admin/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({
      subscribedAt: -1
    });

    return res.status(200).json({
      success: true,
      subscribers
    });

  } catch (error) {
    console.error('Fetch subscribers error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscribers.'
    });
  }
});

// ------------------------------------
// DATABASE CONNECTION & START SERVER
// ------------------------------------

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');

    app.listen(PORT, () => {
      console.log(
        `🚀 Pomona Backend Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error);
  });
