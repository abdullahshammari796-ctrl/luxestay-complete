import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { roomsAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

export default function Booking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [room, setRoom] = useState(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    checkIn: searchParams.get('checkin') || '',
    checkOut: searchParams.get('checkout') || '',
    guests: parseInt(searchParams.get('guests')) || 1,
    specialReq: '',
    payMethod: 'card',
    cardNum: '', cardExpiry: '', cardCvv: '', cardName: ''
  });

  useEffect(() => {
    roomsAPI.getById(id).then(d => setRoom(d.room)).catch(() => navigate('/rooms'));
  }, [id, navigate]);

  if (!room) return <div style={{ textAlign: 'center', padding: '120px' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;

  const nights = form.checkIn && form.checkOut ? Math.max(1, Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000)) : 1;
  const subtotal = nights * room.price;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;
  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleStep1 = e => { e.preventDefault(); if (!form.checkIn || !form.checkOut) return; setStep(2); window.scrollTo(0, 0); };
  const handleStep2 = e => { e.preventDefault(); setStep(3); window.scrollTo(0, 0); };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { navigate('/login', { state: { from: `/booking/${id}` } }); return; }
    setLoading(true);
    setError('');
    try {
      const res = await bookingsAPI.create({
        roomId: room._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
        specialRequests: form.specialReq,
        paymentMethod: form.payMethod,
        guestInfo: { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone }
      });
      setBookingData(res.booking);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && bookingData) return (
    <div className="booking-success">
      <div className="booking-success__card">
        <div className="booking-success__icon">✦</div>
        <h2 className="booking-success__title">Booking Confirmed!</h2>
        <p className="booking-success__sub">Your reservation is confirmed. We look forward to welcoming you.</p>
        <div className="booking-success__ref"><span>Booking Reference</span><strong>{bookingData.referenceNumber}</strong></div>
        <div className="booking-success__details">
          {[['Room',room.name],['Check-in',form.checkIn],['Check-out',form.checkOut],['Guests',form.guests],['Total Paid',`$${total}`]].map(([k,v]) => <div key={k} className="booking-success__detail"><span>{k}</span><strong style={k==='Total Paid'?{color:'var(--gold)'}:{}}>{v}</strong></div>)}
        </div>
        <p className="booking-success__email">Confirmation sent to <strong>{form.email}</strong></p>
        <div className="booking-success__actions">
          <Link to="/bookings" className="btn-primary">View My Bookings</Link>
          <Link to="/" className="btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="booking-page">
      <div className="page-header"><div className="container"><h1 className="fade-up">Complete Your Booking</h1><p className="fade-up-1">{room.name}</p></div></div>
      <div className="booking-progress container">
        {['Stay Details','Guest Info','Payment'].map((label,i) => (
          <React.Fragment key={i}>
            <div className={`booking-progress__step ${step>i+1?'done':''} ${step===i+1?'active':''}`}>
              <div className="booking-progress__circle">{step>i+1?'✓':i+1}</div><span>{label}</span>
            </div>
            {i<2&&<div className={`booking-progress__line ${step>i+1?'done':''}`}/>}
          </React.Fragment>
        ))}
      </div>
      <div className="booking-page__layout container">
        <div className="booking-form">
          {step===1&&<form onSubmit={handleStep1} className="booking-form__step fade-up">
            <h3 className="booking-form__step-title">Select Your Dates</h3>
            <div className="booking-form__grid">
              <div className="form-group"><label>CHECK-IN DATE</label><input type="date" name="checkIn" value={form.checkIn} onChange={update} required min={new Date().toISOString().split('T')[0]}/></div>
              <div className="form-group"><label>CHECK-OUT DATE</label><input type="date" name="checkOut" value={form.checkOut} onChange={update} required min={form.checkIn}/></div>
              <div className="form-group"><label>NUMBER OF GUESTS</label><select name="guests" value={form.guests} onChange={update}>{Array.from({length:room.capacity},(_,i)=>i+1).map(n=><option key={n}>{n} {n===1?'Guest':'Guests'}</option>)}</select></div>
              <div className="form-group"><label>SPECIAL REQUESTS</label><textarea name="specialReq" value={form.specialReq} onChange={update} rows={3} placeholder="Early check-in, dietary requirements..." style={{resize:'vertical'}}/></div>
            </div>
            <div className="booking-form__avail-note"><span className="booking-form__avail-dot"/> Room available for selected dates</div>
            <div className="booking-form__actions"><span/><button type="submit" className="btn-primary">Continue to Guest Info →</button></div>
          </form>}
          {step===2&&<form onSubmit={handleStep2} className="booking-form__step fade-up">
            <h3 className="booking-form__step-title">Guest Information</h3>
            {!isLoggedIn&&<div className="booking-form__login-note"><span>💡</span><span>Already have an account? <Link to="/login">Sign in</Link> to auto-fill your details.</span></div>}
            <div className="booking-form__grid">
              <div className="form-group"><label>FIRST NAME</label><input name="firstName" value={form.firstName} onChange={update} required placeholder="Your first name"/></div>
              <div className="form-group"><label>LAST NAME</label><input name="lastName" value={form.lastName} onChange={update} required placeholder="Your last name"/></div>
              <div className="form-group"><label>EMAIL ADDRESS</label><input type="email" name="email" value={form.email} onChange={update} required placeholder="email@example.com"/></div>
              <div className="form-group"><label>PHONE NUMBER</label><input type="tel" name="phone" value={form.phone} onChange={update} required placeholder="+971 XX XXX XXXX"/></div>
            </div>
            <div className="booking-form__actions"><button type="button" className="btn-ghost" onClick={()=>setStep(1)}>← Back</button><button type="submit" className="btn-primary">Continue to Payment →</button></div>
          </form>}
          {step===3&&<form onSubmit={handleConfirm} className="booking-form__step fade-up">
            <h3 className="booking-form__step-title">Payment Details</h3>
            {error&&<div style={{background:'rgba(224,112,112,.1)',border:'1px solid rgba(224,112,112,.3)',borderRadius:'4px',padding:'12px 16px',fontSize:'13px',color:'#e07070',marginBottom:'18px'}}>⚠️ {error}</div>}
            <div className="booking-form__pay-methods">
              {[{val:'card',label:'💳 Credit / Debit Card'},{val:'paypal',label:'🅿️ PayPal'},{val:'bank',label:'🏦 Bank Transfer'}].map(m=>(
                <label key={m.val} className={`booking-form__pay-method ${form.payMethod===m.val?'active':''}`}><input type="radio" name="payMethod" value={m.val} checked={form.payMethod===m.val} onChange={update}/>{m.label}</label>
              ))}
            </div>
            {form.payMethod==='card'&&<div className="booking-form__card-fields">
              <div className="form-group" style={{gridColumn:'1/-1'}}><label>CARDHOLDER NAME</label><input name="cardName" value={form.cardName} onChange={update} required placeholder="Name on card"/></div>
              <div className="form-group" style={{gridColumn:'1/-1'}}><label>CARD NUMBER</label><input name="cardNum" value={form.cardNum} onChange={update} required placeholder="1234 5678 9012 3456" maxLength={19}/></div>
              <div className="form-group"><label>EXPIRY DATE</label><input name="cardExpiry" value={form.cardExpiry} onChange={update} required placeholder="MM/YY" maxLength={5}/></div>
              <div className="form-group"><label>CVV</label><input name="cardCvv" value={form.cardCvv} onChange={update} required placeholder="123" maxLength={4} type="password"/></div>
            </div>}
            {form.payMethod!=='card'&&<div style={{background:'var(--dark-3)',border:'1px solid rgba(255,255,255,.07)',borderRadius:'4px',padding:'20px',marginBottom:'18px',color:'var(--text-light)',fontSize:'14px'}}>{form.payMethod==='paypal'?'You will be redirected to PayPal to complete payment securely.':'Bank transfer details will be sent to your email after confirmation.'}</div>}
            <div className="booking-form__secure">🔒 All payments are secured with 256-bit SSL encryption</div>
            <div className="booking-form__actions"><button type="button" className="btn-ghost" onClick={()=>setStep(2)}>← Back</button><button type="submit" className="btn-primary" disabled={loading}>{loading?<><div style={{width:15,height:15,border:'2px solid rgba(13,8,5,.3)',borderTopColor:'var(--dark)',borderRadius:'50%',animation:'spin .7s linear infinite',flexShrink:0}}/>Processing...</>:`Confirm Booking – $${total}`}</button></div>
          </form>}
        </div>
        <aside className="booking-summary">
          <div className="booking-summary__card">
            <img src={room.images?.[0]} alt={room.name} className="booking-summary__img"/>
            <div className="booking-summary__body">
              <div className="booking-summary__cat">{room.category}</div>
              <h4 className="booking-summary__name">{room.name}</h4>
              <div className="booking-summary__meta"><span>🛏 {room.bed}</span><span>📐 {room.size}</span><span>👥 Up to {room.capacity}</span></div>
              {form.checkIn&&form.checkOut&&<><div className="divider" style={{margin:'14px 0'}}/><div className="booking-summary__dates"><div><div className="booking-summary__date-label">CHECK-IN</div><div className="booking-summary__date-val">{form.checkIn}</div></div><span style={{color:'var(--gold)',fontSize:'18px'}}>→</span><div><div className="booking-summary__date-label">CHECK-OUT</div><div className="booking-summary__date-val">{form.checkOut}</div></div></div><div className="divider" style={{margin:'14px 0'}}/></>}
              <div className="booking-summary__pricing">
                <div className="booking-summary__row"><span>${room.price} × {nights} night{nights>1?'s':''}</span><span>${subtotal}</span></div>
                <div className="booking-summary__row"><span>Taxes & Fees (10%)</span><span>${taxes}</span></div>
                <div className="booking-summary__total"><span>Total</span><span>${total}</span></div>
              </div>
              <div className="booking-summary__policy"><div className="booking-summary__policy-item">✅ Free cancellation before 48hrs</div><div className="booking-summary__policy-item">✅ No prepayment required</div><div className="booking-summary__policy-item">✅ Best price guarantee</div></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
