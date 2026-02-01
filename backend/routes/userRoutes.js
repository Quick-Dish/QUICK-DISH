const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- 1. REGISTER ---
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();

    const payload = { user: { id: user.id, name: user.name } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- 2. LOGIN ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    // Add isAdmin to the payload
    const payload = { user: { id: user.id, name: user.name, isAdmin: user.isAdmin } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- 3. GET USER DETAILS ---
router.get('/:id', async (req, res) => {
  try {
    // We MUST populate 'favorites' to see the Title and Image on the profile
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('favorites'); 

    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
    res.status(500).send('Server error');
  }
});


// --- 4. TOGGLE FAVORITES (Add or Remove) ---
router.put('/favorites/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { recipeId } = req.body;

    // Check if recipe is already in favorites
    const index = user.favorites.indexOf(recipeId);

    if (index === -1) {
      // Not found? ADD it
      user.favorites.push(recipeId);
    } else {
      // Found? REMOVE it
      user.favorites.splice(index, 1);
    }
    
    await user.save();
    res.json(user.favorites); // Send back the updated list
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;