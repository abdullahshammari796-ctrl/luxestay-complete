// ============================================================
// LuxeStay – API Service Layer
// All backend calls centralised here.
// Base URL reads from .env (REACT_APP_API_URL) or defaults to localhost:5000
// ============================================================

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ── Helper ────────────────────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('luxestay_token');
  const config = {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...options
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:       ()     => request('/auth/me'),
  updateProfile: (body) => request('/auth/updateprofile', { method: 'PUT', body: JSON.stringify(body) }),
  updatePassword: (body) => request('/auth/updatepassword', { method: 'PUT', body: JSON.stringify(body) }),
};

// ── Rooms ─────────────────────────────────────────────────────────────────────
export const roomsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/rooms${qs ? '?' + qs : ''}`);
  },
  getFeatured:     ()   => request('/rooms/featured'),
  getById:         (id) => request(`/rooms/${id}`),
  checkAvailability: (id, checkIn, checkOut) =>
    request(`/rooms/${id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`),
  create: (body) => request('/rooms', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  create:    (body) => request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  getMyBookings: () => request('/bookings/my'),
  getById:   (id)  => request(`/bookings/${id}`),
  cancel:    (id)  => request(`/bookings/${id}/cancel`, { method: 'PUT' }),
  // Admin
  getAll:    (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/bookings${qs ? '?' + qs : ''}`);
  },
  updateStatus: (id, status) =>
    request(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewsAPI = {
  getForRoom: (roomId) => request(`/reviews/room/${roomId}`),
  create: (body)  => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id)    => request(`/reviews/${id}`, { method: 'DELETE' }),
};

// ── Users (Admin) ─────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll:  (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/users${qs ? '?' + qs : ''}`);
  },
  update: (id, body) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id)       => request(`/users/${id}`, { method: 'DELETE' }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats:         () => request('/admin/stats'),
  getRevenue:       () => request('/admin/revenue'),
  getCategoryStats: () => request('/admin/category-stats'),
};
