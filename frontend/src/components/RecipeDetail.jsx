import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Heart, ShoppingCart, Clock, Flame, Video, CheckCircle2 } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';
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
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60';
};

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultVideo = 'https://www.youtube.com/watch?v=3AAdKl1UYZs';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.response?.data?.msg || 'Failed to load recipe');
      } finally {
        setLoading(false);
      }

      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const userRes = await axios.get(`${API_BASE}/users/${userId}`);
          const favorites = userRes.data.favorites || [];
          const isFav = favorites.some((fav) => {
            const favId = typeof fav === 'object' ? (fav._id || fav.id) : fav;
            return favId?.toString() === id?.toString();
          });
          setIsSaved(isFav);
        } catch (userErr) {
          console.warn('Could not fetch user favorites status:', userErr);
        }
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert('Please log in to save recipes to your favorites!');
      navigate('/login');
      return;
    }

    try {
      await axios.put(`${API_BASE}/users/favorites/${userId}`, { recipeId: id });
      setIsSaved(!isSaved);
    } catch (err) {
      console.error(err);
      alert('Failed to update favorites');
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    if (!videoId) return url;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading Recipe Details...</div>;
  if (error || !recipe) return <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>⚠️ {error || 'Recipe not found'}</div>;

  const videoToPlay = recipe.youtubeUrl || defaultVideo;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ position: 'relative', width: '100%', height: '340px' }}>
          <img
            src={recipe.image || getDishFallbackImage(recipe.title)}
            alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getDishFallbackImage(recipe.title);
            }}
          />
          <span className={`tag-badge ${recipe.dietaryCategory === 'Veg' ? 'tag-veg' : 'tag-nonveg'}`} style={{ top: '1.5rem', left: '1.5rem', fontSize: '0.9rem' }}>
            {recipe.dietaryCategory || 'Recipe'}
          </span>
        </div>

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>{recipe.title}</h1>
              <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={16} /> {recipe.cookingTime || 20} mins</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Flame size={16} /> {recipe.difficulty || 'Medium'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                onClick={handleSave}
                style={{ color: isSaved ? '#ef4444' : '#fff' }}
              >
                <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} /> {isSaved ? 'Saved' : 'Save'}
              </button>
              <button className="btn btn-primary" onClick={() => navigate(`/order/${id}`)}>
                <ShoppingCart size={18} /> Order Kit — ${recipe.price ? recipe.price.toFixed(2) : '15.99'}
              </button>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

          {/* Ingredients Section */}
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#10b981' }}>📝 Pre-Portioned Ingredients</h2>
          <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
            {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                {typeof ing === 'object' ? ing.name : ing}
              </li>
            ))}
          </ul>

          {/* Cooking Instructions */}
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#f59e0b' }}>🍳 Step-by-Step Instructions</h2>
          <ol style={{ paddingLeft: '1.25rem', lineHeight: '1.7', color: '#cbd5e1', marginBottom: '2rem' }}>
            {Array.isArray(recipe.instructions) ? (
              recipe.instructions.map((step, idx) => (
                <li key={idx} style={{ marginBottom: '0.75rem' }}>
                  {typeof step === 'object' ? step.text : step}
                </li>
              ))
            ) : (
              <li>{recipe.instructions}</li>
            )}
          </ol>

          {/* Video Section */}
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video color="#ef4444" /> Watch Chef Video Tutorial
            </h2>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={getEmbedUrl(videoToPlay)}
                title="Recipe Cooking Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
