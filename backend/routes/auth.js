// backend/routes/auth.js

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// A Router is like a mini express app - handles a group of related routes
const router = express.Router();

// ─────────────────────────────────────────
// REGISTER — POST /api/auth/register
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    // req.body contains the data sent from the frontend form
    const { username, email, password } = req.body;

    // Check if all fields were provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password - bcrypt turns "mypassword" into a scrambled string
    // The number 10 is the "salt rounds" - higher = more secure but slower
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to MongoDB
    const user = await User.create({
      username,
      email,
      password: hashedPassword   // Never save plain text passwords!
    });

    // Create a JWT token - this is what the user sends with every request
    // to prove they are logged in
    const token = jwt.sign(
      { id: user._id },                    // Payload: what we store in the token
      process.env.JWT_SECRET,              // Secret key to sign it
      { expiresIn: '7d' }                  // Token expires in 7 days
    );

    // Send back the token and basic user info
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// ─────────────────────────────────────────
// LOGIN — POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Use a vague message - don't tell hackers whether email exists
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare entered password with the stored hash
    // bcrypt.compare handles the decoding internally
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Password matches - create and return token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;