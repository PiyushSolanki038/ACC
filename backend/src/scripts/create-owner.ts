import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const createOwner = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if owner already exists
    const existingOwner = await User.findOne({ role: 'owner' });
    if (existingOwner) {
      console.log('Owner already exists:', existingOwner.email);
      process.exit(0);
    }

    // Create owner user
    const owner = await User.create({
      email: 'owner@coppershop.com',
      password: 'owner123', // This will be hashed by the model's pre-save hook
      name: 'Shop Owner',
      role: 'owner'
    });

    console.log('Owner created successfully:');
    console.log('Email:', owner.email);
    console.log('Password: owner123');
    console.log('Role:', owner.role);

    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error creating owner:', error);
    process.exit(1);
  }
};

createOwner(); 