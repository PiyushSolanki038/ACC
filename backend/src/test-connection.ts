import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const testConnection = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB.');
    
    // Test creating a collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

testConnection(); 