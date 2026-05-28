// backend/config/db.js

// Import mongoose - this is our tool for talking to MongoDB
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // process.env.MONGO_URI reads the value from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection works, print the host name so we know it connected
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    // If something goes wrong, print the error and stop the program
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1); // 1 means "exit with error"
  }
};

// Export this function so other files can use it
export default connectDB;