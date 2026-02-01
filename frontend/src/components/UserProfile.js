import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = ({ setToken }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // Toggles for sections
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate('/');
  };

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`https://quick-dish-hk9b.onrender.com/api/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Could not load profile.");
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const config = { headers: { 'x-auth-token': token } };

        // Using the correct /myorders endpoint
        const res = await axios.get(`https://quick-dish-hk9b.onrender.com/api/orders/myorders`, config);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchUserData();
    fetchOrders();
  }, [userId, navigate]);

  // --- GAMIFICATION LOGIC ---
  const getChefRank = (orderCount) => {
    if (orderCount >= 30) return { title: "Master Chef in Grandmaster 🔴", color: "#FF0000" };
    if (orderCount >= 20) return { title: "Master Chef in Candidate Master 🟣", color: "#AA00AA" };
    if (orderCount >= 10) return { title: "Master Chef in Expert 🔵", color: "#0000FF" };
    if (orderCount >= 6) return { title: "Master Chef in Specialist 💠", color: "#03A89E" };
    if (orderCount >= 3) return { title: "Master Chef in Pupil 🟢", color: "#008000" };
    return { title: "Master Chef in Newbie 🔘", color: "#808080" };
  };

  const getStatusColor = (status) => {
    if (status === 'Delivered') return '#2ecc71';
    if (status === 'Shipped') return '#3498db';
    return '#f39c12';
  };

  if (!userId) return null;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}><h3>{error}</h3><button onClick={handleLogout}>Logout</button></div>;
  if (!user) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  const rank = getChefRank(orders.length);

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#555', display: 'block', marginBottom: '20px' }}>← Back to Menu</Link>

      {/* --- HEADER WITH RANK --- */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Profile"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: `4px solid ${rank.color}`,
            marginBottom: '15px',
            padding: '3px'
          }}
        />
        <h2 style={{ margin: 0, color: rank.color }}>{user.name}</h2>
        <p style={{ color: rank.color, fontWeight: 'bold', marginTop: '5px' }}>{rank.title}</p>
        <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{orders.length} Orders Completed</p>
      </div>

      <div style={{ background: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

        {/* ❤️ FAVORITES SECTION */}
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>❤️ My Favorites</h4>
          {user.favorites && user.favorites.length > 0 ? (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
              {user.favorites.map((fav) => {
                if (!fav || !fav._id) return null;
                return (
                  <Link to={`/recipe/${fav._id}`} key={fav._id} style={{ textDecoration: 'none' }}>
                    <div style={{ width: '80px', flexShrink: 0, textAlign: 'center' }}>
                      <img
                        src={fav.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60"}
                        alt={fav.title}
                        style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', marginBottom: '5px' }}
                      />
                      <div style={{ fontSize: '10px', color: '#333', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {fav.title}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: '#999' }}>No favorites yet.</p>
          )}
        </div>

        {/* 📜 ORDER HISTORY (UPDATED WITH IMAGE & TIME) */}
        <div style={{ borderBottom: '1px solid #eee' }}>
          <div onClick={() => setShowHistory(!showHistory)} style={{ display: 'flex', alignItems: 'center', padding: '20px', cursor: 'pointer' }}>
            <div style={{ flex: 1 }}><h4 style={{ margin: 0 }}>📜 Order History</h4></div>
            <span style={{ color: '#ccc' }}>{showHistory ? '▲' : '▼'}</span>
          </div>

          {showHistory && (
            <div style={{ background: '#fafafa', padding: '0 20px 20px 20px' }}>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <Link
                    to={`/recipe/${order.recipe ? order.recipe._id : '#'}`}
                    key={order._id}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {/* 👇 NEW LAYOUT FOR HISTORY ITEM 👇 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px dashed #ddd', cursor: 'pointer' }}>

                      {/* 1. Dish Image */}
                      <img
                        src={order.recipe ? order.recipe.image : "https://via.placeholder.com/50"}
                        alt="Dish"
                        style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                      />

                      {/* 2. Text Details */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2c3e50', marginBottom: '3px' }}>
                          {order.recipe ? order.recipe.title : "Unknown Recipe"}
                        </div>

                        {/* Date and Time */}
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {new Date(order.date).toLocaleString([], {
                            year: 'numeric', month: 'numeric', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>

                      {/* 3. Status Badge */}
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'white', background: getStatusColor(order.status), padding: '4px 8px', borderRadius: '10px' }}>
                        {order.status}
                      </div>

                    </div>
                  </Link>
                ))
              ) : (<p style={{ textAlign: 'center', fontSize: '13px', color: '#999' }}>No orders found.</p>)}
            </div>
          )}
        </div>

        {/* ⚙️ SETTINGS */}
        <div style={{ borderBottom: '1px solid #eee' }}>
          <div onClick={() => setShowSettings(!showSettings)} style={{ display: 'flex', alignItems: 'center', padding: '20px', cursor: 'pointer' }}>
            <div style={{ flex: 1 }}><h4 style={{ margin: 0 }}>⚙️ Settings</h4></div>
            <span style={{ color: '#ccc' }}>{showSettings ? '▲' : '▼'}</span>
          </div>

          {showSettings && (
            <div style={{ background: '#fafafa', padding: '0 20px 20px 20px', fontSize: '14px', color: '#555' }}>
              <p style={{ marginBottom: '10px' }}>🔔 <strong>Notifications:</strong> On</p>
              <p style={{ marginBottom: '10px' }}>📧 <strong>Email:</strong> {user.email}</p>
              <p style={{ marginBottom: '10px', color: '#e67e22', cursor: 'pointer' }}>🔒 Change Password</p>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <div onClick={handleLogout} style={{ padding: '20px', cursor: 'pointer', background: '#fff5f5', color: '#e74c3c', fontWeight: 'bold' }}>
          🚪 Logout
        </div>

      </div>
    </div>
  );
};

export default UserProfile;