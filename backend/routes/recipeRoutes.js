const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

const INITIAL_RECIPES = [
  {
    title: 'Pan-Seared Mediterranean Salmon',
    ingredients: [
      'Fresh Salmon Fillet (200g)',
      'Fresh Garlic Asparagus',
      'Organic Quinoa',
      'Lemon Dill Butter Sauce',
      'Cherry Tomatoes & Olive Oil'
    ],
    instructions: [
      'Pat salmon fillet dry and season both sides with salt and black pepper.',
      'Heat olive oil in a non-stick skillet over medium-high heat.',
      'Place salmon skin-side down and sear for 4 minutes until golden and crispy.',
      'Sauté garlic asparagus and cherry tomatoes in lemon dill butter.',
      'Serve salmon over warm herb quinoa and drizzle with lemon butter sauce.'
    ],
    cookingTime: 25,
    difficulty: 'Medium',
    dietaryCategory: 'Non-Veg',
    price: 18.99,
    image: '/images/mediterranean_salmon.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=3AAdKl1UYZs'
  },
  {
    title: 'Creamy Black Truffle Pappardelle',
    ingredients: [
      'Handmade Pappardelle Pasta',
      'Wild Porcini & Cremini Mushrooms',
      'Black Truffle Cream Sauce',
      'Shaved Aged Parmesan Cheese',
      'Fresh Parsley & Garlic'
    ],
    instructions: [
      'Bring a large pot of salted water to a boil and cook pappardelle for 6 minutes.',
      'In a sauté pan, cook sliced mushrooms in garlic and butter until golden brown.',
      'Pour in black truffle cream sauce and simmer gently for 2 minutes.',
      'Toss cooked pappardelle pasta directly into the sauce until coated.',
      'Garnish generously with shaved parmesan cheese and freshly cracked pepper.'
    ],
    cookingTime: 20,
    difficulty: 'Easy',
    dietaryCategory: 'Veg',
    price: 16.50,
    image: '/images/truffle_pasta.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=3AAdKl1UYZs'
  },
  {
    title: 'Korean Bulgogi Beef Rice Bowl',
    ingredients: [
      'Marinated Thinly Sliced Beef Ribeye',
      'Steamed Jasmine Rice',
      'Sesame Pickled Cucumbers',
      'Traditional Spicy Kimchi',
      'Sunny-Side Farm Egg & Green Onions'
    ],
    instructions: [
      'Heat a skillet over high heat and sear beef slices for 3-4 minutes until caramelized.',
      'Fry farm egg in sesame oil until whites are set and yolk remains runny.',
      'Scoop warm jasmine rice into serving bowl as the base.',
      'Arrange bulgogi beef, kimchi, and pickled cucumbers around the rice.',
      'Top with fried egg, toasted sesame seeds, and sliced green onions.'
    ],
    cookingTime: 30,
    difficulty: 'Medium',
    dietaryCategory: 'Non-Veg',
    price: 15.99,
    image: '/images/korean_beef_bowl.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=3AAdKl1UYZs'
  }
];

// --- 1. GET ALL RECIPES ---
router.get('/', async (req, res) => {
  try {
    let recipes = await Recipe.find();
    if (recipes.length === 0) {
      recipes = await Recipe.insertMany(INITIAL_RECIPES);
    }
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

// --- 3. CREATE SINGLE RECIPE (Admin) ---
router.post('/', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    const saved = await newRecipe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- 4. BATCH UPLOAD ---
router.post('/batch', async (req, res) => {
  try {
    await Recipe.deleteMany({});
    const recipes = req.body;
    if (!Array.isArray(recipes)) {
      return res.status(400).json({ msg: "Please send an Array [] of recipes." });
    }
    await Recipe.insertMany(recipes);
    res.status(201).json({ msg: "✅ Old data reset & New Menu uploaded!" });
  } catch (err) {
    res.status(400).json({ message: "Upload Failed: " + err.message });
  }
});

module.exports = router;
