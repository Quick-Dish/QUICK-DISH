import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    if (isAdmin) {
      const fetchAllOrders = async () => {
        try {
          const res = await axios.get('https://quick-dish-hk9b.onrender.com/api/orders', getConfig());
          setOrders(res.data);
        } catch (err) {
          console.error("Error fetching orders:", err);
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            alert("Security Alert: You are not an Admin!");
            setIsAdmin(false);
          }
        }
      };
      fetchAllOrders();
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
    if (status === 'Delivered') return '#2ecc71'; // Green
    if (status === 'Shipped') return '#3498db';   // Blue
    return '#f39c12';                             // Orange
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
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>👮‍♂️ Chef's Control Room</h1>
        <button onClick={() => setIsAdmin(false)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>Lock</button>
      </div>

      <div style={{ background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
            <tr>
              <th style={{ padding: '15px' }}>Order ID</th>
              <th style={{ padding: '15px' }}>Customer</th>
              <th style={{ padding: '15px' }}>Dish</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id || Math.random()} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px', color: '#777', fontSize: '12px' }}>
                  {order._id ? order._id.substring(order._id.length - 6) : "Error"}...
                </td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>
                  {order.user ? order.user.name : "Unknown"}
                </td>
                <td style={{ padding: '15px' }}>
                  {order.recipe ? order.recipe.title : "Unknown"}
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{ background: getStatusColor(order.status), color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                    {order.status || "Ordered"}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  {/* --- THE FIX: Disable if Delivered --- */}
                  <select
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    value={order.status || "Ordered"}
                    disabled={order.status === 'Delivered'}
                    style={{
                      padding: '5px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      cursor: order.status === 'Delivered' ? 'not-allowed' : 'pointer',
                      opacity: order.status === 'Delivered' ? 0.6 : 1
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
      </div>
    </div>
  );
};

export default AdminDashboard;