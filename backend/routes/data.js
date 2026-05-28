// backend/routes/data.js

import express from 'express';
import BatteryData from '../models/BatteryData.js';
import authMiddleware from '../middleware/auth.js';
import mongoose from 'mongoose';
const router = express.Router();

// All routes below require a valid JWT token
// authMiddleware checks the token before letting the request through

// ─────────────────────────────────────────────────────
// GET /api/data/recent
// Returns the last 100 records for the logged-in user
// Used to populate the analytics page on first load
// ─────────────────────────────────────────────────────
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const records = await BatteryData
      .find({ userId: new mongoose.Types.ObjectId(req.user.id) }) // Only this user's data
      .sort({ createdAt: -1 })        // Newest first
      .limit(100);                    // Last 100 records

    res.json(records);

  } catch (error) {
    console.error('Recent data error:', error.message);
    res.status(500).json({ error: 'Failed to fetch recent data' });
  }
});

// ─────────────────────────────────────────────────────
// GET /api/data/daily
// Returns hourly averages for the last 24 hours
// Used for the "Daily" chart on analytics page
// ─────────────────────────────────────────────────────
router.get('/daily', authMiddleware, async (req, res) => {
  try {
    // Date 24 hours ago
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // MongoDB aggregation pipeline:
    // Think of it as a series of steps that transform your data
    const stats = await BatteryData.aggregate([

      // Step 1: Filter - only this user's data from last 24h
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          createdAt: { $gte: since }
        }
      },

      // Step 2: Group - group records by hour
      // Calculate average values for each hour
      {
        $group: {
          _id: { $hour: '$createdAt' },       // Group by hour (0-23)
          avgVoltage:     { $avg: '$voltage'     },
          avgCurrent:     { $avg: '$current'     },
          avgTemperature: { $avg: '$temperature' },
          avgSOC:         { $avg: '$soc'         },
          avgSOH:         { $avg: '$soh'         },
          count:          { $sum: 1 }             // How many records in this hour
        }
      },

      // Step 3: Sort by hour ascending (0, 1, 2, ... 23)
      { $sort: { _id: 1 } },

      // Step 4: Shape the output to be cleaner
      {
        $project: {
          hour:           '$_id',
          avgVoltage:     { $round: ['$avgVoltage',     1] },
          avgCurrent:     { $round: ['$avgCurrent',     1] },
          avgTemperature: { $round: ['$avgTemperature', 1] },
          avgSOC:         { $round: ['$avgSOC',         2] },
          avgSOH:         { $round: ['$avgSOH',         2] },
          count:          1
        }
      }
    ]);

    res.json(stats);

  } catch (error) {
    console.error('Daily stats error:', error.message);
    res.status(500).json({ error: 'Failed to fetch daily stats' });
  }
});

// ─────────────────────────────────────────────────────
// GET /api/data/weekly
// Returns daily averages for the last 7 days
// Used for the "Weekly" chart on analytics page
// ─────────────────────────────────────────────────────
router.get('/weekly', authMiddleware, async (req, res) => {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const stats = await BatteryData.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          createdAt: { $gte: since }
        }
      },
      {
        $group: {
          // Group by day of week (1=Sunday ... 7=Saturday)
          _id: { $dayOfWeek: '$createdAt' },
          avgVoltage:     { $avg: '$voltage'     },
          avgCurrent:     { $avg: '$current'     },
          avgTemperature: { $avg: '$temperature' },
          avgSOC:         { $avg: '$soc'         },
          avgSOH:         { $avg: '$soh'         },
          count:          { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          day:            '$_id',
          avgVoltage:     { $round: ['$avgVoltage',     1] },
          avgCurrent:     { $round: ['$avgCurrent',     1] },
          avgTemperature: { $round: ['$avgTemperature', 1] },
          avgSOC:         { $round: ['$avgSOC',         2] },
          avgSOH:         { $round: ['$avgSOH',         2] },
          count:          1
        }
      }
    ]);

    res.json(stats);

  } catch (error) {
    console.error('Weekly stats error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weekly stats' });
  }
});

// ─────────────────────────────────────────────────────
// GET /api/data/summary
// Returns overall stats: min, max, average of all values
// Shown as stat cards at the top of analytics page
// ─────────────────────────────────────────────────────
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const summary = await BatteryData.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.user.id) }
      },
      {
        $group: {
          _id:            null,  // null = group ALL records together
          totalRecords:   { $sum: 1 },
          avgSOC:         { $avg: '$soc'         },
          avgSOH:         { $avg: '$soh'         },
          avgTemp:        { $avg: '$temperature' },
          minVoltage:     { $min: '$voltage'     },
          maxVoltage:     { $max: '$voltage'     },
          maxTemp:        { $max: '$temperature' },
          minSOH:         { $min: '$soh'         }
        }
      },
      {
        $project: {
          _id:          0,  // Hide the _id field
          totalRecords: 1,
          avgSOC:       { $round: ['$avgSOC',  1] },
          avgSOH:       { $round: ['$avgSOH',  1] },
          avgTemp:      { $round: ['$avgTemp', 1] },
          minVoltage:   1,
          maxVoltage:   1,
          maxTemp:      1,
          minSOH:       1
        }
      }
    ]);

    // summary is an array - we want just the first (and only) item
    res.json(summary[0] || {});

  } catch (error) {
    console.error('Summary error:', error.message);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// ─────────────────────────────────────────────────────
// GET /api/data/export
// Returns all records as JSON for CSV export
// Frontend converts this to a downloadable CSV file
// ─────────────────────────────────────────────────────
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const records = await BatteryData
      .find({ userId: new mongoose.Types.ObjectId(req.user.id) })
      .sort({ createdAt: 1 })  // Oldest first for export
      .select('-userId -__v'); // Hide userId and version field

    res.json(records);

  } catch (error) {
    console.error('Export error:', error.message);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

export default router;