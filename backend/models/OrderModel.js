const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'Ordered' }, 
  totalPrice: { type: Number, default: 15 } 
});

module.exports = mongoose.model('Order', OrderSchema);