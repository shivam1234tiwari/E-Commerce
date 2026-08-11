// server/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// 🛒 Standard E-Commerce Categories & Image Keywords
const categoriesData = [
  {
    category: 'Electronics',
    brands: ['Apple', 'Samsung', 'Sony', 'Dell', 'Logitech', 'Bose', 'Asus', 'HP'],
    items: ['Wireless Earbuds', 'Gaming Laptop', 'Mechanical Keyboard', '4K Smart TV', 'Smartwatch', 'Bluetooth Speaker', 'DSLR Camera', 'Power Bank'],
    keywords: ['technology', 'gadget', 'laptop', 'headphones', 'smartphone', 'camera', 'speaker'],
    priceRange: [15, 1200],
  },
  {
    category: 'Fashion',
    brands: ['Nike', 'Adidas', 'Zara', 'Puma', 'Levis', 'H&M', 'Tommy Hilfiger'],
    items: ['Classic T-Shirt', 'Slim Fit Jeans', 'Leather Jacket', 'Running Shoes', 'Hoodie', 'Casual Sneakers', 'Formal Suit'],
    keywords: ['fashion', 'tshirt', 'shoes', 'sneakers', 'jacket', 'jeans', 'apparel'],
    priceRange: [10, 250],
  },
  {
    category: 'Home & Kitchen',
    brands: ['IKEA', 'Philips', 'Prestige', 'Bosch', 'Dyson', 'Milton'],
    items: ['Ergonomic Leather Chair', 'Nordic Sofa', 'Air Fryer', 'Non-Stick Cookware Set', 'Coffee Maker', 'Robot Vacuum Cleaner'],
    keywords: ['furniture', 'interior', 'kitchen', 'chair', 'sofa', 'appliance', 'decor'],
    priceRange: [25, 800],
  },
  {
    category: 'Beauty & Personal Care',
    brands: ['L\'Oreal', 'Nivea', 'GlowLuxe', 'The Ordinary', 'Maybelline', 'MAC'],
    items: ['Hydrating Face Serum', 'Organic Cream', 'Matte Lipstick', 'Sunscreen Gel SPF 50', 'Hair Care Oil', 'Vitamin C Cleanser'],
    keywords: ['cosmetics', 'skincare', 'makeup', 'beauty', 'lotion', 'lipstick'],
    priceRange: [8, 120],
  },
  {
    category: 'Fragrances',
    brands: ['Chanel', 'Dior', 'RoyalScents', 'Versace', 'Tom Ford', 'Gucci'],
    items: ['Eau De Parfum 100ml', 'Luxury Oud & Amber', 'Fresh Citrus Cologne', 'Floral Bloom Perfume'],
    keywords: ['perfume', 'fragrance', 'bottle', 'scent'],
    priceRange: [30, 200],
  },
  {
    category: 'Sports & Fitness',
    brands: ['Decathlon', 'Under Armour', 'FitPulse', 'Cosco', 'Yonex'],
    items: ['Yoga Mat non-slip', 'Dumbbell Set', 'Treadmill Machine', 'Badminton Racket', 'Water Bottle 1L'],
    keywords: ['fitness', 'gym', 'sports', 'workout', 'yoga'],
    priceRange: [12, 600],
  },
  {
    category: 'Books & Stationery',
    brands: ['Penguin', 'HarperCollins', 'Classmate', 'Parker', 'Faber-Castell'],
    items: ['Hardcover Fiction Novel', 'Self-Improvement Guide', 'Executive Notebook', 'Fountain Pen Set'],
    keywords: ['book', 'notebook', 'stationery', 'novel', 'pen'],
    priceRange: [5, 50],
  },
  {
    category: 'Toys & Baby Care',
    brands: ['Lego', 'Barbie', 'Pampers', 'Hot Wheels', 'Fisher-Price'],
    items: ['Building Blocks Set', 'Remote Control Car', 'Baby Stroller', 'Educational Board Game'],
    keywords: ['toy', 'doll', 'game', 'play', 'blocks'],
    priceRange: [10, 180],
  },
  {
    category: 'Groceries & Essentials',
    brands: ['Organic India', 'Nestle', 'Tata', 'Britannia', 'Kellogg\'s'],
    items: ['Green Tea Pack 100g', 'Raw Organic Honey', 'Mixed Dry Fruits 500g', 'Whole Grain Oats'],
    keywords: ['grocery', 'food', 'tea', 'fruit', 'honey'],
    priceRange: [3, 40],
  },
  {
    category: 'Automotive',
    brands: ['Bosch', '3M', 'Castrol', 'Studds', 'Rynox'],
    items: ['Full Face Biker Helmet', 'Microfiber Cloth', 'Car Dash Cam 1080p', 'Engine Oil 4L'],
    keywords: ['car', 'helmet', 'vehicle', 'motorcycle', 'automotive'],
    priceRange: [15, 250],
  },
];

const TOTAL_PRODUCTS = 30000;
const BATCH_SIZE = 5000;

// Utility Functions
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getUniqueImageUrl = (keywords, index) => {
  const keyword = keywords[index % keywords.length];
  // Lock parameter ensures every product gets a unique photo
  return `https://loremflickr.com/500/500/${keyword}?lock=${index + 100}`;
};

const importData = async () => {
  try {
    console.log('🧹 Clearing old collections from MongoDB Atlas...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create Default Verified Admin User
    await User.create({
      name: 'Admin User',
      email: 'admin@shoppulse.com',
      password: 'AdminPassword123',
      isAdmin: true,
      isVerified: true,
    });

    console.log('✅ Admin User Created: admin@shoppulse.com / AdminPassword123');
    console.log(`🚀 Generating ${TOTAL_PRODUCTS} products with unique images...`);

    let batch = [];
    let insertedCount = 0;

    for (let i = 1; i <= TOTAL_PRODUCTS; i++) {
      const catObj = categoriesData[i % categoriesData.length];
      const brand = catObj.brands[i % catObj.brands.length];
      const item = catObj.items[i % catObj.items.length];
      const image = getUniqueImageUrl(catObj.keywords, i);
      const price = getRandomInt(catObj.priceRange[0], catObj.priceRange[1]);
      const rating = Number((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1));

      batch.push({
        name: `${brand} ${item} Series ${i}`,
        image,
        brand,
        category: catObj.category,
        description: `High quality ${item.toLowerCase()} manufactured by ${brand}. Features durable design, premium materials, and 1-year warranty.`,
        rating,
        price,
        countInStock: getRandomInt(5, 100),
      });

      // Insert in chunks of 5,000 to optimize network memory & insertion speed
      if (batch.length === BATCH_SIZE || i === TOTAL_PRODUCTS) {
        await Product.insertMany(batch);
        insertedCount += batch.length;
        console.log(`📦 Inserted Batch: ${insertedCount} / ${TOTAL_PRODUCTS} products...`);
        batch = [];
      }
    }

    console.log(`🎉 Successfully seeded ${TOTAL_PRODUCTS} products with unique images into MongoDB Atlas!`);
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

importData();