# 🏨 LuxeStay – Hotel Booking System
### SWS 215 Web Development | Canadian University Dubai

---

## 📦 Project Structure

```
luxestay-complete/
├── frontend/          ← React JS (Deliverable 1)
├── backend/           ← Node.js + Express + MongoDB (Deliverable 2)
└── README.md          ← This file
```

---

## 🚀 Quick Start

### Step 1 – Start Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI if needed (default: localhost)
npm run seed        # seeds admin + rooms into database
npm run dev         # → http://localhost:5000
```

### Step 2 – Start Frontend
```bash
cd frontend
npm install
npm start           # → http://localhost:3000
```

### Demo Accounts
| Role  | Email                   | Password  |
|-------|-------------------------|-----------|
| Admin | admin@luxestay.com      | admin123  |
| User  | user@luxestay.com       | user123   |

---

## 🗂️ Full File List

### Backend (Node.js + Express + MongoDB)
```
backend/
├── server.js                  ← Express app + middleware + routes
├── .env                       ← Environment variables
├── .env.example               ← Template
├── package.json
├── config/
│   └── seed.js                ← Database seeder
├── middleware/
│   └── auth.js                ← JWT protect, adminOnly, optionalAuth
├── models/
│   ├── User.js                ← Schema + bcrypt + JWT methods
│   ├── Room.js                ← Room schema with virtuals
│   ├── Booking.js             ← Auto ref-number, nights calc
│   └── Review.js              ← Rating aggregation hook
└── routes/
    ├── auth.js                ← register, login, me, updateprofile
    ├── rooms.js               ← CRUD + availability check
    ├── bookings.js            ← create, my, cancel, admin update
    ├── reviews.js             ← by room, create, delete
    ├── users.js               ← admin user management
    └── admin.js               ← stats, revenue, category analytics
```

### Frontend (React JS)
```
frontend/
├── public/index.html
├── .env                       ← REACT_APP_API_URL
├── package.json
└── src/
    ├── App.js                 ← Router + layout
    ├── index.js               ← Entry point
    ├── index.css              ← Global styles + design system
    ├── context/
    │   └── AuthContext.js     ← JWT state + login/register/logout
    ├── services/
    │   └── api.js             ← All backend API calls
    ├── data/
    │   └── mockData.js        ← Constants (categories, amenities)
    ├── components/
    │   ├── Navbar.js/css      ← Sticky responsive nav
    │   ├── Footer.js/css      ← Footer with links
    │   └── Chatbot.js/css     ← AI concierge chatbot
    └── pages/
        ├── Home.js/css        ← Landing – hero, rooms, reviews
        ├── Rooms.js/css       ← Listings with filters + sort
        ├── RoomDetail.js/css  ← Gallery, amenities, reviews, booking widget
        ├── Booking.js/css     ← 3-step booking wizard + real API
        ├── Login.js           ← JWT login via real API
        ├── Signup.js          ← Registration via real API
        ├── Dashboard.js/css   ← Customer stats, bookings, profile, reviews
        ├── MyBookings.js      ← Booking history + cancel
        ├── Admin.js/css       ← Full admin panel (rooms, bookings, users, reports)
        ├── About.js/css       ← About page
        ├── Contact.js/css     ← Contact + FAQ
        └── Auth.css           ← Shared auth page styles
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login → JWT token |
| GET | /api/auth/me | Private | Current user |
| GET | /api/rooms | Public | List + filter rooms |
| GET | /api/rooms/featured | Public | Featured rooms |
| GET | /api/rooms/:id | Public | Single room |
| GET | /api/rooms/:id/availability | Public | Check dates |
| POST | /api/rooms | Admin | Create room |
| PUT | /api/rooms/:id | Admin | Update room |
| DELETE | /api/rooms/:id | Admin | Delete room |
| POST | /api/bookings | Private | Create booking |
| GET | /api/bookings/my | Private | My bookings |
| PUT | /api/bookings/:id/cancel | Private | Cancel booking |
| GET | /api/bookings | Admin | All bookings |
| PUT | /api/bookings/:id/status | Admin | Update status |
| GET | /api/reviews/room/:id | Public | Room reviews |
| POST | /api/reviews | Private | Write review |
| GET | /api/users | Admin | All users |
| PUT | /api/users/:id | Admin | Update user |
| GET | /api/admin/stats | Admin | Dashboard KPIs |
| GET | /api/admin/revenue | Admin | Monthly revenue |

---

## 🎨 Design System

- **Theme:** Luxury dark-gold editorial
- **Primary font:** Cormorant Garamond (display)
- **Body font:** Jost
- **Gold accent:** #c9a84c
- **Background:** #0d0805 (deep dark)
- **Text:** #f5efe6 (warm cream)

---

*LuxeStay – SWS 215 Web Development | Canadian University Dubai*
