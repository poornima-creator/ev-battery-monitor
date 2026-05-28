// frontend/src/components/MetricCard.jsx

import { motion, AnimatePresence } from 'framer-motion';

// Each metric card shows one value (voltage, current, etc.)
// Props:
//   label   - e.g. "Voltage"
//   value   - the number to display
//   unit    - e.g. "V", "A", "°C"
//   color   - the accent color for this metric
//   icon    - emoji icon
//   warning - true/false - makes the card pulse red if dangerous
function MetricCard({ label, value, unit, color, icon, warning }) {

  return (
    <motion.div
      // Card entrance animation - slides up when page loads
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}

      // Warning state makes the border glow red
      style={{
        borderColor: warning ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'
      }}

      className="relative bg-white/4 backdrop-blur-sm border rounded-2xl p-5
                 overflow-hidden transition-colors duration-300"
    >
      {/* Background glow - subtle color behind each card */}
      <div
        className="absolute inset-0 opacity-5 rounded-2xl"
        style={{ background: `radial-gradient(circle at top right, ${color}, transparent)` }}
      />

      {/* Warning pulse ring - only shows when warning=true */}
      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl border-2 border-red-500/40"
          />
        )}
      </AnimatePresence>

      {/* Card content */}
      <div className="relative z-10">

        {/* Top row: icon + label */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{icon}</span>
          <span className="text-gray-400 text-xs uppercase tracking-widest font-medium">
            {label}
          </span>
        </div>

        {/* Main value display */}
        <div className="flex items-end gap-1">
          <motion.span
            // Animate the number change smoothly
            key={value}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold"
            style={{ color }}
          >
            {/* Show — if value hasn't loaded yet */}
            {value !== null && value !== undefined ? value : '—'}
          </motion.span>
          <span className="text-gray-500 text-sm mb-1">{unit}</span>
        </div>

        {/* Warning label */}
        {warning && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-xs mt-2 font-medium"
          >
            ⚠ Warning
          </motion.p>
        )}

      </div>
    </motion.div>
  );
}

export default MetricCard;