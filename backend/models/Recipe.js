const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ 
    name: String 
  }],
  instructions: [{ 
    step: Number, 
    text: String 
  }],
  cookingTime: { type: Number, required: true },
  difficulty: { type: String, required: true },
  dietaryCategory: { type: String, required: true },
  
  // 👇 THIS WAS MISSING! Add this line so the DB accepts your images:
  image: { type: String }, 
  
  youtubeUrl: { type: String }
});

module.exports = mongoose.model('Recipe', RecipeSchema);