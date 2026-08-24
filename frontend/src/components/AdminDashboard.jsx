import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Package, Upload, CheckCircle2, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadMsg, setUploadMsg] = useState('');

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (role !== 'admin') {
      navigate('/profile');
      return;
    }
    fetchOrders();
  }, [token, role, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders`, {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      if (err.response?.status === 401 || err.response?.data?.msg?.includes('Token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE}/orders/${orderId}`,
        { status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleResetMenu = async () => {
    try {
      const res = await axios.get(`${API_BASE}/recipes`);
      setUploadMsg('Menu refreshed successfully!');
      setTimeout(() => setUploadMsg(''), 3000);
    } catch (err) {
      setUploadMsg('Failed to refresh menu');
    }
  };

  return (
    <div className="container">
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck size={32} color="#10b981" />
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Admin Management Panel</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Manage active customer orders and recipe menus</p>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={handleResetMenu}>
          <RefreshCw size={16} /> Reset Menu Data
        </button>
      </div>

      {uploadMsg && <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#6ee7b7', borderRadius: '8px', marginBottom: '1.5rem' }}>{uploadMsg}</div>}

      <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Package color="#f59e0b" /> Customer Orders List ({orders.length})
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading Admin Orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          No customer orders found in the database.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                  {order.recipe ? order.recipe.title : 'Meal Kit Order'}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                  Customer: {order.user ? order.user.name : 'Guest'} ({order.user ? order.user.email : 'N/A'})
                </p>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Shipping: {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}` : 'Default Address'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Status:</span>
                <select
                  className="form-input"
                  style={{ width: 'auto', padding: '0.4rem 0.8rem', background: '#1e293b' }}
                  value={order.status || 'Ordered'}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                >
                  <option value="Ordered">Ordered</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
