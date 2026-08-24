import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User as UserIcon, Heart, Package, LogOut, Clock, ChevronRight } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const UserProfile = ({ setToken }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'favorites'
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userRes = await axios.get(`${API_BASE}/users/${userId}`);
        setProfile(userRes.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
      }

      try {
        const ordersRes = await axios.get(`${API_BASE}/orders/myorders`, {
          headers: { 'x-auth-token': token }
        });
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Orders fetch error:', err);
        if (err.response?.status === 401 || err.response?.data?.msg?.includes('Token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('name');
          if (setToken) setToken(null);
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    if (setToken) setToken(null);
    navigate('/');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading Your Profile...</div>;
  if (!profile) return <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>Profile not found. Please log in again.</div>;

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
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
  };

  return (
    <div className="container" style={{ maxWidth: '950px' }}>
      {/* Profile Header Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #f59e0b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.8rem', fontWeight: '800' }}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.25rem' }}>{profile.name}</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{profile.email}</p>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={handleLogout} style={{ color: '#ef4444' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={16} /> Order History ({orders.length})
        </button>
        <button
          className={`btn ${activeTab === 'favorites' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Heart size={16} /> Saved Favorites ({profile.favorites ? profile.favorites.length : 0})
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <Package size={40} style={{ marginBottom: '0.75rem' }} />
              <h3>No orders yet</h3>
              <p style={{ marginTop: '0.5rem' }}>Browse our catalog and order your first gourmet meal kit!</p>
            </div>
          ) : (
            orders.map((order) => {
              const computedTotal = order.totalPrice
                ? order.totalPrice
                : ((order.recipe?.price || 15.99) * (order.quantity || 1) + 4.99);

              return (
                <div key={order._id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={order.recipe?.image || FALLBACK_IMAGE}
                      alt={order.recipe?.title || 'Meal Kit'}
                      style={{ width: '80px', height: '65px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                        {order.recipe ? order.recipe.title : 'Chef Meal Kit'}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        Ordered on: {new Date(order.date || order.createdAt).toLocaleDateString()} • Qty: {order.quantity || 1}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600', marginTop: '0.15rem' }}>
                        Total Paid: ${computedTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`status-chip ${order.status === 'Delivered' ? 'status-delivered' : 'status-ordered'}`}>
                      {order.status || 'Ordered'}
                    </span>
                    {order.recipe && (
                      <Link to={`/recipe/${order.recipe._id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                        Recipe <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Favorites */}
      {activeTab === 'favorites' && (
        <div className="recipe-grid">
          {!profile.favorites || profile.favorites.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', gridColumn: '1 / -1' }}>
              <Heart size={40} style={{ marginBottom: '0.75rem' }} />
              <h3>No saved favorites</h3>
              <p style={{ marginTop: '0.5rem' }}>Click the heart icon on any recipe to save it here!</p>
            </div>
          ) : (
            profile.favorites.map((recipe) => {
              const recId = typeof recipe === 'object' ? (recipe._id || recipe.id) : recipe;
              const recTitle = typeof recipe === 'object' ? recipe.title : 'Saved Recipe';
              const recImg = (typeof recipe === 'object' && recipe.image) ? recipe.image : FALLBACK_IMAGE;

              return (
                <div key={recId} className="glass-panel recipe-card">
                  <div className="recipe-image-wrapper">
                    <img
                      src={recImg}
                      alt={recTitle}
                      className="recipe-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div className="recipe-content">
                    <h3 className="recipe-title">{recTitle}</h3>
                    <Link to={`/recipe/${recId}`} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                      View Saved Recipe
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
