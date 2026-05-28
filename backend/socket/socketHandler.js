// backend/socket/socketHandler.js

import { simulateTick, setMode, getState, resetState } from '../simulation/batteryEngine.js';
import BatteryData from '../models/BatteryData.js';
import mongoose from 'mongoose';

// ─────────────────────────────────────────────────────
// initSocket is called once when the server starts.
// It sets up all real-time communication with the frontend.
// "io" is the Socket.IO server instance passed in from server.js
// ─────────────────────────────────────────────────────
export function initSocket(io) {

  // This runs every time a new browser tab/client connects
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // We'll store the user's ID here once they authenticate via socket
    let currentUserId = null;

    // ── Send initial state immediately on connect ──
    // So the dashboard doesn't show blank values for the first second
    socket.emit('battery:update', getState());

    // ── Start the 1-second simulation loop ────────
    // setInterval calls simulateTick every 1000ms (1 second)
    // and sends the result to THIS specific client only (socket.emit)
    const simulationInterval = setInterval(async () => {
      try {
        // Get the next tick of battery data
        const data = simulateTick();

        console.log("📦 DATA:", data);

        // Send data to the frontend
        // 'battery:update' is the event name - frontend listens for this
        socket.emit('battery:update', data);

        // ── Generate alerts if values are dangerous ──
        const alerts = generateAlerts(data);
        if (alerts.length > 0) {
          socket.emit('battery:alerts', alerts);
        }

        // ── Save to MongoDB every 10 seconds ──────
        // We don't save every second - that's 86,400 records/day!
        // Instead we save every 10th tick using seconds modulo
        const seconds = new Date().getSeconds();
        if (seconds % 10 === 0 && currentUserId) {
          await BatteryData.create({
            userId:      currentUserId,
            voltage:     data.voltage,
            current:     data.current,
            temperature: data.temperature,
            soc:         data.soc,
            soh:         data.soh,
            mode:        data.mode
          });
        }

      } catch (error) {
        console.error('Simulation tick error:', error.message);
      }
    }, 1000); // ← 1000 milliseconds = 1 second

    // ── Listen for mode changes from frontend ─────
    // When user clicks "Charging", "Driving", or "Idle" button
    socket.on('set:mode', (mode) => {
      console.log(`📡 Mode request from ${socket.id}: ${mode}`);
      setMode(mode);
      // Immediately send updated state so UI reflects change instantly
      socket.emit('battery:update', getState());
    });

    // ── Listen for user authentication ────────────
    // Frontend sends the userId after login so we can save data correctly
    socket.on('set:user', (userId) => {
  try {
    currentUserId = new mongoose.Types.ObjectId(userId);
    console.log(`👤 User set for socket ${socket.id}: ${currentUserId}`);
  } catch (err) {
    console.error('Invalid userId received:', userId);
  }
      console.log(`👤 User set for socket ${socket.id}: ${userId}`);
    });

    // ── Listen for reset request ──────────────────
    socket.on('reset:simulation', () => {
      const resetData = resetState();
      socket.emit('battery:update', resetData);
      console.log(`🔄 Simulation reset by ${socket.id}`);
    });

    // ── Cleanup when client disconnects ───────────
    // IMPORTANT: Always clear intervals when a client leaves
    // Otherwise the interval keeps running forever (memory leak!)
    socket.on('disconnect', () => {
      clearInterval(simulationInterval);
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}

// ─────────────────────────────────────────────────────
// ALERT GENERATOR
// Checks battery data and returns a list of warnings
// Called every second - returns empty array if all is fine
// ─────────────────────────────────────────────────────
function generateAlerts(data) {
  const alerts = [];

  // Overheating alert
  if (data.temperature > 55) {
    alerts.push({
      type:    'danger',
      code:    'OVERHEAT',
      message: `🌡️ Critical temperature: ${data.temperature}°C`,
      value:   data.temperature
    });
  } else if (data.temperature > 45) {
    alerts.push({
      type:    'warning',
      code:    'HIGH_TEMP',
      message: `🌡️ High temperature: ${data.temperature}°C`,
      value:   data.temperature
    });
  }

  // Low battery alert
  if (data.soc < 15) {
    alerts.push({
      type:    'danger',
      code:    'LOW_SOC',
      message: `🔋 Critical battery level: ${data.soc}%`,
      value:   data.soc
    });
  } else if (data.soc < 25) {
    alerts.push({
      type:    'warning',
      code:    'LOW_BATTERY',
      message: `🔋 Low battery: ${data.soc}%`,
      value:   data.soc
    });
  }

  // High current spike alert
  if (Math.abs(data.current) > 90) {
    alerts.push({
      type:    'warning',
      code:    'HIGH_CURRENT',
      message: `⚡ High current spike: ${data.current}A`,
      value:   data.current
    });
  }

  // Poor battery health alert
  if (data.soh < 80) {
    alerts.push({
      type:    'warning',
      code:    'LOW_SOH',
      message: `🩺 Battery health degraded: ${data.soh}%`,
      value:   data.soh
    });
  }

  return alerts;
}