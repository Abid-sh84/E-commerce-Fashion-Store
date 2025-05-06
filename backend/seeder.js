import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import { products as sampleProducts } from './data/products.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      isAdmin: true,
      avatar: '/images/avatars/ironman.png',
    });

    // Create regular user
    const regularPassword = await bcrypt.hash('123456', 10);
    
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: regularPassword,
      avatar: '/images/avatars/spiderman.png',
      addresses: [
        {
          name: 'Home',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'United States',
          isDefault: true,
        },
      ],
    });

    // Add admin user ID to the products
    const productsToInsert = sampleProducts.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(productsToInsert);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
