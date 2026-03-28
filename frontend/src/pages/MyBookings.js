import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';

const STATUS_COLORS = { Confirmed:'#4caf50', Pending:'#ff9800', 'Checked In':'#2196f3', 'Checked Out':'#9e9e9e', Cancelled:'#e07070' };

export default function MyBookings() {
  const { isLoggedIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;
    bookingsAPI.getMyBookings().then(d => setBookings(d.bookings || [])).finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/login" />;

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsAPI.cancel(id);
      setBookings(bs => bs.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
      setToast('Booking cancelled successfully.');
      setTimeout(() => setToast(''), 2500);
    } catch (e) { setToast(e.message); setTimeout(() => setToast(''), 2500); }
  };

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', paddingBottom: '80px' }}>
      {toast && <div className="toast">{toast}</div>}
      <div className="page-header"><div className="container"><h1 className="fade-up">My Bookings</h1><p className="fade-up-1">Manage and view all your reservations</p></div></div>
      <div className="container" style={{ paddingTop: '40px' }}>
        {loading ? <div style={{ textAlign: 'center', padding: '60px' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> :
         bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛏</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--cream)', marginBottom: '8px' }}>No bookings yet</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '28px' }}>Time to plan your next luxury escape!</p>
            <Link to="/rooms" className="btn-primary">Browse Rooms</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bookings.map(b => {
              const room = b.room;
              return (
                <div key={b._id} style={{ display: 'flex', gap: '24px', background: 'var(--dark-3)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <img src={room?.images?.[0]} alt={room?.name} style={{ width: '200px', height: '140px', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--cream)', marginBottom: '8px' }}>{room?.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '4px' }}>📅 {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()} · {b.nights} nights</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '4px' }}>👥 {b.guests} guests</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.25)' }}>Ref: <span style={{ color: 'var(--gold)' }}>{b.referenceNumber}</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: STATUS_COLORS[b.status] + '22', color: STATUS_COLORS[b.status], border: `1px solid ${STATUS_COLORS[b.status]}44`, marginBottom: '10px', display: 'inline-block' }}>{b.status}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)' }}>${b.totalAmount}</div>
                      {b.status === 'Confirmed' && <button className="btn-ghost" style={{ fontSize: '11px', padding: '8px 16px', marginTop: '8px', display: 'block' }} onClick={() => handleCancel(b._id)}>Cancel Booking</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ marginTop: '48px', textAlign: 'center' }}><Link to="/rooms" className="btn-outline">Book Another Room →</Link></div>
      </div>
    </div>
  );
}
