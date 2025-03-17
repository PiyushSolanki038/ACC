import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkUsers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({}, '-password');
    console.log('\nUsers in database:');
    users.forEach(user => {
      console.log(`\nEmail: ${user.email}`);
      console.log(`Name: ${user.name}`);
      console.log(`Role: ${user.role}`);
      console.log(`Created at: ${user.createdAt}`);
    });

    await mongoose.connection.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
};

checkUsers(); 