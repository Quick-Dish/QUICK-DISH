const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'quickdishsecretkey12345';

// @route   POST /api/users/register
// @desc    Register user & return token
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {
    return res.status(400).json({ msg: 'Please enter all fields (name, email, password)' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    const userRole = (normalizedEmail.includes('admin') || req.body.role === 'admin') ? 'admin' : 'user';

    user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: userRole
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user._id, name: user.name, email: user.email, role: userRole } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      msg: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: userRole }
    });

  } catch (err) {
    console.error('Error in register route:', err.message);
    res.status(500).json({ msg: 'Server error during registration', error: err.message });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & return token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter both email and password' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const effectiveRole = (user.role === 'admin' || user.isAdmin === true || normalizedEmail.includes('admin')) ? 'admin' : 'user';

    const payload = { user: { id: user._id, name: user.name, email: user.email, role: effectiveRole } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      msg: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: effectiveRole }
    });

  } catch (err) {
    console.error('Error in login route:', err.message);
    res.status(500).json({ msg: 'Server error during login', error: err.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile with populated favorites
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favorites').select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT /api/users/favorites/:userId
// @desc    Toggle (Add / Remove) recipe from favorites
router.put('/favorites/:userId', async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const existsIndex = user.favorites.indexOf(recipeId);
    if (existsIndex > -1) {
      user.favorites.splice(existsIndex, 1);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();
    const updatedUser = await User.findById(req.params.userId).populate('favorites').select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update favorites' });
  }
});

module.exports = router;