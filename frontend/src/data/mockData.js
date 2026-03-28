// ============================================================
// Mock Data – LuxeStay Hotel Booking System
// ============================================================

export const ROOMS = [
  {
    id: 1,
    name: "Deluxe King Suite",
    category: "Suite",
    price: 480,
    originalPrice: 620,
    size: "65 m²",
    capacity: 2,
    bed: "1 King Bed",
    view: "Ocean View",
    floor: "12th – 18th Floor",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80"
    ],
    rating: 4.9,
    reviews: 142,
    available: true,
    featured: true,
    amenities: ["Free WiFi", "Air Conditioning", "Mini Bar", "Room Service", "Jacuzzi", "Smart TV", "Safe Deposit", "Balcony"],
    description: "An indulgent retreat with panoramic ocean views, featuring a private balcony, deep-soak jacuzzi, and handcrafted furnishings. Every detail has been curated for an unparalleled stay.",
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Presidential Suite",
    category: "Presidential",
    price: 1200,
    originalPrice: 1500,
    size: "120 m²",
    capacity: 4,
    bed: "2 King Beds",
    view: "City & Ocean Panorama",
    floor: "Top Floor – 24th",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80"
    ],
    rating: 5.0,
    reviews: 38,
    available: true,
    featured: true,
    amenities: ["Butler Service", "Private Pool", "Free WiFi", "Air Conditioning", "Full Kitchen", "Home Theater", "Sauna", "Private Dining"],
    description: "The pinnacle of luxury. A two-floor sanctuary featuring a private pool, butler service, home cinema, and breathtaking panoramic views across the entire coastline.",
    badge: "Top Tier"
  },
  {
    id: 3,
    name: "Classic Double Room",
    category: "Classic",
    price: 180,
    originalPrice: 220,
    size: "32 m²",
    capacity: 2,
    bed: "1 Queen Bed",
    view: "Garden View",
    floor: "3rd – 8th Floor",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80"
    ],
    rating: 4.6,
    reviews: 289,
    available: true,
    featured: false,
    amenities: ["Free WiFi", "Air Conditioning", "Smart TV", "Room Service", "Safe Deposit", "Minibar"],
    description: "Timeless elegance meets modern comfort in our classic rooms. Thoughtfully designed with premium linens and garden views.",
    badge: null
  },
  {
    id: 4,
    name: "Superior Twin Room",
    category: "Superior",
    price: 240,
    originalPrice: 290,
    size: "42 m²",
    capacity: 2,
    bed: "2 Single Beds",
    view: "Pool View",
    floor: "6th – 12th Floor",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80",
    ],
    rating: 4.7,
    reviews: 167,
    available: true,
    featured: true,
    amenities: ["Free WiFi", "Air Conditioning", "Smart TV", "Room Service", "Balcony", "Safe Deposit"],
    description: "Perfect for colleagues or friends traveling together. Contemporary interiors with separate work areas and pool-facing balconies.",
    badge: "Popular"
  },
  {
    id: 5,
    name: "Honeymoon Suite",
    category: "Suite",
    price: 650,
    originalPrice: 800,
    size: "80 m²",
    capacity: 2,
    bed: "1 King Bed",
    view: "Ocean View + Private Terrace",
    floor: "20th Floor",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80"
    ],
    rating: 4.95,
    reviews: 74,
    available: false,
    featured: true,
    amenities: ["Rose Petal Turndown", "Private Terrace", "Champagne Welcome", "Couples Spa", "Jacuzzi", "Butler Service", "Free WiFi"],
    description: "A romantic sanctuary designed for two. Private ocean-view terrace, in-room jacuzzi, champagne welcome, and couples' spa access.",
    badge: "Romance"
  },
  {
    id: 6,
    name: "Family Suite",
    category: "Family",
    price: 390,
    originalPrice: 480,
    size: "90 m²",
    capacity: 5,
    bed: "1 King + 2 Single Beds",
    view: "Garden & Pool View",
    floor: "4th – 10th Floor",
    image: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80",
    ],
    rating: 4.8,
    reviews: 112,
    available: true,
    featured: false,
    amenities: ["Free WiFi", "Kid's Club Access", "Connecting Rooms Option", "Kitchenette", "Smart TV", "Air Conditioning", "Baby Cot Available"],
    description: "Spacious and thoughtfully arranged for families. Features a kitchenette, kids' club access, and separate sleeping areas for parents and children.",
    badge: "Family Pick"
  }
];

