import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { roomsAPI } from '../services/api';
import { CATEGORIES } from '../data/mockData';
import './Rooms.css';

export default function Rooms() {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || 'All');
  const [sort, setSort] = useState('Recommended');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [showAvailable, setShowAvailable] = useState(false);
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    const params = {};
    if (selectedCat !== 'All') params.category = selectedCat;
    if (showAvailable) params.available = 'true';
    if (maxPrice < 1500) params.maxPrice = maxPrice;
    if (sort === 'Price: Low to High') params.sort = 'price_asc';
    else if (sort === 'Price: High to Low') params.sort = 'price_desc';
    else if (sort === 'Rating') params.sort = 'rating';
    setLoading(true);
    roomsAPI.getAll(params)
      .then(data => setRooms(data.rooms || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, [selectedCat, sort, maxPrice, showAvailable]);

  const filtered = rooms.filter(r => !searchQ || r.name.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="tag">Curated Collection</span>
          <h1 className="fade-up">Our Rooms & Suites</h1>
          <p className="fade-up-1">Discover spaces crafted for those who expect nothing but the finest</p>
        </div>
      </div>
      <div className="container rooms-page__layout">
        <aside className="rooms-sidebar">
          <div className="rooms-sidebar__section">
            <h4 className="rooms-sidebar__title">Search</h4>
            <input className="rooms-sidebar__search" type="text" placeholder="Room name, type..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          </div>
          <div className="rooms-sidebar__section">
            <h4 className="rooms-sidebar__title">Category</h4>
            <div className="rooms-sidebar__cats">
              {['All', ...CATEGORIES.map(c => c.name)].map(cat => (
                <button key={cat} className={`rooms-sidebar__cat ${selectedCat === cat ? 'active' : ''}`} onClick={() => setSelectedCat(cat)}>
                  {cat} {cat !== 'All' && <span className="rooms-sidebar__cat-count">{rooms.filter(r => r.category === cat).length}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="rooms-sidebar__section">
            <h4 className="rooms-sidebar__title">Max Price / Night</h4>
            <div className="rooms-sidebar__price-range"><span>$0</span><span>${maxPrice}</span></div>
            <input type="range" min="100" max="1500" step="50" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="rooms-sidebar__slider" />
          </div>
          <div className="rooms-sidebar__section">
            <h4 className="rooms-sidebar__title">Availability</h4>
            <label className="rooms-sidebar__toggle">
              <input type="checkbox" checked={showAvailable} onChange={e => setShowAvailable(e.target.checked)} />
              <span className="rooms-sidebar__toggle-track" />
              <span className="rooms-sidebar__toggle-label">Available rooms only</span>
            </label>
          </div>
        </aside>
        <main className="rooms-main">
          <div className="rooms-main__toolbar">
            <p className="rooms-main__count">{filtered.length} rooms found</p>
            <div className="rooms-main__sort">
              <label>Sort by:</label>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                {['Recommended','Price: Low to High','Price: High to Low','Rating'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : filtered.length === 0 ? (
            <div className="rooms-empty"><div className="rooms-empty__icon">🏨</div><h3>No rooms found</h3><p>Try adjusting your filters</p><button className="btn-outline" onClick={() => { setSelectedCat('All'); setShowAvailable(false); setMaxPrice(1500); setSearchQ(''); }}>Reset Filters</button></div>
          ) : (
            <div className="rooms-main__grid">
              {filtered.map((room, i) => (
                <div key={room._id} className="room-list-card card fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="room-list-card__img-wrap">
                    <img src={room.images?.[0]} alt={room.name} className="room-list-card__img" />
                    {room.badge && <span className="room-list-card__badge">{room.badge}</span>}
                    {!room.available && <div className="room-list-card__unavail">Currently Unavailable</div>}
                  </div>
                  <div className="room-list-card__body">
                    <div className="room-list-card__header">
                      <div><div className="room-list-card__cat">{room.category}</div><h3 className="room-list-card__name">{room.name}</h3></div>
                      <div className="room-list-card__rating-box"><span className="room-list-card__rating">{room.rating}</span><span className="room-list-card__reviews">{room.numReviews} reviews</span></div>
                    </div>
                    <p className="room-list-card__desc">{room.description?.substring(0, 120)}...</p>
                    <div className="room-list-card__features"><span>🛏 {room.bed}</span><span>📐 {room.size}</span><span>👥 Max {room.capacity}</span><span>🪟 {room.view}</span></div>
                    <div className="room-list-card__amenities">{room.amenities?.slice(0, 4).map(a => <span key={a} className="room-list-card__amenity">{a}</span>)}</div>
                    <div className="room-list-card__footer">
                      <div className="room-list-card__pricing"><span className="room-list-card__price">${room.price}</span><span className="room-list-card__per">/night</span>{room.originalPrice && <span className="room-list-card__orig">${room.originalPrice}</span>}</div>
                      <div className="room-list-card__actions">
                        <Link to={`/rooms/${room._id}`} className="btn-ghost" style={{ fontSize: '11px', padding: '10px 20px' }}>Details</Link>
                        {room.available && <Link to={`/booking/${room._id}`} className="btn-primary" style={{ fontSize: '11px', padding: '10px 24px' }}>Book Now</Link>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
