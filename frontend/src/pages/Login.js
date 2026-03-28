import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const from = location.state?.from || (user.role === 'admin' ? '/admin' : '/dashboard');
      navigate(from);
    } catch (err) {
      setError(err.message || 'Invalid email or password. Try admin@luxestay.com / admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80)' }} />
      <div className="auth-overlay" />
      <div className="auth-card fade-up">
        <div className="auth-card__logo">
          <span className="auth-card__logo-icon">✦</span>
          <span className="auth-card__logo-name">LUXESTAY</span>
        </div>
        <h2 className="auth-card__title">Welcome Back</h2>
        <p className="auth-card__sub">Sign in to manage your reservations</p>
        {error && <div className="auth-card__error">⚠️ {error}</div>}
        <form onSubmit={handleSubmit} className="auth-card__form">
          <div className="form-group"><label>EMAIL ADDRESS</label><input type="email" name="email" value={form.email} onChange={update} required placeholder="your@email.com" /></div>
          <div className="form-group"><label>PASSWORD</label><input type="password" name="password" value={form.password} onChange={update} required placeholder="••••••••" minLength={6} /></div>
          <div className="auth-card__row"><label className="auth-card__remember"><input type="checkbox" /> Remember me</label><span className="auth-card__forgot">Forgot password?</span></div>
          <button type="submit" className="btn-primary auth-card__submit" disabled={loading}>{loading ? <><div className="auth-spinner" />Signing in...</> : 'Sign In'}</button>
        </form>
        <p className="auth-card__switch">Don't have an account? <Link to="/signup">Create one free</Link></p>
        <p className="auth-card__demo">Demo: <code>admin@luxestay.com</code> / <code>admin123</code></p>
      </div>
    </div>
  );
}
