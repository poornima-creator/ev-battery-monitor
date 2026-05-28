// frontend/src/components/StatCard.jsx

import { motion } from 'framer-motion';

// A simpler card for showing summary statistics
// Different from MetricCard - this is for static historical values
function StatCard({ label, value, unit, icon, color, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      className="bg-white/4 border border-white/8 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-xs uppercase tracking-widest">
          {label}
        </span>
        <span className="text-xl">{icon}</span>
      </div>

      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold" style={{ color }}>
          {value ?? '—'}
        </span>
        <span className="text-gray-500 text-sm mb-1">{unit}</span>
      </div>

      {subtitle && (
        <p className="text-gray-500 text-xs mt-2">{subtitle}</p>
      )}
    </motion.div>
  );
}

export default StatCard;