// frontend/src/components/BatteryGauge.jsx

import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

function BatteryGauge({ soc, soh }) {

  // Pick color based on SOC level
  // Green above 50%, amber 20-50%, red below 20%
  const socColor = soc > 50 ? '#00FF88' : soc > 20 ? '#F59E0B' : '#EF4444';

  // SOH color - green above 85%, amber 70-85%
  const sohColor = soh > 85 ? '#00E5FF' : '#F59E0B';

  // Data format required by Recharts RadialBarChart
  const socData  = [{ value: soc  || 0, fill: socColor }];
  const sohData  = [{ value: soh  || 0, fill: sohColor }];

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-5 flex flex-col
                    items-center justify-center h-full">

      <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider self-start">
        🔋 Battery Status
      </h3>

      {/* SOC Gauge */}
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="65%"
            outerRadius="100%"
            data={socData}
            startAngle={180}
            endAngle={-180}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              background={{ fill: 'rgba(255,255,255,0.05)' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={soc}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1,   opacity: 1 }}
            className="text-4xl font-bold"
            style={{ color: socColor }}
          >
            {soc?.toFixed(0) ?? '—'}
          </motion.span>
          <span className="text-gray-400 text-xs mt-1">SOC %</span>
        </div>
      </div>

      {/* SOH Gauge */}
      <div className="relative w-32 h-32 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="65%"
            outerRadius="100%"
            data={sohData}
            startAngle={180}
            endAngle={-180}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={8}
              background={{ fill: 'rgba(255,255,255,0.05)' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={soh}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1,   opacity: 1 }}
            className="text-2xl font-bold"
            style={{ color: sohColor }}
          >
            {soh?.toFixed(1) ?? '—'}
          </motion.span>
          <span className="text-gray-400 text-xs mt-1">SOH %</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-6 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: socColor }} />
          <span className="text-gray-400">Charge</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: sohColor }} />
          <span className="text-gray-400">Health</span>
        </div>
      </div>

    </div>
  );
}

export default BatteryGauge;