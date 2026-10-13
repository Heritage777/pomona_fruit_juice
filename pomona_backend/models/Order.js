// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  whatsappNumber: {
    type: String,
    required: true,
    trim: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  deliveryDate: {
    type: String,
    required: true
  },
  items: [
    {
      id: Number,
      name: String,
      quantity: Number,
      price: String,
      description: String
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: String,
    default: 'TBD' // "To Be Determined" until admin adds fee
  },
  totalAmount: {
    type: String,
    default: 'To be confirmed via WhatsApp'
  },
  status: {
    type: String,
    enum: ['Pending Delivery Quote', 'Quote Sent', 'Paid & Confirmed', 'Delivered', 'Cancelled'],
    default: 'Pending Delivery Quote'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);