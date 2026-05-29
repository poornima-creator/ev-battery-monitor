// frontend/src/hooks/useSocket.js

import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket(userId) {
  // batteryData holds the latest values from the server
  const [batteryData, setBatteryData] = useState(null);

  // alerts holds the list of current warnings
  const [alerts, setAlerts] = useState([]);

  // connected tells us if socket is actually connected
  const [connected, setConnected] = useState(false);

  // useRef stores the socket instance without causing re-renders
  // if we used useState, every reconnect would re-render everything
  const socketRef = useRef(null);

  useEffect(() => {
    // Create the socket connection to our backend
    const socket = io(import.meta.env.VITE_SERVER_URL, {
  transports: ['polling', 'websocket'],
  withCredentials: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

    // Save to ref so other functions can access it
    socketRef.current = socket;

    // ── Connection events ──────────────────────────
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setConnected(true);

      // Tell the server which user this is
      // So battery data gets saved to the right user in MongoDB
      if (userId) {
        socket.emit('set:user', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setConnected(false);
    });

    // ── Battery data event ─────────────────────────
    // Every second the server emits 'battery:update'
    // We just save it to state and React re-renders automatically
    socket.on('battery:update', (data) => {
      setBatteryData(data);
    });

    // ── Alerts event ───────────────────────────────
    socket.on('battery:alerts', (newAlerts) => {
      setAlerts(newAlerts);
    });

    // ── Cleanup ────────────────────────────────────
    // When the Dashboard unmounts (user logs out/navigates away)
    // disconnect the socket and stop all listeners
    return () => {
      socket.disconnect();
    };
  }, [userId]); // Re-run if userId changes (e.g. different user logs in)

  // Function to change battery mode
  // Called when user clicks Charging / Driving / Idle buttons
  const setMode = (mode) => {
    socketRef.current?.emit('set:mode', mode);
  };

  // Function to reset simulation
  const resetSimulation = () => {
    socketRef.current?.emit('reset:simulation');
    setAlerts([]); // Clear alerts on reset
  };

  return { batteryData, alerts, connected, setMode, resetSimulation };
}