import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROOMS, CATEGORIES, AMENITIES_LIST, REVIEWS } from '../data/mockData';
import './Home.css';

const HERO_SLIDES = [
  { bg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80', tag: 'Ocean Front', title: 'Luxury Beyond\nImagination', sub: 'Where every sunset is yours alone' },
  { bg: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80', tag: 'Sky Villa', title: 'Above the\nClouds', sub: 'Elevate your stay to new heights' },
  { bg: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&q=80', tag: 'Private Retreat', title: 'Your Own\nSanctuary', sub: 'Crafted for those who demand the best' }
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/rooms?checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`);
  };

  const featuredRooms = ROOMS.filter(r => r.featured).slice(0, 4);

  return (
    <div className="home">
      {/* ---- HERO ---- */}
      <section className="hero">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`hero__slide ${i === slide ? 'hero__slide--active' : ''}`} style={{ backgroundImage: `url(${s.bg})` }} />
        ))}
        <div className="hero__overlay" />
        <div className="hero__content container">
          <span className="tag fade-up">{HERO_SLIDES[slide].tag}</span>
          <h1 className="hero__title fade-up-1">
            {HERO_SLIDES[slide].title.split('\n').map((l, i) => <span key={i}>{l}<br/></span>)}
          </h1>
          <p className="hero__sub fade-up-2">{HERO_SLIDES[slide].sub}</p>
          <div className="hero__ctas fade-up-3">
            <Link to="/rooms" className="btn-primary">Explore Rooms</Link>
            <Link to="/about" className="btn-ghost">Our Story</Link>
          </div>
        </div>

        {/* Slide Dots */}
        <div className="hero__dots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`hero__dot ${i === slide ? 'hero__dot--active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="hero__scroll">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ---- BOOKING BAR ---- */}
      <section className="booking-bar">
        <div className="container">
          <form className="booking-bar__form" onSubmit={handleSearch}>
            <div className="booking-bar__field">
              <label>CHECK-IN</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="booking-bar__divider" />
            <div className="booking-bar__field">
              <label>CHECK-OUT</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required min={checkIn || new Date().toISOString().split('T')[0]} />
            </div>
            <div className="booking-bar__divider" />
            <div className="booking-bar__field">
              <label>GUESTS</label>
              <select value={guests} onChange={e => setGuests(e.target.value)}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary booking-bar__btn">Search Rooms</button>
          </form>
        </div>
      </section>

      {/* ---- STATS ---- */}
      <section className="stats section-sm">
        <div className="container">
          <div className="stats__grid">
            {[
              { num: '15+', label: 'Years of Excellence' },
              { num: '240', label: 'Luxury Rooms & Suites' },
              { num: '98%', label: 'Guest Satisfaction' },
              { num: '50+', label: 'Awards Received' }
            ].map((s, i) => (
              <div key={i} className="stats__item fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stats__num">{s.num}</div>
                <div className="stats__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- ROOM CATEGORIES ---- */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Our Collection</span>
            <h2 className="section-title">Room Categories</h2>
            <div className="divider-center" />
            <p className="section-desc">From intimate classic rooms to breathtaking presidential suites, each space is a curated experience.</p>
          </div>
          <div className="categories__grid">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.id} to={`/rooms?cat=${cat.name}`} className="category-card fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="category-card__icon">{cat.icon}</div>
                <div className="category-card__name">{cat.name}</div>
                <div className="category-card__count">{cat.count} rooms</div>
                <div className="category-card__desc">{cat.desc}</div>
                <div className="category-card__arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- FEATURED ROOMS ---- */}
      <section className="section featured-rooms">
        <div className="container">
          <div className="section-header">
            <span className="tag">Hand-Picked</span>
            <h2 className="section-title">Featured Rooms & Suites</h2>
            <div className="divider-center" />
          </div>
          <div className="rooms__grid">
            {featuredRooms.map((room, i) => (
              <Link key={room.id} to={`/rooms/${room.id}`} className="room-card card fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="room-card__img-wrap">
                  <img src={room.image} alt={room.name} className="room-card__img" />
                  {room.badge && <span className="room-card__badge">{room.badge}</span>}
                  {!room.available && <div className="room-card__unavail">Unavailable</div>}
                  <div className="room-card__overlay">
                    <span className="btn-primary" style={{fontSize:'11px',padding:'10px 22px'}}>View Room</span>
                  </div>
                </div>
                <div className="room-card__body">
                  <div className="room-card__meta">
                    <span className="room-card__cat">{room.category}</span>
                    <span className="stars">{'★'.repeat(Math.floor(room.rating))}</span>
                  </div>
                  <h3 className="room-card__name">{room.name}</h3>
                  <div className="room-card__features">
                    <span>🛏 {room.bed}</span>
                    <span>📐 {room.size}</span>
                    <span>👥 {room.capacity}</span>
                  </div>
                  <div className="room-card__price-row">
                    <div>
                      <span className="room-card__price">${room.price}</span>
                      <span className="room-card__per">/night</span>
                      {room.originalPrice && <span className="room-card__orig">${room.originalPrice}</span>}
                    </div>
                    <span className="room-card__reviews">{room.reviews} reviews</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop:'48px'}}>
            <Link to="/rooms" className="btn-outline">View All Rooms →</Link>
          </div>
        </div>
      </section>

      {/* ---- AMENITIES ---- */}
      <section className="section amenities-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">World-Class Facilities</span>
            <h2 className="section-title">Hotel Amenities</h2>
            <div className="divider-center" />
          </div>
          <div className="amenities__grid">
            {AMENITIES_LIST.map((a, i) => (
              <div key={i} className="amenity-card fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="amenity-card__icon">{a.icon}</div>
                <div className="amenity-card__title">{a.title}</div>
                <div className="amenity-card__desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- ABOUT SNIPPET ---- */}
      <section className="section about-snippet">
        <div className="container">
          <div className="about-snippet__grid">
            <div className="about-snippet__imgs">
              <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80" alt="Hotel" className="about-snippet__img1" />
              <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80" alt="Hotel Pool" className="about-snippet__img2" />
              <div className="about-snippet__badge-box">
                <span className="about-snippet__badge-num">15+</span>
                <span className="about-snippet__badge-txt">Years of Excellence</span>
              </div>
            </div>
            <div className="about-snippet__content">
              <span className="tag">Our Story</span>
              <h2 className="section-title" style={{textAlign:'left'}}>A Legacy of<br/>Unmatched Luxury</h2>
              <div className="divider" />
              <p className="about-snippet__text">
                Founded in 2008, LuxeStay has redefined the standard of luxury hospitality. Nestled along the pristine shores of Dubai, we have welcomed guests from across the globe, offering experiences that transcend the ordinary.
              </p>
              <p className="about-snippet__text">
                Every room, every meal, and every interaction is crafted with one purpose — to make you feel like the world belongs to you. Our award-winning team of 500+ hospitality professionals lives by a singular creed: excellence, always.
              </p>
              <div className="about-snippet__features">
                {['Award-Winning Service', 'Sustainable Luxury', 'Personalized Stays', 'Culinary Excellence'].map((f, i) => (
                  <div key={i} className="about-snippet__feat">✦ {f}</div>
                ))}
              </div>
              <Link to="/about" className="btn-primary" style={{marginTop:'32px'}}>Discover Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- REVIEWS ---- */}
      <section className="section reviews-section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Guest Voices</span>
            <h2 className="section-title">What Our Guests Say</h2>
            <div className="divider-center" />
          </div>
          <div className="reviews__grid">
            {REVIEWS.slice(0, 3).map((r, i) => (
              <div key={r.id} className="review-card fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="review-card__stars">{'★'.repeat(r.rating)}</div>
                <p className="review-card__text">"{r.text}"</p>
                <div className="review-card__footer">
                  <div className="review-card__avatar">{r.avatar}</div>
                  <div>
                    <div className="review-card__name">{r.name}</div>
                    <div className="review-card__country">{r.country} · {r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA BANNER ---- */}
      <section className="cta-banner">
        <div className="cta-banner__bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80)' }} />
        <div className="cta-banner__overlay" />
        <div className="container cta-banner__content">
          <span className="tag">Limited Availability</span>
          <h2 className="cta-banner__title">Reserve Your Suite<br/>This Season</h2>
          <p className="cta-banner__sub">Experience unparalleled luxury. Book directly with us and receive exclusive benefits.</p>
          <div className="cta-banner__ctas">
            <Link to="/rooms" className="btn-primary">Book Now</Link>
            <Link to="/contact" className="btn-ghost">Contact Concierge</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
