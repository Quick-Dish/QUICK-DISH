import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const navigate = useNavigate();

  // Toggle between Login and Register
  const [isRegistering, setIsRegistering] = useState(false);

  // Form Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear errors

    try {
      let res;
      if (isRegistering) {
        // --- REGISTER ---
        res = await axios.post('https://quick-dish-hk9b.onrender.com/api/users/register', { name, email, password });
        alert("Account Created! Logging you in...");
      } else {
        // --- LOGIN ---
        res = await axios.post('https://quick-dish-hk9b.onrender.com/api/users/login', { email, password });
      }

      // Success! Save Data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('name', res.data.user.name);

      setToken(res.data.token);
      navigate('/'); // Go Home

    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.response?.data?.msg || "Authentication failed. Please check your details.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontFamily: 'Arial' }}>

      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>
        {isRegistering ? 'Create Account 📝' : 'Welcome Back 👨‍🍳'}
      </h2>

      {/* Error Message Display */}
      {error && <div style={{ background: '#ffeded', color: '#e74c3c', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        {/* Name Field (Only for Register) */}
        {isRegistering && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <button
          type="submit"
          style={{ padding: '12px', background: isRegistering ? '#3498db' : '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          {isRegistering ? 'Sign Up' : 'Login'}
        </button>
      </form>

      {/* Switch Mode Button */}
      <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        <p style={{ color: '#777', fontSize: '14px', margin: '0 0 10px 0' }}>
          {isRegistering ? 'Already have an account?' : 'New to Meal Kit?'}
        </p>
        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError(''); // Clear errors when switching
          }}
          style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
        >
          {isRegistering ? 'Login here' : 'Create an account'}
        </button>
      </div>
    </div>
  );
};

export default Login;