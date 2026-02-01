import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecipeList.css'; 

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All"); 
  
  const userName = localStorage.getItem('name') || "Chef";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/recipes');
        setRecipes(res.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || recipe.dietaryCategory === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#fdfbf7', minHeight: '100vh' }}>
      
      {/* --- 1. HEADER --- */}
      <div style={{ background: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             {/* 👇 LOGO SIZE INCREASED HERE (50px -> 100px) */}
             <img src="/Logo.png" alt="Logo" style={{ width: '100px', objectFit: 'contain' }} />
             <h2 style={{ color: '#2c3e50', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>NO CHEF ? NO STRESS</h2>
        </div>

        <Link to="/profile" style={{ textDecoration: 'none', color: '#333' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
             <img 
               src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
               alt="Profile" 
               style={{ width: '35px', borderRadius: '50%', border: '2px solid #ddd' }}
             />
            <span style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '2px' }}>{userName}</span>
          </div>
        </Link>
      </div>

      {/* --- 2. BANNER SECTION --- */}
      <div style={{ position: 'relative', width: '100%', height: '220px', marginBottom: '40px', backgroundColor: '#fdfbf7' }}>
          <img 
            src="/Banner.png" 
            alt="Banner" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
          />
          
          <div style={{ 
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
              textAlign: 'center', width: '90%', maxWidth: '700px' 
          }}>
              <h1 style={{ color: '#1b3c29', fontSize: '36px', marginBottom: '20px', textShadow: '0 2px 4px rgba(255,255,255,0.8)' }}>
                Quick & Delicious Recipes
              </h1>

              <div style={{ display: 'flex', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', borderRadius: '5px' }}>
                  <input 
                    type="text" 
                    placeholder="Search recipes..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: '15px', border: 'none', borderRadius: '5px 0 0 5px', fontSize: '16px', outline: 'none' }}
                  />
                  <button onClick={() => setFilterType("All")} style={{ padding: '0 20px', border: 'none', cursor: 'pointer', background: filterType === "All" ? '#333' : '#ddd', color: filterType === "All" ? 'white' : 'black' }}>All</button>
                  <button onClick={() => setFilterType("Veg")} style={{ padding: '0 20px', border: 'none', cursor: 'pointer', background: filterType === "Veg" ? '#eaeaea' : '#f4f4f4', color: filterType === "Veg" ? '#27ae60' : 'black', fontWeight: filterType === "Veg" ? 'bold' : 'normal' }}>Veg</button>
                  <button onClick={() => setFilterType("Non-Veg")} style={{ padding: '0 20px', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer', background: filterType === "Non-Veg" ? '#eaeaea' : '#f4f4f4', color: filterType === "Non-Veg" ? '#c0392b' : 'black', fontWeight: filterType === "Non-Veg" ? 'bold' : 'normal' }}>Non-Veg</button>
              </div>
          </div>
      </div>

      {/* --- 3. RECIPE GRID (4 Cards per row) --- */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
        
        <div className="recipe-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '25px' 
        }}>
          
          {filteredRecipes.length === 0 ? (
            <p style={{ fontSize: '18px', color: '#777', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>No recipes found matching your search. 😕</p>
          ) : (
            filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card" style={{ background: 'white', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}> 
                
                <img 
                  src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60"} 
                  alt={recipe.title} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                
                <div style={{ padding: '15px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#333' }}>{recipe.title}</h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <span style={{ 
                            background: recipe.dietaryCategory === 'Veg' ? '#e8f8f5' : '#fdedec', 
                            color: recipe.dietaryCategory === 'Veg' ? '#27ae60' : '#c0392b',
                            padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
                        }}>
                            {recipe.dietaryCategory}
                        </span>
                        <span style={{ fontSize: '13px', color: '#999' }}>⏳ {recipe.cookingTime} min</span>
                    </div>
                    
                    <Link to={`/recipe/${recipe._id}`} style={{ textDecoration: 'none' }}>
                        <button style={{ width: '100%', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                        View Recipe
                        </button>
                    </Link>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeList;