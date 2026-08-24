const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  status: {
    type: String,
    enum: ['Ordered', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Ordered'
  },
  shippingAddress: {
    street: String,
    city: String,
    zipCode: String
  },
  quantity: {
    type: Number,
    default: 1
  },
  totalPrice: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
