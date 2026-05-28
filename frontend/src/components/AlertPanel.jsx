// frontend/src/components/AlertPanel.jsx

import { AnimatePresence, motion } from 'framer-motion';

// Maps alert types to colors and backgrounds
const ALERT_STYLES = {
  danger:  { border: 'border-red-500/40',    bg: 'bg-red-500/10',    text: 'text-red-400'    },
  warning: { border: 'border-amber-500/40',  bg: 'bg-amber-500/10',  text: 'text-amber-400'  },
  info:    { border: 'border-blue-500/40',   bg: 'bg-blue-500/10',   text: 'text-blue-400'   }
};

function AlertPanel({ alerts }) {

  // If no alerts, show a calm "all good" message
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
          🚨 Alerts
        </h3>
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span>✅</span>
          <span>All systems normal</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-5">

      <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
        🚨 Active Alerts ({alerts.length})
      </h3>

      <div className="space-y-2">
        {/* AnimatePresence animates alerts sliding in and out */}
        <AnimatePresence>
          {alerts.map((alert) => {
            const style = ALERT_STYLES[alert.type] || ALERT_STYLES.warning;
            return (
              <motion.div
                key={alert.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0  }}
                exit={{    opacity: 0, x:  20 }}
                transition={{ duration: 0.3 }}
                className={`border rounded-lg px-4 py-3 text-sm
                            ${style.border} ${style.bg} ${style.text}`}
              >
                {alert.message}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default AlertPanel;