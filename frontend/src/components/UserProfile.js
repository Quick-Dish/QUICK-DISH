import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ setToken }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token) {
        navigate('/login');
        return;
      }

      const config = { headers: { 'x-auth-token': token } };

      try {
        const userRes = await axios.get(`https://quick-dish-hk9b.onrender.com/api/users/${userId}`);
        setUser(userRes.data);

        const orderRes = await axios.get('https://quick-dish-hk9b.onrender.com/api/orders/myorders', config);
        setOrders(orderRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    setToken(null);
    navigate('/login');
  };

  const getStatusColor = (status) => {
    if (status === 'Delivered') return '#2ecc71';
    if (status === 'Shipped') return '#3498db';
    return '#f39c12';
  };

  // 🏆 NEW GAMIFICATION LOGIC 🏆
  const getChefRank = (orderCount) => {
    if (orderCount >= 30) return { title: "Master Chef in Grandmaster 🔴", color: "#FF0000" };
    if (orderCount >= 20) return { title: "Master Chef in Candidate Master 🟣", color: "#AA00AA" };
    if (orderCount >= 10) return { title: "Master Chef in Expert 🔵", color: "#0000FF" };
    if (orderCount >= 6)  return { title: "Master Chef in Specialist 💠", color: "#03A89E" };
    if (orderCount >= 3)  return { title: "Master Chef in Pupil 🟢", color: "#008000" };
    return { title: "Master Chef in Newbie 🔘", color: "#808080" };
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading your profile...</div>;

  const chefStatus = getChefRank(orders.length);

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>👤 My Profile</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* LEFT COLUMN: User Info & Favorites */}
        <div style={{ flex: 1, minWidth: '320px' }}>
          
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Details</h3>
            
            {/* 👇 UPDATED BADGE DISPLAY 👇 */}
            <div style={{ 
              background: chefStatus.color, 
              color: 'white', 
              padding: '12px', 
              borderRadius: '8px', 
              textAlign: 'center', 
              marginBottom: '20px', 
              fontWeight: 'bold', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)' 
            }}>
               {chefStatus.title} <br/> 
               <span style={{ fontSize: '0.9em', fontWeight: 'normal', opacity: 0.9 }}>
                 ({orders.length} Orders)
               </span>
            </div>

            <p style={{ margin: '10px 0' }}><strong>Name:</strong> {user.name}</p>
            <p style={{ margin: '10px 0' }}><strong>Email:</strong> {user.email}</p>
            <p style={{ margin: '10px 0' }}><strong>Member Since:</strong> {user.date ? new Date(user.date).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>❤️ Favorites</h3>
            
            {user.favorites && user.favorites.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {user.favorites.map((fav) => (
                  <div 
                    key={fav._id || Math.random()} 
                    onClick={() => navigate(`/recipe/${fav._id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background 0.2s', border: '1px solid #f9f9f9' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <img 
                      src={fav.image || "https://via.placeholder.com/50"} 
                      alt={fav.title} 
                      style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} 
                    />
                    <span style={{ fontWeight: 'bold', color: '#555' }}>{fav.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>No favorites yet.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Order History */}
        <div style={{ flex: 2, minWidth: '400px' }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50', marginBottom: '20px' }}>📜 Order History</h3>
          
          {orders.length === 0 ? (
            <div style={{ padding: '40px', background: 'white', borderRadius: '12px', textAlign: 'center', color: '#777', border: '1px solid #eee' }}>
              You haven't ordered anything yet. <br/> 
              <span onClick={() => navigate('/')} style={{ color: '#3498db', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>Go order something delicious!</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {orders.map((order) => (
                <div 
                  key={order._id} 
                  style={{ border: '1px solid #eee', borderRadius: '12px', padding: '20px', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}
                >
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    <img 
                      src={order.recipe ? order.recipe.image : "https://via.placeholder.com/80"} 
                      alt="Dish"
                      onClick={() => order.recipe && navigate(`/recipe/${order.recipe._id}`)}
                      style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', cursor: 'pointer', border: '1px solid #eee' }} 
                    />

                    <div>
                      <h4 
                        onClick={() => order.recipe && navigate(`/recipe/${order.recipe._id}`)}
                        style={{ margin: '0 0 5px 0', color: '#2c3e50', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}
                      >
                        {order.recipe ? order.recipe.title : "Unknown Recipe"}
                        <span style={{ background: '#e67e22', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                          x {order.quantity || 1}
                        </span>
                      </h4>
                      
                      <p style={{ margin: 0, color: '#7f8c8d', fontSize: '13px' }}>
                        📅 {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p style={{ margin: '5px 0 0 0', color: '#95a5a6', fontSize: '12px' }}>
                        📍 {order.address ? (order.address.length > 35 ? order.address.substring(0, 35) + '...' : order.address) : "No Address"}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <span style={{ background: getStatusColor(order.status), color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {order.status || "Ordered"}
                    </span>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#bbb', fontWeight: 'bold' }}>
                      {order.paymentMethod || "COD"}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;