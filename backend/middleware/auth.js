// backend/middleware/auth.js

import jwt from 'jsonwebtoken';

// Middleware is a function that runs BETWEEN the request arriving
// and your route handler running. Think of it as a security guard.

const authMiddleware = (req, res, next) => {
  try {
    // The frontend sends the token in the header like:
    // Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Split "Bearer <token>" and grab just the token part
    const token = authHeader.split(' ')[1];

    // Verify the token using our secret key
    // If the token is fake or expired, this will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's id to the request so route handlers can use it
    req.user = decoded;

    // next() means "this middleware is done, go to the actual route now"
    next();

  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;