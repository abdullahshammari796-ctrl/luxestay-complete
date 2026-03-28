import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { roomsAPI, reviewsAPI } from '../services/api';
import './RoomDetail.css';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([roomsAPI.getById(id), reviewsAPI.getForRoom(id)])
      .then(([roomData, reviewData]) => { setRoom(roomData.room); setReviews(reviewData.reviews || []); })
      .catch(() => navigate('/rooms'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div style={{ textAlign: 'center', padding: '120px' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;
  if (!room) return null;

  const nights = checkIn && checkOut ? Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 1;
  const total = nights * room.price;

  const handleBook = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return alert('Please select check-in and check-out dates.');
    navigate(`/booking/${room._id}?checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="rd-page">
      <div className="breadcrumb container">
        <Link to="/">Home</Link><span>›</span><Link to="/rooms">Rooms</Link><span>›</span><span>{room.name}</span>
      </div>
      <div className="rd-gallery container">
        <div className="rd-main-img"><img src={room.images?.[activeImg] || room.images?.[0]} alt={room.name} />{room.badge && <span className="room-badge">{room.badge}</span>}{!room.available && <div className="rd-unavail-overlay">Currently Unavailable</div>}</div>
        {room.images?.length > 1 && <div className="rd-thumbs">{room.images.map((img, i) => <button key={i} className={`rd-thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}><img src={img} alt="" /></button>)}</div>}
      </div>
      <div className="rd-layout container">
        <div>
          <div className="rd-hdr">
            <div><div className="rd-cat">{room.category}</div><h1 className="rd-name">{room.name}</h1><div className="rd-meta-row"><span className="stars">{'★'.repeat(Math.floor(room.rating))}</span><span className="rd-rating">{room.rating}</span><span className="rd-reviews-count">({room.numReviews} reviews)</span></div></div>
            <div className="rd-price-badge"><span className="rd-price">${room.price}</span><span className="rd-per">/night</span></div>
          </div>
          <div className="divider" />
          <div className="rd-quick">
            {[['🛏','Bed Type',room.bed],['📐','Room Size',room.size],['👥','Max Guests',`${room.capacity} persons`],['🪟','View',room.view],['🏢','Floor',room.floor],['✅','Status',room.available?'Available':'Unavailable']].map(([icon,lbl,val]) => (
              <div key={lbl} className="rd-qi"><span className="rd-qi-icon">{icon}</span><div><div className="rd-qi-lbl">{lbl}</div><div className="rd-qi-val" style={lbl==='Status'?{color:room.available?'#4caf50':'#e07070'}:{}}>{val}</div></div></div>
            ))}
          </div>
          <div className="rd-sec"><h3 className="rd-sec-title">About This Room</h3><p className="rd-description">{room.description}</p></div>
          <div className="rd-sec"><h3 className="rd-sec-title">Room Amenities</h3><div className="rd-amenities">{room.amenities?.map(a => <div key={a} className="rd-amenity"><span className="rd-amenity-check">✦</span>{a}</div>)}</div></div>
          <div className="rd-sec">
            <h3 className="rd-sec-title">Guest Reviews</h3>
            <div className="rd-rating-summary"><div className="rd-rating-big">{room.rating}</div><div><div className="stars" style={{fontSize:'20px'}}>{'★'.repeat(Math.floor(room.rating))}</div><div style={{fontSize:'13px',color:'var(--text-light)',marginTop:'4px'}}>Based on {room.numReviews} reviews</div></div></div>
            {reviews.length > 0 ? reviews.map(r => (
              <div key={r._id} className="rd-review"><div className="rd-review-header"><div className="rd-review-avatar">{r.user?.name?.charAt(0)}</div><div><div className="rd-review-name">{r.user?.name}</div><div className="rd-review-meta">{new Date(r.createdAt).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</div></div><div className="rd-review-stars">{'★'.repeat(r.rating)}</div></div><p className="rd-review-text">"{r.text}"</p></div>
            )) : <p style={{fontSize:'14px',color:'var(--text-light)'}}>No reviews yet. Be the first to stay!</p>}
          </div>
        </div>
        <div className="rd-booking-widget">
          <div className="booking-widget">
            <div className="booking-widget__header"><span className="booking-widget__price">${room.price}</span><span className="booking-widget__per">/night</span>{room.originalPrice && <span className="booking-widget__orig">${room.originalPrice}</span>}</div>
            <div className="booking-widget__stars"><span className="stars">{'★'.repeat(Math.floor(room.rating))}</span><span style={{fontSize:'13px',color:'var(--text-light)',marginLeft:'6px'}}>{room.rating} · {room.numReviews} reviews</span></div>
            <div className="divider" style={{margin:'16px 0'}}/>
            {room.available ? (
              <form onSubmit={handleBook} className="booking-widget__form">
                <div className="form-group"><label>CHECK-IN</label><input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} required min={new Date().toISOString().split('T')[0]}/></div>
                <div className="form-group"><label>CHECK-OUT</label><input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} required min={checkIn}/></div>
                <div className="form-group"><label>GUESTS</label><select value={guests} onChange={e=>setGuests(+e.target.value)}>{Array.from({length:room.capacity},(_,i)=>i+1).map(n=><option key={n}>{n} {n===1?'Guest':'Guests'}</option>)}</select></div>
                {checkIn && checkOut && <div className="booking-widget__summary">
                  <div className="booking-widget__summary-row"><span>${room.price} × {nights} night{nights>1?'s':''}</span><span>${room.price*nights}</span></div>
                  <div className="booking-widget__summary-row"><span>Taxes & Fees (10%)</span><span>${Math.round(total*.1)}</span></div>
                  <div className="booking-widget__summary-total"><span>Total</span><span>${Math.round(total*1.1)}</span></div>
                </div>}
                <button type="submit" className="btn-primary" style={{width:'100%',justifyContent:'center',marginTop:'8px'}}>Reserve Now</button>
              </form>
            ) : (
              <div className="booking-widget__unavail"><p>This room is currently unavailable.</p><Link to="/rooms" className="btn-outline" style={{marginTop:'16px',justifyContent:'center'}}>Browse Other Rooms</Link></div>
            )}
            <div className="booking-widget__note"><span>🔒</span> No charge until check-in. Free cancellation 48hrs before arrival.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
