const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User'); 

// ==========================================
// 1. GET MY ORDERS (For Regular Users) 👤
// ==========================================
// This route MUST come before the Admin route '/'
router.get('/myorders', auth, async (req, res) => {
  try {
    // Find orders where the 'user' field matches the logged-in ID
    const orders = await Order.find({ user: req.user.id })
      .populate('recipe', 'title image') // Get food details
      .sort({ date: -1 }); // Newest first

    res.json(orders);
  } catch (err) {
    console.error("Error fetching my orders:", err);
    res.status(500).send('Server Error');
  }
});

// ==========================================
// 2. GET ALL ORDERS (For Admin Only) 👮‍♂️
// ==========================================
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const orders = await Order.find()
      .sort({ date: -1 }) 
      .populate('user', 'name email')
      .populate('recipe', 'title image');

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ==========================================
// 3. CREATE NEW ORDER 🛒
// ==========================================
router.post('/', auth, async (req, res) => {
  try {
    const newOrder = new Order({
      user: req.user.id,
      recipe: req.body.recipeId, 
      status: 'Ordered'
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ==========================================
// 4. UPDATE ORDER STATUS ✏️
// ==========================================
router.put('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;