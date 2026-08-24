import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Clock, Utensils, ShoppingCart, Eye } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/recipes';
const getDishFallbackImage = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('litti')) return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80';
  if (t.includes('chips') || t.includes('pavakkai')) return 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80';
  if (t.includes('biryani')) return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80';
  if (t.includes('pasta') || t.includes('pappardelle')) return 'https://images.unsplash.com/photo-1621996346565-e3d5d6281318?w=600&auto=format&fit=crop&q=80';
  if (t.includes('momo')) return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80';
  if (t.includes('paneer')) return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80';
  if (t.includes('roll')) return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80';
  if (t.includes('chowmein') || t.includes('choumin') || t.includes('noodle') || t.includes('maggi')) return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80';
  if (t.includes('dosa') || t.includes('adai')) return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80';
  if (t.includes('pani') || t.includes('puri')) return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80';
  if (t.includes('dal') || t.includes('makhani')) return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80';
  if (t.includes('fish')) return 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&auto=format&fit=crop&q=80';
  if (t.includes('kesari') || t.includes('rava')) return 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80';
  if (t.includes('upma')) return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80';
  if (t.includes('salmon')) return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80';
  return FALLBACK_IMAGE;
};

const RecipeList = ({ token, user }) => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(API_URL);
        setRecipes(res.data);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const title = recipe.title || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || recipe.dietaryCategory === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      {/* Hero Banner with Live Search & Filter */}
      <div className="hero-banner">
        <h1 className="hero-title">No Chef? No Stress!</h1>
        <p className="hero-subtitle">
          Chef-curated organic meal kits delivered fresh to your doorstep. Simple 20-minute recipes with pre-measured ingredients.
        </p>

        <div className="search-box">
          <Search size={20} color="#94a3b8" style={{ marginLeft: '1rem', marginTop: '0.8rem' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search recipes, ingredients, or cuisines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          {['All', 'Veg', 'Non-Veg', 'Gourmet'].map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Loading Chef Recipes...
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <Utensils size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3>No recipes match your search</h3>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Try clearing your search query or selecting a different category filter.</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <div key={recipe._id} className="glass-panel recipe-card">
              <div className="recipe-image-wrapper">
                <img
                  src={recipe.image || getDishFallbackImage(recipe.title)}
                  alt={recipe.title || 'Recipe'}
                  className="recipe-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getDishFallbackImage(recipe.title);
                  }}
                />
                <span className={`tag-badge ${recipe.dietaryCategory === 'Veg' ? 'tag-veg' : 'tag-nonveg'}`}>
                  {recipe.dietaryCategory || 'Recipe'}
                </span>
              </div>

              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                
                <div className="recipe-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={15} /> {recipe.cookingTime || 20} mins
                  </span>
                  <span style={{ fontWeight: '700', color: '#f59e0b', fontSize: '1.1rem' }}>
                    ${recipe.price ? recipe.price.toFixed(2) : '15.99'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: 'auto' }}>
                  <Link to={`/recipe/${recipe._id}`} className="btn btn-secondary" style={{ fontSize: '0.88rem' }}>
                    <Eye size={15} /> View Recipe
                  </Link>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '0.88rem' }}
                    onClick={() => navigate(`/order/${recipe._id}`)}
                  >
                    <ShoppingCart size={15} /> Order Kit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
