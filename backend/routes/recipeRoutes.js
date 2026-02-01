const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// --- 1. GET ALL RECIPES ---
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 2. GET SINGLE RECIPE ---
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Recipe not found' });
    res.status(500).send('Server Error');
  }
});

// --- 3. SEED ROUTE (Optional, for browser testing) ---
router.get('/seed', async (req, res) => {
    // We are keeping this just in case you want to quickly reset via browser
    res.json({ msg: "Use Postman to upload data now!" });
});

// --- 4. BATCH UPLOAD (THE POSTMAN ROUTE 📮) ---
// This is the specific route that accepts an Array [...] of recipes
// --- 4. BATCH UPLOAD (THE POSTMAN ROUTE 📮) ---
router.post('/batch', async (req, res) => {
  try {
    // ⚠️ STEP 1: WIPE OLD DATA (Uncommented this!)
    await Recipe.deleteMany({}); 

    const recipes = req.body; 
    
    if (!Array.isArray(recipes)) {
        return res.status(400).json({ msg: "Please send an Array [] of recipes." });
    }

    // STEP 2: INSERT NEW DATA
    await Recipe.insertMany(recipes);
    res.status(201).json({ msg: "✅ Old data deleted & New Menu uploaded!" });
  } catch (err) {
    res.status(400).json({ message: "❌ Upload Failed: " + err.message });
  }
});

module.exports = router;