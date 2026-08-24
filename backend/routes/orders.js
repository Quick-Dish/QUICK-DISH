const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// 1. GET MY ORDERS (User order history)
router.get('/myorders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('recipe')
      .sort({ date: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// 2. GET ALL ORDERS (Admin dashboard)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('recipe')
      .sort({ date: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// 3. CREATE NEW ORDER
router.post('/', auth, async (req, res) => {
  try {
    const { recipeId, quantity, shippingAddress, totalPrice } = req.body;
    
    let calculatedTotal = totalPrice;
    if (!calculatedTotal) {
      const Recipe = require('../models/Recipe');
      const recipeObj = await Recipe.findById(recipeId);
      const unitPrice = recipeObj ? (recipeObj.price || 15.99) : 15.99;
      calculatedTotal = (unitPrice * (quantity || 1)) + 4.99;
    }

    const newOrder = new Order({
      user: req.user.id,
      recipe: recipeId,
      quantity: quantity || 1,
      shippingAddress: shippingAddress || {},
      totalPrice: calculatedTotal,
      status: 'Ordered'
    });

    const savedOrder = await newOrder.save();
    const populated = await Order.findById(savedOrder._id).populate('recipe');
    res.status(201).json(populated);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// 4. UPDATE ORDER STATUS (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    if (req.body.status) {
      order.status = req.body.status;
    }
    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
