require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Table = require('./models/Table');
const MenuItem = require('./models/MenuItem');
const Advertisement = require('./models/Advertisement');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing data
  await Promise.all([User.deleteMany(), Table.deleteMany(), MenuItem.deleteMany(), Advertisement.deleteMany()]);

  // Users
  await User.create([
    { name: 'Admin User', email: 'admin@lamaison.com', password: 'admin123', role: 'admin' },
    { name: 'Kitchen Staff', email: 'kitchen@lamaison.com', password: 'kitchen123', role: 'kitchen' },
    { name: 'John Customer', email: 'customer@lamaison.com', password: 'customer123', role: 'customer' },
  ]);
  console.log('✅ Users seeded');

  // Tables
  const tables = [];
  for (let i = 1; i <= 16; i++) {
    tables.push({ tableNumber: i, capacity: i <= 8 ? 2 : i <= 12 ? 4 : 6, location: i <= 8 ? 'Main Floor' : 'Outdoor' });
  }
  await Table.create(tables);
  console.log('✅ Tables seeded (16 tables)');

  // Menu Items
  await MenuItem.create([
    { name: 'Bruschetta', description: 'Classic Italian appetizer with tomatoes and basil', price: 149, category: 'Starters', isVeg: true, prepTime: 10 },
    { name: 'Chicken Wings', description: 'Crispy fried wings with buffalo sauce', price: 299, category: 'Starters', isVeg: false, prepTime: 15 },
    { name: 'Mushroom Soup', description: 'Creamy wild mushroom velouté', price: 179, category: 'Starters', isVeg: true, prepTime: 12 },
    { name: 'Grilled Salmon', description: 'Fresh Atlantic salmon with lemon butter and herbs', price: 599, category: 'Main Course', isVeg: false, prepTime: 25 },
    { name: 'Pasta Arabiata', description: 'Penne pasta in spicy tomato sauce', price: 349, category: 'Main Course', isVeg: true, prepTime: 20 },
    { name: 'Chicken Tikka Masala', description: 'Tender chicken in rich creamy tomato gravy', price: 449, category: 'Main Course', isVeg: false, prepTime: 25 },
    { name: 'Paneer Butter Masala', description: 'Cottage cheese in buttery tomato gravy', price: 399, category: 'Main Course', isVeg: true, prepTime: 20 },
    { name: 'Beef Steak', description: '250g prime cut, served with roasted vegetables', price: 849, category: 'Main Course', isVeg: false, prepTime: 30 },
    { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with liquid center', price: 199, category: 'Desserts', isVeg: true, prepTime: 15 },
    { name: 'Crème Brûlée', description: 'French classic custard with caramelized sugar', price: 249, category: 'Desserts', isVeg: true, prepTime: 10 },
    { name: 'Mango Sorbet', description: 'Refreshing natural mango sorbet', price: 149, category: 'Desserts', isVeg: true, prepTime: 5 },
    { name: 'Fresh Lime Soda', description: 'Chilled lime with soda and mint', price: 99, category: 'Beverages', isVeg: true, prepTime: 5 },
    { name: 'Cold Coffee', description: 'Blend of espresso, milk and ice cream', price: 149, category: 'Beverages', isVeg: true, prepTime: 5 },
    { name: 'Fresh Juice Combo', description: 'Seasonal fresh fruit juice', price: 129, category: 'Beverages', isVeg: true, prepTime: 5 },
    { name: "Chef's Special Thali", description: 'A complete Indian meal curated by our head chef', price: 599, category: 'Specials', isVeg: false, prepTime: 30 },
    { name: 'Weekend Brunch Platter', description: 'Assorted breakfast and brunch items for two', price: 799, category: 'Specials', isVeg: false, prepTime: 25 },
  ]);
  console.log('✅ Menu items seeded (16 items)');

  // Advertisements
  await Advertisement.create([
    { title: '🎉 Weekend Special – 20% Off', description: 'Enjoy 20% discount on all main course items every Saturday and Sunday. Dine-in only.', active: true, order: 1 },
    { title: '🍷 Wine Pairing Evening', description: 'Join our sommelier for an exclusive wine and food pairing experience every Friday at 7 PM.', active: true, order: 2 },
    { title: '🎂 Birthday Celebrations', description: 'Celebrate your special day with us! Complimentary dessert and décor for birthday bookings.', active: true, order: 3 },
  ]);
  console.log('✅ Advertisements seeded');

  console.log('\n🚀 Database seeded successfully!\n');
  console.log('Login credentials:');
  console.log('  Admin:   admin@lamaison.com   / admin123');
  console.log('  Kitchen: kitchen@lamaison.com / kitchen123');
  console.log('  Customer: customer@lamaison.com / customer123');

  mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });
