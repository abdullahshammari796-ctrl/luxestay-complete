import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, reviewsAPI, authAPI, roomsAPI } from '../services/api';
import './Dashboard.css';

const STATUS_COLORS = { Confirmed:'#4caf50', Pending:'#ff9800', 'Checked In':'#2196f3', 'Checked Out':'#9e9e9e', Cancelled:'#e07070' };

export default function Dashboard() {
  const { user, isLoggedIn, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', nationality: user?.nationality || '' });
  const [reviewForm, setReviewForm] = useState({ roomId: '', rating: 5, text: '' });
  const [toast, setToast] = useState('');
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    if (!isLoggedIn) return;
    Promise.all([bookingsAPI.getMyBookings(), roomsAPI.getAll()])
      .then(([bData, rData]) => { setBookings(bData.bookings || []); setRooms(rData.rooms || []); })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/login" />;

  const stats = [
    { label: 'Total Bookings', val: bookings.length, icon: '🛏' },
    { label: 'Nights Stayed', val: bookings.filter(b => b.status === 'Checked Out').reduce((s, b) => s + (b.nights || 0), 0), icon: '🌙' },
    { label: 'Total Spent', val: `$${bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.totalAmount || 0), 0)}`, icon: '💳' },
    { label: 'Loyalty Points', val: user?.loyaltyPoints || 0, icon: '⭐' }
  ];

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try { await bookingsAPI.cancel(id); setBookings(bs => bs.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b)); showToast('Booking cancelled.'); } catch (e) { showToast(e.message); }
  };
  const handleProfileSave = async () => {
    try { const d = await authAPI.updateProfile(profileForm); updateUser(d.user); showToast('Profile updated!'); } catch (e) { showToast(e.message); }
  };
  const handleReviewSubmit = async () => {
    if (!reviewForm.roomId || !reviewForm.text) return showToast('Please fill in all fields.');
    try { await reviewsAPI.create({ roomId: reviewForm.roomId, rating: reviewForm.rating, text: reviewForm.text }); showToast('Review submitted! Thank you.'); setReviewForm({ roomId: '', rating: 5, text: '' }); } catch (e) { showToast(e.message); }
  };

  const TABS = [['overview','📊','Overview'],['bookings','🛏','Bookings'],['profile','👤','Profile'],['reviews','⭐','Reviews']];
  const BkCard = ({ b }) => {
    const room = b.room;
    return (
      <div className="dashboard__booking-card">
        <img src={room?.images?.[0] || room?.image} alt={room?.name} className="dashboard__booking-img" />
        <div className="dashboard__booking-info">
          <div className="dashboard__booking-room">{room?.name}</div>
          <div className="dashboard__booking-d">📅 {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} · {b.nights} nights</div>
          <div className="dashboard__booking-d">👥 {b.guests} guests · <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{b.referenceNumber}</span></div>
        </div>
        <div className="dashboard__booking-right">
          <span className="dashboard__booking-status" style={{ background: STATUS_COLORS[b.status] + '22', color: STATUS_COLORS[b.status], borderColor: STATUS_COLORS[b.status] + '44' }}>{b.status}</span>
          <div className="dashboard__booking-total">${b.totalAmount}</div>
          {b.status === 'Confirmed' && <button className="dash-cancel" onClick={() => handleCancel(b._id)}>Cancel</button>}
          {b.status === 'Checked Out' && <button className="dash-review-btn" onClick={() => setActiveTab('reviews')}>Write Review</button>}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {toast && <div className="toast">{toast}</div>}
      <div className="dashboard__header">
        <div className="container dashboard__header-inner">
          <div className="dashboard__avatar">{user?.name?.charAt(0)}</div>
          <div><div className="dashboard__welcome">Welcome back, {user?.name?.split(' ')[0]}</div><div className="dashboard__member">Gold Member · Since {new Date(user?.memberSince || Date.now()).getFullYear()}</div></div>
          <Link to="/rooms" className="btn-primary" style={{ marginLeft: 'auto' }}>Book a Room →</Link>
        </div>
      </div>
      <div className="container dashboard__layout">
        <aside className="dashboard__sidebar">{TABS.map(([t,icon,lbl]) => <button key={t} className={`dashboard__tab ${activeTab===t?'on':''}`} onClick={() => setActiveTab(t)}>{icon} {lbl}</button>)}</aside>
        <main className="dashboard__main">
          {loading ? <div style={{ textAlign: 'center', padding: '60px' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : <>
            {activeTab === 'overview' && <div className="fade-up">
              <h2 className="dashboard__section-title">Dashboard Overview</h2>
              <div className="dashboard__stats">{stats.map((s,i) => <div key={i} className="dashboard__stat-card"><div className="dashboard__stat-icon">{s.icon}</div><div className="dashboard__stat-val">{s.val}</div><div className="dashboard__stat-label">{s.label}</div></div>)}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--cream)', margin: '28px 0 14px', fontWeight: 400 }}>Upcoming Stays</h3>
              {bookings.filter(b => ['Confirmed','Pending','Checked In'].includes(b.status)).length === 0
                ? <div className="dashboard__empty"><p>No upcoming bookings. <Link to="/rooms">Explore rooms →</Link></p></div>
                : bookings.filter(b => ['Confirmed','Pending','Checked In'].includes(b.status)).map(b => <BkCard key={b._id} b={b} />)}
            </div>}
            {activeTab === 'bookings' && <div className="fade-up"><h2 className="dashboard__section-title">My Bookings</h2>{bookings.length === 0 ? <div className="dashboard__empty"><p>No bookings yet.</p></div> : bookings.map(b => <BkCard key={b._id} b={b} />)}</div>}
            {activeTab === 'profile' && <div className="fade-up">
              <h2 className="dashboard__section-title">My Profile</h2>
              <div className="dashboard__profile-card">
                <div className="dashboard__profile-avatar">{user?.name?.charAt(0)}</div>
                <div className="dashboard__profile-form">
                  <div className="dashboard__profile-grid">
                    {[['FULL NAME','name','text'],['EMAIL','email','email'],['PHONE','phone','tel'],['NATIONALITY','nationality','text']].map(([lbl,field,type]) => (
                      <div key={field} className="form-group"><label>{lbl}</label><input type={type} value={profileForm[field] || ''} onChange={e => setProfileForm(f => ({...f,[field]:e.target.value}))}/></div>
                    ))}
                  </div>
                  <button className="btn-primary" style={{ marginTop: '24px' }} onClick={handleProfileSave}>Save Changes</button>
                </div>
              </div>
            </div>}
            {activeTab === 'reviews' && <div className="fade-up">
              <h2 className="dashboard__section-title">Write a Review</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '580px' }}>
                <div className="form-group"><label>SELECT ROOM</label><select value={reviewForm.roomId} onChange={e => setReviewForm(f => ({...f, roomId: e.target.value}))}><option value="">-- Choose a room --</option>{rooms.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}</select></div>
                <div className="form-group"><label>RATING</label><div className="dashboard__star-select">{[1,2,3,4,5].map(n => <button key={n} className="dashboard__star" style={{ color: n <= reviewForm.rating ? 'var(--gold)' : 'rgba(255,255,255,.2)' }} onClick={() => setReviewForm(f => ({...f, rating: n}))}>★</button>)}</div></div>
                <div className="form-group"><label>YOUR REVIEW</label><textarea rows={5} value={reviewForm.text} onChange={e => setReviewForm(f => ({...f, text: e.target.value}))} placeholder="Share your experience at LuxeStay..." style={{ resize: 'vertical' }}/></div>
                <button className="btn-primary" onClick={handleReviewSubmit}>Submit Review</button>
              </div>
            </div>}
          </>}
        </main>
      </div>
    </div>
  );
}
