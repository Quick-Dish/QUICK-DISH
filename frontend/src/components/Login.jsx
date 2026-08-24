import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LogIn, UserPlus, Lock, Mail, User } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/users';

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(location.pathname === '/register');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const endpoint = isRegister ? `${API_BASE}/register` : `${API_BASE}/login`;

    try {
      const res = await axios.post(endpoint, form);
      const { token, user, msg } = res.data;

      const userRole = user.role || 'user';
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id || user._id);
      localStorage.setItem('name', user.name);
      localStorage.setItem('role', userRole);

      if (setToken) setToken(token);

      setSuccess(msg || (isRegister ? 'Account created successfully!' : 'Login successful!'));

      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="glass-panel" style={{ maxWidth: '440px', margin: '3rem auto', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            {isRegister ? 'Join Quick Dish' : 'Welcome Back'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
            {isRegister ? 'Create an account to order gourmet meal kits' : 'Sign in to access your orders and saved recipes'}
          </p>
        </div>

        {error && <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>{error}</div>}
        {success && <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#6ee7b7', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Chef Gordon"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="chef@quickdish.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className={`btn ${isRegister ? 'btn-accent' : 'btn-primary'}`}
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '700', cursor: 'pointer' }}
            onClick={() => {
              setError('');
              setSuccess('');
              setIsRegister(!isRegister);
            }}
          >
            {isRegister ? 'Sign In' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
