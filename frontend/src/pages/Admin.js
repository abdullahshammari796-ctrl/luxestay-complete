import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, roomsAPI, bookingsAPI, usersAPI } from '../services/api';
import './Admin.css';

const STATUS_COLORS = { Confirmed:'#4caf50', Pending:'#ff9800', 'Checked In':'#2196f3', 'Checked Out':'#9e9e9e', Cancelled:'#e07070' };

export default function Admin() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([adminAPI.getStats(), roomsAPI.getAll(), bookingsAPI.getAll(), usersAPI.getAll(), adminAPI.getRevenue()])
      .then(([sData, rData, bData, uData, revData]) => {
        setStats(sData.stats);
        setRooms(rData.rooms || []);
        setBookings(bData.bookings || []);
        setUsers(uData.users || []);
        setRevenue(revData.revenue || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/" />;

  const toggleAvail = async (id, current) => {
    try { await roomsAPI.update(id, { available: !current }); setRooms(rs => rs.map(r => r._id === id ? { ...r, available: !current } : r)); showToast('Room status updated.'); } catch (e) { showToast(e.message); }
  };
  const updateBookingStatus = async (id, status) => {
    try { await bookingsAPI.updateStatus(id, status); setBookings(bs => bs.map(b => b._id === id ? { ...b, status } : b)); showToast('Booking updated.'); } catch (e) { showToast(e.message); }
  };
  const toggleUserStatus = async (id, current) => {
    try { await usersAPI.update(id, { isActive: !current }); setUsers(us => us.map(u => u._id === id ? { ...u, isActive: !current } : u)); showToast('User updated.'); } catch (e) { showToast(e.message); }
  };

  const TABS = [['overview','📊 Overview'],['rooms','🛏 Rooms'],['bookings','📋 Bookings'],['users','👥 Users'],['reports','📈 Reports']];

  const STAT_CARDS = stats ? [
    { label:'Total Bookings', val: stats.totalBookings, icon:'🛏', delta: `+${stats.bookingDelta}%` },
    { label:'Monthly Revenue', val: `$${stats.monthlyRevenue?.toLocaleString()}`, icon:'💰', delta: `+${stats.revenueDelta}%` },
    { label:'Active Guests', val: stats.activeGuests, icon:'👥', delta: '' },
    { label:'Occupancy Rate', val: `${stats.occupancyRate}%`, icon:'📊', delta: '' },
    { label:'Total Rooms', val: stats.totalRooms, icon:'🏨', delta: `${stats.availableRooms} avail.` },
    { label:'Avg Rating', val: `${stats.avgRating}★`, icon:'⭐', delta: '' }
  ] : [];

  return (
    <div className="admin">
      {toast && <div className="toast">{toast}</div>}
      <div className="admin__header">
        <div className="container admin__header-inner">
          <div><span className="tag">Admin Portal</span><div className="admin__title">LuxeStay Management</div></div>
          <div className="admin__header-stats">
            <div className="admin__quick-stat">🟢 System Online</div>
            <div className="admin__quick-stat">📅 {new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
          </div>
        </div>
      </div>
      <div className="container admin__layout">
        <aside className="admin__sidebar">{TABS.map(([t,l]) => <button key={t} className={`admin__tab ${activeTab===t?'on':''}`} onClick={() => setActiveTab(t)}>{l}</button>)}</aside>
        <main className="admin__main">
          {loading ? <div style={{textAlign:'center',padding:'60px'}}><div className="spinner" style={{margin:'0 auto'}}/></div> : <>

          {activeTab==='overview' && <div className="fade-up">
            <h2 className="admin__section-title">Overview</h2>
            <div className="admin__stats">{STAT_CARDS.map((s,i) => <div key={i} className="admin__stat-card"><div className="admin__stat-icon">{s.icon}</div><div className="admin__stat-val">{s.val}</div><div className="admin__stat-lbl">{s.label}</div>{s.delta&&<div className="admin__stat-delta up">{s.delta}</div>}</div>)}</div>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.2rem',color:'var(--cream)',margin:'0 0 14px',fontWeight:400}}>Recent Bookings</h3>
            <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Ref</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Total</th><th>Status</th></tr></thead><tbody>
              {bookings.slice(0,5).map(b=><tr key={b._id}><td className="admin__ref">{b.referenceNumber}</td><td>{b.user?.name}</td><td style={{fontSize:'12px'}}>{b.room?.name}</td><td>{b.checkIn&&new Date(b.checkIn).toLocaleDateString()}</td><td style={{color:'var(--gold)'}}>${b.totalAmount}</td><td><span className="admin__status-badge" style={{background:STATUS_COLORS[b.status]+'22',color:STATUS_COLORS[b.status]}}>{b.status}</span></td></tr>)}
            </tbody></table></div>
          </div>}

          {activeTab==='rooms' && <div className="fade-up">
            <div className="admin__toolbar"><h2 className="admin__section-title">Room Management</h2><button className="btn-primary" style={{fontSize:'11px',padding:'9px 18px'}} onClick={()=>showToast('Add room: fill in the form and call POST /api/rooms')}>+ Add Room</button></div>
            <div className="admin__rooms-grid">{rooms.map(room=>(
              <div key={room._id} className="admin__room-card">
                <div className="admin__room-imgw"><img src={room.images?.[0]} alt={room.name} className="admin__room-img"/><span className={`admin__room-avail ${room.available?'admin-avail-yes':'admin-avail-no'}`}>{room.available?'Available':'Unavailable'}</span></div>
                <div className="admin__room-body"><div className="admin__room-name">{room.name}</div><div className="admin__room-meta">{room.category} · {room.size} · ${room.price}/night</div>
                <div className="admin__room-actions"><button className="admin__act" onClick={()=>showToast('Edit: PATCH /api/rooms/'+room._id)}>✏️ Edit</button><button className="admin__act" onClick={()=>toggleAvail(room._id,room.available)}>{room.available?'🔒 Unavailable':'🔓 Available'}</button></div></div>
              </div>
            ))}</div>
          </div>}

          {activeTab==='bookings' && <div className="fade-up">
            <h2 className="admin__section-title">Booking Management</h2>
            <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Reference</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>
              {bookings.map(b=><tr key={b._id}><td className="admin__ref">{b.referenceNumber}</td><td>{b.user?.name}</td><td style={{fontSize:'12px'}}>{b.room?.name}</td><td style={{fontSize:'12px'}}>{b.checkIn&&new Date(b.checkIn).toLocaleDateString()}</td><td style={{color:'var(--gold)'}}>${b.totalAmount}</td><td><span className="admin__status-badge" style={{background:STATUS_COLORS[b.status]+'22',color:STATUS_COLORS[b.status]}}>{b.status}</span></td><td><select className="admin__status-select" value={b.status} onChange={e=>updateBookingStatus(b._id,e.target.value)}>{['Confirmed','Pending','Checked In','Checked Out','Cancelled'].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}
            </tbody></table></div>
          </div>}

          {activeTab==='users' && <div className="fade-up">
            <h2 className="admin__section-title">User Management</h2>
            <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead><tbody>
              {users.map(u=><tr key={u._id}><td style={{fontWeight:500}}>{u.name}</td><td style={{fontSize:'12px',color:'var(--text-light)'}}>{u.email}</td><td><span className="admin__role-badge" style={{color:u.role==='admin'?'var(--gold)':'var(--text-light)',background:u.role==='admin'?'rgba(201,168,76,.1)':'rgba(255,255,255,.05)',padding:'2px 8px',borderRadius:'10px',fontSize:'11px'}}>{u.role}</span></td><td style={{fontSize:'12px',color:'var(--text-light)'}}>{new Date(u.createdAt).toLocaleDateString()}</td><td><span style={{color:u.isActive?'#4caf50':'#e07070',fontSize:'12px'}}>● {u.isActive?'Active':'Inactive'}</span></td><td><button className="admin__act" onClick={()=>toggleUserStatus(u._id,u.isActive)}>{u.isActive?'Deactivate':'Activate'}</button></td></tr>)}
            </tbody></table></div>
          </div>}

          {activeTab==='reports' && <div className="fade-up">
            <h2 className="admin__section-title">Revenue Reports</h2>
            <div className="admin__table-wrap" style={{marginBottom:'32px'}}>
              <table className="admin__table"><thead><tr><th>Month</th><th>Revenue</th><th>Bookings</th></tr></thead><tbody>
                {revenue.map(r=><tr key={r.month}><td>{r.month}</td><td style={{color:'var(--gold)'}}>${r.revenue.toLocaleString()}</td><td>{r.bookings}</td></tr>)}
              </tbody></table>
            </div>
            <div className="admin__reports-grid">
              {stats && [
                ['Total Bookings','All time',stats.totalBookings,''],
                ['Monthly Revenue','This month',`$${stats.monthlyRevenue?.toLocaleString()}`,'up'],
                ['Avg Guest Rating','Based on reviews',`${stats.avgRating}★`,''],
                ['Occupancy Rate','Current',`${stats.occupancyRate}%`,''],
                ['Active Guests','Right now',stats.activeGuests,''],
                ['Total Users','Registered',stats.totalUsers,''],
              ].map(([t,d,v,cls],i)=><div key={i} className="admin__report-card"><div className="admin__report-title">{t}</div><div className="admin__report-desc">{d}</div><div className="admin__report-val">{v}</div></div>)}
            </div>
          </div>}

          </>}
        </main>
      </div>
    </div>
  );
}
