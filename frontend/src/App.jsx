import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Utensils, User, LogOut, ShieldCheck, ShoppingBag } from 'lucide-react';

import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import OrderPage from './components/OrderPage';

function NavigationBar({ token, setToken }) {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('name') || '');
    setUserRole(localStorage.getItem('role') || 'user');
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    setToken(null);
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo-brand">
        <Utensils size={28} color="#10b981" />
        <span>Quick Dish</span>
      </Link>

      <div className="nav-actions">
        <Link to="/" className="btn btn-secondary">
          Explore Kits
        </Link>

        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/profile" className="btn btn-primary">
              <User size={16} /> {userName || 'My Profile'}
            </Link>
            {userRole === 'admin' && (
              <Link to="/admin" className="btn btn-secondary" title="Admin Panel">
                <ShieldCheck size={16} color="#f59e0b" />
              </Link>
            )}
            <button className="btn btn-secondary" onClick={handleLogout}>
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-accent">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div>
        <NavigationBar token={token} setToken={setToken} />

        <Routes>
          <Route path="/" element={<RecipeList token={token} />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Login setToken={setToken} />} />
          <Route path="/profile" element={<UserProfile setToken={setToken} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/order/:recipeId" element={<OrderPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
