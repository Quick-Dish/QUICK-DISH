import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  // Security State
  const [isAdmin, setIsAdmin] = useState(false);
  const [secretCode, setSecretCode] = useState("");

  const handleLogin = () => {
    if (secretCode === "admin123") {
      setIsAdmin(true);
    } else {
      alert("Access Denied!");
    }
  };

  const getConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { 'x-auth-token': token }
    };
  };

  // Define fetch function outside so we can call it repeatedly
  const fetchAllOrders = async () => {
    try {
      const res = await axios.get('https://quick-dish-hk9b.onrender.com/api/orders', getConfig());
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      // Only alert if it's a permission error, to avoid annoying popups on interval checks
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setIsAdmin(false);
      }
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllOrders();

      // 2. Set up Auto-Refresh every 5 seconds 
      const interval = setInterval(() => {
        fetchAllOrders();
      }, 5000);

      // 3. Cleanup: Stop the timer if we leave the page
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`https://quick-dish-hk9b.onrender.com/api/orders/${orderId}`, { status: newStatus }, getConfig());
      
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Delivered') return '#2ecc71'; 
    if (status === 'Shipped') return '#3498db';   
    return '#f39c12';                             
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
        <h1 style={{ color: '#e74c3c' }}>🔒 Restricted Area</h1>
        <input type="password" placeholder="Enter Password" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} style={{ padding: '10px' }} />
        <br />
        <button onClick={handleLogin} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>Unlock</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>👮‍♂️ Chef's Control Room</h1>
          <p style={{ color: '#7f8c8d', margin: '5px 0 0 0', fontSize: '14px' }}>
            Live Updates Active • Checking every 5s...
          </p>
        </div>
        <button onClick={() => setIsAdmin(false)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Lock Dashboard</button>
      </div>

      <div style={{ background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #eaeaea' }}>
            <tr>
              <th style={{ padding: '20px', color: '#555', fontSize: '14px', textTransform: 'uppercase' }}>Order ID</th>
              <th style={{ padding: '20px', color: '#555', fontSize: '14px', textTransform: 'uppercase' }}>Customer</th>
              <th style={{ padding: '20px', color: '#555', fontSize: '14px', textTransform: 'uppercase' }}>Dish & Qty</th>
              <th style={{ padding: '20px', color: '#555', fontSize: '14px', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '20px', color: '#555', fontSize: '14px', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id || Math.random()} style={{ borderBottom: '1px solid #f1f1f1', transition: 'background 0.2s' }}>
                
                <td style={{ padding: '20px', color: '#7f8c8d', fontSize: '13px', verticalAlign: 'middle' }}>
                  #{order._id ? order._id.substring(order._id.length - 6).toUpperCase() : "ERR"}
                </td>

                <td style={{ padding: '20px', verticalAlign: 'middle' }}>
                  <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{order.user ? order.user.name : "Guest User"}</div>
                  <div style={{ fontSize: '12px', color: '#95a5a6', marginTop: '4px' }}>
                    {order.phone || "No Phone Provided"}
                  </div>
                </td>

                <td style={{ padding: '20px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '15px', color: '#2c3e50', fontWeight: '500' }}>
                      {order.recipe ? order.recipe.title : "Unknown Item"}
                    </span>
                    <span style={{ 
                      background: '#fff3cd', 
                      color: '#856404', 
                      border: '1px solid #ffeeba',
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}>
                       x {order.quantity || 1}
                    </span>
                  </div>
                </td>

                <td style={{ padding: '20px', verticalAlign: 'middle' }}>
                  <span style={{ 
                    background: getStatusColor(order.status), 
                    color: 'white', 
                    padding: '6px 14px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {order.status || "Ordered"}
                  </span>
                </td>

                <td style={{ padding: '20px', verticalAlign: 'middle' }}>
                   <select 
                    onChange={(e) => updateStatus(order._id, e.target.value)} 
                    value={order.status || "Ordered"}
                    disabled={order.status === 'Delivered'}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #ddd', 
                      cursor: order.status === 'Delivered' ? 'not-allowed' : 'pointer',
                      background: order.status === 'Delivered' ? '#f9f9f9' : 'white',
                      color: '#333',
                      outline: 'none'
                    }}
                   >
                    <option value="Ordered">Ordered</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
           <div style={{ padding: '50px', textAlign: 'center', color: '#95a5a6' }}>
             No orders yet! Waiting for hungry customers... 🍽️
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;