import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard'; // <--- 1. IMPORT THIS

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeList token={token} setToken={setToken} />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Login setToken={setToken} />} />
        <Route path="/profile" element={<UserProfile setToken={setToken} />} />
        
        {/* 2. ADD THIS ROUTE */}
        <Route path="/admin" element={<AdminDashboard />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;