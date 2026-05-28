// backend/models/User.js

import mongoose from 'mongoose';

// A "Schema" defines the shape of your data - like a form template
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,      // This field must exist
      unique: true,        // No two users can have the same username
      trim: true           // Removes accidental spaces like " john " → "john"
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true      // Always saves as lowercase so "John@gmail.com" = "john@gmail.com"
    },
    password: {
      type: String,
      required: true,
      minlength: 6         // Password must be at least 6 characters
    }
  },
  {
    timestamps: true       // Automatically adds createdAt and updatedAt fields
  }
);

// "User" is the model name - mongoose will create a "users" collection in MongoDB
export default mongoose.model('User', userSchema);