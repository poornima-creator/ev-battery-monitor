// backend/server.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import { initSocket } from './socket/socketHandler.js'; // ← NEW

const app = express();
const httpServer = http.createServer(app);
// backend/server.js

const allowedOrigins = [
  'http://localhost:5173',          // local dev
  process.env.CLIENT_URL,
  'https://ev-battery-monitor-3odirvlwd-poornima-k-s-projects.vercel.app'            // production Vercel URL (set in env)
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: false
  },
  allowEIO3: true,
  transports: ['polling', 'websocket']
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
  res.json({ message: '⚡ EV Battery Monitor API is running' });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    initSocket(io); // ← NEW: start Socket.IO after server is ready
  });
});

export { io };