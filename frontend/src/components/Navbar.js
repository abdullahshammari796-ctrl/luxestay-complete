import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout, isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${location.pathname === '/' ? 'navbar--home' : 'navbar--page'}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">✦</span>
          <div>
            <span className="navbar__logo-name">LUXESTAY</span>
            <span className="navbar__logo-tag">Premium Hotels</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar__links">
          {navLinks.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={`navbar__link ${location.pathname === l.to ? 'active' : ''}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar__actions">
          {isLoggedIn ? (
            <div className="navbar__profile" onClick={() => setProfileOpen(!profileOpen)}>
              <div className="navbar__avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="navbar__username">{user?.name?.split(' ')[0]}</span>
              <span className="navbar__chevron">▾</span>
              {profileOpen && (
                <div className="navbar__dropdown">
                  <Link to="/dashboard" className="navbar__drop-item">📊 My Dashboard</Link>
                  <Link to="/bookings" className="navbar__drop-item">🛏️ My Bookings</Link>
                  {isAdmin && <Link to="/admin" className="navbar__drop-item">⚙️ Admin Panel</Link>}
                  <hr className="navbar__drop-divider" />
                  <button className="navbar__drop-item navbar__drop-item--danger" onClick={handleLogout}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost navbar__btn-sm">Sign In</Link>
              <Link to="/signup" className="btn-primary navbar__btn-sm">Join Free</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button className={`navbar__hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {navLinks.map(l => (
          <Link key={l.to} to={l.to} className="navbar__mobile-link">{l.label}</Link>
        ))}
        <div className="navbar__mobile-actions">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="navbar__mobile-link">📊 My Dashboard</Link>
              <Link to="/bookings" className="navbar__mobile-link">🛏️ My Bookings</Link>
              {isAdmin && <Link to="/admin" className="navbar__mobile-link">⚙️ Admin Panel</Link>}
              <button className="btn-outline" onClick={handleLogout} style={{marginTop: '12px', width: '100%'}}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost" style={{width: '100%', justifyContent: 'center'}}>Sign In</Link>
              <Link to="/signup" className="btn-primary" style={{width: '100%', justifyContent: 'center'}}>Join Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
