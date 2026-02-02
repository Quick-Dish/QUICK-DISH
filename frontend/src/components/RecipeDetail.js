import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const defaultVideo = "https://www.youtube.com/watch?v=3AAdKl1UYZs";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Recipe Data
        const res = await axios.get(`https://quick-dish-hk9b.onrender.com/api/recipes/${id}`);
        setRecipe(res.data);

        // 2. Check if User has ALREADY saved this recipe
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userRes = await axios.get(`https://quick-dish-hk9b.onrender.com/api/users/${userId}`);
          const favorites = userRes.data.favorites || [];

          // Check if current ID exists in their favorites list
          const isFav = favorites.some(fav => {
            const favId = typeof fav === 'object' ? fav._id : fav;
            return favId === id;
          });
          setIsSaved(isFav);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.response?.data?.msg || "Failed to load recipe");
      }
    };
    fetchData();
  }, [id]);

  // (Deleted the old handleOrder function from here)

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token) {
      alert("Please login to save recipes.");
      return;
    }

    try {
      // The backend now handles the toggle (Add/Remove) logic automatically
      await axios.put(`https://quick-dish-hk9b.onrender.com/api/users/favorites/${userId}`, { recipeId: id });

      // Flip the button state instantly
      setIsSaved(!isSaved);

      // Show correct message
      if (!isSaved) {
        alert("❤️ Recipe Saved to Favorites!");
      } else {
        alert("💔 Recipe Removed from Favorites.");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to update favorites.");
    }
  };

  // NEW HELPER FUNCTION: This fixes the "Refused to Connect" error
  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;

    // Handle standard "youtube.com/watch?v=" URLs
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    }
    // Handle short "youtu.be/" URLs
    else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    // Default return if no ID found (prevents crash)
    if (!videoId) return url;

    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>⚠️ {error}</div>;
  if (!recipe) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Deliciousness...</div>;

  // Use DB video if it exists, otherwise use the Hardcoded Default
  const videoToPlay = recipe.youtubeUrl || defaultVideo;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>

      <button onClick={() => navigate('/')} style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px' }}>
        ← Back to Menu
      </button>

      <div style={{ border: '1px solid #ddd', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', background: 'white' }}>

        {/* HERO IMAGE */}
        <img
          src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60"}
          alt={recipe.title}
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />

        <div style={{ padding: '30px' }}>

          {/* --- TOP SECTION: Title + ORDER & SAVE OPTIONS --- */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>

            <div>
              <h1 style={{ margin: 0, color: '#2c3e50' }}>{recipe.title}</h1>
              <span style={{ display: 'inline-block', marginTop: '5px', background: '#27ae60', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                {recipe.dietaryCategory || "Tasty"}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSave}
                style={{
                  background: isSaved ? '#ff7675' : '#ccc', // Red if Saved, Grey if Not
                  color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                }}
              >
                {isSaved ? "❤️ Saved" : "🤍 Save"}
              </button>
              
              <button
                onClick={() => navigate(`/order/${id}`)}
                style={{ background: '#e67e22', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🛒 Order Kit
              </button>
            </div>
          </div>

          <p style={{ color: '#777', fontSize: '16px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <strong>⏳ Time:</strong> {recipe.cookingTime} mins | <strong>📊 Difficulty:</strong> {recipe.difficulty}
          </p>

          {/* INGREDIENTS */}
          <h3>📝 Ingredients</h3>
          <ul style={{ lineHeight: '1.6', color: '#555' }}>
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>
                {typeof ing === 'object' ? ing.name : ing}
              </li>
            ))}
          </ul>

          {/* INSTRUCTIONS */}
          <h3>🍳 Instructions</h3>
          {Array.isArray(recipe.instructions) ? (
            <ol style={{ lineHeight: '1.6', color: '#555', paddingLeft: '20px' }}>
              {recipe.instructions.map((step, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  {typeof step === 'object' ? step.text : step}
                </li>
              ))}
            </ol>
          ) : (
            <p style={{ lineHeight: '1.6', color: '#555' }}>{recipe.instructions}</p>
          )}

          {/* --- VIDEO SECTION --- */}
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              🎥 Watch How to Cook
            </h3>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>

              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={getEmbedUrl(videoToPlay)}
                title="Recipe Video"
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