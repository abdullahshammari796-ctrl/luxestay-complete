import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', agree: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    if (!form.agree) return setError('Please accept the terms and conditions.');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80)' }} />
      <div className="auth-overlay" />
      <div className="auth-card auth-card--wide fade-up">
        <div className="auth-card__logo"><span className="auth-card__logo-icon">✦</span><span className="auth-card__logo-name">LUXESTAY</span></div>
        <h2 className="auth-card__title">Create Your Account</h2>
        <p className="auth-card__sub">Join thousands of guests who enjoy exclusive benefits</p>
        {error && <div className="auth-card__error">⚠️ {error}</div>}
        <form onSubmit={handleSubmit} className="auth-card__form auth-card__form--grid">
          <div className="form-group"><label>FULL NAME</label><input name="name" value={form.name} onChange={update} required placeholder="Your full name" /></div>
          <div className="form-group"><label>EMAIL ADDRESS</label><input type="email" name="email" value={form.email} onChange={update} required placeholder="your@email.com" /></div>
          <div className="form-group"><label>PHONE NUMBER</label><input type="tel" name="phone" value={form.phone} onChange={update} placeholder="+971 XX XXX XXXX" /></div>
          <div />
          <div className="form-group"><label>PASSWORD</label><input type="password" name="password" value={form.password} onChange={update} required placeholder="Min. 6 characters" minLength={6} /></div>
          <div className="form-group"><label>CONFIRM PASSWORD</label><input type="password" name="confirm" value={form.confirm} onChange={update} required placeholder="Repeat password" /></div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="auth-card__remember"><input type="checkbox" name="agree" checked={form.agree} onChange={update} /> I agree to the <a href="#!">Terms of Service</a> and <a href="#!">Privacy Policy</a></label></div>
          <div style={{ gridColumn: '1/-1' }}><button type="submit" className="btn-primary auth-card__submit" disabled={loading} style={{ width: '100%' }}>{loading ? <><div className="auth-spinner" />Creating account...</> : "Create Account – It's Free"}</button></div>
        </form>
        <div className="auth-card__benefits">{['Exclusive member discounts','Early booking access','Free room upgrades','Priority support'].map((b, i) => <div key={i} className="auth-card__benefit">✦ {b}</div>)}</div>
        <p className="auth-card__switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
