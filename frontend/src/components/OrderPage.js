import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const { recipeId } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();

  // State for Form Data
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [recipeTitle, setRecipeTitle] = useState("Loading...");

  // Fetch Recipe Title (Optional: just so user knows what they are buying)
  useEffect(() => {
    axios.get(`https://quick-dish-hk9b.onrender.com/api/recipes/${recipeId}`)
      .then(res => setRecipeTitle(res.data.title))
      .catch(err => console.error("Error loading recipe:", err));
  }, [recipeId]);

  const placeOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    try {
      const config = { headers: { 'x-auth-token': token } };
      const orderData = { 
        recipeId, 
        quantity, 
        address, 
        phone, 
        paymentMethod 
      };

      await axios.post('https://quick-dish-hk9b.onrender.com/api/orders', orderData, config);
      alert("✅ Order Placed Successfully!");
      navigate('/'); // Go back home
    } catch (err) {
      alert("❌ Order Failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>📦 Checkout: {recipeTitle}</h2>
      
      <form onSubmit={placeOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <label><strong>Quantity:</strong></label>
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required style={{ padding: '10px' }} />

        <label><strong>Delivery Address:</strong></label>
        <textarea rows="3" placeholder="Full Address..." value={address} onChange={(e) => setAddress(e.target.value)} required style={{ padding: '10px' }} />

        <label><strong>Phone Number:</strong></label>
        <input type="tel" placeholder="+91..." value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ padding: '10px' }} />

        <label><strong>Payment Method:</strong></label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ padding: '10px' }}>
          <option value="COD">Cash on Delivery (COD)</option>
          <option value="Online">Online Payment</option>
        </select>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" style={{ flex: 1, padding: '15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>✅ Confirm Order</button>
          <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: '15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>❌ Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default OrderPage;