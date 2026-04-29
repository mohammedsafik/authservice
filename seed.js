const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const mongoUri = process.env.SEED_MONGO_URI || process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('Missing required environment variable: SEED_MONGO_URI or MONGO_URI');
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

const products = [
  { name: 'Milk 1L', description: 'Fresh full cream milk', price: 60, stock: 50, category: 'dairy', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Bread', description: 'Whole wheat bread', price: 40, stock: 40, category: 'groceries', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Eggs (12 pack)', description: 'Farm fresh eggs', price: 90, stock: 30, category: 'dairy', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Apple', description: 'Fresh red apples', price: 120, stock: 60, category: 'fruits', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Banana', description: 'Organic bananas', price: 50, stock: 70, category: 'fruits', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Potato', description: 'Fresh potatoes', price: 30, stock: 80, category: 'vegetables', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Onion', description: 'Red onions', price: 35, stock: 75, category: 'vegetables', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Tomato', description: 'Fresh tomatoes', price: 45, stock: 65, category: 'vegetables', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Cheese', description: 'Processed cheese slices', price: 150, stock: 25, category: 'dairy', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Butter', description: 'Salted butter', price: 120, stock: 20, category: 'dairy', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Chips', description: 'Potato chips', price: 20, stock: 100, category: 'snacks', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Biscuits', description: 'Cream biscuits', price: 30, stock: 90, category: 'snacks', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Soft Drink', description: 'Carbonated drink', price: 40, stock: 70, category: 'beverages', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Orange Juice', description: 'Fresh juice', price: 80, stock: 50, category: 'beverages', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Tea Powder', description: 'Premium tea', price: 200, stock: 30, category: 'groceries', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Sugar', description: 'Refined sugar', price: 45, stock: 60, category: 'groceries', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Salt', description: 'Iodized salt', price: 20, stock: 80, category: 'groceries', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Rice 1kg', description: 'Premium rice', price: 70, stock: 55, category: 'groceries', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Carrot', description: 'Fresh carrots', price: 40, stock: 65, category: 'vegetables', imageUrl: 'https://via.placeholder.com/150' },
  { name: 'Cabbage', description: 'Green cabbage', price: 35, stock: 45, category: 'vegetables', imageUrl: 'https://via.placeholder.com/150' }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    await Product.deleteMany();
    console.log('Existing products removed');

    await Product.insertMany(products);
    console.log('Products seeded successfully');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedProducts();
