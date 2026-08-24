import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, ArrowLeft, Truck, CreditCard, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const OrderPage = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [shipping, setShipping] = useState({ street: '123 Gourmet Way', city: 'Foodville', zipCode: '90210' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_BASE}/recipes/${recipeId}`);
        setRecipe(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Recipe not found');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please sign in or register to place your meal kit order!');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post(
        `${API_BASE}/orders`,
        {
          recipeId,
          quantity,
          shippingAddress: shipping,
          totalPrice
        },
        {
          headers: { 'x-auth-token': token }
        }
      );

      alert('🎉 Order placed successfully! Tracking active in your profile.');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.data?.msg?.includes('Token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        setError('Your login session has expired or is invalid. Redirecting to Sign In...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(err.response?.data?.msg || 'Failed to place order');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>Loading Checkout Details...</div>;
  if (error || !recipe) return <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>⚠️ {error || 'Recipe not found'}</div>;

  const itemPrice = recipe.price || 15.99;
  const deliveryFee = 4.99;
  const totalPrice = (itemPrice * quantity) + deliveryFee;

  return (
    <div className="container" style={{ maxWidth: '750px' }}>
      <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShoppingBag color="#10b981" /> Confirm Meal Kit Order
        </h1>

        {error && <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=60'}
            alt={recipe.title}
            style={{ width: '130px', height: '100px', objectFit: 'cover', borderRadius: '12px' }}
          />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{recipe.title}</h3>
            <span style={{ color: '#10b981', fontWeight: '700', fontSize: '1.1rem' }}>${itemPrice.toFixed(2)} / kit</span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Quantity:</span>
              <button 
                type="button"
                className="btn btn-secondary" 
                style={{ padding: '0.2rem 0.6rem' }} 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
              <button 
                type="button"
                className="btn btn-secondary" 
                style={{ padding: '0.2rem 0.6rem' }} 
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck color="#f59e0b" size={18} /> Shipping & Delivery Address
          </h3>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              className="form-input"
              required
              value={shipping.street}
              onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                required
                value={shipping.city}
                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">ZIP Code</label>
              <input
                type="text"
                className="form-input"
                required
                value={shipping.zipCode}
                onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
              />
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '12px', margin: '1.5rem 0', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#94a3b8' }}>
              <span>Meal Kits ({quantity}):</span>
              <span>${(itemPrice * quantity).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#94a3b8' }}>
              <span>Eco Delivery Fee:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
              <span>Total:</span>
              <span style={{ color: '#10b981' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }} disabled={submitting}>
            {submitting ? 'Placing Order...' : 'Confirm Order & Pay'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
