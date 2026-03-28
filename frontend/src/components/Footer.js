import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon">✦</span>
              <div>
                <span className="footer__logo-name">LUXESTAY</span>
                <span className="footer__logo-tag">Premium Hotels</span>
              </div>
            </div>
            <p className="footer__brand-desc">
              Where every moment is crafted with precision, passion, and an unwavering commitment to excellence. Your extraordinary stay awaits.
            </p>
            <div className="footer__socials">
              {['𝕏', 'in', 'f', '📸'].map((s, i) => (
                <a key={i} href="#!" className="footer__social">{s}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <ul className="footer__col-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">All Rooms</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Rooms */}
          <div className="footer__col">
            <h4 className="footer__col-title">Room Types</h4>
            <ul className="footer__col-links">
              <li><Link to="/rooms?cat=Classic">Classic Rooms</Link></li>
              <li><Link to="/rooms?cat=Suite">Luxury Suites</Link></li>
              <li><Link to="/rooms?cat=Presidential">Presidential</Link></li>
              <li><Link to="/rooms?cat=Family">Family Suites</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <ul className="footer__col-links footer__col-links--contact">
              <li>📍 The Palm, Dubai, UAE</li>
              <li>📞 +971 4 000 0000</li>
              <li>✉️ stay@luxestay.com</li>
              <li>🕐 24/7 Concierge</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} LuxeStay Hotels. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#!">Privacy Policy</a>
            <a href="#!">Terms of Service</a>
            <a href="#!">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
