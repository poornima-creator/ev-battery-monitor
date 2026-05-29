// frontend/src/pages/Dashboard.jsx

import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { Link } from 'react-router-dom';

import MetricCard   from '../components/MetricCard';
import LiveChart    from '../components/LiveChart';
import BatteryGauge from '../components/BatteryGauge';
import AlertPanel   from '../components/AlertPanel';
import ModeSelector from '../components/ModeSelector';

function Dashboard() {
  const { user }                                  = useAuth();
  const { batteryData, alerts, connected,
          setMode, resetSimulation }               = useSocket(user?._id || user?.id);

  const d = batteryData;

  const overheat    = d?.temperature > 55;
  const lowSOC      = d?.soc < 20;
  const highCurrent = Math.abs(d?.current || 0) > 90;

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      <div className="p-6 max-w-7xl mx-auto">

        {/* ── Page Header ─────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Good day, {user?.username} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Battery is in
              <span className="text-[#00E5FF] ml-1 capitalize font-medium">
                {d?.mode || 'connecting...'}
              </span>
              {' '}mode
            </p>
          </div>

          {/* Live connection pill */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10
                          px-3 py-1.5 rounded-full">
            <motion.div
              animate={{ opacity: connected ? [1, 0.3, 1] : 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-2 h-2 rounded-full
                          ${connected ? 'bg-green-400' : 'bg-red-400'}`}
            />
            <span className={`text-xs font-medium
                              ${connected ? 'text-green-400' : 'text-red-400'}`}>
              {connected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* ── Mode Selector ───────────────────── */}
        <div className="mb-6">
          <ModeSelector
            currentMode={d?.mode || 'idle'}
            onModeChange={setMode}
            onReset={resetSimulation}
          />
        </div>

        {/* ── Metric Cards ────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <MetricCard
            label="Voltage"
            value={d?.voltage}
            unit="V"
            color="#00E5FF"
            icon="⚡"
          />
          <MetricCard
            label="Current"
            value={d?.current}
            unit="A"
            color="#A78BFA"
            icon="🔌"
            warning={highCurrent}
          />
          <MetricCard
            label="Temperature"
            value={d?.temperature}
            unit="°C"
            color="#FF6B35"
            icon="🌡️"
            warning={overheat}
          />
          <MetricCard
            label="SOC"
            value={d?.soc?.toFixed(1)}
            unit="%"
            color="#00FF88"
            icon="🔋"
            warning={lowSOC}
          />
          <MetricCard
            label="SOH"
            value={d?.soh?.toFixed(1)}
            unit="%"
            color="#FFD700"
            icon="🩺"
          />
        </div>

        {/* ── Charts + Gauge ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <LiveChart batteryData={batteryData} />
          </div>
          <BatteryGauge soc={d?.soc} soh={d?.soh} />
        </div>

        {/* ── Alerts ──────────────────────────── */}
        <AlertPanel alerts={alerts} />

        <p className="text-center text-gray-600 text-xs mt-8">
          ⚡ EV Battery Monitor — Data updates every second
        </p>

      </div>
    </div>
  );
}

export default Dashboard;