export const CATEGORIES = [
  { id: 1, name: "Classic", icon: "🏛️", count: 8, desc: "Timeless elegance" },
  { id: 2, name: "Superior", icon: "⭐", count: 12, desc: "Enhanced comfort" },
  { id: 3, name: "Suite", icon: "👑", count: 6, desc: "Ultimate luxury" },
  { id: 4, name: "Presidential", icon: "💎", count: 2, desc: "Pinnacle of opulence" },
  { id: 5, name: "Family", icon: "🏡", count: 5, desc: "Perfect for families" },
  { id: 6, name: "Honeymoon", icon: "🌹", count: 3, desc: "Romantic retreats" }
];

export const REVIEWS = [
  {
    id: 1, roomId: 1,
    name: "Alexandra Chen", country: "Singapore",
    avatar: "AC", rating: 5,
    date: "March 2025",
    text: "Absolutely breathtaking. The ocean views from the balcony were unlike anything I've experienced. The staff remembered our names, anticipated our needs, and the jacuzzi was divine. Will return for our anniversary."
  },
  {
    id: 2, roomId: 1,
    name: "Marcus Vogt", country: "Germany",
    avatar: "MV", rating: 5,
    date: "February 2025",
    text: "LuxeStay exceeded every expectation. The suite was immaculate, the bed the most comfortable I've slept in, and room service arrived within 15 minutes at midnight. Exceptional."
  },
  {
    id: 3, roomId: 2,
    name: "Priya Mehta", country: "India",
    avatar: "PM", rating: 5,
    date: "January 2025",
    text: "The Presidential Suite is worth every penny. Having a private pool on the top floor with city panoramas is surreal. The butler was incredibly professional. A memory for a lifetime."
  },
  {
    id: 4, roomId: 4,
    name: "James & Fiona Walsh", country: "Ireland",
    avatar: "JW", rating: 4,
    date: "March 2025",
    text: "Fantastic stay, excellent value. Loved the pool views and the breakfast spread was remarkable. One star deducted only because the check-in was slightly slow."
  },
  {
    id: 5, roomId: 5,
    name: "Yuki Tanaka", country: "Japan",
    avatar: "YT", rating: 5,
    date: "February 2025",
    text: "The honeymoon suite made our trip unforgettable. Rose petals on arrival, champagne waiting, and the terrace sunset views… absolutely magical. Perfect in every way."
  }
];

export const AMENITIES_LIST = [
  { icon: "🍽️", title: "Fine Dining", desc: "5 world-class restaurants" },
  { icon: "🏊", title: "Infinity Pool", desc: "Rooftop & garden pools" },
  { icon: "💆", title: "Luxury Spa", desc: "Full wellness sanctuary" },
  { icon: "🏋️", title: "Fitness Center", desc: "24/7 state-of-the-art gym" },
  { icon: "🎾", title: "Tennis Courts", desc: "3 floodlit courts" },
  { icon: "🚗", title: "Valet Parking", desc: "Complimentary for guests" },
  { icon: "✈️", title: "Airport Transfer", desc: "Private luxury vehicles" },
  { icon: "🛎️", title: "24/7 Concierge", desc: "At your service always" }
];

export const BOOKING_STATUSES = ["Confirmed", "Pending", "Checked In", "Checked Out", "Cancelled"];
