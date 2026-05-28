// frontend/src/components/ModeSelector.jsx

import { motion } from 'framer-motion';

// The three modes with their icons and colors
const MODES = [
  { id: 'charging', label: 'Charging', icon: '⚡', color: '#00E5FF' },
  { id: 'driving',  label: 'Driving',  icon: '🚗', color: '#00FF88' },
  { id: 'idle',     label: 'Idle',     icon: '😴', color: '#6B7280' }
];

function ModeSelector({ currentMode, onModeChange, onReset }) {
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-5">

      <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
        🎮 Simulation Mode
      </h3>

      <div className="flex gap-3 flex-wrap">
        {MODES.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              whileTap={{ scale: 0.95 }}  // Tiny shrink on click - feels responsive
              style={{
                borderColor: isActive ? mode.color : 'rgba(255,255,255,0.1)',
                color:       isActive ? mode.color : '#9CA3AF',
                background:  isActive ? `${mode.color}15` : 'transparent'
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border
                         text-sm font-medium transition-all duration-200"
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>

              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="activeMode"
                  className="w-1.5 h-1.5 rounded-full ml-1"
                  style={{ background: mode.color }}
                />
              )}
            </motion.button>
          );
        })}

        {/* Reset button */}
        <motion.button
          onClick={onReset}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border
                     border-white/10 text-gray-400 text-sm font-medium
                     hover:bg-white/5 transition-all duration-200 ml-auto"
        >
          🔄 Reset
        </motion.button>
      </div>

    </div>
  );
}

export default ModeSelector;