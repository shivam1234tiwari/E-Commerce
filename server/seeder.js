// server/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    console.log('🧹 Purging old database collections...');
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // 1. Create Default Verified Admin (Plain password pass karein, hook hash karega)
    await User.create({
      name: 'Admin User',
      email: 'admin@shoppulse.com',
      password: 'AdminPassword123',
      isAdmin: true,
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
    });
    console.log('✅ Admin Ready: admin@shoppulse.com / AdminPassword123');

    // 2. Read products.json directly
    const jsonPath = path.join(__dirname, 'data', 'products.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`File not found at: ${jsonPath}`);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const products = JSON.parse(rawData);

    // 3. Insert products into MongoDB
    await Product.insertMany(products);
    console.log(`🎉 SUCCESS! Seeded ${products.length} products directly from products.json into MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Failed:', error.message);
    process.exit(1);
  }
};

seedData();