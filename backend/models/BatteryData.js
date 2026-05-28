// backend/models/BatteryData.js

import mongoose from 'mongoose';

const batteryDataSchema = new mongoose.Schema(
  {
    // Which user this data belongs to
    // ObjectId is MongoDB's unique ID type - it references the User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    voltage: {
      type: Number,
      required: true   // Range: 300V - 420V
    },

    current: {
      type: Number,
      required: true   // Positive = charging, Negative = discharging
    },

    temperature: {
      type: Number,
      required: true   // Range: 20°C - 65°C
    },

    soc: {
      type: Number,
      required: true,
      min: 0,
      max: 100         // State of Charge percentage
    },

    soh: {
      type: Number,
      required: true,
      min: 0,
      max: 100         // State of Health percentage
    },

    mode: {
      type: String,
      enum: ['charging', 'driving', 'idle'],  // Only these 3 values allowed
      default: 'idle'
    }
  },
  {
    timestamps: true   // Adds createdAt - important for historical charts
  }
);

export default mongoose.model('BatteryData', batteryDataSchema);