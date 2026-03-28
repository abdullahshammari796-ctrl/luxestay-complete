const mongoose = require('mongoose');
const User = require('../models/User');
const Room = require('../models/Room');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/luxestay';
console.log('MONGO_URI from env:', process.env.MONGO_URI);

const rooms = [
  {
    name: "Deluxe King Suite",
    category: "Suite",
    description: "An indulgent retreat with panoramic ocean views, featuring a private balcony, deep-soak jacuzzi, and handcrafted furnishings. Every detail has been curated for an unparalleled stay.",
    price: 480, originalPrice: 620, size: "65 m²", capacity: 2,
    bed: "1 King Bed", view: "Ocean View", floor: "12th–18th Floor",
    amenities: ["Free WiFi","Air Conditioning","Mini Bar","Room Service","Jacuzzi","Smart TV","Safe Deposit","Balcony"],
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80","https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"],
    badge: "Best Seller", available: true, featured: true, rating: 4.9, numReviews: 142
  },
  {
    name: "Presidential Suite",
    category: "Presidential",
    description: "The pinnacle of luxury. A two-floor sanctuary featuring a private pool, butler service, home cinema, and breathtaking panoramic views across the entire coastline.",
    price: 1200, originalPrice: 1500, size: "120 m²", capacity: 4,
    bed: "2 King Beds", view: "City & Ocean Panorama", floor: "Top Floor – 24th",
    amenities: ["Butler Service","Private Pool","Free WiFi","Air Conditioning","Full Kitchen","Home Theater","Sauna","Private Dining"],
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80","https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80"],
    badge: "Top Tier", available: true, featured: true, rating: 5.0, numReviews: 38
  },
  {
    name: "Classic Double Room",
    category: "Classic",
    description: "Timeless elegance meets modern comfort. Thoughtfully designed with premium linens and garden views for a relaxing stay.",
    price: 180, originalPrice: 220, size: "32 m²", capacity: 2,
    bed: "1 Queen Bed", view: "Garden View", floor: "3rd–8th Floor",
    amenities: ["Free WiFi","Air Conditioning","Smart TV","Room Service","Safe Deposit","Minibar"],
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80"],
    badge: null, available: true, featured: false, rating: 4.6, numReviews: 289
  },
  {
    name: "Superior Twin Room",
    category: "Superior",
    description: "Perfect for colleagues or friends. Contemporary interiors with separate work areas and pool-facing balconies.",
    price: 240, originalPrice: 290, size: "42 m²", capacity: 2,
    bed: "2 Single Beds", view: "Pool View", floor: "6th–12th Floor",
    amenities: ["Free WiFi","Air Conditioning","Smart TV","Room Service","Balcony","Safe Deposit"],
    images: ["https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80"],
    badge: "Popular", available: true, featured: true, rating: 4.7, numReviews: 167
  },
  {
    name: "Honeymoon Suite",
    category: "Honeymoon",
    description: "A romantic sanctuary for two. Private ocean-view terrace, in-room jacuzzi, champagne welcome, and couples' spa access.",
    price: 650, originalPrice: 800, size: "80 m²", capacity: 2,
    bed: "1 King Bed", view: "Ocean + Private Terrace", floor: "20th Floor",
    amenities: ["Rose Petal Turndown","Private Terrace","Champagne Welcome","Couples Spa","Jacuzzi","Butler Service","Free WiFi"],
    images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80"],
    badge: "Romance", available: false, featured: true, rating: 4.95, numReviews: 74
  },
  {
    name: "Family Suite",
    category: "Family",
    description: "Spacious and thoughtfully arranged for families. Features a kitchenette, kids' club access, and separate sleeping areas.",
    price: 390, originalPrice: 480, size: "90 m²", capacity: 5,
    bed: "1 King + 2 Single Beds", view: "Garden & Pool View", floor: "4th–10th Floor",
    amenities: ["Free WiFi","Kid's Club Access","Connecting Rooms","Kitchenette","Smart TV","Air Conditioning","Baby Cot"],
    images: ["https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80"],
    badge: "Family Pick", available: true, featured: false, rating: 4.8, numReviews: 112
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Room.deleteMany();
    console.log('Cleared existing data');

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@luxestay.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      phone: '+971 4 000 0000'
    });
    console.log('✅ Admin user created: admin@luxestay.com / admin123');

    // Create sample user
    await User.create({
      name: 'John Doe',
      email: 'user@luxestay.com',
      password: 'user123',
      role: 'user',
      phone: '+971 50 123 4567'
    });
    console.log('✅ Sample user created: user@luxestay.com / user123');

    // Create rooms
    await Room.insertMany(rooms);
    console.log(`✅ ${rooms.length} rooms created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('Admin: admin@luxestay.com / admin123');
    console.log('User:  user@luxestay.com / user123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
