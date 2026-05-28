// backend/simulation/batteryEngine.js

// ─────────────────────────────────────────────────────
// This is the "brain" of the simulation.
// It holds the battery's current state and updates it
// every time simulateTick() is called (once per second).
// ─────────────────────────────────────────────────────

// The initial state of the battery when the server starts
// Think of this like a real battery at rest in a parked car
let batteryState = {
  voltage:     380,        // Volts - starts mid-range
  current:     0,          // Amps  - zero means idle
  temperature: 28,         // °C    - room temperature
  soc:         85,         // %     - starts 85% charged
  soh:         96,         // %     - fairly healthy battery
  mode:        'idle',     // Current operating mode
  cycleCount:  0           // How many full discharge cycles completed
};

// ─────────────────────────────────────────────────────
// HELPER: Generate a random number between min and max
// Example: randomBetween(10, 20) might return 14.7
// ─────────────────────────────────────────────────────
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// ─────────────────────────────────────────────────────
// HELPER: Clamp a value so it never goes outside a range
// Example: clamp(105, 0, 100) returns 100
//          clamp(-5,  0, 100) returns 0
// ─────────────────────────────────────────────────────
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ─────────────────────────────────────────────────────
// HELPER: Round a number to a given decimal places
// Example: roundTo(14.6789, 2) returns 14.68
// ─────────────────────────────────────────────────────
function roundTo(value, decimals) {
  return parseFloat(value.toFixed(decimals));
}

// ─────────────────────────────────────────────────────
// MAIN FUNCTION: Called every 1 second by Socket.IO
// Updates the battery state based on current mode
// Returns the new state so it can be sent to frontend
// ─────────────────────────────────────────────────────
export function simulateTick() {
  const { mode } = batteryState;

  // ── CHARGING MODE ──────────────────────────────────
  if (mode === 'charging') {

    // Current is positive (flowing INTO the battery)
    // Fluctuates slightly like a real charger
    batteryState.current = roundTo(randomBetween(75, 95), 1);

    // Voltage rises slowly as battery charges
    // But stops rising once it hits 420V (fully charged)
    batteryState.voltage = roundTo(
      clamp(batteryState.voltage + randomBetween(0.1, 0.5), 300, 420),
      1
    );

    // SOC increases - charging fills the battery
    // Slower near the top (like real fast chargers slow down above 80%)
    const socIncrement = batteryState.soc > 80
      ? randomBetween(0.01, 0.03)   // Slow above 80%
      : randomBetween(0.03, 0.07);  // Faster below 80%

    batteryState.soc = roundTo(
      clamp(batteryState.soc + socIncrement, 0, 100),
      2
    );

    // Temperature rises gently during charging
    batteryState.temperature = roundTo(
      clamp(batteryState.temperature + randomBetween(0.05, 0.15), 20, 65),
      1
    );
  }

  // ── DRIVING MODE ───────────────────────────────────
  else if (mode === 'driving') {

    // Current is NEGATIVE (flowing OUT of the battery)
    // More negative = more power being used
    batteryState.current = roundTo(-randomBetween(25, 55), 1);

    // Voltage drops as battery discharges
    batteryState.voltage = roundTo(
      clamp(batteryState.voltage - randomBetween(0.1, 0.4), 300, 420),
      1
    );

    // SOC decreases - driving drains the battery
    batteryState.soc = roundTo(
      clamp(batteryState.soc - randomBetween(0.03, 0.06), 0, 100),
      2
    );

    // Temperature rises faster during driving (motor load + discharge heat)
    batteryState.temperature = roundTo(
      clamp(batteryState.temperature + randomBetween(0.1, 0.25), 20, 65),
      1
    );

    // Track full discharge cycles for SOH degradation
    // A "cycle" counts when SOC hits a very low level
    if (batteryState.soc <= 5) {
      batteryState.cycleCount += 1;

      // SOH degrades very slowly over cycles (like a real battery)
      // 0.005% per cycle = needs 200 cycles to lose just 1% health
      batteryState.soh = roundTo(
        clamp(batteryState.soh - 0.005, 70, 100),
        3
      );

      console.log(`🔄 Cycle ${batteryState.cycleCount} complete. SOH: ${batteryState.soh}%`);
    }
  }

  // ── IDLE MODE ──────────────────────────────────────
  else {

    // Tiny current fluctuations - like standby power drain
    batteryState.current = roundTo(randomBetween(-2, 2), 1);

    // Voltage very stable, tiny random noise
    batteryState.voltage = roundTo(
      clamp(batteryState.voltage + randomBetween(-0.05, 0.05), 300, 420),
      1
    );

    // SOC barely changes in idle
    batteryState.soc = roundTo(
      clamp(batteryState.soc - randomBetween(0, 0.005), 0, 100),
      2
    );

    // Temperature slowly cools down towards room temp (25°C)
    if (batteryState.temperature > 25) {
      batteryState.temperature = roundTo(
        batteryState.temperature - randomBetween(0.02, 0.08),
        1
      );
    }
  }

  // ─────────────────────────────────────────────────
  // Return a COPY of the current state with a timestamp
  // We spread (...) to avoid sending the internal object directly
  // ─────────────────────────────────────────────────
  return {
    ...batteryState,
    timestamp: new Date()
  };
}

// ─────────────────────────────────────────────────────
// Called when user clicks Charging / Driving / Idle button
// Changes the mode so simulateTick behaves differently
// ─────────────────────────────────────────────────────
export function setMode(newMode) {
  const validModes = ['charging', 'driving', 'idle'];

  if (!validModes.includes(newMode)) {
    console.warn(`⚠️ Invalid mode: ${newMode}`);
    return;
  }

  console.log(`⚡ Mode changed: ${batteryState.mode} → ${newMode}`);
  batteryState.mode = newMode;
}

// ─────────────────────────────────────────────────────
// Returns the current state without ticking
// Useful for the frontend to get initial values on connect
// ─────────────────────────────────────────────────────
export function getState() {
  return { ...batteryState, timestamp: new Date() };
}

// ─────────────────────────────────────────────────────
// Resets battery to starting values
// Useful for a "Reset Simulation" button
// ─────────────────────────────────────────────────────
export function resetState() {
  batteryState = {
    voltage:     380,
    current:     0,
    temperature: 28,
    soc:         85,
    soh:         96,
    mode:        'idle',
    cycleCount:  0
  };
  console.log('🔄 Battery state reset');
  return getState();
}