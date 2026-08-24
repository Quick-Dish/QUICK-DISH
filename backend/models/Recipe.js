const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String }],
  instructions: [{ type: String }],
  cookingTime: { type: Number, required: true },
  difficulty: { type: String, required: true },
  dietaryCategory: { type: String, required: true }, // e.g. Veg, Non-Veg, Gourmet
  price: { type: Number, default: 15.99 },
  image: { type: String },
  youtubeUrl: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
